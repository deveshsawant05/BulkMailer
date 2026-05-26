import { Queue } from "bullmq";
import Redis from "ioredis";

// The name of our queue
export const CAMPAIGN_QUEUE_NAME = "campaign-emails";

let connection: Redis | null = null;
let campaignQueue: Queue | null = null;

export function getCampaignQueue() {
  if (campaignQueue) return campaignQueue;

  const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  
  const connectionOptions: any = {
    // Allow ioredis to auto-retry pushing jobs if the connection briefly drops
    retryStrategy(times: number) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    // We don't set maxRetriesPerRequest: null here so the producer can retry!
    family: 0,
  };

  if (redisUrl.startsWith("rediss://")) {
    connectionOptions.tls = { rejectUnauthorized: false };
  }

  connection = new Redis(redisUrl, connectionOptions);

  // Prevent unhandled error crashes in Next.js when the connection blips
  connection.on("error", (err: any) => {
    if (err.code !== "ECONNRESET" && err.message !== "Connection is closed.") {
      console.error("Redis connection error:", err.message);
    }
  });

  campaignQueue = new Queue(CAMPAIGN_QUEUE_NAME, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

  return campaignQueue;
}
