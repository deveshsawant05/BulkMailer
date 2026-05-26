import { Worker } from "bullmq";
import Redis from "ioredis";
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
import { decrypt } from "./lib/encryption";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connectionOptions: any = {
  maxRetriesPerRequest: null,
  family: 0, // Force IPv4/IPv6 resolution
};

if (redisUrl.startsWith("rediss://")) {
  connectionOptions.tls = { rejectUnauthorized: false };
}

const connection = new Redis(redisUrl, connectionOptions);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CAMPAIGN_QUEUE_NAME = "campaign-emails";

function createEmailBody(to: string, from: string, subject: string, htmlBody: string): string {
  const message = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    htmlBody,
  ].join("\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const worker = new Worker(
  CAMPAIGN_QUEUE_NAME,
  async (job) => {
    const { campaignId, jobId, recipientId, userId } = job.data;
    console.log(`Processing job ${job.id} for campaign ${campaignId}, recipient ${recipientId}`);

    try {
      // 1. Mark job as PROCESSING
      await supabase
        .from("campaign_jobs")
        .update({ status: "PROCESSING", started_at: new Date().toISOString() })
        .eq("id", jobId);

      // 2. Fetch required data in parallel
      const [campaignRes, recipientRes] = await Promise.all([
        supabase.from("campaigns").select("*, gmail_connections(*)").eq("id", campaignId).single(),
        supabase.from("campaign_recipients").select("*").eq("id", recipientId).single()
      ]);

      if (campaignRes.error || !campaignRes.data) throw new Error("Campaign not found");
      if (recipientRes.error || !recipientRes.data) throw new Error("Recipient not found");

      const campaign = campaignRes.data;
      const recipient = recipientRes.data;
      const connection = campaign.gmail_connections;

      if (!connection) throw new Error("Gmail connection not found for campaign");

      // 3. Setup Google OAuth
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      const accessToken = decrypt(connection.encrypted_access_token);
      const refreshToken = decrypt(connection.encrypted_refresh_token);

      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      const gmail = google.gmail({ version: "v1", auth: oauth2Client });

      // 4. Parse variables in subject and body
      // Assuming body_template and subject_template have {{VarName}} tags
      let finalSubject = campaign.subject_template;
      let finalBody = campaign.body_template;
      
      const vars = recipient.variables || {};
      for (const [key, val] of Object.entries(vars)) {
        const regex = new RegExp(`{{${key}}}`, "g");
        finalSubject = finalSubject.replace(regex, String(val));
        finalBody = finalBody.replace(regex, String(val));
      }

      // 5. Create and Send Email
      const rawMessage = createEmailBody(
        recipient.recipient_email,
        connection.gmail_email,
        finalSubject,
        finalBody
      );

      const sendRes = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: rawMessage,
        },
      });

      console.log(`Successfully sent email to ${recipient.recipient_email}. Message ID: ${sendRes.data.id}`);

      // 6. Mark job as SUCCESS
      const { error: completeError } = await supabase
        .from("campaign_jobs")
        .update({ status: "SUCCESS", completed_at: new Date().toISOString() })
        .eq("id", jobId);
        
      if (completeError) {
        console.error(`Failed to mark job ${jobId} as SUCCESS in DB:`, completeError);
      }

      // 7. Log success
      await supabase.from("email_logs").insert({
        campaign_id: campaignId,
        recipient_id: recipientId,
        event_type: "SENT",
        provider_message_id: sendRes.data.id,
      });

      // Update sent_count on campaign (ideally this should be an RPC or trigger)
      try {
        await supabase.rpc('increment_sent_count', { row_id: campaignId });
      } catch (e) {
        // Ignore error if RPC doesn't exist
      }

      // Check if this was the last job and mark campaign as completed
      const { count: pendingCount } = await supabase
        .from("campaign_jobs")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .in("status", ["PENDING", "PROCESSING"]);
        
      if (pendingCount === 0) {
        await supabase
          .from("campaigns")
          .update({ status: "COMPLETED", finished_at: new Date().toISOString() })
          .eq("id", campaignId);
      }

    } catch (error) {
      console.error(`Job ${jobId} failed:`, error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Mark job as FAILED
      const { error: failError } = await supabase
        .from("campaign_jobs")
        .update({ 
          status: "FAILED", 
          completed_at: new Date().toISOString(),
          last_error: errorMessage 
        })
        .eq("id", jobId);
        
      if (failError) {
        console.error(`Failed to mark job ${jobId} as FAILED in DB:`, failError);
      }

      // Log failure
      await supabase.from("email_logs").insert({
        campaign_id: campaignId,
        recipient_id: recipientId,
        event_type: "FAILED",
        error_details: errorMessage,
      });

      // Check if this was the last job and mark campaign as completed
      const { count: pendingCount } = await supabase
        .from("campaign_jobs")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .in("status", ["PENDING", "PROCESSING"]);
        
      if (pendingCount === 0) {
        await supabase
          .from("campaigns")
          .update({ status: "COMPLETED", finished_at: new Date().toISOString() })
          .eq("id", campaignId);
      }

      throw error; // Rethrow to let BullMQ handle retry logic
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 emails concurrently. Adjust to respect Gmail API limits.
  }
);

worker.on("ready", () => {
  console.log("Worker is running and listening for jobs...");
});

worker.on("error", (err: any) => {
  if (err.code === "ECONNRESET" || err.message?.includes("ECONNRESET")) {
    // Upstash / Serverless Redis drops idle connections. ioredis auto-reconnects.
    // We suppress this harmless error to prevent console spam.
    return;
  }
  console.error("Worker error:", err);
});
