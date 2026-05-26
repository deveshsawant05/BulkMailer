import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkEnum() {
  const statusesToTest = [
    'DRAFT', 'draft', 
    'ACTIVE', 'active', 
    'SENT', 'sent', 
    'SCHEDULED', 'scheduled', 
    'QUEUED', 'queued', 
    'PROCESSING', 'processing',
    'RUNNING', 'running',
    'COMPLETED', 'completed',
    'DONE', 'done',
    'FAILED', 'failed',
    'ERROR', 'error'
  ];

  console.log("Testing valid statuses for campaigns table...");
  const validStatuses = [];

  for (const status of statusesToTest) {
    const { error } = await supabase.from('campaigns').insert({
        user_id: '00000000-0000-0000-0000-000000000000', // arbitrary UUID
        name: 'test',
        subject_template: 'test',
        body_template: 'test',
        gmail_connection_id: '00000000-0000-0000-0000-000000000000',
        status: status
    });

    // If error is foreign key violation (23503), the enum value was VALID!
    // If error is invalid enum (22P02), the enum value was INVALID.
    if (error && error.code === '23503') {
        validStatuses.push(status);
    } else if (!error) {
        validStatuses.push(status);
        // cleanup if it somehow succeeded
        await supabase.from('campaigns').delete().eq('name', 'test');
    }
  }

  console.log("Found valid statuses:", validStatuses);
}

checkEnum();
