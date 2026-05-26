"use client";

import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/global/sidebar";
import TemplateForm from "@/components/templates/template-form";
import premadeTemplates from "@/lib/data/premade-templates.json";
import { attachUnlayerDesignMetadata } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState, useEffect } from "react";

function NewTemplateContent() {
  const searchParams = useSearchParams();
  const prebuiltId = searchParams.get("prebuilt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const selectedTemplate = useMemo(() => {
    if (!prebuiltId) {
      return { name: "", description: "", body_template: "" };
    }
    const templateDef = premadeTemplates.find((t) => t.id === prebuiltId);
    if (!templateDef) {
      return { name: "", description: "", body_template: "" };
    }
    return {
      name: templateDef.name,
      description: templateDef.description,
      design: templateDef.design,
    };
  }, [prebuiltId]);

  if (!mounted) {
    return (
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-5 md:px-8 py-6 text-sm text-zinc-500 flex items-center justify-center">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto px-5 md:px-8 py-6">
      <TemplateForm template={selectedTemplate} />
    </div>
  );
}

export default function NewTemplatePage() {
  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f4f6fa] dark:bg-zinc-950 flex flex-col">
        {/* Slim breadcrumb bar */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-2.5 flex items-center gap-2.5 shrink-0">
          <Link
            href="/templates"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Templates
          </Link>
          <span className="text-zinc-200 dark:text-zinc-700 text-xs">/</span>
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">New Template</span>
        </div>
        <Suspense fallback={<div className="p-8 text-sm text-zinc-500 text-center">Loading...</div>}>
          <NewTemplateContent />
        </Suspense>
      </main>
    </Sidebar>
  );
}