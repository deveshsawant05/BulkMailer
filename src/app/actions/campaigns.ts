"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getCampaignQueue } from "@worker/lib/queue";

type CampaignInput = {
  name: string;
  description?: string;
  template_id?: string;
  gmail_connection_id: string;
  subject_template: string;
  body_template: string;
  status?: string;
  recipients?: string;
};

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in to manage campaigns.");
  }

  return { supabase, userId: user.id };
}

export async function getGmailConnections() {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from("gmail_connections")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data ?? [] };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to load gmail connections.",
    };
  }
}

function parseRecipients(recipientsStr?: string) {
  if (!recipientsStr) return [];
  return recipientsStr
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}

export async function createCampaign(input: CampaignInput) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    if (!input.name || !input.subject_template || !input.gmail_connection_id || !input.body_template) {
      return {
        success: false,
        error: "Campaign name, subject, body, and sender account are required.",
      };
    }

    const recipientsList = parseRecipients(input.recipients);

    const payload = {
      user_id: userId,
      name: input.name,
      description: input.description ?? "",
      template_id: input.template_id || null,
      gmail_connection_id: input.gmail_connection_id,
      subject_template: input.subject_template,
      body_template: input.body_template,
      status: input.status?.toUpperCase() ?? "DRAFT",
      recipient_count: recipientsList.length,
    };

    // Insert campaign
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .insert(payload)
      .select()
      .single();

    if (campaignError) {
      return { success: false, error: campaignError.message };
    }

    // Insert recipients
    if (recipientsList.length > 0) {
      const recipientPayloads = recipientsList.map((email, index) => ({
        campaign_id: campaign.id,
        row_index: index,
        recipient_email: email,
        variables: {},
      }));

      const { error: recipientsError } = await supabase
        .from("campaign_recipients")
        .insert(recipientPayloads);

      if (recipientsError) {
        // Since we don't have true transactions over REST easily without an RPC,
        // we log or return the error. The campaign is created but recipients failed.
        return { success: false, error: "Campaign created, but failed to add recipients: " + recipientsError.message };
      }
    }

    revalidatePath("/campaigns");
    revalidatePath("/dashboard");

    return { success: true, data: campaign };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create campaign.",
    };
  }
}

export async function getCampaigns() {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from("campaigns")
      .select("*, templates(name)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data ?? [] };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to load campaigns.",
    };
  }
}

export async function getCampaignById(id: string) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from("campaigns")
      .select("*, templates(name)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to load campaign.",
    };
  }
}

export async function updateCampaign(id: string, input: CampaignInput) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    if (!input.name || !input.subject_template) {
      return {
        success: false,
        error: "Campaign name and subject line are required.",
      };
    }

    const payload: any = {
      name: input.name,
      description: input.description ?? "",
      template_id: input.template_id || null,
      subject_template: input.subject_template,
    };

    if (input.body_template) payload.body_template = input.body_template;
    if (input.gmail_connection_id) payload.gmail_connection_id = input.gmail_connection_id;
    if (input.status) payload.status = input.status.toUpperCase();
    
    // We don't update recipients here easily without a diff or delete/re-insert
    // Let's assume updating recipients happens separately or we just update count if provided
    if (input.recipients !== undefined) {
      const recipientsList = parseRecipients(input.recipients);
      payload.recipient_count = recipientsList.length;
      
      // Basic delete and re-insert for simplicity in this prototype
      await supabase.from("campaign_recipients").delete().eq("campaign_id", id);
      if (recipientsList.length > 0) {
        const recipientPayloads = recipientsList.map((email, index) => ({
          campaign_id: id,
          row_index: index,
          recipient_email: email,
          variables: {},
        }));
        await supabase.from("campaign_recipients").insert(recipientPayloads);
      }
    }

    const { data, error } = await supabase
      .from("campaigns")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/campaigns");
    revalidatePath(`/campaigns/${id}`);
    revalidatePath("/dashboard");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update campaign.",
    };
  }
}

export async function deleteCampaign(id: string) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/campaigns");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete campaign.",
    };
  }
}

export async function startCampaign(campaignId: string) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    // Fetch the campaign to verify ownership
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", userId)
      .single();

    if (campaignError || !campaign) {
      return { success: false, error: "Campaign not found or unauthorized." };
    }

    if (campaign.status === "QUEUED" || campaign.status === "PROCESSING") {
      return { success: false, error: "Campaign is already running." };
    }

    // Update campaign status
    await supabase
      .from("campaigns")
      .update({ status: "PROCESSING", started_at: new Date().toISOString() })
      .eq("id", campaignId);

    // Fetch all recipients for this campaign
    const { data: recipients, error: recipientsError } = await supabase
      .from("campaign_recipients")
      .select("id")
      .eq("campaign_id", campaignId);

    if (recipientsError) {
      return { success: false, error: "Failed to fetch recipients." };
    }

    if (recipients && recipients.length > 0) {
      const queue = getCampaignQueue();
      // Create initial campaign_jobs entries
      const jobPayloads = recipients.map((r) => ({
        campaign_id: campaignId,
        recipient_id: r.id,
        status: "PENDING",
      }));
      
      const { data: createdJobs, error: jobsError } = await supabase
        .from("campaign_jobs")
        .insert(jobPayloads)
        .select("id, recipient_id");

      if (jobsError) {
        console.error("Failed to create jobs in DB:", jobsError);
      } else if (createdJobs) {
        // Enqueue jobs in Redis
        const bullJobs = createdJobs.map((job, index) => ({
          name: `send-email-${job.id}`,
          data: {
            campaignId,
            jobId: job.id,
            recipientId: job.recipient_id,
            userId,
          },
          opts: {
            delay: index * 1000, // 1 second delay between each email
          },
        }));

        await queue.addBulk(bullJobs);
      }
    }

    revalidatePath("/campaigns");
    revalidatePath(`/campaigns/${campaignId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start campaign.",
    };
  }
}
