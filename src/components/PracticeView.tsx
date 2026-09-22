import React, { useState, useRef, useEffect } from 'react';
import { ALL_QUESTIONS } from '../data/questionsData';
import { ADDITIONAL_QUESTIONS } from '../data/pastYearAdditionalQuestions';
import { QuestionData, StepItem, UserProgress } from '../types';
import { MathToolbox } from './MathToolbox';
import { PastYearView } from './PastYearView';
import { getSavedQuestionState, saveQuestionState, clearQuestionState } from '../utils/questionProgress';
import confetti from 'canvas-confetti';
import { 
  PenTool, 
  GraduationCap,
  CheckCircle2, 
  Check,
  XCircle, 
  HelpCircle, 
  Award, 
  ChevronRight, 
  RotateCcw, 
  AlertTriangle, 
  Lightbulb, 
  FileCheck, 
  Brain, 
  Filter, 
  Layers, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

interface PracticeViewProps {
  initialQuestionId?: string;
  initialMode?: 'solver' | 'bank';
  userProgress: UserProgress;
  onUpdateProgress: (questionId: string, score: number, isComplete: boolean) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  initialQuestionId,
  initialMode,
  userProgress,
  onUpdateProgress
}) => {
  // Combine core 8 questions + 3 additional deep past year questions
  const questions: QuestionData[] = [...ALL_QUESTIONS, ...ADDITIONAL_QUESTIONS];

  const [activeSubTab, setActiveSubTab] = useState<'solver' | 'bank'>(
    initialMode || 'solver'
  );

  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    initialQuestionId || questions[0].id
  );

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Question state
  const currentQuestion = questions.find(q => q.id === selectedQuestionId) || questions[0];
  const [detectorAnswered, setDetectorAnswered] = useState(false);
  const [detectorSelectedIdx, setDetectorSelectedIdx] = useState<number | null>(null);

  // Step solver state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [stepFeedback, setStepFeedback] = useState<Record<number, {
    isCorrect: boolean;
    feedbackText: string;
    showExplanation: boolean;
    attempts: number;
    activeHintLevel: number;
    isBareAnswerWarning?: boolean;
    tickAwarded?: boolean;
    showIncorrectBanner?: boolean;
  }>>({});
  const [isQuestionFinished, setIsQuestionFinished] = useState(false);
  const [showFullMarkScheme, setShowFullMarkScheme] = useState(false);

  // Math Toolbox target input reference
  const activeInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered question list
  const filteredQuestions = questions.filter(q => {
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  // Auto-restore saved progress whenever selected question changes or progress event updates
  useEffect(() => {
    const loadState = (qId: string) => {
      const saved = getSavedQuestionState(qId);
      setUserInputs(saved.userInputs || {});
      setStepFeedback((saved.stepFeedback as any) || {});
      setCurrentStepIndex(saved.currentStepIndex || 0);
      setIsQuestionFinished(!!saved.isQuestionFinished);
      setDetectorAnswered(!!saved.detectorAnswered);
      setDetectorSelectedIdx(saved.detectorSelectedIdx ?? null);
      setShowFullMarkScheme(!!saved.isQuestionFinished);
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

  const handleSelectQuestion = (qId: string) => {
    setSelectedQuestionId(qId);
  };

  // Helper to retrieve official description and symbol pairing
  const getStepSymbolDescription = (step: StepItem): { symbol: string; description: string; prefixWithSymbol: string } => {
    if (step.symbolDescription) {
      const sym = step.expectedSymbol || '';
      return {
        symbol: sym,
        description: step.symbolDescription,
        prefixWithSymbol: sym ? `${step.symbolDescription}, ${sym}` : step.symbolDescription
      };
    }

    const sym = step.expectedSymbol;
    const combined = (step.title + ' ' + step.instruction + ' ' + step.expectedConcept).toLowerCase();

    if (sym === 'q²') {
      let desc = 'Frequency of homozygous recessive genotype';
      if (combined.includes('white coat') || combined.includes('white')) desc = 'Frequency of homozygous recessive genotype (white coated)';
      else if (combined.includes('eyelash')) desc = 'Frequency of homozygous recessive genotype (extra-long eyelashes)';
      else if (combined.includes('pku') || combined.includes('abnormal')) desc = 'Frequency of homozygous recessive genotype (PKU)';
      else if (combined.includes('fair')) desc = 'Frequency of homozygous recessive genotype (fair variety)';
      else if (combined.includes('grey') || combined.includes('gray')) desc = 'Frequency of homozygous recessive genotype (grey hair)';
      else if (combined.includes('thalassemia')) desc = 'Frequency of homozygous recessive genotype (thalassemia major)';
      else if (combined.includes('short legs') || combined.includes('chicken')) desc = 'Frequency of homozygous recessive genotype (short legs)';
      else if (combined.includes('tay-sachs')) desc = 'Frequency of homozygous recessive genotype (Tay-Sachs)';
      else if (combined.includes('albino') || combined.includes('albinism')) desc = 'Frequency of homozygous recessive genotype (albino)';
      else if (combined.includes('non-dimple')) desc = 'Frequency of homozygous recessive genotype (non-dimpled)';
      else if (combined.includes('vestigial')) desc = 'Frequency of homozygous recessive genotype (vestigial wings)';
      else if (combined.includes('yellow')) desc = 'Frequency of homozygous recessive genotype (yellow fur)';

      return {
        symbol: 'q²',
        description: desc,
        prefixWithSymbol: `${desc}, q²`
      };
    }

    if (sym === 'q') {
      let desc = 'Frequency of recessive allele';
      if (combined.includes('fair')) desc = 'Frequency of recessive allele (fair allele)';
      else if (combined.includes('grey')) desc = 'Frequency of recessive allele (grey hair allele)';
      else if (combined.includes('vestigial') || combined.includes('allele l')) desc = 'Frequency of recessive allele (l)';
      else if (combined.includes('yellow') || combined.includes('allele b')) desc = 'Frequency of recessive allele (b)';

      return {
        symbol: 'q',
        description: desc,
        prefixWithSymbol: `${desc}, q`
      };
    }

    if (sym === 'p') {
      let desc = 'Frequency of dominant allele';
      if (combined.includes('dark')) desc = 'Frequency of dominant allele (dark allele)';
      else if (combined.includes('black')) desc = 'Frequency of dominant allele (black allele)';
      else if (combined.includes('dimple')) desc = 'Frequency of dominant allele (dimple allele)';
      else if (combined.includes('normal wing') || combined.includes('allele l')) desc = 'Frequency of dominant allele (L)';
      else if (combined.includes('allele b')) desc = 'Frequency of dominant allele (B)';

      return {
        symbol: 'p',
        description: desc,
        prefixWithSymbol: `${desc}, p`
      };
    }

    if (sym === '2pq') {
      return {
        symbol: '2pq',
        description: 'Frequency of heterozygous genotype',
        prefixWithSymbol: 'Frequency of heterozygous genotype, 2pq'
      };
    }

    if (sym === 'p²') {
      return {
        symbol: 'p²',
        description: 'Frequency of homozygous dominant genotype',
        prefixWithSymbol: 'Frequency of homozygous dominant genotype, p²'
      };
    }

    if (combined.includes('p² + 2pq') || combined.includes('black coated') || combined.includes('dominant phenotype')) {
      return {
        symbol: 'p² + 2pq',
        description: 'Genotype frequency of dominant phenotype',
        prefixWithSymbol: 'Genotype frequency of dominant phenotype, p² + 2pq'
      };
    }

    if (combined.includes('percentage') && (combined.includes('carrier') || combined.includes('heterozyg'))) {
      return {
        symbol: '2pq × 100%',
        description: 'Percentage of heterozygous individuals',
        prefixWithSymbol: 'Percentage of heterozygous individuals, 2pq × 100%'
      };
    }

    if (combined.includes('percentage') && combined.includes('homozygous dominant')) {
      return {
        symbol: 'p² × 100%',
        description: 'Percentage of homozygous dominant individuals',
        prefixWithSymbol: 'Percentage of homozygous dominant individuals, p² × 100%'
      };
    }

    if (combined.includes('number of') || combined.includes('how many')) {
      if (combined.includes('heterozyg') || combined.includes('carrier') || combined.includes('minor')) {
        return {
          symbol: '2pq × N',
          description: 'Number of heterozygous individuals',
          prefixWithSymbol: 'Number of heterozygous individuals'
        };
      }
      if (combined.includes('homozygous dominant') || combined.includes('bb')) {
        return {
          symbol: 'p² × N',
          description: 'Number of homozygous dominant individuals',
          prefixWithSymbol: 'Number of homozygous dominant individuals'
        };
      }
      if (combined.includes('fair') || combined.includes('recessive') || combined.includes('non-dimple')) {
        return {
          symbol: 'N_recessive',
          description: 'Number of recessive individuals',
          prefixWithSymbol: 'Number of recessive individuals'
        };
      }
      return {
        symbol: 'Number',
        description: 'Number of individuals',
        prefixWithSymbol: 'Number of individuals'
      };
    }

    if (combined.includes('total') && combined.includes('allele')) {
      return {
        symbol: 'Total alleles',
        description: 'Total number of alleles in gene pool',
        prefixWithSymbol: 'Total number of alleles in gene pool'
      };
    }

    if (combined.includes('new dominant allele')) {
      return {
        symbol: 'p_new',
        description: 'New dominant allele frequency',
        prefixWithSymbol: 'New dominant allele frequency'
      };
    }

    if (combined.includes('new recessive allele')) {
      return {
        symbol: 'q_new',
        description: 'New recessive allele frequency',
        prefixWithSymbol: 'New recessive allele frequency'
      };
    }

    return {
      symbol: sym || '',
      description: step.title,
      prefixWithSymbol: sym ? `${step.title}, ${sym}` : step.title
    };
  };

  // Helper to generate step scaffold template with DESCRIPTION FIRST
  const getStepScaffold = (step: StepItem): string => {
    const meta = getStepSymbolDescription(step);
    const sym = step.expectedSymbol;

    if (sym === 'q²') {
      return `${meta.prefixWithSymbol} = [recessive count] / [total population] = `;
    }
    if (sym === 'q') {
      return `${meta.prefixWithSymbol} = √q² = √(...) = `;
    }
    if (sym === 'p') {
      return `${meta.prefixWithSymbol} = 1 - q = 1 - (...) = `;
    }
    if (sym === '2pq') {
      return `${meta.prefixWithSymbol} = 2 × p × q = 2(...) (...) = `;
    }
    if (sym === 'p²') {
      return `${meta.prefixWithSymbol} = p × p = (...)² = `;
    }
    const combined = (step.title + ' ' + step.instruction).toLowerCase();
    if (combined.includes('p² + 2pq') || combined.includes('black coated')) {
      return `${meta.prefixWithSymbol} = 1 - q² = 1 - (...) = `;
    }
    if (combined.includes('percentage') && (combined.includes('carrier') || combined.includes('heterozyg'))) {
      return `${meta.prefixWithSymbol} = 2(...) (...) × 100% = `;
    }
    if (combined.includes('percentage') && combined.includes('homozygous dominant')) {
      return `${meta.prefixWithSymbol} = (...)² × 100% = `;
    }
    if (combined.includes('number of') || combined.includes('how many')) {
      if (combined.includes('heterozyg') || combined.includes('carrier') || combined.includes('minor')) {
        return `${meta.description} = 2pq × N = (...) × (...) = `;
      }
      if (combined.includes('homozygous dominant')) {
        return `${meta.description} = p² × N = (...) × (...) = `;
      }
      return `${meta.description} = [frequency] × [total N] = ... × ... = `;
    }
    if (combined.includes('allele') && (combined.includes('count') || combined.includes('total') || combined.includes('pool'))) {
      return `${meta.description} = 2(...) + (...) = `;
    }
    if (combined.includes('new dominant allele')) {
      return `${meta.description} = (Dominant alleles) / (Total alleles) = `;
    }
    if (combined.includes('new recessive allele')) {
      return `${meta.description} = (Recessive alleles) / (Total alleles) = `;
    }
    if (sym) {
      return `${meta.prefixWithSymbol} = ... = `;
    }
    return `${meta.description} = ... = `;
  };

  // Helper to get formatted example of accepted step calculation with DESCRIPTION FIRST
  // Provides generic structural guidance ONLY, without revealing the answer scheme or numerical values
  const getExampleStepText = (step: StepItem): string => {
    const meta = getStepSymbolDescription(step);
    const sym = step.expectedSymbol;

    if (sym === 'q²') {
      return `${meta.prefixWithSymbol} = [recessive count] / [total population] = [value]`;
    }
    if (sym === 'q') {
      return `${meta.prefixWithSymbol} = √q² = √(...) = [value]`;
    }
    if (sym === 'p') {
      return `${meta.prefixWithSymbol} = 1 - q = 1 - (...) = [value]`;
    }
    if (sym === '2pq') {
      return `${meta.prefixWithSymbol} = 2 × p × q = 2(...) (...) = [value]`;
    }
    if (sym === 'p²') {
      return `${meta.prefixWithSymbol} = p² = (...)² = [value]`;
    }
    const combined = (step.title + ' ' + step.instruction).toLowerCase();
    if (combined.includes('p² + 2pq') || combined.includes('dominant phenotype')) {
      return `${meta.prefixWithSymbol} = 1 - q² = 1 - (...) = [value]`;
    }
    if (combined.includes('percentage') && (combined.includes('carrier') || combined.includes('heterozyg'))) {
      return `${meta.prefixWithSymbol} = 2pq × 100% = 2(...) (...) × 100% = [value]%`;
    }
    if (combined.includes('percentage') && combined.includes('homozygous dominant')) {
      return `${meta.prefixWithSymbol} = p² × 100% = (...)² × 100% = [value]%`;
    }
    if (combined.includes('number of') || combined.includes('how many')) {
      return `${meta.description} = [frequency] × [total N] = (...) × (...) = [number]`;
    }
    if (combined.includes('allele') && (combined.includes('count') || combined.includes('total') || combined.includes('pool'))) {
      return `${meta.description} = 2(...) + (...) = [total alleles]`;
    }
    if (sym) {
      return `${meta.prefixWithSymbol} = [formula] = [substitution] = [value]`;
    }
    return `${meta.description} = [working] = [value]`;
  };

  // Format verified step display with official Matriculation description preceding the symbol
  const formatStepWithDescription = (step: StepItem, rawInput: string): string => {
    const meta = getStepSymbolDescription(step);
    const trimmed = (rawInput || '').trim();
    if (!trimmed) {
      return `${meta.prefixWithSymbol} = ${step.acceptedAnswers[0]}`;
    }

    // Check if rawInput already includes a meaningful word of description
    const descWords = meta.description.toLowerCase().split(/[\s,()]+/).filter(w => w.length >= 4);
    const hasDescription = descWords.some(w => trimmed.toLowerCase().includes(w));

    if (hasDescription) {
      return trimmed;
    }

    // If student wrote "q² = ..." or "q = ..." without description
    if (step.expectedSymbol && trimmed.startsWith(step.expectedSymbol)) {
      return `${meta.description}, ${trimmed}`;
    }

    // If includes '='
    if (trimmed.includes('=')) {
      return `${meta.prefixWithSymbol} = ${trimmed}`;
    }

    return `${meta.prefixWithSymbol} = ${trimmed}`;
  };

  // Check if student entered ONLY a bare answer without showing calculation steps
  const isBareAnswerOnly = (rawVal: string, isNumericStep: boolean): boolean => {
    if (!isNumericStep) return false;
    const trimmed = rawVal.trim();
    
    // Pure number or percentage alone (e.g. "0.0008", ".0008", "0.4", "288", "36%")
    const pureNumRegex = /^[+-]?(?:\d*\.)?\d+%?$/;
    if (pureNumRegex.test(trimmed)) return true;

    // Number with noun alone (e.g. "288 hamsters", "0.4 frequency") with NO math operators or formulas
    const numWithWordRegex = /^[+-]?(?:\d*\.)?\d+\s*(?:individuals|hamsters|mice|students|geese|chickens|people|cows|goats|flies|varieties|babies|carriers|%)?$/i;
    if (numWithWordRegex.test(trimmed)) {
      const hasMathSymbols = /[=/*×÷+\-√²^()]/.test(trimmed) || /\b(q|p|2pq|q2|p2|sqrt|root|total)\b/i.test(trimmed);
      if (!hasMathSymbols) return true;
    }

    return false;
  };

  const handleInsertSymbolToStep = (stepNumber: number, sym: string) => {
    setUserInputs(prev => {
      const cur = prev[stepNumber] || '';
      const nextVal = cur + (cur.endsWith(' ') || cur === '' ? '' : ' ') + sym;
      const nextInputs = { ...prev, [stepNumber]: nextVal };
      saveQuestionState(selectedQuestionId, {
        userInputs: nextInputs,
        stepFeedback,
        currentStepIndex,
        isQuestionFinished,
        detectorAnswered,
        detectorSelectedIdx
      });
      return nextInputs;
    });
    if (activeInputRef.current) {
      activeInputRef.current.focus();
    }
  };

  const handleInsertTextToStep = (stepNumber: number, text: string) => {
    setUserInputs(prev => {
      const cur = prev[stepNumber] || '';
      const nextVal = cur + (cur.endsWith(' ') || cur === '' ? '' : ' ') + text;
      const nextInputs = { ...prev, [stepNumber]: nextVal };
      saveQuestionState(selectedQuestionId, {
        userInputs: nextInputs,
        stepFeedback,
        currentStepIndex,
        isQuestionFinished,
        detectorAnswered,
        detectorSelectedIdx
      });
      return nextInputs;
    });
    if (activeInputRef.current) {
      activeInputRef.current.focus();
    }
  };

  const handleInsertScaffoldToStep = (step: StepItem) => {
    const scaffold = getStepScaffold(step);
    setUserInputs(prev => {
      const nextInputs = { ...prev, [step.stepNumber]: scaffold };
      saveQuestionState(selectedQuestionId, {
        userInputs: nextInputs,
        stepFeedback,
        currentStepIndex,
        isQuestionFinished,
        detectorAnswered,
        detectorSelectedIdx
      });
      return nextInputs;
    });
    if (activeInputRef.current) {
      activeInputRef.current.focus();
    }
  };

  const handleInputChange = (stepNumber: number, val: string) => {
    setUserInputs(prev => {
      const nextInputs = { ...prev, [stepNumber]: val };
      saveQuestionState(selectedQuestionId, {
        userInputs: nextInputs,
        stepFeedback,
        currentStepIndex,
        isQuestionFinished,
        detectorAnswered,
        detectorSelectedIdx
      });
      return nextInputs;
    });

    if (stepFeedback[stepNumber]?.showIncorrectBanner) {
      setStepFeedback(prev => {
        const nextFb = {
          ...prev,
          [stepNumber]: { ...prev[stepNumber], showIncorrectBanner: false }
        };
        saveQuestionState(selectedQuestionId, {
          userInputs,
          stepFeedback: nextFb,
          currentStepIndex,
          isQuestionFinished,
          detectorAnswered,
          detectorSelectedIdx
        });
        return nextFb;
      });
    }
  };

  // Check Step Answer with strict step calculation enforcement & PopGen error diagnosis
  const checkStep = (step: StepItem, selectedChoiceValue?: string) => {
    const rawVal = (selectedChoiceValue !== undefined ? selectedChoiceValue : userInputs[step.stepNumber] || '').trim();
    if (!rawVal) return;

    const currentAttempt = (stepFeedback[step.stepNumber]?.attempts || 0) + 1;
    const isNumericStep = step.acceptedAnswers.some(ans => /\d/.test(ans));

    // Multiple-choice step handling (e.g. Question 1 Step 5 Conclusion: Yes / No equilibrium)
    if (step.isMultipleChoice && step.choiceOptions) {
      const chosenOpt = step.choiceOptions.find(opt => 
        opt.value.toLowerCase() === rawVal.toLowerCase() ||
        opt.label.toLowerCase().includes(rawVal.toLowerCase())
      );
      const isChoiceCorrect = chosenOpt ? chosenOpt.isCorrect : step.acceptedAnswers.some(ans => ans.toLowerCase() === rawVal.toLowerCase());

      if (isChoiceCorrect) {
        const newFb = {
          ...stepFeedback,
          [step.stepNumber]: {
            isCorrect: true,
            isBareAnswerWarning: false,
            tickAwarded: true,
            feedbackText: chosenOpt?.feedback || `✓ Correct Conclusion! [${step.marks || 1} ${step.marks === 1 ? 'mark' : 'marks'}]`,
            showExplanation: true,
            attempts: currentAttempt,
            activeHintLevel: stepFeedback[step.stepNumber]?.activeHintLevel || 0,
            showIncorrectBanner: false
          }
        };
        setStepFeedback(newFb);

        // If last step completed
        if (currentStepIndex === currentQuestion.steps.length - 1) {
          setIsQuestionFinished(true);
          saveQuestionState(selectedQuestionId, {
            userInputs,
            stepFeedback: newFb,
            currentStepIndex,
            isQuestionFinished: true,
            detectorAnswered,
            detectorSelectedIdx
          });
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {}
          onUpdateProgress(currentQuestion.id, currentQuestion.totalMarks, true);
        } else {
          const nextIdx = currentStepIndex + 1;
          setCurrentStepIndex(nextIdx);
          saveQuestionState(selectedQuestionId, {
            userInputs,
            stepFeedback: newFb,
            currentStepIndex: nextIdx,
            isQuestionFinished: false,
            detectorAnswered,
            detectorSelectedIdx
          });
        }
      } else {
        const newFb = {
          ...stepFeedback,
          [step.stepNumber]: {
            isCorrect: false,
            isBareAnswerWarning: false,
            tickAwarded: false,
            feedbackText: chosenOpt?.feedback || "✗ Incorrect conclusion! Please review allele frequency changes between 1995 and 2005.",
            showExplanation: false,
            attempts: currentAttempt,
            activeHintLevel: stepFeedback[step.stepNumber]?.activeHintLevel || 0,
            showIncorrectBanner: true
          }
        };
        setStepFeedback(newFb);
        saveQuestionState(selectedQuestionId, {
          userInputs,
          stepFeedback: newFb,
          currentStepIndex,
          isQuestionFinished,
          detectorAnswered,
          detectorSelectedIdx
        });
      }
      return;
    }

    // MANDATORY REQUIREMENT: Students must give their answers in step-by-step calculation.
    // They are NOT allowed to give only their answers. They must show the steps with the description of the symbol first.
    if (isNumericStep && isBareAnswerOnly(rawVal, isNumericStep)) {
      const example = getExampleStepText(step);
      const newFb = {
        ...stepFeedback,
        [step.stepNumber]: {
          isCorrect: false,
          isBareAnswerWarning: true,
          tickAwarded: false,
          feedbackText: `⚠️ Working Step with Description Required: You are NOT allowed to give only the final bare answer ("${rawVal}"). In Matriculation Biology examination standard, all symbols must be written with their description first in the calculation (e.g. "${example}").`,
          showExplanation: currentAttempt >= 3,
          attempts: currentAttempt,
          activeHintLevel: stepFeedback[step.stepNumber]?.activeHintLevel || 0,
          showIncorrectBanner: false
        }
      };
      setStepFeedback(newFb);
      saveQuestionState(selectedQuestionId, {
        userInputs,
        stepFeedback: newFb,
        currentStepIndex,
        isQuestionFinished,
        detectorAnswered,
        detectorSelectedIdx
      });
      return;
    }

    // Extract student's candidate answer value from their step-by-step calculation
    let candidate = rawVal.trim();
    if (rawVal.includes('=')) {
      const parts = rawVal.split('=');
      candidate = parts[parts.length - 1].trim();
    }
    // Clean candidate from trailing punctuation like '.' or ';'
    candidate = candidate.replace(/[.;]+$/, '').trim();
    const cleanCandidate = candidate.toLowerCase();
    const cleanRaw = rawVal.toLowerCase().trim();

    // Strict equality check against the official mark scheme:
    const exactMatch = step.acceptedAnswers.some(ans => {
      const a = ans.trim().toLowerCase();
      const c = cleanCandidate;
      const r = cleanRaw;

      if (c === a || r === a) return true;
      if (c.replace(/[\s,]+/g, '') === a.replace(/[\s,]+/g, '')) return true;
      if (a.endsWith('%') && (c === a || c + '%' === a || c === a.replace('%', ''))) return true;
      if (!isNumericStep && (r.includes(a) || r.replace(/\s+/g, '').includes(a.replace(/\s+/g, '')))) return true;
      return false;
    });

    if (exactMatch) {
      // Correct step calculation verified against the official answer scheme!
      const newFb = {
        ...stepFeedback,
        [step.stepNumber]: {
          isCorrect: true,
          isBareAnswerWarning: false,
          tickAwarded: true,
          feedbackText: `✓ Correct Step! Well done! [${step.marks || 1} ${step.marks === 1 ? 'mark' : 'marks'}]`,
          showExplanation: true,
          attempts: currentAttempt,
          activeHintLevel: stepFeedback[step.stepNumber]?.activeHintLevel || 0,
          showIncorrectBanner: false
        }
      };
      setStepFeedback(newFb);

      // If last step completed
      if (currentStepIndex === currentQuestion.steps.length - 1) {
        setIsQuestionFinished(true);
        saveQuestionState(selectedQuestionId, {
          userInputs,
          stepFeedback: newFb,
          currentStepIndex,
          isQuestionFinished: true,
          detectorAnswered,
          detectorSelectedIdx
        });
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
        onUpdateProgress(currentQuestion.id, currentQuestion.totalMarks, true);
      } else {
        // Unlock next step
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        saveQuestionState(selectedQuestionId, {
          userInputs,
          stepFeedback: newFb,
          currentStepIndex: nextIdx,
          isQuestionFinished: false,
          detectorAnswered,
          detectorSelectedIdx
        });
      }
    } else {
      // Answer does NOT match the answer scheme.
      const newFb = {
        ...stepFeedback,
        [step.stepNumber]: {
          isCorrect: false,
          isBareAnswerWarning: false,
          tickAwarded: false,
          feedbackText: "✗ Incorrect! Please check your answers/steps.",
          showExplanation: false,
          attempts: currentAttempt,
          activeHintLevel: stepFeedback[step.stepNumber]?.activeHintLevel || 0,
          showIncorrectBanner: true
        }
      };
      setStepFeedback(newFb);
      saveQuestionState(selectedQuestionId, {
        userInputs,
        stepFeedback: newFb,
        currentStepIndex,
        isQuestionFinished,
        detectorAnswered,
        detectorSelectedIdx
      });
    }
  };

  const handleRequestHint = (stepNumber: number) => {
    setStepFeedback(prev => {
      const cur = prev[stepNumber] || {
        isCorrect: false,
        feedbackText: '',
        showExplanation: false,
        attempts: 0,
        activeHintLevel: 0,
        showIncorrectBanner: false
      };
      const newFb = {
        ...prev,
        [stepNumber]: {
          ...cur,
          showIncorrectBanner: false,
          feedbackText: cur.isCorrect ? cur.feedbackText : '',
          isBareAnswerWarning: false,
          activeHintLevel: Math.min(3, cur.activeHintLevel + 1)
        }
      };
      saveQuestionState(selectedQuestionId, {
        userInputs,
        stepFeedback: newFb,
        currentStepIndex,
        isQuestionFinished,
        detectorAnswered,
        detectorSelectedIdx
      });
      return newFb;
    });
  };

  const currentStep = currentQuestion.steps[currentStepIndex];
  const isQuestionComplete = userProgress.completedQuestions.includes(currentQuestion.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Unified Feature Mode Header: Step Solver & PSPM Question Bank */}
      <div className="bg-white p-3 rounded-2xl border-2 border-purple-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('solver')}
            id="solver-subtab-solver"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'solver'
                ? 'bg-purple-800 text-white shadow-md'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <PenTool className="w-4 h-4 text-amber-300" />
            <span>Interactive Step Solver</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bank')}
            id="solver-subtab-bank"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'bank'
                ? 'bg-purple-800 text-white shadow-md'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-300" />
            <span>Tutorial &amp; PSPM Question Bank</span>
            <span className="bg-emerald-400 text-purple-950 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              {questions.length} Qs
            </span>
          </button>
        </div>

        <div className="text-xs text-purple-800 font-bold px-2 flex items-center gap-2">
          {activeSubTab === 'solver' ? (
            <button
              onClick={() => setActiveSubTab('bank')}
              className="text-purple-700 hover:text-purple-950 underline flex items-center gap-1 cursor-pointer"
            >
              <span>Browse All {questions.length} Qs &amp; Mark Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-purple-700 font-semibold">
              Select any question below to solve in the interactive engine
            </span>
          )}
        </div>
      </div>

      {activeSubTab === 'bank' ? (
        <PastYearView
          onLoadQuestionIntoSolver={(qId) => {
            handleSelectQuestion(qId);
            setActiveSubTab('solver');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          completedQuestions={userProgress.completedQuestions}
        />
      ) : (
        <>
          {/* Top Banner & Question Selector */}
          <div className="bg-white p-5 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-1">
              <PenTool className="w-3.5 h-3.5 text-purple-700" />
              <span>Interactive Step-by-Step Question Solver</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-purple-950">
              {currentQuestion.number}: {currentQuestion.title}
            </h2>
          </div>

          {/* Question Stats Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 font-semibold">
              Marks: {currentQuestion.totalMarks}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
              currentQuestion.difficulty === 'Foundation'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : currentQuestion.difficulty === 'Intermediate'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-purple-50 text-purple-800 border-purple-300'
            }`}>
              {currentQuestion.difficulty}
            </span>
            {isQuestionComplete && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-purple-900 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-purple-200 text-purple-950 text-xs font-medium bg-white"
          >
            <option value="all">All Categories ({questions.length})</option>
            <option value="gene-pool">Gene Pool Counting</option>
            <option value="hardy-weinberg">Standard Hardy-Weinberg</option>
            <option value="heterozygotes">Carriers / Heterozygotes</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-purple-200 text-purple-950 text-xs font-medium bg-white"
          >
            <option value="all">All Difficulties</option>
            <option value="Foundation">Foundation</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className="ml-auto text-purple-700 font-semibold text-xs">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>
        </div>

        {/* Question Selector Carousel / Badges */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filteredQuestions.map((q) => {
            const isSel = q.id === selectedQuestionId;
            const isDone = userProgress.completedQuestions.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(q.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border-purple-200'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                <span>{q.number}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left is Question & Solver, Right is Math Toolbox & Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Full Question Text + Detector + Step Solver */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Stem Box */}
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                Question Context ({currentQuestion.source})
              </span>
              {isQuestionFinished ? (
                <button
                  onClick={() => setShowFullMarkScheme(!showFullMarkScheme)}
                  className="text-xs text-purple-800 hover:text-purple-950 font-bold flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 px-2.5 py-1 rounded-lg border border-purple-300 transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5 text-purple-700" />
                  {showFullMarkScheme ? 'Hide Official Scheme' : 'View Official Mark Scheme'}
                </button>
              ) : (
                <div 
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200"
                  title="Official mark scheme will be unlocked after you submit your calculations and complete the steps"
                >
                  <Lock className="w-3 h-3 text-purple-400" />
                  <span>Official Scheme Unlocks After Completion</span>
                </div>
              )}
            </div>

            {/* Formatted Question Text */}
            <div className="text-xs sm:text-sm text-purple-950 font-medium whitespace-pre-line leading-relaxed bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              {currentQuestion.questionText}
            </div>

            {/* Question Specimen Image (if provided) */}
            {currentQuestion.imageUrl && (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-purple-50/80 p-3.5 rounded-xl border border-purple-200">
                <img 
                  src={currentQuestion.imageUrl} 
                  alt={currentQuestion.title}
                  className="w-full sm:w-48 h-32 object-cover rounded-lg border border-purple-300 shadow-2xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs text-purple-950 space-y-1">
                  <div className="font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Biological Specimen Reference</span>
                  </div>
                  <p className="text-purple-800 leading-relaxed">
                    {currentQuestion.imageCaption || 'Visual reference for this question context.'}
                  </p>
                </div>
              </div>
            )}

            {/* Target Concept Pill */}
            <div className="p-3 bg-purple-100/70 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2">
              <Brain className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <strong>Core Syllabus Concept:</strong> {currentQuestion.targetConcept}
              </div>
            </div>

            {/* Full Mark Scheme Drawer (if toggled) */}
            {showFullMarkScheme && (
              <div className="p-4 bg-purple-950 text-white rounded-xl space-y-2 text-xs animate-in fade-in duration-200">
                <div className="font-bold text-amber-300 border-b border-purple-800 pb-1 flex items-center justify-between">
                  <span>Official Answer Scheme:</span>
                  <span className="font-mono text-purple-300">Total: {currentQuestion.totalMarks} Marks</span>
                </div>
                <div className="space-y-1.5 font-mono text-purple-100">
                  {currentQuestion.officialAnswerScheme.map((item, idx) => (
                    <div key={idx} className="bg-purple-900/60 p-2 rounded border border-purple-800">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STAGE 1: QUESTION DETECTOR (Understand before calculating) */}
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-900 text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-purple-950">
                Stage 1: Question Detector — "Think First, Calculate Second"
              </h3>
            </div>
            <p className="text-xs text-purple-800">
              Before touching your calculator, what is the correct strategy for this problem?
            </p>

            <div className="space-y-2">
              {currentQuestion.detectorOptions.map((opt, idx) => {
                const isPicked = detectorSelectedIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setDetectorSelectedIdx(idx);
                      setDetectorAnswered(true);
                      saveQuestionState(selectedQuestionId, {
                        userInputs,
                        stepFeedback,
                        currentStepIndex,
                        isQuestionFinished,
                        detectorAnswered: true,
                        detectorSelectedIdx: idx
                      });
                    }}
                    className={`w-full p-3 rounded-xl text-xs font-semibold text-left border transition-all flex items-start gap-2.5 ${
                      isPicked
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                          : 'bg-red-50 border-red-400 text-red-950 shadow-xs'
                        : 'bg-white hover:bg-purple-50/70 border-purple-200 text-purple-900'
                    }`}
                  >
                    <span className="font-mono text-purple-600 font-bold shrink-0">({String.fromCharCode(65 + idx)})</span>
                    <span className="flex-1">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Detector Feedback */}
            {detectorAnswered && detectorSelectedIdx !== null && (
              <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                currentQuestion.detectorOptions[detectorSelectedIdx].isCorrect
                  ? 'bg-emerald-100 border border-emerald-300 text-emerald-950'
                  : 'bg-red-100 border border-red-300 text-red-950'
              }`}>
                <strong>{currentQuestion.detectorOptions[detectorSelectedIdx].isCorrect ? '✓ Excellent Assessment! ' : '⚠ Caution: '}</strong>
                {currentQuestion.detectorOptions[detectorSelectedIdx].feedback}
              </div>
            )}
          </div>

          {/* STAGE 2: STEP-BY-STEP INTERACTIVE SOLVER */}
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-100 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-900 text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-bold text-purple-950">
                  Stage 2: Step-by-Step Calculation Engine
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md">
                  Step {Math.min(currentStepIndex + 1, currentQuestion.steps.length)} of {currentQuestion.steps.length}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
                  <span>✓ Working Required</span>
                </span>
              </div>
            </div>

            {/* Matriculation Exam Marking Rule Banner */}
            <div className="p-3 bg-amber-50/90 border-2 border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
              <span className="text-base leading-none mt-0.5">📋</span>
              <div className="space-y-0.5">
                <span className="font-extrabold text-amber-950 block uppercase tracking-wide text-[11px]">
                  Matriculation Marking Standard (SB015 Requirement)
                </span>
                <p className="text-[12px] text-amber-900 leading-snug">
                  All symbols <strong>must be written with their description first</strong> in the step calculation (for example, <code className="bg-amber-100/90 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">Frequency of homozygous recessive genotype, q² = [recessive count] / [total N] = [value]</code>). Use the template button or quick term buttons below to insert the full description!
                </p>
              </div>
            </div>

            {/* Stepper Status Indicators */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {currentQuestion.steps.map((s, sIdx) => {
                const isPassed = stepFeedback[s.stepNumber]?.isCorrect;
                const isCurrent = sIdx === currentStepIndex && !isQuestionFinished;
                return (
                  <div
                    key={s.stepNumber}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      isPassed
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : isCurrent
                        ? 'bg-purple-800 text-white border-purple-900 ring-2 ring-purple-300 shadow-xs'
                        : 'bg-purple-50 text-purple-700 border-purple-200 opacity-60'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                        {s.stepNumber}
                      </span>
                    )}
                    <span>Step {s.stepNumber}</span>
                    {isPassed && <span className="text-[10px] bg-emerald-800 px-1 rounded">✓</span>}
                  </div>
                );
              })}
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-700 h-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + (isQuestionFinished ? 1 : 0)) / currentQuestion.steps.length) * 100}%` }}
              />
            </div>

            {/* Render Steps up to currentStepIndex */}
            <div className="space-y-5">
              {currentQuestion.steps.slice(0, currentStepIndex + 1).map((step, idx) => {
                const fb = stepFeedback[step.stepNumber];
                const isCurrentActive = idx === currentStepIndex && !isQuestionFinished;
                const isStepPassed = fb?.isCorrect;

                return (
                  <div
                    key={step.stepNumber}
                    className={`p-5 rounded-2xl border-2 transition-all space-y-3.5 ${
                      isStepPassed
                        ? 'bg-emerald-50/40 border-emerald-400'
                        : isCurrentActive
                        ? 'bg-purple-50/70 border-purple-400 shadow-xs'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    {/* Step Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isStepPassed ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>✓ Step {step.stepNumber} Correct</span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md bg-purple-200 text-purple-900 font-extrabold text-xs">
                            Step {step.stepNumber}
                          </span>
                        )}
                        <span className="font-bold text-xs sm:text-sm text-purple-950">{step.title}</span>
                      </div>
                      <span className="text-xs font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded">
                        [{step.marks} {step.marks === 1 ? 'mark' : 'marks'}]
                      </span>
                    </div>

                    {/* Step Instruction */}
                    <p className="text-xs sm:text-sm text-purple-950 font-medium bg-white/70 p-3 rounded-xl border border-purple-100 leading-relaxed">
                      {step.instruction}
                    </p>

                    {/* Step Answer Box (Multiple Choice Conclusion or Step-by-Step Calculation) */}
                    <div className={`p-4 rounded-xl border-2 space-y-3 transition-all ${
                      isStepPassed ? 'bg-emerald-100/40 border-emerald-400' : 'bg-white border-purple-300'
                    }`}>
                      {step.isMultipleChoice && step.choiceOptions ? (
                        /* Multiple Choice Answer Box (For Qualitative / Conclusion steps) */
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <label className="font-extrabold text-xs text-purple-950 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
                              <span>Select Conclusion (Multiple Choice):</span>
                            </label>
                            <span className="text-[11px] font-bold text-purple-900 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>💡 No calculation working required • Select conclusion</span>
                            </span>
                          </div>

                          {/* Options List */}
                          <div className="space-y-2 pt-1">
                            {step.choiceOptions.map((opt, optIdx) => {
                              const isSelected = (userInputs[step.stepNumber] || '').toLowerCase() === opt.value.toLowerCase() || (userInputs[step.stepNumber] || '').toLowerCase() === opt.label.toLowerCase();
                              const isOptionPassed = isStepPassed && isSelected;
                              
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  disabled={isStepPassed || !isCurrentActive}
                                  onClick={() => {
                                    if (isStepPassed || !isCurrentActive) return;
                                    setUserInputs(prev => ({ ...prev, [step.stepNumber]: opt.value }));
                                    checkStep(step, opt.value);
                                  }}
                                  className={`w-full p-3.5 rounded-xl text-left text-xs sm:text-sm font-bold border-2 transition-all flex items-start gap-3 cursor-pointer ${
                                    isOptionPassed
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                                      : isSelected && fb?.showIncorrectBanner && !fb.isCorrect
                                      ? 'bg-red-50 border-red-500 text-red-950'
                                      : isCurrentActive
                                      ? 'bg-white hover:bg-purple-50 hover:border-purple-400 border-purple-200 text-purple-950 shadow-2xs active:scale-[0.99]'
                                      : 'bg-gray-50 border-gray-200 text-gray-700 opacity-60'
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                                    isOptionPassed
                                      ? 'bg-emerald-600 text-white border-emerald-700'
                                      : isSelected && fb?.showIncorrectBanner && !fb.isCorrect
                                      ? 'bg-red-600 text-white border-red-700'
                                      : 'bg-purple-100 text-purple-900 border-purple-300'
                                  }`}>
                                    {isOptionPassed ? '✓' : isSelected && fb?.showIncorrectBanner && !fb.isCorrect ? '✗' : String.fromCharCode(65 + optIdx)}
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="text-sm font-black tracking-tight">{opt.label}</div>
                                    {isSelected && isStepPassed && (
                                      <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                                        {opt.feedback}
                                      </p>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Quick Hint Button for Multiple Choice */}
                          {!isStepPassed && isCurrentActive && (
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-purple-700 font-medium">
                                Click on the correct conclusion above to submit.
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRequestHint(step.stepNumber)}
                                className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs border border-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                <span>Hint {(fb?.activeHintLevel || 0) > 0 ? `(${fb?.activeHintLevel}/3)` : ''}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Standard Calculation Step Answer Box with Working */
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <label className="font-extrabold text-xs text-purple-950 flex items-center gap-1.5">
                              <PenTool className="w-3.5 h-3.5 text-purple-700" />
                              <span>Step-by-Step Calculation Answer Box:</span>
                            </label>
                            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>⚠️ Working required (no bare answers)</span>
                            </span>
                          </div>

                          {/* Quick Symbol & Scaffold Bar (for active step) */}
                          {!isStepPassed && isCurrentActive && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wide">Quick Insert:</span>
                              <button
                                type="button"
                                onClick={() => handleInsertScaffoldToStep(step)}
                                className="px-2.5 py-1 rounded-md bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                                title="Insert complete calculation template with symbol description"
                              >
                                <span>📝 Insert Step Template (With Description)</span>
                              </button>
                              {['q² =', 'q = √', 'p = 1 -', '2pq =', 'p² =', '√', '÷', '×', '=', '²'].map((sym) => (
                                <button
                                  key={sym}
                                  type="button"
                                  onClick={() => handleInsertSymbolToStep(step.stepNumber, sym)}
                                  className="px-2 py-0.5 rounded-md bg-purple-100 hover:bg-purple-200 text-purple-900 font-mono font-bold text-xs border border-purple-200 active:scale-95 transition-all"
                                  title={`Insert ${sym}`}
                                >
                                  {sym}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Input or Verified Display */}
                          {isStepPassed ? (
                            <div className="p-3 bg-emerald-100/70 border-2 border-emerald-400 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                                  <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                                  <span>Verified Step Calculation (Description + Working):</span>
                                </span>
                                <span className="px-2.5 py-0.5 bg-emerald-700 text-white text-[11px] font-extrabold rounded-md flex items-center gap-1">
                                  <span>✓ [{step.marks} {step.marks === 1 ? 'mark' : 'marks'}]</span>
                                </span>
                              </div>
                              <div className="font-mono font-bold text-emerald-950 text-sm bg-white/90 p-2.5 rounded-lg border border-emerald-300 leading-relaxed">
                                {formatStepWithDescription(step, userInputs[step.stepNumber])}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  ref={isCurrentActive ? activeInputRef : undefined}
                                  type="text"
                                  value={userInputs[step.stepNumber] || ''}
                                  onChange={(e) => handleInputChange(step.stepNumber, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') checkStep(step);
                                  }}
                                  placeholder={`Format e.g. ${getExampleStepText(step)}`}
                                  className={`flex-1 px-3.5 py-2.5 rounded-xl border font-mono text-xs sm:text-sm focus:ring-2 focus:outline-hidden shadow-2xs transition-colors min-h-[42px] ${
                                    fb?.showIncorrectBanner && !fb.isCorrect && !fb.isBareAnswerWarning
                                      ? 'border-red-500 ring-2 ring-red-200 bg-red-50/50 text-red-950 focus:ring-red-500'
                                      : 'border-purple-300 bg-white text-purple-950 focus:ring-purple-500'
                                  }`}
                                />
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  {fb?.showIncorrectBanner && !fb.isCorrect && !fb.isBareAnswerWarning && (
                                    <span className="px-2.5 py-2 bg-red-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shrink-0 shadow-2xs min-h-[42px]">
                                      <span>✗</span>
                                      <span className="inline">Incorrect</span>
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => checkStep(step)}
                                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
                                  >
                                    <Check className="w-4 h-4" />
                                    <span>Check Step</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRequestHint(step.stepNumber)}
                                    className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold text-xs border border-purple-300 flex items-center justify-center gap-1 min-h-[42px] cursor-pointer"
                                    title="Get progressive hint"
                                  >
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Hint {(fb?.activeHintLevel || 0) > 0 ? `(${fb?.activeHintLevel}/3)` : ''}</span>
                                  </button>
                                </div>
                              </div>
                              <p className="text-[11px] text-purple-800 font-medium leading-normal">
                                Exam Standard Format: State description first, then symbol &amp; substitution structure (e.g. <span className="font-mono font-bold text-purple-950">{getExampleStepText(step)}</span>)
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Warning Banner when Bare Answer is Provided without Steps */}
                    {fb?.isBareAnswerWarning && (
                      <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-xl space-y-2 text-xs text-amber-950 shadow-2xs animate-in fade-in duration-200">
                        <div className="font-black text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Working Required — Final Answers Alone Are Not Allowed!</span>
                        </div>
                        <p className="leading-relaxed font-medium">{fb.feedbackText}</p>
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => handleInsertScaffoldToStep(step)}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs active:scale-95"
                          >
                            <span>📝 Insert Step Template</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Progressive Hint Drawer - Guidance Only */}
                    {(fb?.activeHintLevel || 0) > 0 && !isStepPassed && (
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950 animate-in fade-in duration-150 shadow-2xs">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span>Step Guidance (Hint Level {fb?.activeHintLevel} of 3):</span>
                        </div>
                        {fb?.activeHintLevel >= 1 && <div>• <strong>Level 1 (Concept Guidance):</strong> {step.hint1}</div>}
                        {fb?.activeHintLevel >= 2 && <div>• <strong>Level 2 (Formula Guidance):</strong> {step.hint2}</div>}
                        {fb?.activeHintLevel >= 3 && <div>• <strong>Level 3 (Working Guidance):</strong> {step.hint3}</div>}
                      </div>
                    )}

                    {/* Step Feedback Banner: Correct Step with allocated mark */}
                    {fb?.isCorrect && (
                      <div className="p-3.5 rounded-xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 space-y-1.5 animate-in zoom-in-95 duration-200 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                            ✓
                          </div>
                          <span className="font-black text-emerald-950 text-sm">
                            ✓ Correct Step! Well done! [{step.marks} {step.marks === 1 ? 'mark' : 'marks'}]
                          </span>
                        </div>
                        <div className="text-xs text-emerald-900 pl-8 leading-relaxed font-medium">
                          <strong>Official Mark Scheme:</strong> {step.explanation}
                        </div>
                      </div>
                    )}

                    {/* Incorrect Feedback with Wrong Symbol (✗) - Never reveals the official answer */}
                    {fb?.showIncorrectBanner && !fb.isCorrect && !fb.isBareAnswerWarning && (
                      <div className="p-3.5 rounded-xl bg-red-100 border-2 border-red-400 text-red-950 animate-in zoom-in-95 duration-200 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                            ✗
                          </div>
                          <span className="font-black text-red-950 text-sm">
                            ✗ Incorrect! Please check your answers/steps.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Question Completed Celebration Banner */}
            {isQuestionFinished && (
              <div className="p-5 bg-gradient-to-r from-purple-900 via-purple-800 to-emerald-900 text-white rounded-2xl space-y-3 animate-in zoom-in-95 duration-200 shadow-md">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-base">
                  <Award className="w-6 h-6" />
                  <span>QUESTION COMPLETE! FULL MARKS AWARDED: {currentQuestion.totalMarks}/{currentQuestion.totalMarks}</span>
                </div>
                <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                  {currentQuestion.finalAnswerText}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const nextQ = questions.find(q => !userProgress.completedQuestions.includes(q.id)) || questions[0];
                      handleSelectQuestion(nextQ.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      clearQuestionState(currentQuestion.id);
                      setUserInputs({});
                      setStepFeedback({});
                      setCurrentStepIndex(0);
                      setIsQuestionFinished(false);
                      setDetectorAnswered(false);
                      setDetectorSelectedIdx(null);
                      setShowFullMarkScheme(false);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-purple-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={() => setShowFullMarkScheme(prev => !prev)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-purple-950 text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>✓ UNLOCKED — {showFullMarkScheme ? 'Hide Official Scheme' : 'View Official Mark Scheme & Allocation'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Docked Math Toolbox & Quick Tips */}
        <div className="space-y-4">
          <MathToolbox lastActiveInputRef={activeInputRef} />

          {/* Quick Rules Cheatsheet */}
          <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs space-y-2.5 text-xs text-purple-950">
            <div className="font-bold text-purple-900 border-b border-purple-100 pb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Exam Working Standards</span>
            </div>
            <ul className="space-y-1 text-purple-800 text-[11px] leading-snug list-disc pl-4">
              <li>Always identify homozygous recessive trait <strong>q²</strong> first!</li>
              <li>State the formula: e.g. <span className="font-mono">q² = ...</span> then <span className="font-mono">q = √q²</span>.</li>
              <li>Write units (e.g. <span className="font-mono">... individuals</span> or <span className="font-mono">... flies</span>) when asked for counts.</li>
              <li>If population size &lt;100: 1 d.p.; 100-999: 2 d.p.; &ge;1000: 3 d.p.</li>
            </ul>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
