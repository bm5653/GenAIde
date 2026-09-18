import React, { useState } from 'react';
import { PITFALLS_DATA } from '../data/pitfallsData';
import { PitfallItem } from '../types';
import { 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const PitfallsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePitfallId, setActivePitfallId] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const filteredPitfalls = PITFALLS_DATA.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.whyItHappens.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePitfall = PITFALLS_DATA.find(p => p.id === activePitfallId) || PITFALLS_DATA[0];

  const handleSelectQuizOption = (pitfallId: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [pitfallId]: optionIdx }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Examiner Error Diagnostics & Defense</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
          PopGen Pitfalls & Common Examination Traps
        </h2>
        <p className="text-xs sm:text-sm text-purple-800">
          Based on teacher notes, student exam scripts, and feedback surveys, these are the 16 most common mistakes in Matriculation Chapter 5. Learn how to recognize and avoid them.
        </p>

        {/* Search Bar */}
        <div className="pt-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pitfalls (e.g. square root, dominant, 2pq, decimal places, immigration)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm text-purple-950 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Main Grid: Left is Pitfall list selector, Right is Active Pitfall Deep Dive & Mini-Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 16 Pitfalls List */}
        <div className="lg:col-span-1 space-y-2 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredPitfalls.map((p) => {
            const isSel = p.id === activePitfallId;
            const isQuizAnswered = quizAnswers[p.id] !== undefined;

            return (
              <button
                key={p.id}
                onClick={() => setActivePitfallId(p.id)}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                  isSel
                    ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                    : 'bg-white hover:bg-purple-50 border-purple-200 text-purple-950'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                  isSel ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-900'
                }`}>
                  {p.id}
                </span>
                <div className="space-y-0.5 overflow-hidden flex-1">
                  <div className="font-bold text-xs truncate">{p.title}</div>
                  <div className={`text-[10px] truncate ${isSel ? 'text-purple-200' : 'text-purple-600'}`}>
                    {p.subtitle}
                  </div>
                </div>
                {isQuizAnswered && (
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSel ? 'text-emerald-400' : 'text-emerald-600'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right 2 Columns: Active Pitfall Detail & Mini Quiz */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-5">
            {/* Title & Badge */}
            <div className="border-b border-purple-100 pb-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  Pitfall #{activePitfall.id}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-purple-950">
                {activePitfall.title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-purple-700">
                {activePitfall.subtitle}
              </p>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
                <div className="font-bold text-purple-950 uppercase tracking-wider text-[11px]">
                  Why it happens:
                </div>
                <p className="text-purple-900 leading-relaxed">
                  {activePitfall.whyItHappens}
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <div className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                  How to spot it in exam:
                </div>
                <p className="text-amber-950 leading-relaxed">
                  {activePitfall.howToSpotIt}
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-950 uppercase tracking-wider text-[11px]">
                  How to avoid it:
                </div>
                <p className="text-emerald-950 leading-relaxed">
                  {activePitfall.howToAvoidIt}
                </p>
              </div>
            </div>

            {/* Bad Example vs Good Example */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 bg-red-50/70 rounded-xl border-2 border-red-200 space-y-1 text-xs">
                <div className="font-bold text-red-900 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>WRONG APPROACH (Loses Marks):</span>
                </div>
                <div className="font-mono text-xs text-red-950 bg-white p-2.5 rounded-lg border border-red-200">
                  {activePitfall.badExample}
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-xl border-2 border-emerald-200 space-y-1 text-xs">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>CORRECT APPROACH (Full Marks):</span>
                </div>
                <div className="font-mono text-xs text-emerald-950 bg-white p-2.5 rounded-lg border border-emerald-200">
                  {activePitfall.goodExample}
                </div>
              </div>
            </div>

            {/* Interactive Mini-Quiz */}
            <div className="p-5 bg-purple-100/60 rounded-2xl border-2 border-purple-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-purple-950">
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>Test Your Trap-Detection Reflex:</span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-purple-950">
                {activePitfall.miniQuiz.question}
              </p>

              <div className="space-y-2">
                {activePitfall.miniQuiz.options.map((opt, optIdx) => {
                  const isPicked = quizAnswers[activePitfall.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectQuizOption(activePitfall.id, optIdx)}
                      className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                        isPicked
                          ? opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                            : 'bg-red-100 border-red-400 text-red-950'
                          : 'bg-white hover:bg-purple-50 text-purple-950 border-purple-200'
                      }`}
                    >
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quiz Feedback */}
              {quizAnswers[activePitfall.id] !== undefined && (
                <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                  activePitfall.miniQuiz.options[quizAnswers[activePitfall.id]].isCorrect
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-medium'
                    : 'bg-red-50 border border-red-300 text-red-950 font-medium'
                }`}>
                  <strong>
                    {activePitfall.miniQuiz.options[quizAnswers[activePitfall.id]].isCorrect
                      ? '✓ Spot on! '
                      : '✗ Keep in mind: '}
                  </strong>
                  {activePitfall.miniQuiz.options[quizAnswers[activePitfall.id]].feedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
