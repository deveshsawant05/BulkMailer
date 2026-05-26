import { Queue } from "bullmq";
import Redis from "ioredis";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

const CAMPAIGN_QUEUE_NAME = "campaign-emails";

const testQueue = new Queue(CAMPAIGN_QUEUE_NAME, { connection });

async function run() {
  console.log("Adding job to queue...");
  try {
      await testQueue.add("test-job", {
        campaignId: "test",
        jobId: "test",
        recipientId: "test",
        userId: "test"
      });
      console.log("Job added!");
  } catch(e) {
      console.error("Failed to add job:", e);
  }
  process.exit(0);
}

run();
