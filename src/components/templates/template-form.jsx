"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Save, Plus, X, GripVertical,
  Settings2, Variable, Mail, Copy, Check, MousePointerClick
} from "lucide-react";

import { createTemplate, updateTemplate } from "@/app/actions/templates";
import UnlayerEmailBuilder from "@/components/templates/unlayer-email-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  attachUnlayerDesignMetadata,
  extractUnlayerDesignMetadata,
  extractVariables,
  stripUnlayerDesignMetadata,
} from "@/lib/utils";

export default function TemplateForm({ template = null }) {
  const router = useRouter();
  const emailBuilderRef = useRef(null);
  const activeInputRef = useRef(null); // tracks last-focused text input
  const [isSaving, setIsSaving] = useState(false);
  const [isBuilderReady, setIsBuilderReady] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(template?.name ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [subjectTemplate, setSubjectTemplate] = useState(template?.subject_template ?? "");
  const [bodyTemplate, setBodyTemplate] = useState(
    stripUnlayerDesignMetadata(template?.body_template ?? "")
  );
  const [customVariables, setCustomVariables] = useState(() =>
    extractVariables(`${template?.subject_template ?? ""}\n${template?.body_template ?? ""}`)
  );
  const [newVarName, setNewVarName] = useState("");
  const [copiedVar, setCopiedVar] = useState(null);

  const initialDesign = useMemo(
    () => extractUnlayerDesignMetadata(template?.body_template ?? ""),
    [template?.body_template]
  );

  const variables = useMemo(() => {
    const extracted = extractVariables(`${subjectTemplate}\n${bodyTemplate}`);
    return Array.from(new Set([...customVariables, ...extracted]));
  }, [subjectTemplate, bodyTemplate, customVariables]);

  const addCustomVariable = () => {
    const clean = newVarName.trim();
    if (clean && !customVariables.includes(clean)) {
      setCustomVariables((prev) => [...prev, clean]);
      setNewVarName("");
    }
  };

  const removeVariable = (v) => {
    setCustomVariables((prev) => prev.filter((c) => c !== v));
  };

  // ─── Variable insertion strategy ───────────────────────────────────────────
  // Unlayer runs inside an <iframe> — native HTML5 drag events cannot cross
  // the frame boundary. The approach here is:
  //   1. If a regular text <input> is focused (name / description / subject),
  //      clicking a variable inserts {{Var}} at the cursor position in that input.
  //   2. If no input is focused (user is working inside Unlayer), clicking a
  //      variable copies {{Var}} to the clipboard AND calls the builder's
  //      insertText() method which uses Unlayer's internal `editor.execute('paste')`
  //      via postMessage to inject the text into the currently selected block.
  // ───────────────────────────────────────────────────────────────────────────

  const handleVariableClick = useCallback((variable) => {
    const tag = `{{${variable}}}`;

    // 1. Try inserting into the last-focused native input
    const input = activeInputRef.current;
    if (input && document.contains(input)) {
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const before = input.value.slice(0, start);
      const after = input.value.slice(end);
      const newValue = before + tag + after;

      // Update react state for whichever field is focused
      const id = input.id;
      if (id === "subject-template") setSubjectTemplate(newValue);
      else if (id === "template-name") setName(newValue);
      else if (id === "template-description") setDescription(newValue);

      // Restore cursor position after react re-render
      requestAnimationFrame(() => {
        input.focus();
        const pos = start + tag.length;
        input.setSelectionRange(pos, pos);
      });
      return;
    }

    // 2. Try inserting into Unlayer via the builder's insertText method
    const inserted = emailBuilderRef.current?.insertText?.(tag);

    // 3. Always copy to clipboard as the reliable fallback
    navigator.clipboard.writeText(tag).catch(() => {});
    setCopiedVar(variable);
    setTimeout(() => setCopiedVar(null), 1800);
  }, []);

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
      const payload = {
        name,
        description,
        subject_template: subjectTemplate,
        body_template: attachUnlayerDesignMetadata(exported.html, exported.design),
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

  // Track which native input the user last focused
  const trackFocus = (e) => { activeInputRef.current = e.target; };
  const clearFocus = (e) => {
    // Only clear if focus left our inputs entirely (not just tab-between)
    setTimeout(() => {
      if (!document.activeElement || !["template-name","template-description","subject-template"].includes(document.activeElement.id)) {
        // Keep the ref so variable click can still insert after blur
      }
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-5 w-full items-start">

      {/* ══════════════════════════════
          LEFT COLUMN — Config + Editor
         ══════════════════════════════ */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 order-2 xl:order-1">

        {/* ── Config card (compact single row) ── */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <Settings2 className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Configuration</h2>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">— name, description & subject</span>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5 sm:col-span-4">
              <Label htmlFor="template-name" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={trackFocus}
                onBlur={clearFocus}
                placeholder="e.g. Weekly Newsletter"
                required
                className="h-9 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm font-medium"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 sm:col-span-8">
              <Label htmlFor="template-description" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Description
              </Label>
              <Input
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={trackFocus}
                onBlur={clearFocus}
                placeholder="Internal notes about when this template is used..."
                className="h-9 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm"
              />
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5 sm:col-span-12">
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
                  onFocus={trackFocus}
                  onBlur={clearFocus}
                  placeholder="Hi {{FirstName}}, here's your update from {{CompanyName}}!"
                  required
                  className="h-10 pl-11 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 focus-visible:ring-blue-500 focus-visible:border-blue-400 text-sm font-medium"
                />
              </div>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Click any variable on the right to insert it at the cursor, or type <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{"{{VarName}}"}</code> directly.
              </p>
            </div>
          </div>
        </div>

        {/* ── Visual Editor ── */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          {/* Titlebar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase ml-1">
                Visual Editor
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto-saving
            </div>
          </div>

          <UnlayerEmailBuilder
            ref={emailBuilderRef}
            value={bodyTemplate}
            initialDesign={initialDesign}
            onChange={setBodyTemplate}
            onReadyChange={setIsBuilderReady}
            variables={variables}
            className="w-full border-0 rounded-none shadow-none"
            style={{ minHeight: 720 }}
          />
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT COLUMN — Save + Variables
         ══════════════════════════════ */}
      <div className="w-full xl:w-[300px] flex flex-col gap-4 shrink-0 order-1 xl:order-2 xl:sticky xl:top-4">

        {/* ── Save card ── */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="h-1 bg-blue-600 w-full" />
          <div className="p-5 flex flex-col gap-3.5">
            <div>
              <p className="font-bold text-zinc-900 dark:text-white text-sm">
                {template?.id ? "Save Changes" : "Publish Template"}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                {template?.id
                  ? "Updates apply to all linked campaigns."
                  : "Template becomes available in campaigns."}
              </p>
            </div>

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
        </div>

        {/* ── Variables card ── */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Variable className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">Variables</p>
              </div>
            </div>
            {variables.length > 0 && (
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 px-2 py-0.5 rounded-full">
                {variables.length}
              </span>
            )}
          </div>

          <div className="p-4 flex flex-col gap-3">
            {/* Add input */}
            <div className="flex gap-2">
              <Input
                placeholder="NewVariable"
                value={newVarName}
                onChange={(e) => setNewVarName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomVariable(); } }}
                className="h-8 rounded-lg border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-mono flex-1 focus-visible:ring-indigo-500"
              />
              <Button
                type="button"
                onClick={addCustomVariable}
                className="h-8 w-8 px-0 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-none shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Hint */}
            <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl px-3 py-2">
              <MousePointerClick className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-snug">
                <strong>Click</strong> a variable to insert it at cursor in any text field, or copy it to paste into the email editor.
              </p>
            </div>

            {/* Variables list */}
            <div className="flex flex-col gap-1.5 min-h-[80px] max-h-[320px] overflow-y-auto">
              {variables.length > 0 ? variables.map((variable) => {
                const isCopied = copiedVar === variable;
                return (
                  <div
                    key={variable}
                    className="group flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/15 transition-all duration-100 pr-1.5 pl-1.5 py-1 select-none"
                  >
                    <div
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", `{{${variable}}}`)}
                      className="cursor-grab active:cursor-grabbing p-1 rounded text-zinc-300 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:text-indigo-400 touch-none"
                      title="Drag to insert into editor"
                    >
                      <GripVertical className="w-3 h-3 shrink-0" />
                    </div>
                    <span 
                      className="flex-1 font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-300 truncate cursor-pointer py-1"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleVariableClick(variable)}
                      title="Click to insert / copy"
                    >
                      {`{{${variable}}}`}
                    </span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleVariableClick(variable); }}
                        className="p-1 rounded-md text-zinc-300 dark:text-zinc-600 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        title="Insert / copy"
                      >
                        {isCopied
                          ? <Check className="w-3 h-3 text-emerald-500" />
                          : <Copy className="w-3 h-3" />
                        }
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeVariable(variable); }}
                        className="p-1 rounded-md text-zinc-300 dark:text-zinc-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove variable"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center py-7 text-center gap-2">
                  <div className="w-9 h-9 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-zinc-300 dark:text-zinc-600">{"{}"}</span>
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">No variables yet.<br />Add one above or use <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-[10px]">{"{{Var}}"}</code> in subject.</p>
                </div>
              )}
            </div>

            {variables.length > 0 && (
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center leading-relaxed pt-0.5">
                Drag into the editor · Click to insert/copy
              </p>
            )}
          </div>
        </div>
      </div>

    </form>
  );
}