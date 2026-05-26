"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  Mail,
  Users,
  Sparkles,
  Send,
  Plug
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/global/sidebar";
import useCheckSession from "@/hooks/check-session";
import LoadingPage from "@/components/global/loading-page";
import { createCampaign, getGmailConnections, startCampaign } from "@/app/actions/campaigns";
import { createClient } from "@/utils/supabase/client";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { loading, user } = useCheckSession();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [templates, setTemplates] = useState([]);
  const [gmailConnections, setGmailConnections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [gmailConnectionId, setGmailConnectionId] = useState("");
  const [subjectLine, setSubjectLine] = useState("");
  const [bodyTemplate, setBodyTemplate] = useState("");
  const [recipients, setRecipients] = useState("");

  const recipientCount = recipients
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e.length > 0).length;

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      setLoadingData(true);
      const supabase = createClient();
      
      // Load templates
      const { data: templateData } = await supabase
        .from("templates")
        .select("id, name, subject_template, body_template")
        .order("updated_at", { ascending: false });

      if (templateData) {
        setTemplates(templateData);
      }

      // Load Gmail connections
      const connectionsRes = await getGmailConnections();
      if (connectionsRes.success) {
        setGmailConnections(connectionsRes.data || []);
        if (connectionsRes.data && connectionsRes.data.length === 1) {
          setGmailConnectionId(connectionsRes.data[0].id);
        }
      }
      setLoadingData(false);
    }
    loadData();
  }, [user]);

  const handleTemplateChange = (e) => {
    const selectedId = e.target.value;
    setTemplateId(selectedId);

    if (selectedId) {
      const t = templates.find((t) => t.id === selectedId);
      if (t) {
        if (t.subject_template) setSubjectLine(t.subject_template);
        if (t.body_template) setBodyTemplate(t.body_template);
      }
    } else {
      setBodyTemplate("");
    }
  };

  const handleSave = async (status) => {
    setError("");
    if (!name.trim()) {
      setError("Campaign name is required.");
      return;
    }
    if (!gmailConnectionId) {
      setError("Please select a sender account.");
      return;
    }
    if (!templateId || !bodyTemplate) {
      setError("A template is required for the email body.");
      return;
    }
    if (!subjectLine.trim()) {
      setError("Subject line is required.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await createCampaign({
        name,
        description,
        template_id: templateId || undefined,
        gmail_connection_id: gmailConnectionId,
        subject_template: subjectLine,
        body_template: bodyTemplate,
        status: "DRAFT", // always create as DRAFT initially
        recipients,
      });

      if (!result.success) {
        setError(result.error);
      } else {
        if (status === "QUEUED") {
          // Now start it properly which enqueues the jobs
          const startResult = await startCampaign(result.data.id);
          if (!startResult.success) {
            setError("Campaign saved as DRAFT, but failed to start: " + startResult.error);
            setIsSaving(false);
            return;
          }
        }
        router.push("/campaigns");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || loadingData) {
    return (
      <Sidebar>
        <LoadingPage />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f8f9fc] dark:bg-zinc-950 flex flex-col">
        {/* Breadcrumb Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center gap-3 shrink-0">
          <Link
            href="/campaigns"
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Campaigns
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            Create Campaign
          </span>
        </div>

        <div className="max-w-4xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Campaign Details */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Campaign Details
              </h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 Product Launch"
                  className="h-10 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Description
                </Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Internal notes about this campaign..."
                  className="min-h-[80px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm resize-y"
                />
              </div>
            </div>
          </div>

          {/* Email Configuration */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Mail className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Email Configuration
              </h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Sender Account <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 rounded-l-xl pointer-events-none">
                    <Plug className="w-4 h-4" />
                  </div>
                  <select
                    value={gmailConnectionId}
                    onChange={(e) => setGmailConnectionId(e.target.value)}
                    className="h-10 w-full pl-11 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <option value="">-- Select an Account --</option>
                    {gmailConnections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.email || c.email_address || `Account (${c.id.slice(0,8)})`}
                      </option>
                    ))}
                  </select>
                </div>
                {gmailConnections.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    No connected accounts found. You must connect a Gmail account before creating a campaign.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Template <span className="text-red-500">*</span>
                </Label>
                <select
                  value={templateId}
                  onChange={handleTemplateChange}
                  className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="">-- Select a Template --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Subject Line <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 rounded-l-xl pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    value={subjectLine}
                    onChange={(e) => setSubjectLine(e.target.value)}
                    placeholder="Enter subject line..."
                    className="h-10 pl-11 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recipients */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Recipients
                </h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                {recipientCount} recipients
              </span>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <textarea
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="john@example.com, jane@example.com..."
                className="min-h-[120px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm resize-y"
              />
              <p className="text-[11px] text-zinc-500">
                Enter a comma-separated list of email addresses.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving || gmailConnections.length === 0}
              onClick={() => handleSave("DRAFT")}
              className="h-10 px-5 rounded-xl border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save as Draft
            </Button>
            <Button
              type="button"
              disabled={isSaving || gmailConnections.length === 0}
              onClick={() => handleSave("QUEUED")}
              className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm shadow-blue-600/20 gap-2 transition-all"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Create Campaign
            </Button>
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
