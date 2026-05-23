import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import { getTemplateById } from "@/app/actions/templates";
import Sidebar from "@/components/global/sidebar";
import TemplateForm from "@/components/templates/template-form";

export default async function EditTemplatePage({ params }) {
  const { id } = await params;
  const result = await getTemplateById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const template = result.data;

  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f8f9fc] dark:bg-zinc-950">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-3 flex items-center gap-3">
          <Link
            href="/templates"
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Templates
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <div className="flex items-center gap-2">
            <Pencil className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-xs">
              {template.name || "Edit Template"}
            </span>
          </div>
        </div>

        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-8 py-8">
          <TemplateForm template={template} />
        </div>
      </main>
    </Sidebar>
  );
}