import Link from "next/link";
import { Edit, Plus, Trash2, Mail, Megaphone, Users, Calendar, FilePlus2 } from "lucide-react";

import { getCampaigns, deleteCampaign } from "@/app/actions/campaigns";
import Sidebar from "@/components/global/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDate(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

const statusStyles = {
  DRAFT: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  QUEUED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  PROCESSING: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  PAUSED: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
};

export default async function CampaignsPage() {
  const result = await getCampaigns();
  const campaigns = result.data ?? [];

  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f8f9fc] dark:bg-zinc-950">

        {/* ─── Google Docs Style Header (Start a new campaign) ─── */}
        <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Start a new campaign
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {/* Blank Campaign */}
              <Link
                href="/campaigns/create"
                className="group flex flex-col items-center gap-2 text-left focus:outline-none"
              >
                <div className="w-full aspect-[3/4] bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg flex flex-col items-center justify-center transition-colors shadow-sm group-focus-visible:ring-2 group-focus-visible:ring-blue-500">
                  <Plus className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="w-full">
                  <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-tight">Blank Campaign</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Recent Campaigns ─── */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Recent campaigns
             </h2>
          </div>

          {!result.success ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 px-5 py-4 text-sm text-red-600 dark:text-red-400 font-medium">
              {result.error}
            </div>
          ) : campaigns.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-16 gap-5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                  No campaigns yet
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Create your first email campaign to start reaching your audience.
                </p>
              </div>
            </div>
          ) : (
            /* ── Campaign table ── */
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                {["Campaign", "Template", "Status", "Recipients", "Updated", ""].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                    >
                      {h}
                    </div>
                  )
                )}
              </div>

              {/* Table Rows */}
              {campaigns.map((campaign, idx) => {
                const templateName = campaign.templates?.name ?? "—";
                const status = (campaign.status ?? "DRAFT").toUpperCase();

                return (
                  <div
                    key={campaign.id}
                    className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center group transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-900/10 ${
                      idx !== 0
                        ? "border-t border-zinc-100 dark:border-zinc-800"
                        : ""
                    }`}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                          {campaign.name}
                        </p>
                        {campaign.description && (
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                            {campaign.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Template */}
                    <div className="text-sm text-zinc-600 dark:text-zinc-300 truncate">
                      {templateName}
                    </div>

                    {/* Status */}
                    <div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold capitalize ${
                          statusStyles[status] || statusStyles.DRAFT
                        }`}
                      >
                        {status.toLowerCase()}
                      </Badge>
                    </div>

                    {/* Recipients */}
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                      <Users className="w-3.5 h-3.5" />
                      {campaign.recipient_count ?? 0}
                    </div>

                    {/* Date */}
                    <div className="text-sm text-zinc-400 dark:text-zinc-500">
                      {formatDate(campaign.updated_at)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 rounded-lg border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 dark:hover:bg-blue-900/20 gap-1.5 text-xs font-medium transition-all"
                      >
                        <Link href={`/campaigns/${campaign.id}`}>
                          <Edit className="h-3.5 w-3.5" /> View
                        </Link>
                      </Button>
                      <form action={deleteCampaign.bind(null, campaign.id)}>
                        <Button
                          type="submit"
                          size="sm"
                          className="h-8 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-100 dark:border-red-900/30 gap-1.5 text-xs font-medium transition-all shadow-none"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </Sidebar>
  );
}
