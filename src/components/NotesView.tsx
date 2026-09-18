import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Save
} from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    front: "What is the definition of a Gene Pool?",
    back: "The total number of genes and their different alleles that are present in a population of a particular species of organisms at a given time.",
    category: "Definition"
  },
  {
    id: 2,
    front: "What are the 5 conditions for Hardy-Weinberg Equilibrium?",
    back: "1. Large population size\n2. Random mating\n3. No mutation\n4. No migration (no gene flow)\n5. No natural selection",
    category: "Conditions"
  },
  {
    id: 3,
    front: "Why must you ALWAYS start calculations with the homozygous recessive trait (q²)?",
    back: "Because dominant individuals are a mixture of TWO genotypes: homozygous dominant (p²) AND heterozygous (2pq). Only recessive individuals have a single known genotype (aa = q²).",
    category: "Golden Rule"
  },
  {
    id: 4,
    front: "What is the difference between p and p²?",
    back: "p is the frequency of the DOMINANT ALLELE.\np² is the frequency of the HOMOZYGOUS DOMINANT GENOTYPE.",
    category: "Symbols"
  },
  {
    id: 5,
    front: "Why does the heterozygous term in Hardy-Weinberg have a 2 in front (2pq)?",
    back: "Because heterozygotes can be formed in TWO ways: dominant allele from mother + recessive from father (pq), OR recessive from mother + dominant from father (qp). pq + qp = 2pq.",
    category: "Formula"
  },
  {
    id: 6,
    front: "What is the critical rule for symbols when a population is NOT in Hardy-Weinberg?",
    back: "DO NOT USE SYMBOLS (p, q, p², q², 2pq)! Write out full verbal terms: 'Frequency of dominant allele', 'Frequency of recessive allele', etc.",
    category: "Examiner Rule"
  },
  {
    id: 7,
    front: "How do you calculate Gene Pool Size in diploid organisms?",
    back: "Total number of alleles = 2 × Total number of individuals (diploid organisms carry 2 alleles per gene).",
    category: "Formula"
  },
  {
    id: 8,
    front: "What are the standard decimal place rules based on population size?",
    back: "• 10 - 99: 1 decimal place\n• 100 - 999: 2 decimal places\n• 1000 and above: 3 decimal places\n(Or follow explicit question instructions)",
    category: "Standard"
  }
];

export const NotesView: React.FC = () => {
  // Flashcard state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Scratchpad state
  const [userNotes, setUserNotes] = useState(() => {
    return localStorage.getItem('genaide_personal_notes') || '';
  });
  const [isSaved, setIsSaved] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const card = FLASHCARDS[currentCardIdx];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % FLASHCARDS.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };

  const handleSaveNotes = () => {
    localStorage.setItem('genaide_personal_notes', userNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopySummary = () => {
    const summaryText = `CHAPTER 5: POPULATION GENETICS SUMMARY CHEATSHEET
1. Gene Pool = Total genes and alleles in a population at a given time.
   Diploid: Gene pool size = 2 × N.
2. Hardy-Weinberg Law = Allele frequencies remain constant generation to generation.
   5 Conditions: Large pop, Random mating, No mutation, No migration, No natural selection.
3. Equations:
   p + q = 1 (Alleles)
   p² + 2pq + q² = 1 (Genotypes)
4. Golden Step Sequence:
   Step 1: q² = Recessive / Total
   Step 2: q = √q²
   Step 3: p = 1 - q
   Step 4: 2pq = 2(p)(q) & p² = (p)²
5. Non-H-W Population Rule:
   DO NOT USE p and q symbols. Write full words. Count alleles: (2 × Homo) + Hetero.
6. Decimal Rules:
   10-99 (1 d.p.), 100-999 (2 d.p.), 1000+ (3 d.p.).`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
          <FileText className="w-4 h-4 text-purple-700" />
          <span>High-Yield Revision & Flashcards</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
              Study Notes & Quick Revision Flashcards
            </h2>
            <p className="text-xs sm:text-sm text-purple-800">
              Consolidated Chapter 5 summary notes, interactive concept flashcards, and your personal revision scratchpad.
            </p>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied Cheatsheet!' : 'Copy Summary Notes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Flashcards + Personal Scratchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FLASHCARDS SECTION */}
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-base text-purple-950">
                PopGen Flashcard Deck ({currentCardIdx + 1} / {FLASHCARDS.length})
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-semibold">
              {card.category}
            </span>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[220px] p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/80 border-2 border-purple-200 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 transition-all select-none shadow-2xs group"
          >
            <div className="text-[11px] font-bold text-purple-500 uppercase tracking-widest mb-3 flex items-center gap-1">
              <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
              <span>{isFlipped ? 'Answer (Click to flip)' : 'Question (Click to flip)'}</span>
            </div>

            <div className="text-base sm:text-lg font-bold text-purple-950 whitespace-pre-line leading-relaxed max-w-md">
              {isFlipped ? card.back : card.front}
            </div>
          </div>

          {/* Card Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevCard}
              className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs text-purple-700 font-bold hover:underline"
            >
              Flip Card
            </button>

            <button
              onClick={handleNextCard}
              className="p-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-semibold text-xs flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PERSONAL SCRATCHPAD SECTION */}
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-base text-purple-950">
                Personal Revision Scratchpad
              </h3>
            </div>
            {isSaved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <p className="text-xs text-purple-700">
            Jot down your custom formulas, notes from lectures, or question numbers you need to review. Automatically saved to your browser.
          </p>

          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Write your personal PopGen notes here... (e.g. Remember: 4 d.p. for Q15 wolves, non-dimpled is recessive q² = 1000/1200)"
            className="w-full h-44 p-3.5 rounded-xl border border-purple-300 font-mono text-xs text-purple-950 leading-relaxed focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
          />

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSaveNotes}
              className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
