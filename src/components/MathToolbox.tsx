import React, { useState, useEffect } from 'react';
import { Calculator, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface MathToolboxProps {
  onInsertSymbol?: (sym: string) => void;
  lastActiveInputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export const MathToolbox: React.FC<MathToolboxProps> = ({ onInsertSymbol, lastActiveInputRef }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  // Official Matriculation examination symbol terms with full descriptions
  const examTermsWithDescriptions = [
    {
      label: "q² (Homozygous Recessive)",
      text: "Frequency of homozygous recessive genotype, q² = "
    },
    {
      label: "q (Recessive Allele)",
      text: "Frequency of recessive allele, q = "
    },
    {
      label: "p (Dominant Allele)",
      text: "Frequency of dominant allele, p = "
    },
    {
      label: "2pq (Heterozygous)",
      text: "Frequency of heterozygous genotype, 2pq = "
    },
    {
      label: "p² (Homozygous Dominant)",
      text: "Frequency of homozygous dominant genotype, p² = "
    }
  ];

  // Core symbol list specifically based on student needs & PopGen calculation requirements
  const symbolCategories = [
    {
      title: "PopGen Symbols",
      symbols: ["p", "q", "p²", "q²", "2pq"]
    },
    {
      title: "Math & Surds",
      symbols: ["√", "²", "³", "=", "+", "−", "×", "÷", "/", "%", "(", ")", "."]
    },
    {
      title: "Genotypes & Alleles",
      symbols: ["AA", "Aa", "aa", "A", "a", "BB", "Bb", "bb", "B", "b"]
    }
  ];

  const handleSymbolClick = (sym: string) => {
    // 1. If explicit insertion callback provided
    if (onInsertSymbol) {
      onInsertSymbol(sym);
    }

    // 2. Insert into the active element or last focused ref
    const targetElement = (lastActiveInputRef && lastActiveInputRef.current) 
      ? lastActiveInputRef.current 
      : (document.activeElement as HTMLInputElement | HTMLTextAreaElement);

    if (targetElement && (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      const start = targetElement.selectionStart ?? targetElement.value.length;
      const end = targetElement.selectionEnd ?? targetElement.value.length;
      const val = targetElement.value;
      const newVal = val.substring(0, start) + sym + val.substring(end);
      targetElement.value = newVal;
      
      // Dispatch input event so React state hooks pick up the change
      const event = new Event('input', { bubbles: true });
      targetElement.dispatchEvent(event);

      // Restore focus and position cursor after inserted symbol
      targetElement.focus();
      const newCursorPos = start + sym.length;
      targetElement.setSelectionRange(newCursorPos, newCursorPos);
    } else {
      // Fallback: Copy to clipboard if not in an input
      try {
        navigator.clipboard.writeText(sym);
        setCopiedSymbol(sym);
        setTimeout(() => setCopiedSymbol(null), 1500);
      } catch (err) {
        console.warn("Clipboard access failed", err);
      }
    }
  };

  return (
    <aside 
      id="popgen-math-toolbox"
      aria-label="Mathematical symbol toolbox"
      className="bg-white border-2 border-purple-300 rounded-xl shadow-md overflow-hidden transition-all duration-200"
    >
      {/* Toolbox Header */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-purple-900 text-white px-3.5 py-2 flex items-center justify-between cursor-pointer select-none hover:bg-purple-800 transition-colors"
      >
        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm tracking-wide">
          <Calculator className="w-4 h-4 text-purple-300" />
          <span>POPGEN MATH & SYMBOL TOOLBOX</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-purple-200">
          <span className="hidden sm:inline text-[11px] font-normal text-purple-300">Click to insert</span>
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </div>

      {/* Toolbox Body */}
      {!isCollapsed && (
        <div className="p-3 bg-purple-50/50 space-y-3 text-xs">
          {/* Exam Standard Description Terms */}
          <div className="space-y-1.5 bg-purple-100/60 p-2 rounded-lg border border-purple-200">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-950 flex items-center justify-between">
              <span>Exam Terms (Description First)</span>
              <span className="text-[9px] font-semibold text-purple-700 bg-white px-1.5 py-0.5 rounded border border-purple-200">Official</span>
            </div>
            <div className="space-y-1">
              {examTermsWithDescriptions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSymbolClick(item.text)}
                  className="w-full text-left px-2 py-1 rounded bg-white hover:bg-purple-600 hover:text-white text-purple-950 font-semibold text-[11px] border border-purple-200 shadow-2xs hover:border-purple-600 transition-all flex items-center justify-between group active:scale-[0.98]"
                  title={`Insert "${item.text}"`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="text-[10px] text-purple-400 group-hover:text-purple-100 ml-1">Insert ↵</span>
                </button>
              ))}
            </div>
          </div>

          {symbolCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-900/80 px-0.5">
                {cat.title}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.symbols.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => handleSymbolClick(sym)}
                    className="h-8 min-w-8 px-2 bg-white hover:bg-purple-600 hover:text-white text-purple-950 font-semibold rounded-md border border-purple-200 shadow-2xs hover:border-purple-600 transition-colors flex items-center justify-center text-xs sm:text-sm active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                    title={`Insert ${sym} into active input`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {copiedSymbol && (
            <div className="text-[11px] text-emerald-800 bg-emerald-100/90 border border-emerald-300 py-1 px-2 rounded-md flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Copied '{copiedSymbol}' to clipboard!</span>
            </div>
          )}

          <div className="text-[11px] text-purple-700/80 pt-1 border-t border-purple-200/80 leading-snug">
            💡 <strong>Tip:</strong> Click an answer box, then click any symbol to type surds (<code className="bg-purple-100 px-1 py-0.5 rounded text-purple-900 font-mono">√</code>) or superscripts (<code className="bg-purple-100 px-1 py-0.5 rounded text-purple-900 font-mono">p²</code>, <code className="bg-purple-100 px-1 py-0.5 rounded text-purple-900 font-mono">q²</code>) without bugs.
          </div>
        </div>
      )}
    </aside>
  );
};
