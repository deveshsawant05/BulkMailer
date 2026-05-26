"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TemplatePreview } from "@/components/templates/template-preview";
import { Button } from "@/components/ui/button";

export function TemplateGallery({ premadeTemplates }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleTemplates = isExpanded ? premadeTemplates : premadeTemplates.slice(0, 5);

  return (
    <motion.div layout className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Start a new template
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 h-8"
          >
            Template gallery
            {isExpanded ? <ChevronUp className="w-4 h-4 ml-1.5" /> : <ChevronDown className="w-4 h-4 ml-1.5" />}
          </Button>
        </div>
        
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Blank Canvas */}
          <motion.div layout>
            <Link
              href="/templates/new"
              className="group flex flex-col items-center gap-2 text-left focus:outline-none h-full"
            >
              <div className="w-full aspect-[3/4] bg-white dark:bg-zinc-800 border bg-transparent hover:bg-zinc-50 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg flex items-center justify-center transition-colors shadow-sm group-focus-visible:ring-2 group-focus-visible:ring-blue-500">
                <Plus className="w-10 h-10 text-blue-500 dark:text-blue-400" strokeWidth={1} />
              </div>
              <div className="w-full mt-1">
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-tight">Blank</p>
              </div>
            </Link>
          </motion.div>

          {/* Premade Templates */}
          <AnimatePresence>
            {visibleTemplates.map((tpl, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: i >= 5 && isExpanded ? (i - 5) * 0.05 : 0 }}
                key={tpl.id}
              >
                <Link
                  href={`/templates/new?prebuilt=${tpl.id}`}
                  className="group flex flex-col items-center gap-2 text-left focus:outline-none"
                >
                  <div className="relative w-full aspect-[3/4] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg overflow-hidden transition-all shadow-sm group-focus-visible:ring-2 group-focus-visible:ring-blue-500">
                    <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                      <TemplatePreview template={tpl} className="w-full h-full" />
                    </div>
                  </div>
                  <div className="w-full mt-1">
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-tight truncate">{tpl.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
