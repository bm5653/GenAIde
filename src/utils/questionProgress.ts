export interface SavedStepFeedback {
  isCorrect?: boolean;
  isBareWarning?: boolean;
  feedbackText?: string;
  showExplanation?: boolean;
  attempts?: number;
  activeHintLevel?: number;
  showIncorrectBanner?: boolean;
}

export interface SavedQuestionState {
  userInputs: Record<number, string>;
  stepFeedback: Record<number, SavedStepFeedback>;
  currentStepIndex: number;
  isQuestionFinished: boolean;
  detectorAnswered?: boolean;
  detectorSelectedIdx?: number | null;
  lastUpdated?: number;
}

const STORAGE_KEY = 'genaide_saved_question_answers_v1';

export const getSavedQuestionState = (qId: string): SavedQuestionState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed[qId]) {
        return {
          userInputs: parsed[qId].userInputs || {},
          stepFeedback: parsed[qId].stepFeedback || {},
          currentStepIndex: typeof parsed[qId].currentStepIndex === 'number' ? parsed[qId].currentStepIndex : 0,
          isQuestionFinished: !!parsed[qId].isQuestionFinished,
          detectorAnswered: !!parsed[qId].detectorAnswered,
          detectorSelectedIdx: parsed[qId].detectorSelectedIdx ?? null,
          lastUpdated: parsed[qId].lastUpdated
        };
      }
    }
  } catch (e) {
    console.warn('Failed to load question state from storage', e);
  }

  return {
    userInputs: {},
    stepFeedback: {},
    currentStepIndex: 0,
    isQuestionFinished: false,
    detectorAnswered: false,
    detectorSelectedIdx: null
  };
};

export const saveQuestionState = (qId: string, data: Partial<SavedQuestionState>): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const existing = store[qId] || {
      userInputs: {},
      stepFeedback: {},
      currentStepIndex: 0,
      isQuestionFinished: false,
      detectorAnswered: false,
      detectorSelectedIdx: null
    };

    store[qId] = {
      ...existing,
      ...data,
      userInputs: { ...existing.userInputs, ...(data.userInputs || {}) },
      stepFeedback: { ...existing.stepFeedback, ...(data.stepFeedback || {}) },
      lastUpdated: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));

    // Also update global completed list if question is finished
    if (data.isQuestionFinished) {
      try {
        const savedProgress = localStorage.getItem('genaide_user_progress_v1');
        let parsed = savedProgress ? JSON.parse(savedProgress) : { completedQuestions: [] };
        if (!parsed.completedQuestions) parsed.completedQuestions = [];
        if (!parsed.completedQuestions.includes(qId)) {
          parsed.completedQuestions.push(qId);
          localStorage.setItem('genaide_user_progress_v1', JSON.stringify(parsed));
        }
      } catch {}
    }

    // Dispatch event for live UI reactivity across views
    window.dispatchEvent(new CustomEvent('genaide_question_progress_updated', { detail: { qId } }));
  } catch (e) {
    console.warn('Failed to save question state to storage', e);
  }
};

export const clearQuestionState = (qId: string): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const store = JSON.parse(raw);
      delete store[qId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      window.dispatchEvent(new CustomEvent('genaide_question_progress_updated', { detail: { qId } }));
    }
  } catch (e) {
    console.warn('Failed to clear question state', e);
  }
};
