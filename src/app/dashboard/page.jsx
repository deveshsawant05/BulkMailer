import Link from "next/link";
import {
  Megaphone,
  Mail,
  FileText,
  Clock,
  Plus,
  Users,
  Layers,
  ArrowRight
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import Sidebar from "@/components/global/sidebar";
import { getDashboardStats, getRecentCampaigns, getRecentTemplates } from "@/app/actions/dashboard";

const statusStyles = {
  DRAFT: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  QUEUED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  PROCESSING: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  PAUSED: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
};

function formatDate(value) {
  if (!value) return "--";
  const date = new Date(value);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

export default async function DashboardPage() {
  const [statsResult, recentCampaignsResult, recentTemplatesResult] = await Promise.all([
    getDashboardStats(),
    getRecentCampaigns(5),
    getRecentTemplates(5),
  ]);

  const stats = statsResult.data || { totalCampaigns: 0, activeCampaigns: 0, totalTemplates: 0, totalRecipients: 0 };
  const recentCampaigns = recentCampaignsResult.data || [];
  const recentTemplates = recentTemplatesResult.data || [];

  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f8f9fc] dark:bg-zinc-950 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Here is what's happening with your bulk mail campaigns.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="h-9 px-4 rounded-xl border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 gap-2">
              <Link href="/templates/new">
                <FileText className="w-4 h-4" />
                New Template
              </Link>
            </Button>
            <Button asChild className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm shadow-blue-600/20 gap-2 transition-all">
              <Link href="/campaigns/create">
                <Plus className="w-4 h-4" />
                Create Campaign
              </Link>
            </Button>
          </div>
        </div>

        <div className="max-w-[1600px] w-full mx-auto p-6 md:p-8 space-y-6">
          
          {/* Stat Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Total Campaigns */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Campaigns</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalCampaigns}</span>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{stats.activeCampaigns} active</span>
                  <span>currently running</span>
                </div>
              </div>
            </div>

            {/* Total Recipients */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Recipients</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalRecipients.toLocaleString()}</span>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Across all your campaigns</span>
                </div>
              </div>
            </div>

            {/* Total Templates */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Templates</span>
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalTemplates}</span>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Available in your library</span>
                </div>
              </div>
            </div>

            {/* Avg Send Time (Placeholder) */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Avg. Send Time</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">--</span>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Per email delivered</span>
                </div>
              </div>
            </div>

          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
            {/* Recent Campaigns */}
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Recent Campaigns</h3>
                <Link href="/campaigns" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              
              {recentCampaigns.length > 0 ? (
                <Table>
                  <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
                    <TableRow className="border-b-zinc-100 dark:border-b-zinc-800">
                      <TableHead className="h-10 text-xs font-semibold text-zinc-500 tracking-wider uppercase">Name</TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-zinc-500 tracking-wider uppercase">Status</TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-zinc-500 tracking-wider uppercase text-right">Recipients</TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-zinc-500 tracking-wider uppercase text-right">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCampaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="border-b-zinc-100 dark:border-b-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                        <TableCell className="font-medium text-sm text-zinc-900 dark:text-zinc-100 max-w-[150px] truncate">
                          <Link href={`/campaigns/${campaign.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                            {campaign.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold ${statusStyles[campaign.status?.toUpperCase() || "DRAFT"]}`}>
                            {campaign.status || "DRAFT"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-zinc-600 dark:text-zinc-400 text-right">
                          {(campaign.recipient_count ?? 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs text-zinc-500 dark:text-zinc-400 text-right whitespace-nowrap">
                          {formatDate(campaign.updated_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                    <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">No campaigns yet</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[250px]">Create a campaign to send emails to your audience.</p>
                </div>
              )}
            </div>

            {/* Template Usage */}
            <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Recent Templates</h3>
                <Link href="/templates" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentTemplates.length > 0 ? (
                <Table>
                  <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
                    <TableRow className="border-b-zinc-100 dark:border-b-zinc-800">
                      <TableHead className="h-10 text-xs font-semibold text-zinc-500 tracking-wider uppercase">Template</TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-zinc-500 tracking-wider uppercase text-right">Used In</TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-zinc-500 tracking-wider uppercase text-right">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTemplates.map((template) => (
                      <TableRow key={template.id} className="border-b-zinc-100 dark:border-b-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                        <TableCell className="font-medium text-sm text-zinc-900 dark:text-zinc-100 max-w-[150px] truncate">
                          <Link href={`/templates/${template.id}/edit`} className="hover:text-blue-600 dark:hover:text-blue-400">
                            {template.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm text-zinc-600 dark:text-zinc-400 text-right">
                          {template.usage_count ?? 0}
                        </TableCell>
                        <TableCell className="text-xs text-zinc-500 dark:text-zinc-400 text-right whitespace-nowrap">
                          {formatDate(template.updated_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">No templates yet</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">Design your first email template to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
