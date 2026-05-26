"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Plus, Settings as SettingsIcon, AlertCircle, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Sidebar from "@/components/global/sidebar";
import useCheckSession from "@/hooks/check-session";
import LoadingPage from "@/components/global/loading-page";
import { getGmailConnections } from "@/app/actions/campaigns";
import { Suspense } from "react";

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const { loading, user } = useCheckSession();
  
  const [connections, setConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(true);

  const error = searchParams.get("error");
  const success = searchParams.get("success");

  useEffect(() => {
    if (!user) return;
    
    async function fetchConnections() {
      setLoadingConnections(true);
      const result = await getGmailConnections();
      if (result.success) {
        setConnections(result.data || []);
      }
      setLoadingConnections(false);
    }
    fetchConnections();
  }, [user]);

  if (loading || loadingConnections) {
    return (
      <Sidebar>
        <LoadingPage />
      </Sidebar>
    );
  }

  const handleConnect = () => {
    // Redirect to our OAuth route
    window.location.href = "/api/auth/gmail";
  };

  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f8f9fc] dark:bg-zinc-950">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                Settings
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Manage your account and integrations
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error === "no_code" && "No authorization code returned from Google."}
                {error === "missing_credentials" && "System is missing Google OAuth credentials."}
                {error === "db_error" && "Failed to save the connection to the database."}
                {error === "oauth_failed" && "Failed to authenticate with Google."}
                {error !== "no_code" && error !== "missing_credentials" && error !== "db_error" && error !== "oauth_failed" && error}
              </AlertDescription>
            </Alert>
          )}

          {success === "gmail_connected" && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Gmail account successfully connected! You can now use it to send campaigns.
              </AlertDescription>
            </Alert>
          )}

          <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 pb-4">
              <CardTitle className="text-lg">Email Integrations</CardTitle>
              <CardDescription>
                Connect your email accounts to send campaigns directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {connections.length > 0 ? (
                  <div className="grid gap-4">
                    {connections.map((conn) => (
                      <div key={conn.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-zinc-900 dark:text-white">
                              {conn.gmail_email}
                            </p>
                            <p className="text-xs text-zinc-500">Connected via Gmail</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-zinc-200">
                          Disconnect
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-zinc-500 mb-4">No email accounts connected.</p>
                  </div>
                )}

                <div className="flex justify-start pt-2">
                  <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm gap-2">
                    <Plus className="w-4 h-4" />
                    Connect Gmail Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Sidebar>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <SettingsPageContent />
    </Suspense>
  );
}
