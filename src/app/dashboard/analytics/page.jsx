"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import Sidebar from "@/components/global/sidebar";
import useCheckSession from "@/hooks/check-session";
import LoadingPage from "@/components/global/loading-page";

const emailsSentData = [
  {
    name: "Jan",
    sent: 24000,
  },
  {
    name: "Feb",
    sent: 13980,
  },
  {
    name: "Mar",
    sent: 98000,
  },
  {
    name: "Apr",
    sent: 39080,
  },
  {
    name: "May",
    sent: 48000,
  },
  {
    name: "Jun",
    sent: 38000,
  },
];

const campaignData = [
  {
    name: "Jan",
    active: 4,
    completed: 2,
  },
  {
    name: "Feb",
    active: 3,
    completed: 4,
  },
  {
    name: "Mar",
    active: 6,
    completed: 3,
  },
  {
    name: "Apr",
    active: 4,
    completed: 5,
  },
  {
    name: "May",
    active: 5,
    completed: 4,
  },
  {
    name: "Jun",
    active: 8,
    completed: 3,
  },
];

export default function AnalyticsPage() {
  const { loading, user } = useCheckSession();

  return (
    <Sidebar>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="flex-1 space-y-4 px-4 md:px-8 ">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sent (30d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">54,321</div>
                <p className="text-xs text-muted-foreground">
                  Through all campaigns
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Currently running
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Campaign Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,450</div>
                <p className="text-xs text-muted-foreground">
                  Recipients per campaign
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Send Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground">
                  Last 1000 emails
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Emails Sent</CardTitle>
                <CardDescription>Total emails sent per month</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    sent: {
                      label: "Emails Sent",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emailsSentData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="sent"
                        stroke="var(--color-sent)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Campaign Status</CardTitle>
                <CardDescription>Active vs completed campaigns</CardDescription>
              </CardHeader>
              <CardContent className="pl-2 w-full">
                <ChartContainer
                  config={{
                    active: {
                      label: "Active",
                      color: "hsl(var(--chart-2))",
                    },
                    completed: {
                      label: "Completed",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={campaignData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="active"
                        stroke="var(--color-active)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="var(--color-completed)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
