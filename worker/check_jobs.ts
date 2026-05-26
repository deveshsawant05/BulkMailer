import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function checkJobsTable() {
  const { data, error } = await supabase
    .from("campaign_jobs")
    .select("*")
    .limit(1);
    
  console.log("Error reading campaign_jobs?", error);
  if (data && data.length > 0) {
     console.log("Sample job:", data[0]);
  }
}

checkJobsTable();
