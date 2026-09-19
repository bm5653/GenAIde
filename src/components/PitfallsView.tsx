import React, { useState } from 'react';
import { PITFALLS_DATA, PITFALL_PRACTICE_QUESTIONS } from '../data/pitfallsData';
import { PitfallItem, PitfallPracticeQuestion } from '../types';
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
  ArrowRight,
  BookOpen,
  Award,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

export const PitfallsView: React.FC = () => {
  const [activeTabMode, setActiveTabMode] = useState<'practice' | 'guide'>('practice');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePitfallId, setActivePitfallId] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // Practice Mode state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<number, number>>({});
  const [showModelWorking, setShowModelWorking] = useState<Record<number, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const filteredPitfalls = PITFALLS_DATA.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.whyItHappens.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePitfall = PITFALLS_DATA.find(p => p.id === activePitfallId) || PITFALLS_DATA[0];

  const handleSelectQuizOption = (pitfallId: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [pitfallId]: optionIdx }));
  };

  const handleSelectPracticeOption = (questionId: number, optionIdx: number) => {
    setSelectedPracticeAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const toggleModelWorking = (questionId: number) => {
    setShowModelWorking(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleHint = (questionId: number) => {
    setRevealedHints(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const currentPracticeQ = PITFALL_PRACTICE_QUESTIONS[activeQuestionIdx];
  const answeredPracticeCount = Object.keys(selectedPracticeAnswers).length;
  const correctPracticeCount = PITFALL_PRACTICE_QUESTIONS.filter(
    q => selectedPracticeAnswers[q.id] !== undefined && q.options[selectedPracticeAnswers[q.id]].isCorrect
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Examiner Error Diagnostics & Defense</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-purple-50 p-1.5 rounded-xl border border-purple-200">
            <button
              onClick={() => setActiveTabMode('practice')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTabMode === 'practice'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'text-purple-800 hover:bg-purple-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>5 Practice Questions</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-purple-950 rounded-full text-[10px] font-black">
                5 Qs
              </span>
            </button>
            <button
              onClick={() => setActiveTabMode('guide')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTabMode === 'guide'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'text-purple-800 hover:bg-purple-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>16 Traps Guide</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
            {activeTabMode === 'guide' 
              ? 'PopGen Pitfalls & Common Examination Traps' 
              : 'PopGen Pitfall Mastery: 5 Practice Challenge Questions'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-800 mt-1">
            {activeTabMode === 'guide'
              ? 'Based on teacher notes, student exam scripts, and feedback surveys, these are the 16 most common mistakes in Matriculation Chapter 5. Learn how to recognize and avoid them.'
              : 'Put your trap-detection reflexes to the test with these 5 authentic Matriculation examination scenarios designed specifically to catch students off-guard.'}
          </p>
        </div>

        {/* Quick CTA to practice when in guide mode */}
        {activeTabMode === 'guide' && (
          <div className="pt-1">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-purple-950 font-semibold">
                <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Want to test if you can outsmart the examiner traps in full scenarios?</span>
              </div>
              <button
                onClick={() => setActiveTabMode('practice')}
                className="px-3.5 py-1.5 bg-purple-800 hover:bg-purple-900 text-white rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
              >
                <span>Take the 5 Pitfall Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Search Bar (Only shown in guide mode) */}
        {activeTabMode === 'guide' && (
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
        )}
      </div>

      {/* MODE 1: 16 PITFALLS GUIDE */}
      {activeTabMode === 'guide' && (
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
      )}

      {/* MODE 2: 5 PRACTICE QUESTIONS ARENA */}
      {activeTabMode === 'practice' && (
        <div className="space-y-6">
          {/* Practice Question Navigation & Score Bar */}
          <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Question Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {PITFALL_PRACTICE_QUESTIONS.map((q, idx) => {
                const isSelected = idx === activeQuestionIdx;
                const isAnswered = selectedPracticeAnswers[q.id] !== undefined;
                const isCorrect = isAnswered && q.options[selectedPracticeAnswers[q.id]].isCorrect;

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-purple-800 text-white shadow-2xs'
                        : isAnswered
                          ? isCorrect
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                            : 'bg-red-50 border border-red-300 text-red-950'
                          : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <span>Question {idx + 1}</span>
                    {isAnswered && (
                      isCorrect 
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        : <XCircle className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Score & Reset Controls */}
            <div className="flex items-center gap-3 text-xs">
              <div className="px-3 py-1.5 bg-purple-50 rounded-xl border border-purple-200 font-bold text-purple-950">
                Score: <span className="text-purple-700">{correctPracticeCount}</span> / {PITFALL_PRACTICE_QUESTIONS.length} ({answeredPracticeCount} attempted)
              </div>
              <button
                onClick={() => {
                  setSelectedPracticeAnswers({});
                  setShowModelWorking({});
                }}
                className="px-2.5 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-50 text-purple-700 flex items-center gap-1 text-xs font-semibold transition-colors"
                title="Reset answers"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Active Practice Question Card */}
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-6">
            {/* Header with question number and traps covered */}
            <div className="border-b border-purple-100 pb-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-900 text-white text-xs font-bold">
                  Practice Question {activeQuestionIdx + 1} of {PITFALL_PRACTICE_QUESTIONS.length}
                </span>
                {currentPracticeQ.trapsCovered.map(t => (
                  <span
                    key={t.id}
                    className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-700" />
                    <span>Pitfall #{t.id}: {t.name}</span>
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-black text-purple-950">
                {currentPracticeQ.title}
              </h3>
            </div>

            {/* Scenario & Question Prompt */}
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs sm:text-sm text-purple-950 leading-relaxed">
                <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                  Examination Scenario:
                </div>
                {currentPracticeQ.scenario}
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs sm:text-sm font-semibold text-amber-950">
                <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Question Prompt:
                </div>
                {currentPracticeQ.questionText}
              </div>
            </div>

            {/* Opt-in Guidance Hint (Pedagogical guidance only, no incorrect error pop-ups) */}
            {currentPracticeQ.hint && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleHint(currentPracticeQ.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold transition-colors shadow-2xs"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>{revealedHints[currentPracticeQ.id] ? 'Hide Guidance Hint' : '💡 Need a Hint? Click for Guidance'}</span>
                </button>

                {revealedHints[currentPracticeQ.id] && (
                  <div className="p-3.5 bg-amber-50/80 rounded-xl border-2 border-amber-300 text-xs text-amber-950 space-y-1.5 animate-in fade-in duration-150">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                      <span>Guidance & Strategic Direction (No Spoilers):</span>
                    </div>
                    <p className="leading-relaxed font-medium pl-5 text-amber-950">
                      {currentPracticeQ.hint}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Options */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Select the correct approach (watch out for common examiner traps!):
              </div>

              <div className="space-y-2.5">
                {currentPracticeQ.options.map((opt, optIdx) => {
                  const isSelected = selectedPracticeAnswers[currentPracticeQ.id] === optIdx;
                  const hasAnsweredThisQ = selectedPracticeAnswers[currentPracticeQ.id] !== undefined;

                  let buttonStyle = 'bg-white hover:bg-purple-50/60 text-purple-950 border-purple-200';
                  if (isSelected) {
                    buttonStyle = opt.isCorrect
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200'
                      : 'bg-red-100 border-red-500 text-red-950 ring-2 ring-red-200';
                  } else if (hasAnsweredThisQ && opt.isCorrect) {
                    buttonStyle = 'bg-emerald-50/70 border-emerald-300 text-emerald-950';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectPracticeOption(currentPracticeQ.id, optIdx)}
                      className={`w-full p-3.5 rounded-xl text-xs sm:text-sm text-left border-2 transition-all flex items-start gap-3 ${buttonStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected 
                          ? opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                          : 'bg-purple-100 text-purple-900'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="font-medium leading-relaxed flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instant Diagnostic Feedback */}
            {selectedPracticeAnswers[currentPracticeQ.id] !== undefined && (
              <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border-2 animate-in fade-in duration-200 ${
                currentPracticeQ.options[selectedPracticeAnswers[currentPracticeQ.id]].isCorrect
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-red-50 border-red-400 text-red-950'
              }`}>
                <div className="font-black text-sm flex items-center gap-2 mb-1.5">
                  {currentPracticeQ.options[selectedPracticeAnswers[currentPracticeQ.id]].isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>CORRECT DECISION — TRAP AVOIDED!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span>
                        TRAP DETECTED: {currentPracticeQ.options[selectedPracticeAnswers[currentPracticeQ.id]].trapName || 'Examiner Penalty'}
                      </span>
                    </>
                  )}
                </div>
                <p>{currentPracticeQ.options[selectedPracticeAnswers[currentPracticeQ.id]].feedback}</p>
              </div>
            )}

            {/* Expandable Model Working & Examiner Mark Scheme */}
            <div className="border-t border-purple-100 pt-4 space-y-3">
              <button
                onClick={() => toggleModelWorking(currentPracticeQ.id)}
                className="w-full p-3 bg-purple-50 hover:bg-purple-100/80 rounded-xl border border-purple-200 text-xs font-bold text-purple-950 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-700" />
                  <span>
                    {showModelWorking[currentPracticeQ.id] 
                      ? 'Hide Official Model Working & Marking Scheme' 
                      : 'Show Official Model Working & Marking Scheme'}
                  </span>
                </div>
                {showModelWorking[currentPracticeQ.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showModelWorking[currentPracticeQ.id] && (
                <div className="p-4 bg-purple-50/50 rounded-xl border-2 border-purple-200 space-y-4 text-xs animate-in fade-in duration-150">
                  <div className="font-bold text-xs text-purple-900 uppercase tracking-wider">
                    Official Matriculation Mark Scheme Steps:
                  </div>

                  <div className="space-y-2">
                    {currentPracticeQ.modelWorking.map((mw, mwIdx) => (
                      <div key={mwIdx} className="bg-white p-3 rounded-lg border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-purple-900">{mw.stepTitle}</div>
                          <div className="font-mono text-purple-950 mt-0.5">{mw.working}</div>
                        </div>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded font-bold text-[11px] shrink-0 self-start sm:self-auto">
                          [{mw.marks} mark{mw.marks > 1 ? 's' : ''}]
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Examiner Tips */}
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 space-y-1.5">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                      <span>Examiner Tips for This Scenario:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      {currentPracticeQ.examinerTips.map((tip, tipIdx) => (
                        <li key={tipIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Next / Previous Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={activeQuestionIdx === 0}
                onClick={() => setActiveQuestionIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl border border-purple-200 text-xs font-bold text-purple-900 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous Question
              </button>

              <button
                disabled={activeQuestionIdx === PITFALL_PRACTICE_QUESTIONS.length - 1}
                onClick={() => setActiveQuestionIdx(prev => Math.min(PITFALL_PRACTICE_QUESTIONS.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
              >
                Next Question →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
