import React, { useState, useMemo, useEffect } from 'react';
import { ALL_QUESTIONS } from '../data/questionsData';
import { ADDITIONAL_QUESTIONS } from '../data/pastYearAdditionalQuestions';
import { QuestionData, StepItem } from '../types';
import { getSavedQuestionState, saveQuestionState, clearQuestionState } from '../utils/questionProgress';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileCheck, 
  AlertTriangle,
  Filter,
  Lock,
  CheckCircle2,
  PenTool,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

interface PastYearViewProps {
  onLoadQuestionIntoSolver?: (questionId: string) => void;
  completedQuestions?: string[];
}

export const PastYearView: React.FC<PastYearViewProps> = ({ 
  onLoadQuestionIntoSolver,
  completedQuestions = []
}) => {
  const allQuestions: QuestionData[] = [...ALL_QUESTIONS, ...ADDITIONAL_QUESTIONS];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedMarkSchemes, setExpandedMarkSchemes] = useState<Record<string, boolean>>({});
  
  // Track which question has its inline step solver open
  const [activeInlineSolverId, setActiveInlineSolverId] = useState<string | null>(null);
  const [localCompleted, setLocalCompleted] = useState<string[]>([]);

  // Inline solver state
  const [inlineStepIndex, setInlineStepIndex] = useState<number>(0);
  const [inlineInputs, setInlineInputs] = useState<Record<number, string>>({});
  const [inlineFeedback, setInlineFeedback] = useState<Record<number, {
    isCorrect?: boolean;
    isBareWarning?: boolean;
    feedbackText?: string;
    showHint?: boolean;
  }>>({});

  // Compute set of solved question IDs from props + local state + persisted storage fallback
  const solvedQuestionIds = useMemo(() => {
    const set = new Set<string>([...completedQuestions, ...localCompleted]);
    try {
      const saved = localStorage.getItem('genaide_user_progress_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.completedQuestions)) {
          parsed.completedQuestions.forEach((id: string) => set.add(id));
        }
      }
    } catch {}
    return set;
  }, [completedQuestions, localCompleted]);

  const solvedCount = allQuestions.filter(q => solvedQuestionIds.has(q.id)).length;

  const toggleMarkScheme = (qId: string) => {
    setExpandedMarkSchemes(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Listen for progress updates across components/tabs
  useEffect(() => {
    const handleProgressUpdate = (e: any) => {
      const qId = e.detail?.qId;
      if (qId && activeInlineSolverId === qId) {
        const saved = getSavedQuestionState(qId);
        setInlineInputs(saved.userInputs);
        setInlineFeedback(saved.stepFeedback as any);
        setInlineStepIndex(saved.currentStepIndex);
      }
    };
    window.addEventListener('genaide_question_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('genaide_question_progress_updated', handleProgressUpdate);
  }, [activeInlineSolverId]);

  const handleOpenInlineSolver = (qId: string) => {
    if (activeInlineSolverId === qId) {
      setActiveInlineSolverId(null);
      return;
    }
    setActiveInlineSolverId(qId);
    const saved = getSavedQuestionState(qId);
    setInlineInputs(saved.userInputs || {});
    setInlineFeedback((saved.stepFeedback as any) || {});
    setInlineStepIndex(saved.currentStepIndex || 0);
  };

  const handleInlineInputChange = (qId: string, stepNum: number, value: string) => {
    setInlineInputs(prev => {
      const next = { ...prev, [stepNum]: value };
      saveQuestionState(qId, {
        userInputs: next,
        stepFeedback: inlineFeedback,
        currentStepIndex: inlineStepIndex,
        isQuestionFinished: solvedQuestionIds.has(qId)
      });
      return next;
    });
  };

  const handleInsertSymbol = (qId: string, stepNum: number, symbol: string) => {
    setInlineInputs(prev => {
      const current = prev[stepNum] || '';
      const updated = current + (current.endsWith(' ') || current === '' ? '' : ' ') + symbol;
      const next = { ...prev, [stepNum]: updated };
      saveQuestionState(qId, {
        userInputs: next,
        stepFeedback: inlineFeedback,
        currentStepIndex: inlineStepIndex,
        isQuestionFinished: solvedQuestionIds.has(qId)
      });
      return next;
    });
  };

  const handleCheckInlineStep = (q: QuestionData, step: StepItem) => {
    const rawInput = (inlineInputs[step.stepNumber] || '').trim();
    if (!rawInput) return;

    const isNumericStep = step.acceptedAnswers.some(ans => /\d/.test(ans));

    // Check bare answer warning
    if (isNumericStep) {
      const isBare = /^[+-]?(?:\d*\.)?\d+%?$/.test(rawInput);
      if (isBare) {
        const newFb = {
          ...inlineFeedback,
          [step.stepNumber]: {
            isCorrect: false,
            isBareWarning: true,
            feedbackText: "⚠️ Include your working formula & substitution before the final value! e.g. q² = 4/5000 = 0.0008"
          }
        };
        setInlineFeedback(newFb);
        saveQuestionState(q.id, {
          userInputs: inlineInputs,
          stepFeedback: newFb,
          currentStepIndex: inlineStepIndex,
          isQuestionFinished: solvedQuestionIds.has(q.id)
        });
        return;
      }
    }

    // Check correctness
    let isCorrect = false;
    const lowerInput = rawInput.toLowerCase();

    for (const ans of step.acceptedAnswers) {
      const lowerAns = ans.toLowerCase();
      if (lowerInput.includes(lowerAns)) {
        isCorrect = true;
        break;
      }
      const numAns = parseFloat(ans);
      if (!isNaN(numAns)) {
        const matchNums = rawInput.match(/[+-]?(?:\d*\.)?\d+/g);
        if (matchNums) {
          for (const m of matchNums) {
            const val = parseFloat(m);
            if (!isNaN(val) && Math.abs(val - numAns) <= (step.tolerance || 0.0001)) {
              isCorrect = true;
              break;
            }
          }
        }
      }
    }

    if (isCorrect) {
      const newFb = {
        ...inlineFeedback,
        [step.stepNumber]: {
          isCorrect: true,
          feedbackText: `✓ Correct! [${step.marks || 1} ${step.marks === 1 ? 'mark' : 'marks'}]`
        }
      };
      setInlineFeedback(newFb);

      // Check if last step
      if (inlineStepIndex === q.steps.length - 1) {
        setLocalCompleted(prev => Array.from(new Set([...prev, q.id])));
        saveQuestionState(q.id, {
          userInputs: inlineInputs,
          stepFeedback: newFb,
          currentStepIndex: inlineStepIndex,
          isQuestionFinished: true
        });
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {}
        setExpandedMarkSchemes(prev => ({ ...prev, [q.id]: true }));
      } else {
        const nextIdx = inlineStepIndex + 1;
        setInlineStepIndex(nextIdx);
        saveQuestionState(q.id, {
          userInputs: inlineInputs,
          stepFeedback: newFb,
          currentStepIndex: nextIdx,
          isQuestionFinished: false
        });
      }
    } else {
      const newFb = {
        ...inlineFeedback,
        [step.stepNumber]: {
          isCorrect: false,
          feedbackText: `✗ Re-check your calculation for ${step.expectedConcept}.`
        }
      };
      setInlineFeedback(newFb);
      saveQuestionState(q.id, {
        userInputs: inlineInputs,
        stepFeedback: newFb,
        currentStepIndex: inlineStepIndex,
        isQuestionFinished: solvedQuestionIds.has(q.id)
      });
    }
  };

  const filtered = allQuestions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.number.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === 'solved') {
      matchesCategory = solvedQuestionIds.has(q.id);
    } else if (selectedCategory === 'unsolved') {
      matchesCategory = !solvedQuestionIds.has(q.id);
    } else if (selectedCategory !== 'all') {
      matchesCategory = q.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
            <GraduationCap className="w-4 h-4 text-purple-700" />
            <span>Matriculation Exam Preparation Bank</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{solvedCount} of {allQuestions.length} Questions Solved</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
          Tutorial and Past Year PSPM Questions & Interactive Step Solver
        </h2>
        <p className="text-xs sm:text-sm text-purple-800">
          Official tutorial and past year PSPM examination questions directly extracted from the Biology Chapter 5 Question Bank. 
          Use the <strong>Interactive Step Solver</strong> to solve calculations step-by-step or load any question into the workstation.
        </p>

        {/* Search & Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. albino, hamsters, Drosophila, migration, goats)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm text-purple-950 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-600 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded-xl border border-purple-200 text-xs font-semibold text-purple-950 bg-white"
            >
              <option value="all">All Questions ({allQuestions.length})</option>
              <option value="solved">✓ Solved ({solvedCount})</option>
              <option value="unsolved">🔒 Unsolved ({allQuestions.length - solvedCount})</option>
              <option value="gene-pool">Allele Counting / Gene Pool</option>
              <option value="hardy-weinberg">Standard Hardy-Weinberg</option>
              <option value="heterozygotes">Heterozygotes & Carriers</option>
              <option value="migration">Immigration / Migration</option>
              <option value="removal">Selective Removal / Culling</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.map((q) => {
          const isSolved = solvedQuestionIds.has(q.id);
          const isExpanded = !!expandedMarkSchemes[q.id];

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-300 shadow-xs p-5 sm:p-6 space-y-4 transition-all"
            >
              {/* Question Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-900 text-white font-mono font-bold text-xs">
                      {q.number}
                    </span>
                    <span className="text-xs font-semibold text-purple-700">
                      {q.source}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      q.isHardyWeinberg 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : 'bg-amber-50 text-amber-900 border-amber-300'
                    }`}>
                      {q.isHardyWeinberg ? 'Hardy-Weinberg' : 'Gene Pool Counting'}
                    </span>
                    {isSolved && (
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Solved</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-purple-950">
                    {q.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                    {q.totalMarks} Marks
                  </span>
                  <button
                    onClick={() => handleOpenInlineSolver(q.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeInlineSolverId === q.id
                        ? 'bg-amber-400 text-purple-950 border border-amber-500'
                        : 'bg-purple-800 text-white hover:bg-purple-900'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>{activeInlineSolverId === q.id ? 'Close Inline Solver' : 'Interactive Step Solver'}</span>
                  </button>
                  {onLoadQuestionIntoSolver && (
                    <button
                      onClick={() => onLoadQuestionIntoSolver(q.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs border border-purple-200 flex items-center gap-1 transition-all cursor-pointer"
                      title="Open in Full Solver Workstation with PopGen Toolbox"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Workstation</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="text-xs sm:text-sm text-purple-950 leading-relaxed whitespace-pre-line bg-purple-50/50 p-4 rounded-xl border border-purple-100 font-normal">
                {q.questionText}
              </div>

              {/* Pedagogy Note / Trap Warning */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Examiner Guidance:</strong> {q.whyHwOrNonHw}
                </div>
              </div>

              {/* Inline Interactive Step Solver (When Expanded) */}
              {activeInlineSolverId === q.id && (
                <div className="p-4 sm:p-5 bg-purple-900/5 rounded-2xl border-2 border-purple-300 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-purple-700" />
                      <span className="font-extrabold text-xs sm:text-sm text-purple-950">
                        Interactive Step Solver for {q.number}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-purple-700">
                      Step {inlineStepIndex + 1} of {q.steps.length}
                    </span>
                  </div>

                  {q.steps.map((step, idx) => {
                    const isCurrentStep = idx === inlineStepIndex;
                    const isPastStep = idx < inlineStepIndex;
                    const feedback = inlineFeedback[step.stepNumber];

                    if (!isCurrentStep && !isPastStep) return null;

                    return (
                      <div 
                        key={step.stepNumber} 
                        className={`p-4 rounded-xl border transition-all space-y-3 ${
                          isPastStep 
                            ? 'bg-emerald-50/60 border-emerald-200' 
                            : 'bg-white border-purple-300 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                            {isPastStep && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            Step {step.stepNumber}: {step.title}
                          </span>
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            {step.marks} {step.marks === 1 ? 'Mark' : 'Marks'}
                          </span>
                        </div>

                        <p className="text-xs text-purple-900">{step.instruction}</p>

                        {isCurrentStep ? (
                          <div className="space-y-3">
                            {/* Symbol shortcut bar */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] font-bold text-purple-700">Insert Symbol:</span>
                              {['q²', 'q', 'p', '2pq', 'p²', '√', '÷', '×', '1 - q'].map(sym => (
                                <button
                                  key={sym}
                                  type="button"
                                  onClick={() => handleInsertSymbol(q.id, step.stepNumber, sym)}
                                  className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-950 font-mono font-bold text-xs rounded border border-purple-300 active:scale-95 transition-transform cursor-pointer"
                                >
                                  {sym}
                                </button>
                              ))}
                            </div>

                            {/* Step Input */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                value={inlineInputs[step.stepNumber] || ''}
                                onChange={(e) => handleInlineInputChange(q.id, step.stepNumber, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleCheckInlineStep(q, step);
                                }}
                                placeholder={`Enter working & value (e.g. ${step.expectedSymbol || 'q'} = ... = ...)`}
                                className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-hidden bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleCheckInlineStep(q, step)}
                                className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95"
                              >
                                Check Step
                              </button>
                            </div>

                            {/* Step Feedback Banner */}
                            {feedback && (
                              <div className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                                feedback.isCorrect
                                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                                  : feedback.isBareWarning
                                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                  : 'bg-rose-100 text-rose-950 border border-rose-300'
                              }`}>
                                <div>{feedback.feedbackText}</div>
                              </div>
                            )}

                            {/* Hint toggle */}
                            <div className="pt-1">
                              <details className="text-xs text-purple-800 font-medium">
                                <summary className="cursor-pointer text-purple-700 hover:underline flex items-center gap-1">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Need a hint?</span>
                                </summary>
                                <div className="mt-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-950">
                                  {step.hint1 || step.hint2 || "Recall: write down the formula, substitute given values, then state your answer."}
                                </div>
                              </details>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-emerald-100/60 text-emerald-900 font-mono text-xs flex items-center justify-between">
                            <span>✓ Completed: {inlineInputs[step.stepNumber] || step.explanation}</span>
                            <span className="font-bold text-emerald-800">+{step.marks} marks</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Official Mark Scheme Toggle Section */}
              <div className="pt-1 space-y-2">
                {isSolved ? (
                  <>
                    <button
                      onClick={() => toggleMarkScheme(q.id)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-2 border-emerald-300 font-bold text-xs flex items-center justify-between transition-colors shadow-2xs cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-700" />
                        <span className="font-black text-emerald-900">✓ UNLOCKED</span>
                        <span>— {isExpanded ? 'Hide Official Mark Scheme & Allocation' : 'View Official Mark Scheme & Allocation'}</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-800" /> : <ChevronDown className="w-4 h-4 text-emerald-800" />}
                    </button>

                    {/* Collapsible Mark Scheme */}
                    {isExpanded && (
                      <div className="p-4 rounded-xl bg-purple-950 text-white text-xs font-mono space-y-2 animate-in slide-in-from-top-2 duration-150 border border-purple-800 shadow-md">
                        <div className="font-bold text-amber-300 border-b border-purple-800 pb-1 flex justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Official Marking Points & Allocations</span>
                          </span>
                          <span>Total: {q.totalMarks} Marks</span>
                        </div>
                        {q.officialAnswerScheme.map((item, idx) => (
                          <div key={idx} className="p-2 rounded bg-purple-900/60 border border-purple-800/80 leading-relaxed text-purple-100">
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-purple-950">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Mark Scheme Locked:</strong> Complete this question in the Interactive Step Solver to unlock the official answer scheme and mark allocations.
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenInlineSolver(q.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold text-xs shrink-0 shadow-2xs flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Solve to Unlock</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 bg-white rounded-2xl border-2 border-purple-200 text-center space-y-2">
            <div className="text-purple-950 font-bold text-base">No questions found</div>
            <p className="text-xs text-purple-700">Try modifying your search keywords or resetting the category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};


