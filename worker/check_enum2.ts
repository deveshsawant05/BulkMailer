import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function checkEnum() {
  const statusesToTest = [
    'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 
    'SUCCESS', 'DONE', 'FINISHED', 'ERROR', 'QUEUED'
  ];

  console.log("Testing valid statuses for campaign_jobs table...");
  const validStatuses = [];

  for (const status of statusesToTest) {
    const { error } = await supabase.from('campaign_jobs').insert({
        campaign_id: '00000000-0000-0000-0000-000000000000',
        recipient_id: '00000000-0000-0000-0000-000000000000',
        status: status
    });

    if (error && error.code === '23503') { // Foreign key constraint violation = valid enum
        validStatuses.push(status);
    } else if (!error) {
        validStatuses.push(status);
        await supabase.from('campaign_jobs').delete().eq('status', status);
    }
  }

  console.log("Found valid statuses:", validStatuses);
}

checkEnum();
