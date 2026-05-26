import Link from "next/link";
import { Edit, Trash2, FileText } from "lucide-react";

import { deleteTemplate, getTemplates } from "@/app/actions/templates";
import Sidebar from "@/components/global/sidebar";
import { Button } from "@/components/ui/button";
import { extractVariables } from "@/lib/utils";
import Object_PremadeTemplates from "@/lib/data/premade-templates.json";
import { TemplatePreview } from "@/components/templates/template-preview";
import { TemplateGallery } from "@/components/templates/template-gallery";

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

        {/* ─── Google Docs Style Header (Start a new template) ─── */}
        <TemplateGallery premadeTemplates={Object_PremadeTemplates} />

        {/* ─── Recent Templates ─── */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Recent templates
             </h2>
          </div>

          {!result.success ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 px-5 py-4 text-sm text-red-600 dark:text-red-400 font-medium">
              {result.error}
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-zinc-900 dark:text-white text-sm">No templates yet</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Select a template above to get started.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => {
                const variables = extractVariables(
                  `${template.subject_template}\n${template.body_template}`
                );

                return (
                  <div key={template.id} className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                    <Link href={`/templates/${template.id}/edit`} className="relative w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden block focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500">
                      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105 pointer-events-none bg-zinc-200 dark:bg-zinc-800">
                        <TemplatePreview template={template} className="w-full h-full" />
                      </div>
                    </Link>
                    
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <div className="min-w-0">
                        <Link href={`/templates/${template.id}/edit`} className="hover:underline focus:outline-none">
                          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{template.name}</h3>
                        </Link>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{formatDate(template.updated_at)}</p>
                      </div>
                      
                      <div className="mt-1">
                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 line-clamp-1">
                          {template.subject_template || "No subject line"}
                        </p>
                      </div>

                      <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                        {variables.length > 0 ? (
                          <>
                            {variables.slice(0, 3).map((v) => (
                              <span key={v} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                                {"{"}{v}{"}"}
                              </span>
                            ))}
                            {variables.length > 3 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                +{variables.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">No variables</span>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Link href={`/templates/${template.id}/edit`}>
                          <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                        </Link>
                      </Button>
                      <form action={deleteTemplate.bind(null, template.id)}>
                        <Button type="submit" variant="ghost" size="sm" className="h-8 px-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
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