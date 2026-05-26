"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  useCallback,
  useMemo,
  forwardRef,
} from "react";
import EmailEditor from "react-email-editor";

const customFonts = [
  { label: 'Andale Mono', value: 'andale mono,times' },
  { label: 'Arial', value: 'arial,helvetica,sans-serif' },
  { label: 'Arial Black', value: 'arial black,avant garde' },
  { label: 'Book Antiqua', value: 'book antiqua,palatino' },
  { label: 'Cabin', value: 'Cabin,sans-serif', url: 'https://fonts.googleapis.com/css2?family=Cabin:wght@400;700&display=swap' },
  { label: 'Comic Sans MS', value: 'comic sans ms,sans-serif' },
  { label: 'Courier New', value: 'courier new,courier' },
  { label: 'Crimson Text', value: 'Crimson Text,serif', url: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;700&display=swap' },
  { label: 'Georgia', value: 'georgia,palatino' },
  { label: 'Helvetica', value: 'helvetica,sans-serif' },
  { label: 'Impact', value: 'impact,chicago' },
  { label: 'Lato', value: 'Lato,sans-serif', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap' },
  { label: 'Lobster Two', value: 'Lobster Two,cursive', url: 'https://fonts.googleapis.com/css2?family=Lobster+Two:wght@400;700&display=swap' },
  { label: 'Montserrat', value: 'Montserrat,sans-serif', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap' },
  { label: 'Old Standard TT', value: 'Old Standard TT,serif', url: 'https://fonts.googleapis.com/css2?family=Old+Standard+TT:wght@400;700&display=swap' },
  { label: 'Open Sans', value: 'Open Sans,sans-serif', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap' },
  { label: 'Pacifico', value: 'Pacifico,cursive', url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap' },
  { label: 'Playfair Display', value: 'Playfair Display,serif', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap' },
  { label: 'Raleway', value: 'Raleway,sans-serif', url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap' },
  { label: 'Rubik', value: 'Rubik,sans-serif', url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap' },
  { label: 'Source Sans Pro', value: 'Source Sans Pro,sans-serif', url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap' },
  { label: 'Symbol', value: 'symbol' },
  { label: 'Tahoma', value: 'tahoma,arial,helvetica,sans-serif' },
  { label: 'Terminal', value: 'terminal,monaco' },
  { label: 'Times New Roman', value: 'times new roman,times' },
  { label: 'Trebuchet MS', value: 'trebuchet ms,geneva' },
  { label: 'Verdana', value: 'verdana,geneva' }
];

const UnlayerEmailBuilder = forwardRef(function UnlayerEmailBuilder(
  {
    initialDesign = null,
    variables = [],
    onChange,
    onReadyChange,
    className,
    style,
    minHeight = "720px",
  },
  ref
) {
  const emailEditorRef = useRef(null);
  const [ready, setReady] = useState(false);

  // ── Expose imperative methods to parent via ref ──────────────────────
  useImperativeHandle(
    ref,
    () => ({
      isReady: () => ready,
      exportTemplate: () => {
        return new Promise((resolve, reject) => {
          const editor = emailEditorRef.current?.editor;
          if (!editor) {
            reject(new Error("Editor not ready"));
            return;
          }
          editor.exportHtml((data) => {
            resolve({ html: data.html, design: data.design });
          });
        });
      },
      insertText: (text) => {
        try {
          navigator.clipboard.writeText(text);
          return true;
        } catch {
          return false;
        }
      },
    }),
    [ready]
  );

  // ── Editor ready callback ───────────────────────────────────────────
  const onReady = useCallback(
    (unlayer) => {
      if (initialDesign && typeof initialDesign === "object") {
        console.log("Loading design into Unlayer:", initialDesign);
        unlayer.loadDesign(initialDesign);
      }

      unlayer.addEventListener("design:loaded", () => {
        if (onChange) {
          unlayer.exportHtml((data) => {
            onChange(data.html);
          });
        }
      });

      unlayer.addEventListener("design:updated", () => {
        if (onChange) {
          unlayer.exportHtml((data) => {
            onChange(data.html);
          });
        }
      });

      setReady(true);
      if (onReadyChange) onReadyChange(true);
    },
    [initialDesign, onChange, onReadyChange]
  );
  
  const mergeTags = useMemo(() => {
    const tags = {};
    variables.forEach(v => {
      if (!v) return;
      // Remove {{ and }} if present in the value for Unlayer syntax
      const key = v.replace(/^{{\s*/, '').replace(/\s*}}$/, '');
      if (key) {
        tags[key] = {
          name: key, // Show the name without brackets (e.g. variable)
          value: `{{${key}}}`, // Insert with brackets (e.g. {{variable}})
        };
      }
    });
    return tags;
  }, [variables]);

  useEffect(() => {
    if (ready && emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.setMergeTags(mergeTags);
    }
  }, [ready, mergeTags]);

  const initialOptions = useMemo(() => ({
    displayMode: "email",
    mergeTags: mergeTags,
    mergeTagsConfig: {
      title: "Variables" // Rename "Merge Tags" to "Variables" in Unlayer
    },
    translations: {
      en: {
        "labels.merge_tags": "Variables"
      }
    },
    appearance: {
      theme: "modern_light",
      panels: {
        tools: {
          dock: "right",
        },
      },
    },
    features: {
      stockImages: {
        enabled: true,
        safeSearch: true,
      },
      textEditor: {
        spellChecker: true,
        tables: true,
        cleanPaste: true,
      }
    },
    fonts: {
      showDefaultFonts: false,
      customFonts: customFonts
    },
    tools: {
      form: { enabled: false },
    }
  }), []); // Keep options reference stable so it doesn't trigger reload

  return (
    <div className={className} style={{ ...style, height: minHeight }}>
      <EmailEditor
        ref={emailEditorRef}
        onReady={onReady}
        minHeight="680px"
        options={initialOptions}
      />
    </div>
  );
});

UnlayerEmailBuilder.displayName = "UnlayerEmailBuilder";

export default UnlayerEmailBuilder;