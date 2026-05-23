import React from 'react';
import { cn } from '@/lib/utils';

export function TemplatePreview({ design, className }) {
  if (!design || !design.body) {
    return (
      <div className={cn("bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-medium rounded-lg", className)}>
        No preview
      </div>
    );
  }

  const { body } = design;
  const { backgroundColor } = body.values || {};

  return (
    <div
      className={cn("w-full h-full overflow-hidden flex justify-center pointer-events-none select-none relative", className)}
      style={{ backgroundColor: backgroundColor || '#eaeced' }}
    >
      <div
        className="absolute top-0 origin-top"
        style={{
          width: '600px',
          backgroundColor: '#ffffff',
          transform: 'scale(0.45)',
          left: '50%',
          marginLeft: '-300px',
          height: 'fit-content',
        }}
      >
        {body.rows?.map((row, rIndex) => (
          <div
            key={rIndex}
            style={{
              backgroundColor: row.values?.backgroundColor || 'transparent',
              padding: row.values?.padding || '0',
            }}
          >
            <div style={{ display: 'flex', width: '100%', margin: '0 auto', maxWidth: row.values?.contentWidth || '100%' }}>
              {row.columns?.map((col, cIndex) => (
                <div
                  key={cIndex}
                  style={{
                    flex: 1,
                    backgroundColor: col.values?.backgroundColor || 'transparent',
                    padding: col.values?.padding || '0',
                  }}
                >
                  {col.contents?.map((content, idx) => (
                    <ContentBlock key={idx} content={content} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentBlock({ content }) {
  const { type, values } = content;
  const padding = values.containerPadding || '0';

  if (type === 'image') {
    return (
      <div style={{ padding, textAlign: values.textAlign || 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={values.src?.url || ''}
          alt="Template content"
          style={{ maxWidth: '100%', height: 'auto', display: 'inline-block' }}
        />
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div style={{ padding, color: values.color }}>
        <div dangerouslySetInnerHTML={{ __html: values.text }} />
      </div>
    );
  }

  if (type === 'button') {
    return (
      <div style={{ padding, textAlign: values.align || 'center' }}>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: values.backgroundColor || '#2563eb',
            color: values.color || '#fff',
            padding: values.padding || '10px 20px',
            borderRadius: values.borderRadius || '6px',
            textDecoration: 'none',
          }}
          dangerouslySetInnerHTML={{ __html: values.text }}
        />
      </div>
    );
  }

  if (type === 'divider') {
    const border = values.border || {};
    return (
      <div style={{ padding }}>
        <div
          style={{
            borderTopWidth: border.borderTopWidth || '1px',
            borderTopStyle: border.borderTopStyle || 'solid',
            borderTopColor: border.borderTopColor || '#e2e8f0',
          }}
        />
      </div>
    );
  }

  return null;
}