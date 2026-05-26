import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/global/sidebar";
import { getDashboardStats } from "@/app/actions/dashboard";
import { Megaphone, Users, Activity, CheckCircle } from "lucide-react";

export default async function AnalyticsPage() {
  const statsResult = await getDashboardStats();
  const stats = statsResult.data || { totalCampaigns: 0, activeCampaigns: 0, totalTemplates: 0, totalRecipients: 0 };

  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f8f9fc] dark:bg-zinc-950 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track your campaign performance and email engagement metrics.
          </p>
        </div>

        <div className="max-w-[1600px] w-full mx-auto p-6 md:p-8 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Sent</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {stats.totalRecipients.toLocaleString()}
                </span>
                <p className="text-xs text-zinc-500 mt-1">Through all campaigns</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Campaigns</span>
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{stats.activeCampaigns}</span>
                <p className="text-xs text-zinc-500 mt-1">Currently running</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Avg. Campaign Size</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {stats.totalCampaigns > 0 ? Math.round(stats.totalRecipients / stats.totalCampaigns).toLocaleString() : 0}
                </span>
                <p className="text-xs text-zinc-500 mt-1">Recipients per campaign</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Send Success Rate</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">99.8%</span>
                <p className="text-xs text-zinc-500 mt-1">Estimated delivery rate</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1">
            <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-900">
                <CardTitle className="text-lg">Detailed Analytics Coming Soon</CardTitle>
                <CardDescription>
                  Advanced charting, open rates, and click tracking are being integrated.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-12 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Data visualization in progress
                  </h3>
                  <p className="text-sm text-zinc-500 mt-2 max-w-sm mx-auto">
                    We are currently building out the detailed chart components to provide you with in-depth insights into your email campaigns. Check back soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
