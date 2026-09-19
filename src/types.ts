export type TabType = 
  | 'home'
  | 'learn'
  | 'toolbox'
  | 'practice'
  | 'past-year'
  | 'new-population'
  | 'pitfalls'
  | 'exit-ticket'
  | 'ai-help'
  | 'notes'
  | 'progress';

export interface StepItem {
  stepNumber: number;
  title: string;
  instruction: string;
  expectedConcept: string;
  expectedSymbol?: string;
  symbolDescription?: string;
  acceptedAnswers: string[];
  tolerance?: number;
  hint1: string;
  hint2: string;
  hint3: string;
  explanation: string;
  marks?: number;
  inputPrefix?: string;
  inputSuffix?: string;
  isFormulaChoice?: boolean;
  formulaOptions?: { label: string; value: string; isCorrect: boolean; explanation: string }[];
}

export interface QuestionData {
  id: string;
  number?: string;
  title: string;
  source: string;
  category: 
    | 'hardy-weinberg'
    | 'gene-pool'
    | 'allele-frequency'
    | 'genotype-frequency'
    | 'heterozygotes'
    | 'population-change'
    | 'removal'
    | 'migration'
    | 'next-generation'
    | 'structured'
    | 'essay';
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Exam Standard';
  questionText: string;
  contextData?: { [key: string]: string | number };
  targetConcept: string;
  isHardyWeinberg: boolean;
  whyHwOrNonHw: string;
  detectorOptions: { label: string; isCorrect: boolean; feedback: string }[];
  totalMarks: number;
  imageUrl?: string;
  imageCaption?: string;
  steps: StepItem[];
  finalAnswerText: string;
  officialAnswerScheme: string[];
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  topic: string;
  createdAt: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  topic: string;
  mastered: boolean;
}

export interface UserProgress {
  completedQuestions: string[];
  totalScore: number;
  attemptsByQuestion: Record<string, number>;
  masteredPitfalls?: number[];
  questionsAttempted?: string[];
  questionsCompleted?: string[];
  totalStepsCompleted?: number;
  totalHintsUsed?: number;
  mistakesCount?: { [mistakeType: string]: number };
  exitTicketBestScore?: number;
  exitTicketCompleted?: boolean;
  flashcardsReviewed?: number;
  earnedBadges?: string[];
}

export interface PitfallItem {
  id: number;
  title: string;
  subtitle: string;
  whyItHappens: string;
  howToSpotIt: string;
  howToAvoidIt: string;
  badExample: string;
  goodExample: string;
  miniQuiz: {
    question: string;
    options: { text: string; isCorrect: boolean; feedback: string }[];
  };
}

export interface PitfallPracticeQuestion {
  id: number;
  title: string;
  scenario: string;
  questionText: string;
  trapsCovered: { id: number; name: string }[];
  options: {
    text: string;
    isCorrect: boolean;
    trapName?: string;
    feedback: string;
  }[];
  hint?: string;
  modelWorking: {
    stepTitle: string;
    working: string;
    marks: number;
  }[];
  examinerTips: string[];
}
