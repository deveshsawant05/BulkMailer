"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Save,
  Settings2, Mail, Maximize, Minimize, Plus, Trash2, Tag
} from "lucide-react";

import { createTemplate, updateTemplate } from "@/app/actions/templates";
import UnlayerEmailBuilder from "@/components/templates/unlayer-email-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  attachUnlayerDesignMetadata,
  extractUnlayerDesignMetadata,
  attachUnlayerVariablesMetadata,
  extractUnlayerVariablesMetadata,
  extractVariables,
} from "@/lib/utils";

export default function TemplateForm({ template = null }) {
  const router = useRouter();
  const emailBuilderRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuilderReady, setIsBuilderReady] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(template?.name ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [subjectTemplate, setSubjectTemplate] = useState(template?.subject_template ?? "");
  const [bodyTemplate, setBodyTemplate] = useState(template?.body_template ?? "");
  
  const initialDesign = useMemo(() => {
    if (template?.design) return template.design;
    return extractUnlayerDesignMetadata(template?.body_template ?? "");
  }, [template]);

  const initialVariables = useMemo(() => {
    let vars = extractUnlayerVariablesMetadata(template?.body_template ?? "");
    if (!vars || vars.length === 0) {
      const designString = initialDesign ? JSON.stringify(initialDesign) : template?.body_template ?? "";
      const matches = designString.matchAll(/{{\s*([A-Za-z0-9_]+)\s*}}/g);
      vars = Array.from(new Set(Array.from(matches, (match) => match[1]))).map(v => `{{${v}}}`);
    }
    return vars;
  }, [template, initialDesign]);
  
  const [variables, setVariables] = useState(initialVariables.length ? initialVariables : []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!emailBuilderRef.current?.isReady()) {
      setError("Email builder is still loading. Please wait.");
      return;
    }

    setIsSaving(true);
    try {
      const exported = await emailBuilderRef.current.exportTemplate();
      
      // Merge HTML with both design and variables metadata
      let finalHtml = attachUnlayerDesignMetadata(exported.html, exported.design);
      finalHtml = attachUnlayerVariablesMetadata(finalHtml, variables);
      
      const payload = {
        name,
        description,
        subject_template: subjectTemplate,
        body_template: finalHtml,
      };

      const result = template?.id
        ? await updateTemplate(template.id, payload)
        : await createTemplate(payload);

      if (!result.success) {
        setError(result.error ?? "Template could not be saved.");
        return;
      }

      router.push("/templates");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Template could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  // Block scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Auto-detect variables from the email editor content
  useEffect(() => {
    if (bodyTemplate) {
      const extracted = extractVariables(bodyTemplate).map(v => `{{${v}}}`);
      if (extracted.length > 0) {
        setVariables(prev => {
          const newVars = Array.from(new Set([...prev, ...extracted]));
          if (newVars.length !== prev.length) return newVars;
          return prev;
        });
      }
    }
  }, [bodyTemplate]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full items-start">

      {/* ── Top Row: Config + Actions ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        
        {/* Config card */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <Settings2 className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Configuration</h2>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">— name, description & subject</span>
          </div>

          <div className="p-5 flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="template-name" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Weekly Newsletter"
                required
                className="h-10 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="template-description" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Description
              </Label>
              <Input
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Internal notes..."
                className="h-10 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject-template" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Subject Line <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 rounded-l-xl pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  id="subject-template"
                  value={subjectTemplate}
                  onChange={(e) => setSubjectTemplate(e.target.value)}
                  placeholder="Hi {{FirstName}}, here's your update from {{CompanyName}}!"
                  required
                  className="h-10 pl-11 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Publish + Variables */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Save Button */}
          <div className="flex flex-col gap-3 shrink-0">
            {error && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-3.5 py-2.5 text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSaving || !isBuilderReady}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-sm shadow-blue-600/20 gap-2 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving…" : template?.id ? "Update Template" : "Save Template"}
            </Button>

            {!isBuilderReady && (
              <p className="text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Editor loading…
              </p>
            )}
          </div>
          
          {/* Variables Manager Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Tag className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Variables</h2>
            </div>
            
            <div className="p-4 flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  id="new-variable"
                  placeholder="New variable (e.g. {{name}})"
                  className="h-9 text-xs font-mono bg-white dark:bg-zinc-900"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        const formatted = val.startsWith("{{") ? val : `{{${val}}}`;
                        if (!variables.includes(formatted)) {
                          setVariables([...variables, formatted]);
                        }
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 px-4 text-xs font-medium"
                  onClick={() => {
                    const input = document.getElementById('new-variable');
                    const val = input?.value.trim();
                    if (val) {
                      const formatted = val.startsWith("{{") ? val : `{{${val}}}`;
                      if (!variables.includes(formatted)) {
                        setVariables([...variables, formatted]);
                      }
                      input.value = "";
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[300px]">
                {variables.length === 0 ? (
                  <div className="w-full text-center py-6 text-sm text-zinc-500">
                    No variables detected. Add one or type {"{{var}}"} in the editor.
                  </div>
                ) : (
                  variables.map((variable, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors"
                    >
                      <span 
                        onClick={() => {
                          navigator.clipboard.writeText(variable);
                        }}
                        className="text-xs font-mono text-zinc-700 dark:text-zinc-300 cursor-pointer"
                        title="Click to copy"
                      >
                        {variable}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newVars = [...variables];
                          newVars.splice(index, 1);
                          setVariables(newVars);
                        }}
                        className="opacity-50 hover:opacity-100 hover:text-red-500 transition-opacity p-0.5"
                        title="Remove variable"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Visual Editor ── */}
      <div className="w-full relative">
        {isFullscreen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300" />}
        <div className={`bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-2 sm:inset-4 md:inset-6 lg:inset-8 z-[100] m-0 shadow-2xl animate-in zoom-in-95 duration-200 ease-out border-zinc-300 dark:border-zinc-700' : 'w-full relative'}`}>
          {/* Titlebar */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase ml-1">
                Visual Editor
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Auto-saving
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors bg-white dark:bg-zinc-800 p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-sm"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <UnlayerEmailBuilder
            ref={emailBuilderRef}
            value={bodyTemplate}
            initialDesign={initialDesign}
            variables={variables}
            onChange={setBodyTemplate}
            onReadyChange={setIsBuilderReady}
            className="w-full border-0 rounded-none shadow-none flex-1"
            minHeight={isFullscreen ? '100vh' : '720px'}
          />
        </div>
      </div>

    </form>
  );
}