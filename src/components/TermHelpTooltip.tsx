import React, { useState, useRef, useEffect } from "react";
import { HelpCircle, X, Sparkles, BookMarked, Info, ChevronDown } from "lucide-react";
import { AccountingTerm } from "../types";
import { ACCOUNTING_GLOSSARY } from "../data/glossary";

interface TermHelpTooltipProps {
  key?: React.Key;
  termItem: AccountingTerm;
  displayText?: string;
}

export function TermHelpTooltip({ termItem, displayText }: TermHelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span className="relative inline-block my-0.5 mx-0.5" ref={tooltipRef}>
      {/* TERM BADGE & HELP ICON TRIGGER */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 font-black text-xs sm:text-sm cursor-pointer transition-all hover:scale-105 select-none"
        title="انقر للشرح المبسط لهذا المصطلح المحاسبي"
      >
        <span>{displayText || termItem.term}</span>
        <HelpCircle className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20 shrink-0 animate-pulse" />
      </button>

      {/* POPOVER TOOLTIP DIALOG */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-gradient-to-br from-[#0c1226] via-[#090e1f] to-[#060914] border border-amber-400/50 shadow-2xl text-white space-y-2.5 animate-bounceIn">
          {/* Top Pointer Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-[#060914]" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <BookMarked className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <span>{termItem.term}</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-bold">
                  تصنيف: {termItem.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Definition */}
          <div className="space-y-1">
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {termItem.definition}
            </p>
          </div>

          {/* Practical Example */}
          {termItem.example && (
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-amber-200/90 space-y-1">
              <span className="font-bold text-amber-400 block text-[10px]">
                💡 مثال تطبيقي عملي:
              </span>
              <p className="leading-snug">{termItem.example}</p>
            </div>
          )}
        </div>
      )}
    </span>
  );
}

interface AnnotatedTextProps {
  text: string;
}

export function AnnotatedText({ text }: AnnotatedTextProps) {
  if (!text) return null;

  // Build regex pattern for terms and aliases
  const allPatterns: { phrase: string; term: AccountingTerm }[] = [];
  ACCOUNTING_GLOSSARY.forEach((t) => {
    allPatterns.push({ phrase: t.term, term: t });
    if (t.aliases) {
      t.aliases.forEach((a) => allPatterns.push({ phrase: a, term: t }));
    }
  });

  // Sort longest phrase first to match specific multi-word terms before short single words
  allPatterns.sort((a, b) => b.phrase.length - a.phrase.length);

  // Escaping special characters for regex
  const escapedPhrases = allPatterns.map((p) =>
    p.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`(${escapedPhrases.join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        const matchedPattern = allPatterns.find(
          (p) => p.phrase.toLowerCase() === part.toLowerCase()
        );

        if (matchedPattern) {
          return (
            <TermHelpTooltip
              key={i}
              termItem={matchedPattern.term}
              displayText={part}
            />
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export function LessonTermsWidget({ textContent }: { textContent: string }) {
  // Find all terms relevant to this lesson text
  const matchedTerms: AccountingTerm[] = [];
  ACCOUNTING_GLOSSARY.forEach((term) => {
    const isTermInText =
      textContent.includes(term.term) ||
      term.aliases?.some((a) => textContent.includes(a));
    if (isTermInText && !matchedTerms.some((t) => t.term === term.term)) {
      matchedTerms.push(term);
    }
  });

  // If no terms in text, show default top terms
  const termsToShow =
    matchedTerms.length > 0 ? matchedTerms : ACCOUNTING_GLOSSARY.slice(0, 5);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0a1124] to-[#0d162d] border border-indigo-500/25 space-y-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>المصطلحات المحاسبية الهامة بهذا الدرس</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                {termsToShow.length} مصطلحات
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              انقر على أي مصطلح لاستعراض الشرح والمثال فوراً
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {termsToShow.map((term, idx) => (
          <TermHelpTooltip key={idx} termItem={term} />
        ))}
      </div>
    </div>
  );
}
