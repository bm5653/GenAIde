// popgenTutorEngine.ts - Socratic Population Genetics Assistive Tutor Engine
// Built strictly for Chapter 5: Population Genetics (Malaysian Matriculation Biology)

import { QUESTIONS_DATA } from '../data/questionsData';
import { ADDITIONAL_QUESTIONS } from '../data/pastYearAdditionalQuestions';
import { HARDY_WEINBERG_CONDITIONS, POPGEN_SYMBOLS, DECIMAL_RULES } from '../data/chapter5Notes';
import { analyzeUploadedWorkingImage, StepEvaluationResult } from './popgenImageAnalyzer';

export type TutorMode = 'homework' | 'exam' | 'check-answer' | 'concept';

export type ExplanationStyle = 'simple' | 'analogy' | 'visual' | 'step-by-step' | 'exam' | 'biological';

/**
 * System Prompt for Chapter 5 Population Genetics Assistive Tutor
 */
export const POPGEN_TUTOR_SYSTEM_PROMPT = `You are an expert Biology tutor for the Malaysian Matriculation College Programme (SB015 Syllabus, Chapter 5: Population Genetics). 

Please act as a supportive AI tutor. Follow these rules:
1. DO NOT give me the final answer directly.
2. Guide me step-by-step using the standard POP GEN Table approach:
   - Step 1: Identify recessive phenotype count & calculate q² = (number of recessive) / (total population).
   - Step 2: Find recessive allele frequency q = √q².
   - Step 3: Find dominant allele frequency p = 1 - q.
   - Step 4: Calculate genotype frequencies (p², 2pq, q²) or number of individuals as requested.
3. Ensure decimal precision matches standard rules:
   - Standard populations: 2 to 3 decimal places.
   - Large populations (> 10,000): up to 4 or 5 decimal places as required.
4. If I make a mistake, gently point out where my working went wrong without solving the remaining steps for me. Ask me guiding questions to try again.`;

export interface TutoringContext {
  activeQuestionNumber?: string;
  questionText?: string;
  conceptInvolved?: string;
  givenData?: {
    recessivePhenotypePercent?: number;
    recessiveIndividuals?: number;
    totalPopulation?: number;
    q2?: number;
    q?: number;
    p?: number;
    p2?: number;
    twoPq?: number;
    hasCullingOrMigration?: boolean;
    cullingCount?: number;
  };
  currentHintLevel: number; // 0: none, 1: think, 2: remember, 3: next-step, 4: show reasoning
  studentAttempts: string[];
  lastEvaluationVerdict?: 'on-track' | 'almost-there' | 'revisit';
  isWorksheetWithMultipleQuestions?: boolean;
  detectedQuestionList?: string[];
}

export interface StructuredSocraticResponse {
  type: 'socratic-guide' | 'hint' | 'check-result' | 'why-explanation' | 'style-explanation' | 'redirect' | 'multi-question-prompt' | 'complete-solution';
  title?: string;
  askingSummary?: string;
  conceptSummary?: string;
  thinkPrompt?: string;
  yourTurnPrompt?: string;
  evaluationVerdict?: 'on-track' | 'almost-there' | 'revisit';
  evaluationDetails?: {
    whatIsCorrect: string;
    whereIssueOccurs?: string;
    conceptToReconsider?: string;
    whatToTryNext: string;
  };
  stepEvaluation?: StepEvaluationResult;
  hintLevel?: number;
  hintContent?: {
    levelName: 'THINK' | 'REMEMBER' | 'NEXT STEP' | 'SHOW THE REASONING';
    prompt: string;
    formulaOrTip?: string;
  };
  completeSolution?: {
    given: string;
    required: string;
    equations: string[];
    substitution: string[];
    calculationSteps: string[];
    finalAnswer: string;
    biologicalMeaning: string;
    keyTakeaway: string;
  };
  whyAnswer?: {
    question: string;
    coreReason: string;
    biologicalExplanation: string;
    commonMisconception: string;
  };
  styleAnswer?: {
    style: ExplanationStyle;
    content: string;
  };
  text: string;
  suggestedActions?: { label: string; actionText: string }[];
}

// Out-of-scope Biology keywords (Non-Chapter 5)
const NON_POPGEN_TOPICS = [
  'photosynthesis', 'respiration', 'calvin cycle', 'krebs cycle', 'glycolysis',
  'mitosis', 'meiosis', 'cell cycle', 'chloroplast', 'mitochondria',
  'enzyme', 'lock and key', 'induced fit', 'active site', 'denature',
  'dna replication', 'transcription', 'translation', 'mrna', 'trna', 'ribosome',
  'circulatory system', 'heart', 'nephron', 'kidney', 'homeostasis',
  'immune system', 'antibody', 'antigen', 'pathogen', 'vaccine',
  'nervous system', 'action potential', 'synapse', 'neuron',
  'hormone', 'insulin', 'glucagon', 'endocrine',
  'plant transport', 'xylem', 'phloem', 'transpiration'
];

/**
 * Check if the query is strictly within Chapter 5 Population Genetics
 */
export function isQueryOutOfScope(query: string): boolean {
  const lower = query.toLowerCase();
  for (const topic of NON_POPGEN_TOPICS) {
    if (lower.includes(topic)) {
      // Check if it's casually mentioned alongside popgen (e.g. "does mutation in dna change allele frequency?")
      if (lower.includes('allele') || lower.includes('frequency') || lower.includes('gene pool') || lower.includes('hardy-weinberg') || lower.includes('population')) {
        return false; // Related to popgen!
      }
      return true; // Strictly out of scope
    }
  }
  return false;
}

/**
 * Generate redirection message for non-PopGen queries
 */
export function getScopeRedirectionMessage(query: string): StructuredSocraticResponse {
  return {
    type: 'redirect',
    title: 'Focus: Chapter 5 Population Genetics',
    text: `I'm your dedicated **Population Genetics Assistive Tutor** for **Chapter 5 (Malaysian Matriculation Biology)**.

I can help you with:
• **Allele, genotype, and phenotype frequencies** (p, q, p², 2pq, q²)
• **Hardy-Weinberg equilibrium** & the 5 conditions
• **Gene pool allele counting** (2 × N) when equilibrium is broken
• **Forces changing allele frequency** (Genetic drift, Founder/Bottleneck effect, Natural selection, Migration, Mutation)
• **Exam-style calculations and step-by-step problem solving**

If your question connects to Population Genetics, please share it here and we will work through the reasoning step-by-step!`,
    suggestedActions: [
      { label: 'Solve Hardy-Weinberg problem', actionText: 'How do I start a Hardy-Weinberg calculation?' },
      { label: 'Check my answer', actionText: 'Check my answer: q² = 0.16, so q = 0.4' },
      { label: 'Why is 2pq multiplied by 2?', actionText: 'WHY is the heterozygous frequency 2pq?' }
    ]
  };
}

/**
 * Common PopGen "WHY?" explanations
 */
export const WHY_EXPLANATIONS: Record<string, { question: string; coreReason: string; biologicalExplanation: string; commonMisconception: string }> = {
  'p-plus-q': {
    question: "WHY is p + q = 1?",
    coreReason: "In a simplified two-allele gene pool, there are only two possible alleles (dominant and recessive). Together, they constitute 100% of all alleles at that locus.",
    biologicalExplanation: "Imagine every allele in the population's gene pool gathered in a jar. If 60% are dominant alleles (A, p = 0.60), then the remaining 40% must be recessive alleles (a, q = 0.40). Since an allele must be either A or a, their sum must equal 1.0 (or 100%).",
    commonMisconception: "Students sometimes assume that because p + q = 1, the population must be in Hardy-Weinberg equilibrium. In reality, p + q = 1 ALWAYS holds true in any two-allele gene pool, whether the population is in equilibrium or not!"
  },
  'two-pq': {
    question: "WHY is the heterozygous frequency 2pq (with a factor of 2)?",
    coreReason: "A heterozygous individual (Aa) can be formed in TWO mutually exclusive ways during random fertilization.",
    biologicalExplanation: "1. Sperm carrying allele A (probability p) fertilizes ovum carrying allele a (probability q) → probability = p × q.\n2. Sperm carrying allele a (probability q) fertilizes ovum carrying allele A (probability p) → probability = q × p.\nAdding both possible parental origins: (p × q) + (q × p) = 2pq.",
    commonMisconception: "Forgetting the factor of 2 and writing pq. Always remember that both maternal and paternal gamete contributions lead to heterozygous offspring."
  },
  'start-recessive': {
    question: "WHY must we always start our calculation with the recessive phenotype (q²)?",
    coreReason: "The recessive phenotype is the ONLY phenotype that corresponds to a single, unambiguous genotype (homozygous recessive, aa).",
    biologicalExplanation: "Individuals showing the dominant phenotype are a mixture of TWO genotypes: homozygous dominant (AA, p²) and heterozygous (Aa, 2pq). Their frequency is p² + 2pq, NOT p²! You cannot take the square root of dominant individuals to get p. In contrast, recessive individuals can only be aa, meaning their frequency is purely q².",
    commonMisconception: "Taking the square root of the dominant percentage to find p. For example, if 84% are black (dominant), p is NOT √0.84!"
  },
  'genetic-drift-small': {
    question: "WHY does genetic drift affect small populations more strongly than large populations?",
    coreReason: "Random sampling error has a proportionally larger impact on small sample sizes than on large ones.",
    biologicalExplanation: "In a population of 10 beetles (20 alleles), if 2 beetles carrying green alleles die by chance under a falling branch, 20% of the entire gene pool is wiped out in an instant. In a population of 10,000 beetles, losing 2 beetles alters allele frequency by only 0.02%, which is negligible.",
    commonMisconception: "Thinking genetic drift is caused by natural selection or adaptation. Drift is purely RANDOM chance, not environmental fitness."
  },
  'non-random-mating': {
    question: "WHY does non-random mating change genotype frequencies without necessarily changing allele frequencies?",
    coreReason: "Non-random mating reshuffles how alleles pair into genotypes (homozygotes vs heterozygotes) without adding or removing alleles from the gene pool.",
    biologicalExplanation: "In self-fertilization or positive assortative mating (like mating with like), heterozygotes (Aa) produce 50% homozygotes (AA and aa) each generation. The proportion of heterozygotes drops, while homozygosity increases. However, the total count of 'A' and 'a' alleles remains unchanged unless selection or mortality occurs.",
    commonMisconception: "Assuming that every violation of the 5 Hardy-Weinberg conditions automatically changes allele frequencies."
  },
  'expansion-preserves-hw': {
    question: "WHY do allele frequencies remain constant when a population grows under Hardy-Weinberg equilibrium?",
    coreReason: "Under Hardy-Weinberg conditions, population growth simply scales up the total number of individuals proportionally without altering the ratio of alleles in the gene pool.",
    biologicalExplanation: "When a population expands (e.g. from 13,000 to 15,000 individuals) under random mating and absent evolutionary forces, every genotype increases in absolute numbers by the exact same proportion. Consequently, the relative proportions p², 2pq, and q² remain unchanged, and allele frequencies p and q stay strictly identical from one generation to the next.",
    commonMisconception: "Thinking that population growth or higher birth numbers will change allele frequencies p and q. Under Hardy-Weinberg equilibrium, allele frequencies remain constant generation after generation regardless of population growth!"
  }
};

/**
 * Formats "Explain It Differently" content based on student's learning style preference
 */
export function getDifferentExplanation(
  topicKey: string, 
  style: ExplanationStyle
): string {
  switch (style) {
    case 'simple':
      if (topicKey.includes('2pq')) {
        return `🧒 **Simple Explanation (The 2-way Handshake):**\nThink of making a heterozygous kid (Aa). You can get 'A' from mom and 'a' from dad, OR 'a' from mom and 'A' from dad. Two different paths lead to the exact same result, so we multiply by 2: **2 × p × q**.`;
      }
      if (topicKey.includes('recessive') || topicKey.includes('q²')) {
        return `🧒 **Simple Explanation (The Hidden Identity):**\nWhen you see someone with brown eyes (dominant), you can't tell if they are pure (AA) or carrying blue (Aa). But when you see blue eyes (recessive), you are 100% sure they are 'aa'. That's why blue eyes gives you q² right away!`;
      }
      return `🧒 **Simple Explanation:**\nIn Population Genetics, we count either **alleles** (individual letters like A and a) or **genotypes** (pairs of letters like AA, Aa, aa). Always verify whether the question is talking about single alleles (p, q) or pairs (p², 2pq, q²).`;

    case 'analogy':
      if (topicKey.includes('2pq')) {
        return `🧠 **Analogy (Tossing Two Coins):**\nImagine tossing two coins. What is the chance of getting one Head (p) and one Tail (q)?\n• Coin 1 = Head, Coin 2 = Tail (probability p × q)\n• Coin 1 = Tail, Coin 2 = Head (probability q × p)\nTotal chance of a mixed pair = pq + qp = 2pq!`;
      }
      if (topicKey.includes('drift')) {
        return `🧠 **Analogy (The Marble Jar):**\nImagine a jar of 1,000 marbles (500 red, 500 blue). If you blindly pick 10 marbles, you might get 8 red and 2 blue purely by luck. But if you blindly pick 500 marbles, you will get very close to 50% red and 50% blue. Small samples experience huge random swings; large samples stay balanced.`;
      }
      return `🧠 **Analogy (The Soup Recipe):**\nThink of the gene pool as a big soup recipe. Alleles are individual spice grains (A and a). When organisms reproduce, they scoop up two grains to form each bowl (AA, Aa, or aa). The proportion of loose grains in the pot is p and q.`;

    case 'visual':
      return `📊 **Visual Punnett Square of Random Fertilization:**\n\`\`\`\n         Female Gamete: p (A)    Female Gamete: q (a)\nMale (A):     p² (AA)                 pq (Aa)\nMale (a):     qp (aA)                 q² (aa)\n\`\`\`\nNotice the two off-diagonal boxes: both are heterozygous (Aa), giving pq + qp = 2pq!`;

    case 'step-by-step':
      return `🔢 **Step-by-Step Calculation Ladder:**\n1. **Find Recessive:** q² = (Recessive Individuals) / (Total N)\n2. **Find Recessive Allele:** q = √q²\n3. **Find Dominant Allele:** p = 1 − q\n4. **Find Heterozygotes (Carriers):** 2pq = 2 × p × q\n5. **Find Count of Individuals:** Multiply frequency by Total Population N.`;

    case 'exam':
      return `📝 **Matriculation Marking Rubric Perspective:**\n• **Step 1:** Writing q² = … [1 mark for formula & substitution]\n• **Step 2:** Calculating q = √q² = … [1 mark]\n• **Step 3:** Showing p = 1 − q = … [1 mark]\n• **Step 4:** Calculating 2pq = 2(p)(q) [1 mark with correct decimal places]\n⚠️ *Examiner Warning:* Stating p² = dominant phenotype gets immediate 0 marks.`;

    case 'biological':
      return `🔬 **Biological Meaning:**\nAllele frequencies reflect the underlying genetic diversity of the gene pool. In diploid populations, sexual reproduction and independent assortment generate genotypic variation while conserving overall allele frequencies across generations, provided no evolutionary mechanisms (selection, drift, gene flow, mutation) intervene.`;
  }
}

/**
 * Diagnostic analysis for typed or submitted student answers
 */
export function checkStudentAnswer(
  studentInput: string, 
  context: TutoringContext
): StructuredSocraticResponse {
  const input = studentInput.toLowerCase();
  
  // 1. Check for equating dominant phenotype to p or p²
  if (input.includes('p = √') || input.includes('p=√') || (input.includes('dominant') && input.includes('√'))) {
    return {
      type: 'check-result',
      title: 'Let\'s Revisit This',
      evaluationVerdict: 'revisit',
      evaluationDetails: {
        whatIsCorrect: "You correctly remembered to take a square root to transition from a genotype frequency to an allele frequency.",
        whereIssueOccurs: "You took the square root of the DOMINANT phenotype frequency to find p.",
        conceptToReconsider: "Individuals showing the dominant phenotype consist of TWO genotypes: homozygous dominant (p²) AND heterozygous (2pq). Their total frequency is p² + 2pq, NOT p².",
        whatToTryNext: "Look for the recessive phenotype frequency (q²) instead. Recessive individuals are pure aa, so you can safely take q = √q²."
      },
      text: `🔴 **LET'S REVISIT THIS**

**What you did well:** You recognized that finding an allele frequency requires taking a square root.
**Where the issue is:** You applied the square root to the dominant trait. In Population Genetics, dominant individuals are a mixture of p² (homozygous) and 2pq (heterozygous).
**What to do next:** Find the recessive phenotype (q²) first, calculate q = √q², and then find p = 1 − q.`
    };
  }

  // 2. Check for missing factor of 2 in 2pq
  if ((input.includes('pq') && !input.includes('2pq') && !input.includes('2*p*q') && !input.includes('2(p)(q)')) ||
      (input.includes('carrier') && input.includes('p*q'))) {
    return {
      type: 'check-result',
      title: 'Almost There!',
      evaluationVerdict: 'almost-there',
      evaluationDetails: {
        whatIsCorrect: "Your values for p and q are accurate, and you correctly multiplied dominant and recessive allele frequencies.",
        whereIssueOccurs: "You wrote p × q instead of 2pq for the heterozygous frequency.",
        conceptToReconsider: "A heterozygous offspring can be formed in TWO ways: maternal A + paternal a, OR maternal a + paternal A. Both events happen with probability pq, making the total frequency 2pq.",
        whatToTryNext: "Multiply your result by 2 to get the complete heterozygous frequency: 2 × p × q."
      },
      text: `🟡 **ALMOST THERE!**

**What you did well:** Your allele frequencies (p and q) and multiplication steps are on target!
**Where the issue is:** You missed the factor of **2** in 2pq.
**Remember:** Heterozygotes can inherit A from the mother and a from the father, OR a from the mother and A from the father.
**Try this:** Multiply your answer by 2: 2 × p × q. What value do you get?`
    };
  }

  // 3. Check for taking square root of dominant phenotype (e.g. p = √dominant)
  if ((input.includes('p = √') || input.includes('p=√') || input.includes('p = sqrt') || input.includes('p=sqrt')) && 
      !input.includes('1 - q') && !input.includes('1-q')) {
    return {
      type: 'check-result',
      title: 'Dominant Phenotype Trap Detected',
      evaluationVerdict: 'revisit',
      evaluationDetails: {
        whatIsCorrect: "You recognized that dominant allele frequency p is needed.",
        whereIssueOccurs: "You attempted to calculate p by taking the square root of dominant individuals.",
        conceptToReconsider: "Dominant individuals consist of TWO genotypes (AA, p² and Aa, 2pq). Their frequency is p² + 2pq, NOT p² alone. You cannot take the square root of dominant phenotype!",
        whatToTryNext: "Start with the homozygous recessive phenotype: q² = recessive count / total population. Then calculate q = √q², and finally p = 1 - q."
      },
      text: `🔴 **LET'S REVISIT THIS (The #1 Matriculation Trap!)**

**Notice:** Dominant individuals are a mixture of **homozygous dominant (p²)** and **heterozygous (2pq)**.
You **CANNOT** take the square root of dominant individuals to find p!
**The Guaranteed 3-Step Strategy:**
1. Calculate recessive genotype frequency: **q² = (recessive individuals) / (total population)**
2. Find recessive allele frequency: **q = √q²**
3. Find dominant allele frequency: **p = 1 - q**`
    };
  }

  // 4. Check for confusing allele frequency with genotype frequency
  if (input.includes('q² = q') || input.includes('p² = p') || input.includes('allele frequency is q²') || input.includes('genotype frequency is q')) {
    return {
      type: 'check-result',
      title: 'Concept Clarification Needed',
      evaluationVerdict: 'revisit',
      evaluationDetails: {
        whatIsCorrect: "You are actively working with the standard Population Genetics symbols.",
        whereIssueOccurs: "Confusing single allele frequency (p, q) with diploid genotype frequency (p², 2pq, q²).",
        conceptToReconsider: "An allele is a single version of a gene carried on one chromosome (p or q). A genotype is a pair of alleles in a diploid individual (p², 2pq, or q²).",
        whatToTryNext: "Make sure you label q as 'Frequency of recessive allele' and q² as 'Frequency of homozygous recessive genotype'."
      },
      text: `🔴 **LET'S REVISIT THIS**

**Crucial Distinction:**
• **Allele frequency:** p and q (frequency of individual alleles in the gene pool).
• **Genotype frequency:** p², 2pq, and q² (proportion of diploid individuals with specific gene pairs).
• q² is NEVER equal to q (unless frequency is 0 or 1).`
    };
  }

  // 5. Positive evaluation if on right track
  if (input.includes('0.') || input.includes('%') || input.includes('√') || input.includes('1 -')) {
    return {
      type: 'check-result',
      title: 'On the Right Track!',
      evaluationVerdict: 'on-track',
      evaluationDetails: {
        whatIsCorrect: "Your reasoning aligns with the POP GEN Table step-by-step approach.",
        whatToTryNext: "Check decimal precision: Standard populations (N < 10,000) require 2 to 3 decimal places; large populations (N ≥ 10,000) require up to 4 or 5 decimal places. What is your next step?"
      },
      text: `🟢 **ON THE RIGHT TRACK!**

Great work! Your step calculation aligns with the standard POP GEN Table approach.
• **Decimal precision rule:**
  - Standard populations (N < 10,000): **2 to 3 decimal places**.
  - Large populations (N ≥ 10,000): **up to 4 or 5 decimal places**.
• **Guiding Question:** What is your next step in the POP GEN Table sequence? (e.g. from q² → q, or from q → p = 1 − q?)`
    };
  }

  return {
    type: 'check-result',
    title: 'Let\'s Examine Your Working',
    evaluationVerdict: 'on-track',
    text: `Let's break down your working using our standard POP GEN Table approach:
1. **Step 1:** What is your recessive phenotype count and calculated q²?
2. **Step 2:** What value did you find for q = √q²?
3. **Step 3:** Have you calculated p = 1 − q?
4. **Step 4:** Which genotype frequency or individual count does the question require?

Tell me which step you are currently calculating, and let's work through it together!`
  };
}

/**
 * Generate Progressive Hint (Hint 1 to 4 or Complete Solution)
 */
export function getProgressiveHint(
  hintLevel: number, 
  context?: TutoringContext
): StructuredSocraticResponse {
  const level = Math.min(Math.max(hintLevel, 1), 5);

  if (level === 1) {
    return {
      type: 'hint',
      hintLevel: 1,
      hintContent: {
        levelName: 'THINK',
        prompt: "Which Hardy-Weinberg term represents the homozygous recessive genotype in the population?",
        formulaOrTip: "Look at the problem: can you identify the recessive phenotype percentage or count?"
      },
      text: `💡 **HINT 1 — THINK (Guiding Question)**

**Ask yourself:**
• Which phenotype in the question is the **recessive trait**?
• Which Hardy-Weinberg mathematical term (p, q, p², 2pq, or q²) represents the homozygous recessive genotype?

*Take a moment: What is the recessive phenotype in your problem?*`
    };
  }

  if (level === 2) {
    return {
      type: 'hint',
      hintLevel: 2,
      hintContent: {
        levelName: 'REMEMBER',
        prompt: "Remember: q² represents the frequency of the homozygous recessive genotype (individuals with genotype aa).",
        formulaOrTip: "q² = (Number of recessive individuals) / (Total population N)"
      },
      text: `💡 **HINT 2 — REMEMBER (Formula Reminder)**

**Key Concept:**
• q² represents the frequency of the **homozygous recessive genotype** (aa).
• Because recessive individuals can ONLY have genotype aa, their phenotype frequency directly equals q²!
• If given as a percentage (e.g. 16%), convert it to a decimal first: 16% = 0.16 = q².`
    };
  }

  if (level === 3) {
    return {
      type: 'hint',
      hintLevel: 3,
      hintContent: {
        levelName: 'NEXT STEP',
        prompt: "You now know q². What mathematical operation can you use to find the recessive allele frequency q?",
        formulaOrTip: "Take the square root: q = √q²"
      },
      text: `💡 **HINT 3 — NEXT STEP (Mathematical Operation)**

**The Operation:**
• You know the value of q².
• To find the allele frequency q, take the **square root**:
  q = √q²
• Once you have q, how will you find p? Remember the golden rule: **p + q = 1**, which means **p = 1 − q**!`
    };
  }

  if (level === 4) {
    return {
      type: 'hint',
      hintLevel: 4,
      hintContent: {
        levelName: 'SHOW THE REASONING',
        prompt: "Detailed reasoning progression through the calculation.",
        formulaOrTip: "Step 1: q² → Step 2: q = √q² → Step 3: p = 1 - q → Step 4: 2pq = 2(p)(q)"
      },
      text: `💡 **HINT 4 — SHOW THE REASONING (Detailed Guidance)**

Here is the complete logical chain:
1. **Recessive Genotype Frequency:** q² = (Recessive Individuals) / (Total Individuals)
2. **Recessive Allele Frequency:** q = √q²
3. **Dominant Allele Frequency:** p = 1 − q
4. **Heterozygous Genotype Frequency:** 2pq = 2 × p × q
5. **Number of Heterozygous Individuals (if asked):** 2pq × Total Population N

*Which specific step are you currently working on?*`
    };
  }

  // Level 5: Complete Solution Reveal
  return getCompleteSolutionResponse(context);
}

/**
 * Generates the Complete Solution when student has attempted hints or explicitly requests it
 */
export function getCompleteSolutionResponse(context?: TutoringContext): StructuredSocraticResponse {
  const qNum = context?.activeQuestionNumber || 'Question 2';
  const allQ = [...QUESTIONS_DATA, ...ADDITIONAL_QUESTIONS];
  const qObj = allQ.find(q => q.number === qNum) || allQ[1]; // default Question 2

  return {
    type: 'complete-solution',
    title: `Complete Solution: ${qObj.number} (${qObj.title})`,
    completeSolution: {
      given: "Total population and recessive phenotype proportion.",
      required: "Allele frequencies (p, q) and heterozygous carriers (2pq).",
      equations: [
        "q² = Recessive phenotype frequency",
        "q = √q²",
        "p = 1 - q",
        "Heterozygous frequency = 2pq"
      ],
      substitution: [
        "q² = 0.36 (from 36% white mice)",
        "q = √0.36 = 0.60",
        "p = 1 - 0.60 = 0.40",
        "2pq = 2(0.40)(0.60) = 0.48"
      ],
      calculationSteps: [
        "1. Identify homozygous recessive genotype: q² = 0.36",
        "2. Calculate recessive allele frequency: q = √0.36 = 0.6",
        "3. Calculate dominant allele frequency: p = 1 - 0.6 = 0.4",
        "4. Calculate heterozygous frequency: 2pq = 2(0.4)(0.6) = 0.48 (48%)"
      ],
      finalAnswer: "Recessive allele frequency (q) = 0.6; Dominant allele frequency (p) = 0.4; Heterozygous carrier frequency = 0.48 (48%).",
      biologicalMeaning: "48% of the mice in this population are normal in appearance but carry the hidden recessive allele for white coat colour.",
      keyTakeaway: "Always start with the recessive trait (q²), never the dominant trait!"
    },
    text: `✅ **COMPLETE SOLUTION & REASONING**

### 1. Given Information
• Recessive phenotype given in problem.
• Population is assumed to be in Hardy-Weinberg equilibrium.

### 2. Relevant Equations
• q² = Frequency of homozygous recessive individuals
• q = √q²
• p = 1 − q
• Frequency of heterozygotes = 2pq

### 3. Substitution & Step-by-Step Calculation
1. **Homozygous recessive genotype frequency (q²):**
   q² = 0.36
2. **Frequency of recessive allele (q):**
   q = √0.36 = 0.60
3. **Frequency of dominant allele (p):**
   p = 1 − q = 1 − 0.60 = 0.40
4. **Frequency of heterozygous genotype (2pq):**
   2pq = 2(0.40)(0.60) = 0.48 (or 48%)

### 4. Biological Interpretation
48% of the population are phenotypically dominant carriers who can pass the hidden recessive allele to subsequent generations.

---
🧠 **REMEMBER:**
Dominant phenotype equals p² + 2pq. You can **ONLY** take the square root of the recessive phenotype (q²) to find an allele frequency!`
  };
}

/**
 * Detects if user uploaded an image with multiple questions (worksheet)
 */
export function detectWorksheetQuestions(queryOrText: string): string[] | null {
  const lower = queryOrText.toLowerCase();
  const hasMultiple = (
    (lower.includes('question 1') && lower.includes('question 2')) ||
    (lower.includes('q1') && lower.includes('q2')) ||
    lower.includes('worksheet') ||
    lower.includes('all questions') ||
    lower.includes('multiple questions')
  );

  if (hasMultiple) {
    return ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'];
  }
  return null;
}

/**
 * Main Socratic Problem-Solving Guiding Response
 */
export function generateQuestionFirstGuidance(
  query: string,
  detectedQuestion?: string
): StructuredSocraticResponse {
  const qLower = query.toLowerCase();

  // Check if multiple questions detected
  const multiQ = detectWorksheetQuestions(query);
  if (multiQ) {
    return {
      type: 'multi-question-prompt',
      title: 'Worksheet Detected',
      text: `I can see multiple Population Genetics questions on your worksheet! 📋

To help you learn effectively, let's work on **one question at a time**. Which question would you like to start with?`,
      suggestedActions: multiQ.map(q => ({ label: q, actionText: `Let's work on ${q}` }))
    };
  }

  // Check for Exam Command Words (Calculate, State, Explain, Describe, Compare)
  let examCommandWord = '';
  if (qLower.startsWith('calculate') || qLower.includes('calculate ')) examCommandWord = 'Calculate';
  else if (qLower.startsWith('state') || qLower.includes('state ')) examCommandWord = 'State';
  else if (qLower.startsWith('explain') || qLower.includes('explain ')) examCommandWord = 'Explain';
  else if (qLower.startsWith('describe') || qLower.includes('describe ')) examCommandWord = 'Describe';
  else if (qLower.startsWith('compare') || qLower.includes('compare ')) examCommandWord = 'Compare';

  // Determine question context
  const allQ = [...QUESTIONS_DATA, ...ADDITIONAL_QUESTIONS];
  let targetQ = allQ.find(q => q.number === detectedQuestion);
  if (!targetQ) {
    targetQ = allQ.find(q => {
      const matchWord = q.title.toLowerCase();
      return (
        (matchWord.includes('hamster') && qLower.includes('hamster')) ||
        (matchWord.includes('pku') && qLower.includes('pku')) ||
        (matchWord.includes('mice') && qLower.includes('mice')) ||
        (matchWord.includes('tay-sachs') && qLower.includes('tay')) ||
        (matchWord.includes('thalassemia') && qLower.includes('thalassemia')) ||
        (matchWord.includes('chicken') && qLower.includes('chicken')) ||
        (matchWord.includes('albinism') && qLower.includes('albinism')) ||
        (matchWord.includes('sheep') && qLower.includes('sheep')) ||
        (matchWord.includes('flower') && qLower.includes('flower'))
      );
    });
  }

  if (targetQ) {
    const isRemoval = targetQ.category === 'removal' || targetQ.category === 'migration' || targetQ.category === 'gene-pool';
    
    if (isRemoval) {
      return {
        type: 'socratic-guide',
        title: `${targetQ.number}: ${targetQ.title}`,
        askingSummary: "This problem involves a change in the population (individuals removed, culled, or migrating).",
        conceptSummary: "Gene Pool Allele Counting (Equilibrium is BROKEN!)",
        thinkPrompt: "When individuals are removed from a population, is the population still in Hardy-Weinberg equilibrium?",
        yourTurnPrompt: "What is the new total population size (N_new) after the change? What is the size of the new gene pool?",
        text: `### 🔎 WHAT IS THE QUESTION ASKING?
The question asks for the allele frequencies after a disturbance (individuals killed, removed, or migrating).

### 🧬 POPULATION GENETICS CONCEPT
**Gene Pool Allele Counting (2 × N)**
⚠️ *Critical Principle:* Because individuals were removed or added, **Hardy-Weinberg equilibrium is BROKEN**. You cannot use q = √q²!

### 💭 THINK ABOUT THIS
What happened to the total population size? How many total alleles are now present in this new diploid population?

### ✏️ YOUR TURN
Calculate:
1. Surviving population size (N_new)
2. Total alleles in the new gene pool (2 × N_new)
What numbers do you get?`,
        suggestedActions: [
          { label: '💡 Hint 1: Think', actionText: 'Give me Hint 1: Think' },
          { label: '❓ WHY is H-W broken?', actionText: 'WHY can\'t we use Hardy-Weinberg formula after individuals are removed?' },
          { label: 'Check my answer', actionText: 'Check my working for this question' }
        ]
      };
    }

    return {
      type: 'socratic-guide',
      title: `${targetQ.number}: ${targetQ.title}`,
      askingSummary: `Let's solve ${targetQ.title} step-by-step using the standard POP GEN Table approach.`,
      conceptSummary: "POP GEN Table Approach (SB015 Syllabus, Chapter 5)",
      thinkPrompt: "Step 1: Identify recessive phenotype count & calculate q² = (number of recessive) / (total population).",
      yourTurnPrompt: "What is your recessive phenotype count, and what decimal value do you get for q²?",
      text: `👋 **Let's solve this step-by-step using our POP GEN Table approach!**

### 📋 STEP-BY-STEP POP GEN TABLE ROADMAP:
1. **Step 1:** Identify recessive phenotype count & calculate q² = (number of recessive) / (total population).
2. **Step 2:** Find recessive allele frequency q = √q².
3. **Step 3:** Find dominant allele frequency p = 1 − q.
4. **Step 4:** Calculate genotype frequencies (p², 2pq, q²) or number of individuals as requested.

📏 **Decimal Precision Reminder:**
• Standard populations (N < 10,000): **2 to 3 decimal places**.
• Large populations (N ≥ 10,000): **up to 4 or 5 decimal places**.

---
### ✏️ STEP 1 (YOUR TURN):
Can you identify the **recessive phenotype** in your question and calculate:
q² = (number of recessive) / (total population)
What value do you get for q²?`,
      suggestedActions: [
        { label: '💡 Hint: Step 1', actionText: 'How do I identify q² for this question?' },
        { label: 'Check my Step 1', actionText: 'Step 1: q² = ' },
        { label: 'Why start with q²?', actionText: 'Why can\'t I start calculation with the dominant trait?' }
      ]
    };
  }

  // Generic PopGen Socratic Response
  return {
    type: 'socratic-guide',
    title: 'POP GEN Table Step-by-Step Guide',
    askingSummary: "Let's guide you through the 4-step POP GEN Table approach for Chapter 5.",
    conceptSummary: "Malaysian Matriculation SB015 - Chapter 5: Population Genetics",
    thinkPrompt: "Step 1: Identify recessive phenotype count & calculate q² = (number of recessive) / (total population).",
    yourTurnPrompt: "What is your population size and number of recessive individuals?",
    text: `👋 **Welcome! Let's solve your question step-by-step using the standard POP GEN Table approach.**

### 📋 THE 4-STEP POP GEN TABLE APPROACH:
1. **Step 1:** Identify recessive phenotype count & calculate q² = (number of recessive) / (total population).
2. **Step 2:** Find recessive allele frequency q = √q².
3. **Step 3:** Find dominant allele frequency p = 1 − q.
4. **Step 4:** Calculate genotype frequencies (p², 2pq, q²) or number of individuals as requested.

📏 **Decimal Precision Guidelines:**
• Standard populations (N < 10,000): **2 to 3 decimal places**.
• Large populations (N ≥ 10,000): **up to 4 or 5 decimal places** as required.

---
### ✏️ STEP 1 (LET'S START HERE):
What numbers or percentages did your question give you? 
Can you identify the **recessive phenotype** and calculate q²? Share your first step!`,
    suggestedActions: [
      { label: '💡 Step 1: Find q²', actionText: 'Give me a hint on Step 1: Find q²' },
      { label: 'Check my q²', actionText: 'Check my Step 1: q² = ' },
      { label: 'Check my answer', actionText: 'Check my answer' }
    ]
  };
}
