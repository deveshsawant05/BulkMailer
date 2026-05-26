"use client";

import { useEffect, useState, useMemo } from "react";
import { stripUnlayerDesignMetadata } from "@/lib/utils";

// Fast lightweight generator for instant previews without loading the heavy Unlayer editor
function generateSimplePreviewHtml(design) {
  if (!design || !design.body || !design.body.rows) return "";
  
  let html = `<div style="background-color: ${design.body.values?.backgroundColor || '#f4f4f4'}; width: 100%; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px 0;">`;
  html += `<div style="max-width: 600px; margin: 0 auto; background-color: ${design.body.values?.contentBackgroundColor || '#ffffff'}; overflow: hidden;">`;
  
  design.body.rows.forEach(row => {
    html += `<div style="background-color: ${row.values?.backgroundColor || 'transparent'}; width: 100%;">`;
    html += `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;"><tr>`;
    
    row.columns.forEach(col => {
      html += `<td valign="top" style="width: ${100 / row.columns.length}%;">`;
      col.contents?.forEach(content => {
        const { type, values } = content;
        
        // Parse padding (e.g. "10px 20px" or "10px")
        let paddingObj = { top: 0, right: 0, bottom: 0, left: 0 };
        if (values.containerPadding) {
          const parts = values.containerPadding.split(' ').map(p => p.replace('px', ''));
          // extremely naive padding application just for preview purposes
          const pt = parts[0] || '0';
          const pr = parts[1] || pt;
          const pb = parts[2] || pt;
          const pl = parts[3] || pr;
          html += `<div style="padding: ${pt}px ${pr}px ${pb}px ${pl}px; text-align: ${values.textAlign || values.align || 'left'}; box-sizing: border-box;">`;
        } else {
          html += `<div style="text-align: ${values.textAlign || values.align || 'left'}; box-sizing: border-box;">`;
        }
        
        if (type === 'text') {
          html += `<div style="line-height: ${values.lineHeight || '140%'}; color: ${values.color || '#000000'}; font-family: ${values.fontFamily?.label || 'inherit'};">${values.text || ''}</div>`;
        } else if (type === 'image') {
          html += `<img src="${values.src?.url || ''}" alt="" style="max-width: 100%; height: auto; display: inline-block; vertical-align: middle;" />`;
        } else if (type === 'button') {
          html += `<a href="#" style="display: inline-block; background-color: ${values.backgroundColor || '#000'}; color: ${values.color || '#fff'}; padding: ${values.padding || '10px 20px'}; border-radius: ${values.borderRadius || '0'}; text-decoration: none; font-size: ${values.fontSize || '16px'}; font-family: ${values.fontFamily?.label || 'inherit'};">${values.text || 'Button'}</a>`;
        } else if (type === 'divider') {
          html += `<div style="border-top: ${values.border?.borderTopWidth || '1px'} ${values.border?.borderTopStyle || 'solid'} ${values.border?.borderTopColor || '#cccccc'}; width: 100%; margin: 0 auto;"></div>`;
        }
        
        html += `</div>`;
      });
      html += `</td>`;
    });
    
    html += `</tr></table></div>`;
  });
  
  html += `</div></div>`;
  return html;
}

export function TemplatePreview({ template, className = "" }) {
  // Use useMemo to avoid re-calculating HTML on every render if template hasn't changed
  const initialHtml = useMemo(() => {
    const stripped = stripUnlayerDesignMetadata(template?.body_template || "");
    if (stripped) return stripped;
    if (template?.design) return generateSimplePreviewHtml(template.design);
    return "";
  }, [template?.body_template, template?.design]);
  
  const [html, setHtml] = useState(initialHtml);

  // Sync state if initialHtml changes
  useEffect(() => {
    setHtml(initialHtml);
  }, [initialHtml]);

  if (!html) {
    return (
      <div className={`flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-xs ${className}`}>
        No preview
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <div className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left scale-[0.25]">
        <iframe
          srcDoc={html}
          className="w-full h-full pointer-events-none border-0"
          tabIndex={-1}
          scrolling="no"
          title="Template Preview"
          loading="lazy"
        />
      </div>
    </div>
  );
}
