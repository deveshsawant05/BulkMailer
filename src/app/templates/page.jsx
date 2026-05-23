import Link from "next/link";
import { Edit, Plus, Trash2, FileText, Layers } from "lucide-react";

import { deleteTemplate, getTemplates } from "@/app/actions/templates";
import Sidebar from "@/components/global/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { extractVariables } from "@/lib/utils";

function formatDate(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function TemplatesPage() {
  const result = await getTemplates();
  const templates = result.data ?? [];

  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f8f9fc] dark:bg-zinc-950">

        {/* Page Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                  Email Templates
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {templates.length} {templates.length === 1 ? "template" : "templates"} in your library
                </p>
              </div>
            </div>
            <Button
              asChild
              className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm shadow-blue-600/20 gap-2 transition-all"
            >
              <Link href="/templates/new">
                <Plus className="h-4 w-4" />
                New Template
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {!result.success ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 px-5 py-4 text-sm text-red-600 dark:text-red-400 font-medium">
              {result.error}
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-zinc-900 dark:text-white text-base">No templates yet</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Create your first email template to get started.</p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2">
                <Link href="/templates/new"><Plus className="h-4 w-4" /> Create Template</Link>
              </Button>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-4 px-6 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                {["Template", "Subject", "Variables", "Updated", ""].map((h, i) => (
                  <div key={i} className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {h}
                  </div>
                ))}
              </div>

              {/* Table Rows */}
              {templates.map((template, idx) => {
                const variables = extractVariables(
                  `${template.subject_template}\n${template.body_template}`
                );

                return (
                  <div
                    key={template.id}
                    className={`grid grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-4 px-6 py-4 items-center group transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-900/10 ${
                      idx !== 0 ? "border-t border-zinc-100 dark:border-zinc-800" : ""
                    }`}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{template.name}</p>
                        {template.description && (
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{template.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="text-sm text-zinc-600 dark:text-zinc-300 truncate">{template.subject_template}</div>

                    {/* Variables */}
                    <div className="flex flex-wrap gap-1.5">
                      {variables.length > 0 ? (
                        <>
                          {variables.slice(0, 2).map((v) => (
                            <span key={v} className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-medium border border-indigo-100 dark:border-indigo-800">
                              {"{{"}{v}{"}}"}
                            </span>
                          ))}
                          {variables.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                              +{variables.length - 2}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </div>

                    {/* Date */}
                    <div className="text-sm text-zinc-400 dark:text-zinc-500">{formatDate(template.updated_at)}</div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button asChild variant="outline" size="sm" className="h-8 px-3 rounded-lg border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 dark:hover:bg-blue-900/20 gap-1.5 text-xs font-medium transition-all">
                        <Link href={`/templates/${template.id}/edit`}>
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                      <form action={deleteTemplate.bind(null, template.id)}>
                        <Button type="submit" size="sm" className="h-8 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-100 dark:border-red-900/30 gap-1.5 text-xs font-medium transition-all shadow-none">
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