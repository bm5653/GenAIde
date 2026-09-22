import React, { useState, useRef, useEffect } from 'react';
import { ALL_QUESTIONS } from '../data/questionsData';
import { ADDITIONAL_QUESTIONS } from '../data/pastYearAdditionalQuestions';
import { QuestionData, StepItem, UserProgress } from '../types';
import { getSavedQuestionState, saveQuestionState, clearQuestionState } from '../utils/questionProgress';
import { getStandardFullDescription } from '../utils/symbolFormatter';
import confetti from 'canvas-confetti';
import { 
  GraduationCap,
  CheckCircle2, 
  Check,
  XCircle, 
  HelpCircle, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw, 
  AlertTriangle, 
  Lightbulb, 
  FileCheck, 
  Brain, 
  Filter, 
  Layers, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Unlock,
  Search,
  BookOpen,
  Calculator,
  Compass,
  FileText,
  SlidersHorizontal,
  Flame,
  Info,
  ExternalLink,
  Target,
  BarChart2,
  RefreshCw,
  Edit3
} from 'lucide-react';

interface PracticeViewProps {
  initialQuestionId?: string;
  initialMode?: string;
  userProgress: UserProgress;
  onUpdateProgress: (questionId: string, score: number, isComplete: boolean) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  initialQuestionId,
  userProgress,
  onUpdateProgress
}) => {
  // Consolidate all questions
  const allQuestions: QuestionData[] = [...ALL_QUESTIONS, ...ADDITIONAL_QUESTIONS];

  // View state: 'directory' (Question Bank cards list) or 'solver' (Active question workspace)
  const [activeViewMode, setActiveViewMode] = useState<'directory' | 'solver'>(
    initialQuestionId ? 'solver' : 'directory'
  );

  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    initialQuestionId || allQuestions[0].id
  );

  // Filters
  const [sourceFilter, setSourceFilter] = useState<'all' | 'Tutorial' | 'PSPM'>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active question object
  const currentQuestion = allQuestions.find(q => q.id === selectedQuestionId) || allQuestions[0];

  // Step solver state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [stepFeedback, setStepFeedback] = useState<Record<number, {
    isCorrect: boolean;
    feedbackText: string;
    showExplanation: boolean;
    attempts: number;
    activeHintLevel: number;
    isAttemptSubmitted?: boolean;
    errorType?: 'bare_answer' | 'bare_symbol' | 'concept' | 'calculation' | 'interpretation' | 'none';
  }>>({});
  
  const [isQuestionFinished, setIsQuestionFinished] = useState<boolean>(false);

  // Reflection state
  const [reflectionSelections, setReflectionSelections] = useState<Record<string, boolean>>({});

  // Input ref for Math toolbox
  const activeInputRef = useRef<HTMLInputElement | null>(null);

  // Restore state when question changes
  useEffect(() => {
    const loadState = (qId: string) => {
      const saved = getSavedQuestionState(qId);
      setUserInputs(saved.userInputs || {});
      setStepFeedback((saved.stepFeedback as any) || {});
      setCurrentStepIndex(saved.currentStepIndex || 0);
      setIsQuestionFinished(!!saved.isQuestionFinished || !!saved.attemptCompleted);
    };

    loadState(selectedQuestionId);

    const handleProgressUpdate = (e: any) => {
      const qId = e.detail?.qId;
      if (qId === selectedQuestionId) {
        loadState(selectedQuestionId);
      }
    };

    window.addEventListener('genaide_question_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('genaide_question_progress_updated', handleProgressUpdate);
  }, [selectedQuestionId]);

  // Filter questions
  const filteredQuestions = allQuestions.filter(q => {
    // Source filter
    const qSource = q.sourceType || (q.source.toLowerCase().includes('tutorial') ? 'Tutorial' : 'PSPM');
    if (sourceFilter !== 'all' && qSource !== sourceFilter) return false;

    // Topic filter
    if (topicFilter !== 'all') {
      const qTopic = q.topic || q.category;
      if (qTopic !== topicFilter && q.category !== topicFilter) return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(qLower);
      const matchSource = q.source.toLowerCase().includes(qLower);
      const matchText = q.questionText.toLowerCase().includes(qLower);
      const matchConcept = q.targetConcept.toLowerCase().includes(qLower);
      if (!matchTitle && !matchSource && !matchText && !matchConcept) return false;
    }

    return true;
  });

  const tutorialCount = allQuestions.filter(q => (q.sourceType || (q.source.includes('Tutorial') ? 'Tutorial' : 'PSPM')) === 'Tutorial').length;
  const pspmCount = allQuestions.filter(q => (q.sourceType || (q.source.includes('PSPM') ? 'PSPM' : 'PSPM')) === 'PSPM').length;

  // Question navigation actions
  const handleOpenQuestion = (qId: string) => {
    setSelectedQuestionId(qId);
    setActiveViewMode('solver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDirectory = () => {
    setActiveViewMode('directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentIndexInFiltered = filteredQuestions.findIndex(q => q.id === selectedQuestionId);

  const handleNextQuestion = () => {
    if (currentIndexInFiltered < filteredQuestions.length - 1) {
      handleOpenQuestion(filteredQuestions[currentIndexInFiltered + 1].id);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndexInFiltered > 0) {
      handleOpenQuestion(filteredQuestions[currentIndexInFiltered - 1].id);
    }
  };

  const handleNextSameSource = (source: 'Tutorial' | 'PSPM') => {
    const list = allQuestions.filter(q => (q.sourceType || (q.source.includes('Tutorial') ? 'Tutorial' : 'PSPM')) === source);
    const curIdx = list.findIndex(q => q.id === selectedQuestionId);
    const nextQ = list[(curIdx + 1) % list.length];
    if (nextQ) handleOpenQuestion(nextQ.id);
  };

  const handleSimilarQuestion = () => {
    const curTopic = currentQuestion.topic || currentQuestion.category;
    const sameTopicList = allQuestions.filter(q => q.id !== currentQuestion.id && (q.topic === curTopic || q.category === curTopic));
    if (sameTopicList.length > 0) {
      handleOpenQuestion(sameTopicList[0].id);
    } else {
      handleNextQuestion();
    }
  };

  const [editingSteps, setEditingSteps] = useState<{ [key: number]: boolean }>({});
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Helper to retrieve stage title and symbol info
  const getStepStageName = (step: StepItem, idx: number): string => {
    if (step.stageName) return step.stageName;
    if (step.title.toLowerCase().includes('given') || step.title.toLowerCase().includes('identify') || step.title.toLowerCase().includes('break down')) return 'Given Data';
    if (step.title.toLowerCase().includes('recessive allele') || step.title.toLowerCase().includes('q for') || step.title.toLowerCase().includes('recessive')) return 'Recessive (q)';
    if (step.title.toLowerCase().includes('dominant allele') || step.title.toLowerCase().includes('p for') || step.title.toLowerCase().includes('dominant')) return 'Dominant (p)';
    if (step.title.toLowerCase().includes('heterozyg') || step.title.toLowerCase().includes('carrier') || step.title.toLowerCase().includes('2pq')) return 'Heterozygote (2pq)';
    if (step.title.toLowerCase().includes('formula')) return 'Formula';
    if (step.title.toLowerCase().includes('calculate') || step.title.toLowerCase().includes('percentage')) return 'Calculate';
    if (step.title.toLowerCase().includes('interpret') || step.title.toLowerCase().includes('conclusion') || step.title.toLowerCase().includes('child') || idx === currentQuestion.steps.length - 1) return 'Final / Conclusion';
    return `Step ${idx + 1}`;
  };

  // Helper to get full standard description with symbol for the step
  const getStepStandardDescription = (step: StepItem) => {
    return getStandardFullDescription(step, currentQuestion?.questionText);
  };

  // Math quick-insert handler for a specific step
  const handleInsertSymbol = (symbol: string, stepIdx: number) => {
    const currentVal = userInputs[stepIdx] || '';
    const inputEl = inputRefs.current[stepIdx];
    
    if (inputEl) {
      const start = inputEl.selectionStart || currentVal.length;
      const end = inputEl.selectionEnd || currentVal.length;
      const newVal = currentVal.substring(0, start) + symbol + currentVal.substring(end);
      setUserInputs(prev => ({ ...prev, [stepIdx]: newVal }));
      setTimeout(() => {
        inputEl.focus();
        inputEl.setSelectionRange(start + symbol.length, start + symbol.length);
      }, 10);
    } else {
      setUserInputs(prev => ({ ...prev, [stepIdx]: currentVal + symbol }));
    }
  };

  // Auto-insert full description template for a specific step
  const handleInsertFullDescription = (prefix: string, stepIdx: number) => {
    const currentVal = userInputs[stepIdx] || '';
    if (currentVal.startsWith(prefix)) return;
    
    const cleanVal = currentVal.replace(/^[^0-9.]*/, '').trim();
    const newVal = `${prefix}${cleanVal}`;
    setUserInputs(prev => ({ ...prev, [stepIdx]: newVal }));
    
    setTimeout(() => {
      const inputEl = inputRefs.current[stepIdx];
      if (inputEl) {
        inputEl.focus();
        inputEl.setSelectionRange(newVal.length, newVal.length);
      }
    }, 10);
  };

  const scrollToStep = (idx: number) => {
    setCurrentStepIndex(idx);
    const el = document.getElementById(`step-card-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Check Step Submission with STRICT Matriculation Symbol Description & Decimal Places Matching
  const getStepSchemeRequirements = (step: StepItem, questionText: string) => {
    const primary = step.acceptedAnswers[0] || '';
    const isPercentage = primary.includes('%') || step.instruction.toLowerCase().includes('percentage') || step.title.toLowerCase().includes('percentage');
    
    // Check decimal count from primary accepted answer or question instructions
    let expectedDecimals: number | null = null;
    const floatMatch = primary.match(/[0-9]+\.([0-9]+)/);
    if (floatMatch) {
      expectedDecimals = floatMatch[1].length;
    }

    // Check if question text or step explicitly specifies decimal precision
    const lowerQ = (questionText + ' ' + step.instruction).toLowerCase();
    if (lowerQ.includes('5 decimal') || lowerQ.includes('five decimal')) {
      expectedDecimals = 5;
    } else if (lowerQ.includes('4 decimal') || lowerQ.includes('four decimal')) {
      expectedDecimals = 4;
    } else if (lowerQ.includes('3 decimal') || lowerQ.includes('three decimal')) {
      if (expectedDecimals === null || expectedDecimals < 3) expectedDecimals = 3;
    } else if (lowerQ.includes('2 decimal') || lowerQ.includes('two decimal')) {
      if (expectedDecimals === null) expectedDecimals = 2;
    }

    const numericVal = parseFloat(primary.replace(/[^0-9.-]/g, ''));
    const isInteger = !isNaN(numericVal) && Number.isInteger(numericVal) && !primary.includes('.');

    return {
      expectedDecimals,
      primaryAnswer: primary,
      isPercentage,
      isInteger,
      numericVal
    };
  };

  const handleCheckStep = (stepIdx: number, overrideInput?: string) => {
    const step = currentQuestion.steps[stepIdx];
    const rawInput = (overrideInput !== undefined ? overrideInput : (userInputs[stepIdx] || '')).trim();

    if (!rawInput && !step.isMultipleChoice) return;

    const prevAttempts = stepFeedback[stepIdx]?.attempts || 0;
    const newAttempts = prevAttempts + 1;

    let isCorrect = false;
    let feedbackText = '';
    let errorType: 'bare_answer' | 'bare_symbol' | 'concept' | 'calculation' | 'interpretation' | 'none' = 'none';

    // Multiple Choice evaluation
    if (step.isMultipleChoice && step.choiceOptions) {
      const selectedOption = step.choiceOptions.find(o => o.value.toLowerCase() === rawInput.toLowerCase() || o.label.toLowerCase() === rawInput.toLowerCase());
      const isAcceptedText = step.acceptedAnswers.some(ans => rawInput.toLowerCase().includes(ans.toLowerCase()) || ans.toLowerCase().includes(rawInput.toLowerCase()));
      if (selectedOption?.isCorrect || isAcceptedText) {
        isCorrect = true;
        feedbackText = `✓ Correct. Well done! [${step.marks || 1} ${step.marks === 1 ? 'mark' : 'marks'}]`;
        errorType = 'none';
      } else {
        isCorrect = false;
        feedbackText = `❌ Incorrect. Check your answers/steps.`;
        errorType = 'concept';
      }
    } else {
      // Step-by-Step input evaluation
      const standardDesc = getStepStandardDescription(step);

      // Check if description is required for this step
      const isDescriptiveStep = standardDesc.description.length > 0;

      // 1. Check for Bare Answers (numbers only, e.g. "0.0008", ".0283", "4/5000")
      const isBareNumber = /^[0-9./\s%=-]+$/.test(rawInput.trim()) || /^[a-z²³\s]*=[0-9./\s%]+$/i.test(rawInput.trim().replace(/\s+/g, ''));
      const hasDescriptiveWords = /frequency|homozygous|heterozygous|recessive|dominant|allele|genotype|number|carrier|percentage|proportion|total|ratio|equilibrium|population/i.test(rawInput);

      if (isDescriptiveStep && !hasDescriptiveWords && !rawInput.includes(standardDesc.description)) {
        // Did they type only bare symbol and number? (e.g., "q² = 0.0008" or "q = 0.0283")
        const hasSymbolOnly = /^(q²|p²|2pq|q|p|n)\s*=/i.test(rawInput.trim()) || /^(q\^2|p\^2)\s*=/i.test(rawInput.trim());

        errorType = hasSymbolOnly ? 'bare_symbol' : 'bare_answer';
        isCorrect = false;
        feedbackText = `❌ Incorrect. Check your answers/steps.`;
      } else {
        // Description keywords are present (or not a descriptive step). Now verify numerical / algebraic correctness.
        const normalizedInput = rawInput.toLowerCase().replace(/\s+/g, '').replace(/,/g, '');
        
        const exactMatch = step.acceptedAnswers.some(ans => {
          const normAns = ans.toLowerCase().replace(/\s+/g, '').replace(/,/g, '');
          return normalizedInput.includes(normAns);
        });

        if (exactMatch) {
          isCorrect = true;
          feedbackText = `✓ Correct. Well done! [${step.marks || 1} ${step.marks === 1 ? 'mark' : 'marks'}]`;
          errorType = 'none';
        } else {
          // Extract numerical value from user's full answer string
          const numbersInInput = rawInput.match(/-?[0-9]+(?:\.[0-9]+)?/g);
          const rawNumStr = numbersInInput ? numbersInInput[numbersInInput.length - 1] : null;
          const parsedVal = rawNumStr ? parseFloat(rawNumStr) : NaN;

          if (!isNaN(parsedVal) && rawNumStr) {
            // Strict digit-by-digit comparison with accepted answer scheme options
            const matchesExactSchemeDigits = step.acceptedAnswers.some(ans => {
              const ansNumMatch = ans.match(/-?[0-9]+(?:\.[0-9]+)?/);
              if (!ansNumMatch) return false;
              const expectedNumStr = ansNumMatch[0];
              return rawNumStr === expectedNumStr;
            });

            if (matchesExactSchemeDigits) {
              isCorrect = true;
              feedbackText = `✓ Correct. Well done! [${step.marks || 1} ${step.marks === 1 ? 'mark' : 'marks'}]`;
              errorType = 'none';
            } else {
              isCorrect = false;
              errorType = 'calculation';
              feedbackText = `❌ Incorrect. Check your answers/steps.`;
            }
          } else {
            errorType = 'concept';
            feedbackText = `❌ Incorrect. Check your answers/steps.`;
          }
        }
      }
    }

    const updatedFeedback = {
      ...stepFeedback,
      [stepIdx]: {
        isCorrect,
        feedbackText,
        showExplanation: isCorrect || newAttempts >= 3,
        attempts: newAttempts,
        activeHintLevel: isCorrect ? 0 : Math.min(newAttempts, 4),
        isAttemptSubmitted: true,
        errorType
      }
    };

    setStepFeedback(updatedFeedback);

    // Check if total attempt completed
    const allStepsAttempted = currentQuestion.steps.every((_, i) => 
      i === stepIdx ? true : (updatedFeedback[i]?.isAttemptSubmitted || updatedFeedback[i]?.isCorrect)
    );

    const willBeFinished = isCorrect && stepIdx === currentQuestion.steps.length - 1;

    saveQuestionState(currentQuestion.id, {
      userInputs,
      stepFeedback: updatedFeedback as any,
      currentStepIndex,
      isQuestionFinished: isQuestionFinished || willBeFinished,
      attemptCompleted: allStepsAttempted || willBeFinished
    });

    if (isCorrect) {
      if (stepIdx === currentQuestion.steps.length - 1) {
        setIsQuestionFinished(true);
        onUpdateProgress(currentQuestion.id, currentQuestion.totalMarks || 5, true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setCurrentStepIndex(stepIdx + 1);
      }
    }
  };

  // Progressive Hint Reveal (1 -> 2 -> 3 -> 4)
  const handleRevealHint = (stepIdx: number) => {
    const cur = stepFeedback[stepIdx]?.activeHintLevel || 0;
    const next = Math.min(cur + 1, 4);
    setStepFeedback(prev => ({
      ...prev,
      [stepIdx]: {
        ...(prev[stepIdx] || { isCorrect: false, feedbackText: '', showExplanation: false, attempts: 0 }),
        activeHintLevel: next
      }
    }));
  };

  // Reset current question
  const handleResetQuestion = () => {
    if (currentQuestion) {
      clearQuestionState(currentQuestion.id);
      setUserInputs({});
      setStepFeedback({});
      setCurrentStepIndex(0);
      setIsQuestionFinished(false);
      setReflectionSelections({});
      setEditingSteps({});
      onUpdateProgress(currentQuestion.id, 0, false);
    }
  };

  // Scheme is unlocked ONLY when the full question attempt has been completed step-by-step
  const isAllStepsAttempted = currentQuestion.steps.every((_, i) => 
    stepFeedback[i]?.isAttemptSubmitted || stepFeedback[i]?.isCorrect
  );
  const isSchemeUnlocked = isQuestionFinished || isAllStepsAttempted;
  const isQuestionMastered = userProgress.completedQuestions.includes(currentQuestion.id);
  const completedStepsCount = Object.values(stepFeedback).filter(f => f.isCorrect || f.isAttemptSubmitted).length;

  return (
    <div className="space-y-6 pb-16">
      {/* DIRECTORY VIEW: Filterable Question Bank */}
      {activeViewMode === 'directory' ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Hero Header */}
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200">
                <GraduationCap className="w-4 h-4 text-purple-700" />
                <span>TUTORIAL &amp; PSPM QUESTION BANK</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Completed: {userProgress.completedQuestions.length} / {allQuestions.length}</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
                Tutorial &amp; PSPM Bank
              </h1>
              <p className="text-xs sm:text-sm text-purple-800 leading-relaxed mt-1">
                Select any Matriculation question to solve step-by-step. All answers must include the complete description of the symbol. Complete your attempt to unlock the official marking scheme.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="pt-3 border-t border-purple-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Source Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider mr-1">Source:</span>
                <button
                  onClick={() => setSourceFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sourceFilter === 'all'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  All ({allQuestions.length})
                </button>
                <button
                  onClick={() => setSourceFilter('Tutorial')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    sourceFilter === 'Tutorial'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  Tutorial ({tutorialCount})
                </button>
                <button
                  onClick={() => setSourceFilter('PSPM')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    sourceFilter === 'PSPM'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                  PSPM ({pspmCount})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative sm:w-72">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search question, keyword, year..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-purple-200 bg-white text-xs text-purple-950 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Sub-Filters: Topic & Difficulty */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-purple-800">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-purple-900">Topic:</span>
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-purple-200 bg-white text-xs text-purple-950 font-medium focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="all">All Topics</option>
                  <option value="Hardy-Weinberg Equilibrium">Hardy-Weinberg Equilibrium</option>
                  <option value="Allele Frequency">Allele Frequency</option>
                  <option value="Genotype Frequency">Genotype Frequency</option>
                  <option value="Population Changes">Population Changes</option>
                  <option value="Natural Selection">Natural Selection</option>
                  <option value="Gene Pool &amp; Counting">Gene Pool &amp; Counting</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-purple-900">Difficulty:</span>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-purple-200 bg-white text-xs text-purple-950 font-medium focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Basic">Basic</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {(sourceFilter !== 'all' || topicFilter !== 'all' || difficultyFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSourceFilter('all');
                    setTopicFilter('all');
                    setDifficultyFilter('all');
                    setSearchQuery('');
                  }}
                  className="ml-auto text-purple-600 hover:text-purple-900 underline font-semibold text-xs cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Question Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q, idx) => {
              const isCompleted = userProgress.completedQuestions.includes(q.id);
              const isTutorial = q.source.toLowerCase().includes('tutorial') || q.sourceType === 'Tutorial';

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 hover:shadow-md ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-purple-200 hover:border-purple-400'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                          isTutorial ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {q.source}
                        </span>
                        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          {q.topic || q.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                          {q.totalMarks || 5} marks
                        </span>
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Solved
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-purple-950 leading-snug">
                      {q.number || `Question ${idx + 1}`}: {q.title}
                    </h3>

                    <p className="text-xs text-purple-900/80 line-clamp-2 leading-relaxed">
                      {q.questionText}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-purple-700">
                      <Layers className="w-3.5 h-3.5 text-purple-500" />
                      <span>{q.steps.length} Interactive Steps</span>
                    </div>

                    <button
                      onClick={() => handleOpenQuestion(q.id)}
                      className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{isCompleted ? 'Review & Practice' : 'Start Solving'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* SOLVER VIEW: Active Question Workspace */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Bar with Back Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-purple-200 shadow-xs">
            <button
              onClick={handleBackToDirectory}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-purple-700" />
              <span>Back to Question Bank</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevQuestion}
                disabled={currentIndexInFiltered <= 0}
                className="px-3 py-1.5 rounded-xl border border-purple-200 bg-white text-purple-900 hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="text-xs font-bold text-purple-700">
                {currentIndexInFiltered + 1} / {filteredQuestions.length}
              </span>

              <button
                onClick={handleNextQuestion}
                disabled={currentIndexInFiltered >= filteredQuestions.length - 1}
                className="px-3 py-1.5 rounded-xl border border-purple-200 bg-white text-purple-900 hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Question Card */}
          <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-xs overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-purple-800 text-purple-100 text-xs font-bold uppercase border border-purple-700">
                    {currentQuestion.source}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-purple-950/70 text-purple-200 text-xs font-semibold">
                    {currentQuestion.topic || currentQuestion.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-400 text-purple-950 text-xs font-extrabold">
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-200 bg-purple-950/60 px-3 py-0.5 rounded-full border border-purple-700">
                    Total Marks: {currentQuestion.totalMarks || 5} marks
                  </span>
                  {isQuestionMastered && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" /> Mastered
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Question Stem Text */}
            <div className="p-5 sm:p-6 bg-[#FAF9F6] border-b border-purple-100 space-y-3">
              <div className="text-xs font-bold text-purple-900 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-700" />
                <span>Question Text &amp; Given Context</span>
              </div>

              <div className="text-sm sm:text-base text-purple-950 font-medium whitespace-pre-line leading-relaxed bg-white p-4 sm:p-5 rounded-xl border border-purple-200 shadow-2xs">
                {currentQuestion.questionText}
              </div>

              {currentQuestion.imageUrl && (
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-purple-200">
                  <img src={currentQuestion.imageUrl} alt="Question diagram" className="max-h-56 object-contain rounded" referrerPolicy="no-referrer" />
                  {currentQuestion.imageCaption && (
                    <p className="text-xs text-purple-600 italic mt-2">{currentQuestion.imageCaption}</p>
                  )}
                </div>
              )}
            </div>

            {/* 🧠 YOUR SOLVING PATH (Visual Progress & Quick Jump Bar) */}
            <div className="p-4 sm:p-5 bg-purple-50/70 border-b border-purple-100 space-y-3 sticky top-0 z-10 backdrop-blur-md bg-purple-50/90 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-purple-700" />
                  <span>🧠 Your Solving Path</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-purple-700 font-extrabold">
                    {completedStepsCount} of {currentQuestion.steps.length} Steps Completed
                  </span>
                  <button
                    type="button"
                    onClick={handleResetQuestion}
                    className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset all answer boxes and start over"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                    <span>Reset &amp; Try Again</span>
                  </button>
                </div>
              </div>

              {/* Step Flow Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {currentQuestion.steps.map((st, idx) => {
                  const fb = stepFeedback[idx];
                  const isCurrent = idx === currentStepIndex;
                  const isDone = fb?.isCorrect;
                  const stageName = getStepStageName(st, idx);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToStep(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-purple-700 text-white shadow-xs ring-2 ring-purple-400 scale-[1.02]'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-extrabold ${
                        isCurrent ? 'bg-white/20 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-purple-200 text-purple-900'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </span>
                      <span>{stageName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UNIFIED CONTINUOUS STEP-BY-STEP SOLVING WORKSHEET */}
            <div className="p-5 sm:p-6 space-y-6 bg-white">
              <div className="text-xs text-purple-700 font-semibold bg-purple-50 p-3 rounded-xl border border-purple-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                <span>All solving steps are displayed on this page. Refer to your previous answers above as you calculate each subsequent step!</span>
              </div>

              <div className="space-y-6 relative">
                {currentQuestion.steps.map((step, idx) => {
                  const fb = stepFeedback[idx];
                  const isCompleted = fb?.isCorrect;
                  const isEditing = editingSteps[idx];
                  const isActive = idx === currentStepIndex || isEditing || (!isCompleted && idx === 0);
                  const standardDesc = getStepStandardDescription(step);

                  return (
                    <div
                      key={step.stepNumber}
                      id={`step-card-${idx}`}
                      className={`rounded-2xl transition-all ${
                        isActive
                          ? 'p-5 sm:p-6 border-2 border-purple-600 bg-white shadow-md ring-4 ring-purple-100'
                          : isCompleted
                          ? 'p-5 border-2 border-emerald-300 bg-emerald-50/20 shadow-2xs'
                          : 'p-4 sm:p-5 border border-purple-200 bg-purple-50/30'
                      }`}
                    >
                      {/* Step Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-100">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                            isCompleted && !isEditing
                              ? 'bg-emerald-600 text-white'
                              : isActive
                              ? 'bg-purple-700 text-white'
                              : 'bg-purple-200 text-purple-900'
                          }`}>
                            {isCompleted && !isEditing ? `✓ Step ${step.stepNumber}` : `Step ${step.stepNumber}`}
                          </span>
                          <h3 className="text-base font-extrabold text-purple-950">
                            {step.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          {step.marks && (
                            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-200">
                              [{step.marks} mark{step.marks > 1 ? 's' : ''}]
                            </span>
                          )}

                          {isCompleted && !isEditing ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSteps(prev => ({ ...prev, [idx]: true }));
                                setCurrentStepIndex(idx);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3 text-purple-600" />
                              <span>Edit Answer</span>
                            </button>
                          ) : isEditing ? (
                            <button
                              type="button"
                              onClick={() => setEditingSteps(prev => ({ ...prev, [idx]: false }))}
                              className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold transition-all cursor-pointer"
                            >
                              Done Editing
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {/* COMPLETED STEP DISPLAY: Shows submitted answer & working clearly for reference */}
                      {isCompleted && !isEditing ? (
                        <div className="pt-4 space-y-3 animate-in fade-in duration-200">
                          <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Your Answer (Full Description Included):</span>
                              </span>
                              <span className="text-[11px] bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                                ✓ Well done!
                              </span>
                            </div>
                            <div className="font-mono text-sm text-purple-950 font-bold bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                              {userInputs[idx]}
                            </div>
                          </div>

                          <div className="text-xs text-purple-900 bg-purple-50/60 p-3 rounded-xl border border-purple-100 flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-purple-950">Step Explanation: </strong>
                              <span>{step.explanation}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* ACTIVE / INTERACTIVE STEP SOLVER */
                        <div className="pt-4 space-y-4">
                          {/* Step Instruction */}
                          <div className="text-xs sm:text-sm text-purple-900 leading-relaxed bg-purple-50/60 p-3.5 rounded-xl border border-purple-100">
                            {step.instruction}
                          </div>

                          {/* Multiple Choice or Text Input */}
                          {step.isMultipleChoice && step.choiceOptions ? (
                            <div className="space-y-3 pt-1">
                              <div className="space-y-2">
                                {step.choiceOptions.map((opt, cIdx) => {
                                  const isChosen = (userInputs[idx] || '') === opt.value;
                                  return (
                                    <button
                                      key={cIdx}
                                      type="button"
                                      onClick={() => {
                                        setUserInputs(prev => ({ ...prev, [idx]: opt.value }));
                                        handleCheckStep(idx, opt.value);
                                      }}
                                      className={`w-full p-3.5 rounded-xl border-2 text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${
                                        isChosen
                                          ? 'bg-purple-700 text-white font-bold border-purple-800 shadow-xs'
                                          : 'bg-white hover:bg-purple-50 text-purple-950 border-purple-200'
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                                        isChosen ? 'border-white bg-white text-purple-900' : 'border-purple-300'
                                      }`}>
                                        {isChosen && <div className="w-2 h-2 rounded-full bg-purple-900" />}
                                      </div>
                                      <span className="leading-snug">{opt.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleCheckStep(idx)}
                                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Check Answer</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 pt-1">
                              {/* 1. Complete Symbol Description Notice & Quick Insert */}
                              {standardDesc.fullPrefix && (
                                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                                    <span className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
                                      <Edit3 className="w-3.5 h-3.5 text-purple-700" />
                                      <span>Matriculation Requirement: Full Symbol Description Required</span>
                                    </span>
                                    <span className="text-[11px] text-rose-700 font-bold">
                                      (No bare answers or bare symbols)
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs text-purple-800">Quick-Insert Template:</span>
                                    <button
                                      type="button"
                                      onClick={() => handleInsertFullDescription(standardDesc.fullPrefix, idx)}
                                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 font-bold font-mono text-xs border border-purple-300 shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                      <span>+ {standardDesc.fullPrefix}</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* 2. Quick Math Symbols Toolbar */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-bold text-purple-800 flex items-center gap-1">
                                  <Calculator className="w-3.5 h-3.5 text-purple-600" /> Math Symbols:
                                </span>
                                {['√', '²', 'p²', 'q²', '2pq', 'p', 'q', '+', '-', '1 - q', '100', '%'].map(sym => (
                                  <button
                                    key={sym}
                                    type="button"
                                    onClick={() => handleInsertSymbol(sym, idx)}
                                    className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-950 font-mono text-xs font-bold rounded-lg border border-purple-200 active:scale-95 cursor-pointer transition-colors"
                                  >
                                    {sym}
                                  </button>
                                ))}
                              </div>

                              {/* 3. Text Input Field */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  ref={(el) => { inputRefs.current[idx] = el; }}
                                  type="text"
                                  value={userInputs[idx] || ''}
                                  onChange={(e) => setUserInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCheckStep(idx);
                                  }}
                                  placeholder={standardDesc.fullPrefix ? `e.g. ${standardDesc.fullPrefix}0.0008` : "Enter step with description and value..."}
                                  className="flex-1 px-3.5 py-2.5 rounded-xl border-2 font-mono text-sm text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-purple-200 shadow-2xs"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleCheckStep(idx)}
                                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Check Step</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Step Feedback Box */}
                          {fb?.feedbackText && (
                            <div className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 ${
                              fb.isCorrect
                                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                                : 'bg-rose-100 text-rose-950 border border-rose-300'
                            }`}>
                              {fb.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                              )}
                              <span>{fb.feedbackText}</span>
                            </div>
                          )}

                          {/* Progressive Guidance Hints Section */}
                          <div className="pt-2 border-t border-purple-100 space-y-2">
                            <button
                              type="button"
                              onClick={() => handleRevealHint(idx)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-950 cursor-pointer"
                            >
                              <Lightbulb className="w-4 h-4 text-amber-500" />
                              <span>
                                {(fb?.activeHintLevel || 0) === 0 ? "💡 Need a hint?" : `💡 Show Next Guidance Hint (${fb?.activeHintLevel || 0}/4)`}
                              </span>
                            </button>

                            {(fb?.activeHintLevel || 0) >= 1 && (
                              <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                                  <span className="font-bold text-amber-900">Hint 1 (Conceptual clue): </span>
                                  {step.hint1}
                                </div>
                                {(fb?.activeHintLevel || 0) >= 2 && (
                                  <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs">
                                    <span className="font-bold text-amber-900">Hint 2 (Formula clue): </span>
                                    {step.hint2}
                                  </div>
                                )}
                                {(fb?.activeHintLevel || 0) >= 3 && (
                                  <div className="p-3 rounded-xl bg-amber-200/60 border border-amber-400 text-amber-950 text-xs">
                                    <span className="font-bold text-amber-900">Hint 3 (Substitution guidance): </span>
                                    {step.hint3}
                                  </div>
                                )}
                                {(fb?.activeHintLevel || 0) >= 4 && (
                                  <div className="p-3 rounded-xl bg-amber-300/60 border border-amber-500 text-amber-950 text-xs">
                                    <span className="font-bold text-amber-900">Hint 4 (Calculation guidance): </span>
                                    {step.hint4 || step.explanation}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ANSWER SCHEME SECTION (Locked strictly until required step attempt completed) */}
            <div className="p-5 sm:p-6 bg-[#FAF9F6] border-t-2 border-purple-200 space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isSchemeUnlocked ? 'bg-emerald-600 text-white' : 'bg-purple-900 text-white'
                }`}>
                  {isSchemeUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <h3 className="text-base sm:text-lg font-black text-purple-950">
                  {isSchemeUnlocked ? '🔓 Official Answer Scheme & Marking Breakdown' : '🔒 Answer Scheme Locked'}
                </h3>
              </div>

              {!isSchemeUnlocked ? (
                <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-purple-300 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-purple-950">
                      Complete Your Step-by-Step Attempt to Unlock
                    </h4>
                    <p className="text-xs text-purple-800 max-w-md mx-auto">
                      Work through every interactive step above. Complete your solving attempt to unlock the official Matriculation answer scheme, full mathematical working, and error diagnostics.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-purple-700 bg-purple-50 inline-block px-3 py-1 rounded-full border border-purple-200">
                    Progress: {completedStepsCount} / {currentQuestion.steps.length} steps attempted
                  </div>
                </div>
              ) : (
                /* UNLOCKED ANSWER SCHEME WITH COMPARISON & ERROR ANALYSIS */
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Notice Banner */}
                  <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>You completed the required attempt! Compare your working with the official Matriculation marking scheme.</span>
                  </div>

                  {/* 1. Official Solution Card */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-emerald-300 shadow-xs space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>OFFICIAL MARKING SCHEME</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {currentQuestion.officialAnswerScheme?.map((schemeLine, idx) => (
                        <div 
                          key={idx}
                          className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs sm:text-sm text-purple-950 flex items-start gap-2.5 font-mono"
                        >
                          <div className="w-5 h-5 rounded-full bg-purple-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-sans">
                            {idx + 1}
                          </div>
                          <span className="leading-relaxed flex-1">{schemeLine}</span>
                        </div>
                      ))}
                    </div>

                    {currentQuestion.finalAnswerText && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-semibold">
                        <span className="font-bold">Final Summary: </span>
                        {currentQuestion.finalAnswerText}
                      </div>
                    )}
                  </div>

                    {/* 2. 🔍 CHECK YOUR WORK (Error Analysis) */}
                    <div className="p-5 rounded-2xl bg-white border-2 border-purple-200 space-y-3">
                      <div className="flex items-center gap-2 text-purple-950 font-black text-sm sm:text-base">
                        <Search className="w-4 h-4 text-purple-700" />
                        <span>🔍 Check Your Work (Error Analysis)</span>
                      </div>

                      <p className="text-xs text-purple-800">
                        Compare your inputs with the expected values to pinpoint any calculation or conceptual slips:
                      </p>

                      <div className="space-y-2 pt-1">
                        {currentQuestion.steps.map((st, i) => {
                          const inputVal = (userInputs[i] || '').trim() || '—';
                          const fb = stepFeedback[i];
                          
                          // Determine if user's input matches expected answer
                          let isStepMatch = false;
                          if (fb && typeof fb.isCorrect === 'boolean') {
                            isStepMatch = fb.isCorrect;
                          } else if (inputVal !== '—') {
                            if (st.isMultipleChoice && st.choiceOptions) {
                              const chosen = st.choiceOptions.find(o => o.value.toLowerCase() === inputVal.toLowerCase() || o.label.toLowerCase() === inputVal.toLowerCase());
                              isStepMatch = !!chosen?.isCorrect || st.acceptedAnswers.some(ans => inputVal.toLowerCase().includes(ans.toLowerCase()));
                            } else {
                              const numbersInInput = inputVal.match(/-?[0-9]+(?:\.[0-9]+)?/g);
                              const rawNumStr = numbersInInput ? numbersInInput[numbersInInput.length - 1] : null;
                              if (rawNumStr) {
                                isStepMatch = st.acceptedAnswers.some(ans => {
                                  const ansNumMatch = ans.match(/-?[0-9]+(?:\.[0-9]+)?/);
                                  return ansNumMatch ? rawNumStr === ansNumMatch[0] : false;
                                });
                              } else {
                                const normInput = inputVal.toLowerCase().replace(/\s+/g, '');
                                isStepMatch = st.acceptedAnswers.some(ans => normInput.includes(ans.toLowerCase().replace(/\s+/g, '')));
                              }
                            }
                          }

                          return (
                            <div 
                              key={i} 
                              className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                                isStepMatch 
                                  ? 'border-emerald-200 bg-emerald-50/40' 
                                  : 'border-rose-200 bg-rose-50/40'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-purple-950">Step {st.stepNumber}: {st.title}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-purple-900">
                                  <span>Your Input: <strong className={`font-mono px-1.5 py-0.5 rounded ${isStepMatch ? 'bg-emerald-100/70 text-emerald-950' : 'bg-rose-100/70 text-rose-950'}`}>{inputVal}</strong></span>
                                  <span className="text-purple-400">|</span>
                                  <span>Expected: <strong className="font-mono text-purple-950 bg-purple-100/60 px-1.5 py-0.5 rounded">{st.acceptedAnswers[0]}</strong></span>
                                </div>
                              </div>

                              <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 shrink-0 self-start sm:self-auto border ${
                                isStepMatch 
                                  ? 'bg-emerald-100 text-emerald-950 border-emerald-300' 
                                  : 'bg-rose-100 text-rose-950 border-rose-300'
                              }`}>
                                {isStepMatch ? '✓ Match' : '❌ Not Match'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  {/* 3. 🧠 QUICK REFLECTION */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-purple-200 space-y-3">
                    <div className="flex items-center gap-2 text-purple-950 font-black text-sm sm:text-base">
                      <Brain className="w-4 h-4 text-purple-700" />
                      <span>🧠 Quick Reflection</span>
                    </div>

                    <p className="text-xs text-purple-800">
                      What did you learn from this question? Select all that apply:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {[
                        "I understood the concept and full symbol description requirements.",
                        "I need to review the formula (p + q = 1 vs p² + 2pq + q² = 1).",
                        "I made a calculation / arithmetic mistake.",
                        "I confused allele frequency (p, q) with genotype frequency (p², q²).",
                        "I need more practice writing full step-by-step descriptions."
                      ].map((text, rIdx) => {
                        const isChecked = !!reflectionSelections[text];
                        return (
                          <button
                            key={rIdx}
                            onClick={() => setReflectionSelections(prev => ({ ...prev, [text]: !prev[text] }))}
                            className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                              isChecked
                                ? 'bg-purple-100/70 border-purple-400 text-purple-950 font-bold'
                                : 'bg-purple-50/40 border-purple-100 text-purple-900 hover:bg-purple-50'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                              isChecked ? 'border-purple-700 bg-purple-700 text-white' : 'border-purple-300'
                            }`}>
                              {isChecked && <Check className="w-3 h-3" />}
                            </div>
                            <span>{text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Action & Navigation Buttons */}
                  <div className="p-4 bg-white rounded-2xl border border-purple-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleSimilarQuestion}
                        className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs border border-purple-200 transition-colors cursor-pointer"
                      >
                        [Similar Question]
                      </button>

                      <button
                        onClick={() => handleNextSameSource('PSPM')}
                        className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs border border-purple-200 transition-colors cursor-pointer"
                      >
                        [Next PSPM Question]
                      </button>

                      <button
                        onClick={() => handleNextSameSource('Tutorial')}
                        className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs border border-purple-200 transition-colors cursor-pointer"
                      >
                        [Next Tutorial Question]
                      </button>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={handleResetQuestion}
                        className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                        <span>Reset &amp; Try Again</span>
                      </button>

                      <button
                        onClick={handleBackToDirectory}
                        className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        [Back to Question Bank]
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
