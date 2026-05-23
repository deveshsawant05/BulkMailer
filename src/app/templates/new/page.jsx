"use client";

import { useState } from "react";
import Sidebar from "@/components/global/sidebar";
import TemplateForm from "@/components/templates/template-form";
import { TemplatePreview } from "@/components/templates/template-preview";
import premadeTemplates from "@/lib/data/premade-templates.json";
import { attachUnlayerDesignMetadata } from "@/lib/utils";
import { ArrowLeft, FilePlus2, ChevronRight, Zap, LayoutTemplate } from "lucide-react";

export default function NewTemplatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleSelectTemplate = (templateDef) => {
    if (!templateDef) {
      setSelectedTemplate({ name: "", description: "", body_template: "" });
      return;
    }
    setSelectedTemplate({
      name: templateDef.name,
      description: templateDef.description,
      body_template: attachUnlayerDesignMetadata("<p>Loading...</p>", templateDef.design),
    });
  };

  if (selectedTemplate) {
    return (
      <Sidebar>
        <main className="flex-1 min-h-screen bg-[#f4f6fa] dark:bg-zinc-950 flex flex-col">
          {/* Slim breadcrumb bar */}
          <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-2.5 flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Templates
            </button>
            <span className="text-zinc-200 dark:text-zinc-700 text-xs">/</span>
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">New Template</span>
          </div>
          <div className="flex-1 w-full max-w-[1600px] mx-auto px-5 md:px-8 py-6">
            <TemplateForm template={selectedTemplate} />
          </div>
        </main>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <main className="flex-1 min-h-screen bg-[#f4f6fa] dark:bg-zinc-950 flex flex-col">

        {/* ─── Compact Header ─── */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/30">
                <LayoutTemplate className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <h1 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                  Choose a Starting Point
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Pick a template or start blank — fully customizable in the editor.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-full">
              <span className="font-semibold text-zinc-600 dark:text-zinc-300">{premadeTemplates.length + 1}</span>
              templates available
            </div>
          </div>
        </div>

        {/* ─── Template Grid ─── */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-8 py-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

            {/* ── Blank Canvas ── */}
            <button
              onClick={() => handleSelectTemplate(null)}
              onMouseEnter={() => setHoveredId("blank")}
              onMouseLeave={() => setHoveredId(null)}
              className="group col-span-1 flex flex-col rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-zinc-900 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all duration-150 cursor-pointer overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 py-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 flex items-center justify-center transition-colors duration-150">
                  <FilePlus2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-zinc-900 dark:text-white text-sm leading-tight">Blank Canvas</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">Design from scratch</p>
                </div>
              </div>
              <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-150">
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Start fresh</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform duration-150" />
              </div>
            </button>

            {/* ── Premade Templates ── */}
            {premadeTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                onMouseEnter={() => setHoveredId(tpl.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group col-span-1 flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-600/8 transition-all duration-150 cursor-pointer overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {/* Preview thumbnail */}
                <div className="relative bg-zinc-100 dark:bg-zinc-800 overflow-hidden" style={{ height: 160 }}>
                  <div
                    className="absolute inset-0 transition-transform duration-300"
                    style={{ transform: hoveredId === tpl.id ? "scale(1.03)" : "scale(1)" }}
                  >
                    <TemplatePreview design={tpl.design} className="w-full h-full" />
                  </div>
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
                    style={{
                      backgroundColor: hoveredId === tpl.id ? "rgba(15,23,42,0.45)" : "transparent",
                      opacity: hoveredId === tpl.id ? 1 : 0,
                    }}
                  >
                    <div className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg">
                      <Zap className="w-3.5 h-3.5" />
                      Use this
                    </div>
                  </div>

                  {/* Category pill always visible */}
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex text-[9px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-white/90 dark:bg-zinc-900/90 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800/60 backdrop-blur-sm">
                      {tpl.category}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="px-3.5 pt-3 pb-2 flex-1 flex flex-col gap-0.5">
                  <p className="font-bold text-zinc-900 dark:text-white text-[13px] leading-tight">{tpl.name}</p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug line-clamp-2 mt-0.5">{tpl.description}</p>
                </div>

                <div className="px-3.5 py-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150">
                    Select template
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-150" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </main>
    </Sidebar>
  );
}