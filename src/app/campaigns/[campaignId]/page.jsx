"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Play,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/global/sidebar";
import useCheckSession from "@/hooks/check-session";
import LoadingPage from "@/components/global/loading-page";
import { getCampaignById, startCampaign } from "@/app/actions/campaigns";
import { createClient } from "@/utils/supabase/client";

const statusStyles = {
  DRAFT: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  QUEUED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  PAUSED: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
};

export default function CampaignDetailsPage({ params }) {
  const router = useRouter();
  const { campaignId } = use(params);
  const { loading, user } = useCheckSession();

  const [campaign, setCampaign] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    if (!user || !campaignId) return;

    async function loadData() {
      setLoadingData(true);
      const res = await getCampaignById(campaignId);
      if (res.success && res.data) {
        setCampaign(res.data);
      } else {
        setError("Failed to load campaign.");
      }

      // Load initial jobs
      const { data: jobData } = await supabase
        .from("campaign_jobs")
        .select("*, campaign_recipients(recipient_email)")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: true });
        
      if (jobData) setJobs(jobData);
      
      setLoadingData(false);
    }
    
    loadData();

    // Subscribe to realtime changes on jobs
    const channel = supabase
      .channel(`jobs-${campaignId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "campaign_jobs",
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          // Re-fetch jobs to get joined data or update locally
          // For simplicity, we just re-fetch all jobs for this campaign
          supabase
            .from("campaign_jobs")
            .select("*, campaign_recipients(recipient_email)")
            .eq("campaign_id", campaignId)
            .order("created_at", { ascending: true })
            .then(({ data }) => {
              if (data) setJobs(data);
            });
            
          // If all jobs are completed/failed, we might want to update campaign status
          // The backend could have a trigger to set status='SENT', so we poll campaign too
          getCampaignById(campaignId).then((c) => {
            if (c.success) setCampaign(c.data);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, campaignId, supabase]);

  const handleStartCampaign = async () => {
    setError("");
    setIsStarting(true);
    const res = await startCampaign(campaignId);
    if (!res.success) {
      setError(res.error);
    } else {
      // Re-fetch campaign to get updated status
      const c = await getCampaignById(campaignId);
      if (c.success) setCampaign(c.data);
    }
    setIsStarting(false);
  };

  if (loading || loadingData) {
    return (
      <Sidebar>
        <LoadingPage />
      </Sidebar>
    );
  }

  if (!campaign) {
    return (
      <Sidebar>
        <div className="p-8 text-center text-red-500">{error || "Campaign not found"}</div>
      </Sidebar>
    );
  }

  const completedCount = jobs.filter(j => j.status === "SUCCESS" || j.status === "COMPLETED").length;
  const failedCount = jobs.filter(j => j.status === "FAILED").length;
  const totalCount = campaign.recipient_count || jobs.length || 1; // prevent div by zero
  const progressPercent = Math.min(100, Math.round(((completedCount + failedCount) / totalCount) * 100));

  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f8f9fc] dark:bg-zinc-950 flex flex-col">
        {/* Breadcrumb Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/campaigns"
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Campaigns
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-[200px]">
              {campaign.name}
            </span>
            <Badge variant="outline" className={`ml-2 text-[10px] uppercase font-bold tracking-wider ${statusStyles[campaign.status?.toUpperCase() || "DRAFT"]}`}>
              {campaign.status || "DRAFT"}
            </Badge>
          </div>
          
          {(campaign.status === "DRAFT" || !campaign.status) && (
            <Button
              onClick={handleStartCampaign}
              disabled={isStarting}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm gap-2"
            >
              {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Start Campaign
            </Button>
          )}
        </div>

        <div className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Progress Card (Shown if PROCESSING/QUEUED or has jobs) */}
          {jobs.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" /> Sending Progress
              </h2>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-500">
                  {progressPercent}% Completed
                </span>
                <span className="text-xs font-semibold text-zinc-500">
                  {completedCount + failedCount} of {totalCount} Processed
                </span>
              </div>
              <Progress value={progressPercent} className="h-3 rounded-full mb-6" />

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">Total</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">{totalCount}</p>
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">Delivered</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{completedCount}</p>
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-900/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-500 font-medium">Failed</p>
                    <p className="text-lg font-bold text-red-700 dark:text-red-400">{failedCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job List */}
          {jobs.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Delivery Status Log</h3>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {job.status === "SUCCESS" || job.status === "COMPLETED" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : job.status === "FAILED" ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : job.status === "PROCESSING" ? (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-zinc-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {job.campaign_recipients?.recipient_email || "Unknown Recipient"}
                        </p>
                        {job.last_error && (
                          <p className="text-xs text-red-500 mt-0.5 max-w-lg truncate flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 inline" /> {job.last_error}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                      {job.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </Sidebar>
  );
}
