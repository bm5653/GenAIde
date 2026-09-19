// popgenTutorEngine.ts - Socratic Population Genetics Assistive Tutor Engine
// Built strictly for Chapter 5: Population Genetics (Malaysian Matriculation Biology)

import { QUESTIONS_DATA } from '../data/questionsData';
import { ADDITIONAL_QUESTIONS } from '../data/pastYearAdditionalQuestions';
import { HARDY_WEINBERG_CONDITIONS, POPGEN_SYMBOLS, DECIMAL_RULES } from '../data/chapter5Notes';
import { analyzeUploadedWorkingImage, StepEvaluationResult } from './popgenImageAnalyzer';

export type TutorMode = 'homework' | 'exam' | 'check-answer' | 'concept';

export type ExplanationStyle = 'simple' | 'analogy' | 'visual' | 'step-by-step' | 'exam' | 'biological';

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
• **Allele, genotype, and phenotype frequencies** ($p$, $q$, $p^2$, $2pq$, $q^2$)
• **Hardy-Weinberg equilibrium** & the 5 conditions
• **Gene pool allele counting** ($2 \\times N$) when equilibrium is broken
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
  'culling-breaks-hw': {
    question: "WHY can't we use the Hardy-Weinberg formula after individuals are killed or migrate?",
    coreReason: "The Hardy-Weinberg principle assumes an undisturbed, closed gene pool in genetic equilibrium. Culling or migration directly disrupts equilibrium.",
    biologicalExplanation: "When recessive individuals are removed or immigrants arrive, the genotype proportions no longer follow p² + 2pq + q² = 1. Therefore, you CANNOT take the square root of surviving phenotypes! You must count actual surviving alleles in the new gene pool (Total alleles = 2 × N_new).",
    commonMisconception: "Calculating q = √(recessive / N_new) after culling. After culling, q² no longer equals the square of q!"
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
        return `🧒 **Simple Explanation (The Hidden Identity):**\nWhen you see someone with brown eyes (dominant), you can't tell if they are pure (AA) or carrying blue (Aa). But when you see blue eyes (recessive), you are 100% sure they are 'aa'. That's why blue eyes gives you $q^2$ right away!`;
      }
      return `🧒 **Simple Explanation:**\nIn Population Genetics, we count either **alleles** (individual letters like $A$ and $a$) or **genotypes** (pairs of letters like $AA$, $Aa$, $aa$). Always verify whether the question is talking about single alleles ($p, q$) or pairs ($p^2, 2pq, q^2$).`;

    case 'analogy':
      if (topicKey.includes('2pq')) {
        return `🧠 **Analogy (Tossing Two Coins):**\nImagine tossing two coins. What is the chance of getting one Head (p) and one Tail (q)?\n• Coin 1 = Head, Coin 2 = Tail (probability $p \\times q$)\n• Coin 1 = Tail, Coin 2 = Head (probability $q \\times p$)\nTotal chance of a mixed pair = $pq + qp = 2pq$!`;
      }
      if (topicKey.includes('drift')) {
        return `🧠 **Analogy (The Marble Jar):**\nImagine a jar of 1,000 marbles (500 red, 500 blue). If you blindly pick 10 marbles, you might get 8 red and 2 blue purely by luck. But if you blindly pick 500 marbles, you will get very close to 50% red and 50% blue. Small samples experience huge random swings; large samples stay balanced.`;
      }
      return `🧠 **Analogy (The Soup Recipe):**\nThink of the gene pool as a big soup recipe. Alleles are individual spice grains ($A$ and $a$). When organisms reproduce, they scoop up two grains to form each bowl ($AA$, $Aa$, or $aa$). The proportion of loose grains in the pot is $p$ and $q$.`;

    case 'visual':
      return `📊 **Visual Punnett Square of Random Fertilization:**\n\`\`\`\n         Female Gamete: p (A)    Female Gamete: q (a)\nMale (A):     p² (AA)                 pq (Aa)\nMale (a):     qp (aA)                 q² (aa)\n\`\`\`\nNotice the two off-diagonal boxes: both are heterozygous ($Aa$), giving $pq + qp = 2pq$!`;

    case 'step-by-step':
      return `🔢 **Step-by-Step Calculation Ladder:**\n1. **Find Recessive:** $q^2 = \\frac{\\text{Recessive Individuals}}{\\text{Total } N}$\n2. **Find Recessive Allele:** $q = \\sqrt{q^2}$\n3. **Find Dominant Allele:** $p = 1 - q$\n4. **Find Heterozygotes (Carriers):** $2pq = 2 \\times p \\times q$\n5. **Find Count of Individuals:** Multiply frequency by Total Population $N$.`;

    case 'exam':
      return `📝 **Matriculation Marking Rubric Perspective:**\n• **Step 1:** Writing $q^2 = \\dots$ [1 mark for formula & substitution]\n• **Step 2:** Calculating $q = \\dots$ [1 mark]\n• **Step 3:** Showing $p = 1 - q = \\dots$ [1 mark]\n• **Step 4:** Calculating $2pq = 2(p)(q)$ [1 mark with correct decimal places]\n⚠️ *Examiner Warning:* Stating $p^2 = \\text{dominant phenotype}$ gets immediate 0 marks.`;

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
        conceptToReconsider: "Individuals showing the dominant phenotype consist of TWO genotypes: homozygous dominant ($p^2$) AND heterozygous ($2pq$). Their total frequency is $p^2 + 2pq$, NOT $p^2$.",
        whatToTryNext: "Look for the recessive phenotype frequency ($q^2$) instead. Recessive individuals are pure $aa$, so you can safely take $q = \\sqrt{q^2}$."
      },
      text: `🔴 **LET'S REVISIT THIS**

**What you did well:** You recognized that finding an allele frequency requires taking a square root.
**Where the issue is:** You applied the square root to the dominant trait. In Population Genetics, dominant individuals are a mixture of $p^2$ (homozygous) and $2pq$ (heterozygous).
**What to do next:** Find the recessive phenotype ($q^2$) first, calculate $q = \\sqrt{q^2}$, and then find $p = 1 - q$.`
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
        whereIssueOccurs: "You wrote $p \\times q$ instead of $2pq$ for the heterozygous frequency.",
        conceptToReconsider: "A heterozygous offspring can be formed in TWO ways: maternal A + paternal a, OR maternal a + paternal A. Both events happen with probability pq, making the total frequency $2pq$.",
        whatToTryNext: "Multiply your result by 2 to get the complete heterozygous frequency: $2 \\times p \\times q$."
      },
      text: `🟡 **ALMOST THERE!**

**What you did well:** Your allele frequencies ($p$ and $q$) and multiplication steps are on target!
**Where the issue is:** You missed the factor of **2** in $2pq$.
**Remember:** Heterozygotes can inherit $A$ from the mother and $a$ from the father, OR $a$ from the mother and $A$ from the father.
**Try this:** Multiply your answer by 2: $2 \\times p \\times q$. What value do you get?`
    };
  }

  // 3. Check for using Hardy-Weinberg after removal or culling
  if (input.includes('removed') || input.includes('culled') || input.includes('died') || input.includes('migrated')) {
    if (input.includes('q = √') || input.includes('q=√') || input.includes('hw') || input.includes('p² + 2pq')) {
      return {
        type: 'check-result',
        title: 'Major Pitfall Detected',
        evaluationVerdict: 'revisit',
        evaluationDetails: {
          whatIsCorrect: "You recognized that the population size and composition have changed.",
          whereIssueOccurs: "You attempted to use the Hardy-Weinberg formula ($q = \\sqrt{q^2}$) after individuals were removed or added.",
          conceptToReconsider: "When individuals are culled or migrate, Hardy-Weinberg equilibrium is BROKEN. The genotype proportions no longer follow $p^2 + 2pq + q^2 = 1$.",
          whatToTryNext: "Use Gene Pool Allele Counting: (1) Find surviving population $N_{new}$. (2) Gene pool = $2 \\times N_{new}$. (3) Count surviving dominant and recessive alleles directly from surviving genotypes."
        },
        text: `🔴 **LET'S REVISIT THIS (Exam Trap!)**

**Notice:** Once individuals die, are culled, or migrate, **Hardy-Weinberg equilibrium is broken!**
You **CANNOT** use $q = \\sqrt{q^2}$ on surviving individuals.
**Switch to Gene Pool Allele Counting:**
1. Calculate surviving population $N_{new}$.
2. Total alleles in new gene pool = $2 \\times N_{new}$.
3. Count actual surviving alleles: $(2 \\times \\text{Homozygous}) + (1 \\times \\text{Heterozygous})$.
4. Divide by total alleles.`
      };
    }
  }

  // 4. Check for confusing allele frequency with genotype frequency
  if (input.includes('q² = q') || input.includes('p² = p') || input.includes('allele frequency is q²') || input.includes('genotype frequency is q')) {
    return {
      type: 'check-result',
      title: 'Concept Clarification Needed',
      evaluationVerdict: 'revisit',
      evaluationDetails: {
        whatIsCorrect: "You are actively working with the standard Population Genetics symbols.",
        whereIssueOccurs: "Confusing single allele frequency ($p, q$) with diploid genotype frequency ($p^2, 2pq, q^2$).",
        conceptToReconsider: "An allele is a single version of a gene carried on one chromosome ($p$ or $q$). A genotype is a pair of alleles in a diploid individual ($p^2$, $2pq$, or $q^2$).",
        whatToTryNext: "Make sure you label $q$ as 'Frequency of recessive allele' and $q^2$ as 'Frequency of homozygous recessive genotype'."
      },
      text: `🔴 **LET'S REVISIT THIS**

**Crucial Distinction:**
• **Allele frequency:** $p$ and $q$ (frequency of individual alleles in the gene pool).
• **Genotype frequency:** $p^2$, $2pq$, and $q^2$ (proportion of diploid individuals with specific gene pairs).
• $q^2$ is NEVER equal to $q$ (unless frequency is 0 or 1).`
    };
  }

  // 5. Positive evaluation if on right track
  if (input.includes('0.') || input.includes('%') || input.includes('√') || input.includes('1 -')) {
    return {
      type: 'check-result',
      title: 'On the Right Track!',
      evaluationVerdict: 'on-track',
      evaluationDetails: {
        whatIsCorrect: "Your reasoning follows the correct Population Genetics mathematical structure.",
        whatToTryNext: "Check your rounding against Matriculation rules: 1 d.p. for N=10-99; 2 d.p. for N=100-999; 3 d.p. for N>=1000. What does this number tell you biologically about the population?"
      },
      text: `🟢 **ON THE RIGHT TRACK!**

Great work! Your calculation and conceptual sequence are mathematically sound.
• **Biological check:** What does this calculated number represent? Is it an allele frequency in the gene pool, or a proportion of individuals in the population?
• **Rounding check:** Make sure your final answer matches the population size decimal place rule.`
    };
  }

  return {
    type: 'check-result',
    title: 'Let\'s Examine Your Working',
    evaluationVerdict: 'on-track',
    text: `Let's break down your answer step-by-step!
1. Which specific value did you start with? (e.g. recessive phenotype count or percentage?)
2. What formula did you use in your next step?
Tell me what numbers you used and we'll verify each step together.`
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
• Which Hardy-Weinberg mathematical term ($p$, $q$, $p^2$, $2pq$, or $q^2$) represents the homozygous recessive genotype?

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
• $q^2$ represents the frequency of the **homozygous recessive genotype** ($aa$).
• Because recessive individuals can ONLY have genotype $aa$, their phenotype frequency directly equals $q^2$!
• If given as a percentage (e.g. 16%), convert it to a decimal first: $16\\% = 0.16 = q^2$.`
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
• You know the value of $q^2$.
• To find the allele frequency $q$, take the **square root**:
  $$q = \\sqrt{q^2}$$
• Once you have $q$, how will you find $p$? Remember the golden rule: **$p + q = 1$**, which means **$p = 1 - q$**!`
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
1. **Recessive Genotype Frequency:** $q^2 = \\frac{\\text{Recessive Individuals}}{\\text{Total Individuals}}$
2. **Recessive Allele Frequency:** $q = \\sqrt{q^2}$
3. **Dominant Allele Frequency:** $p = 1 - q$
4. **Heterozygous Genotype Frequency:** $2pq = 2 \\times p \\times q$
5. **Number of Heterozygous Individuals (if asked):** $2pq \\times \\text{Total Population } N$

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
• $q^2 = \\text{Frequency of homozygous recessive individuals}$
• $q = \\sqrt{q^2}$
• $p = 1 - q$
• $\\text{Frequency of heterozygotes} = 2pq$

### 3. Substitution & Step-by-Step Calculation
1. **Homozygous recessive genotype frequency ($q^2$):**
   $$q^2 = 0.36$$
2. **Frequency of recessive allele ($q$):**
   $$q = \\sqrt{0.36} = 0.60$$
3. **Frequency of dominant allele ($p$):**
   $$p = 1 - q = 1 - 0.60 = 0.40$$
4. **Frequency of heterozygous genotype ($2pq$):**
   $$2pq = 2(0.40)(0.60) = 0.48 \\text{ (or } 48\\%\\text{)}$$

### 4. Biological Interpretation
48% of the population are phenotypically dominant carriers who can pass the hidden recessive allele to subsequent generations.

---
🧠 **REMEMBER:**
Dominant phenotype equals $p^2 + 2pq$. You can **ONLY** take the square root of the recessive phenotype ($q^2$) to find an allele frequency!`
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
        yourTurnPrompt: "What is the new total population size ($N_{new}$) after the change? What is the size of the new gene pool?",
        text: `### 🔎 WHAT IS THE QUESTION ASKING?
The question asks for the allele frequencies after a disturbance (individuals killed, removed, or migrating).

### 🧬 POPULATION GENETICS CONCEPT
**Gene Pool Allele Counting ($2 \\times N$)**
⚠️ *Critical Principle:* Because individuals were removed or added, **Hardy-Weinberg equilibrium is BROKEN**. You cannot use $q = \\sqrt{q^2}$!

### 💭 THINK ABOUT THIS
What happened to the total population size? How many total alleles are now present in this new diploid population?

### ✏️ YOUR TURN
Calculate:
1. Surviving population size ($N_{new}$)
2. Total alleles in the new gene pool ($2 \\times N_{new}$)
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
      askingSummary: `The question requires calculating allele frequencies and genotype proportions for ${targetQ.title}.`,
      conceptSummary: "Hardy-Weinberg Principle ($p + q = 1$ and $p^2 + 2pq + q^2 = 1$)",
      thinkPrompt: "Which phenotype given in the problem represents the homozygous recessive genotype?",
      yourTurnPrompt: "What is the frequency of the recessive phenotype ($q^2$)? Can you find $q$ by taking its square root?",
      text: `### 🔎 WHAT IS THE QUESTION ASKING?
${examCommandWord ? `**Command word [${examCommandWord}]:** ` : ''}Determine the allele frequencies ($p$ and $q$) and genotype frequencies for this population.

### 🧬 POPULATION GENETICS CONCEPT
**Hardy-Weinberg Equilibrium**
Because this population is in genetic equilibrium, the frequencies of alleles and genotypes follow:
$$p + q = 1 \\quad \\text{and} \\quad p^2 + 2pq + q^2 = 1$$

### 💭 THINK ABOUT THIS
Remember our golden strategy: **Always identify the recessive phenotype first ($q^2$)**.
Why can't you start by taking the square root of the dominant trait?

### ✏️ YOUR TURN
What is the decimal value of the recessive phenotype ($q^2$) in your problem?
Once you have $q^2$, what is $q = \\sqrt{q^2}$? Tell me your first step!`,
      suggestedActions: [
        { label: '💡 Hint 1: Think', actionText: 'Give me Hint 1: Think' },
        { label: '❓ WHY start with recessive?', actionText: 'WHY must we always start our calculation with the recessive phenotype?' },
        { label: 'Check my answer', actionText: 'Check my answer: q² = ...' }
      ]
    };
  }

  // Generic PopGen Socratic Response
  return {
    type: 'socratic-guide',
    title: 'Population Genetics Problem Setup',
    askingSummary: "Let's unpack what your question is asking before calculating.",
    conceptSummary: "Chapter 5: Population Genetics Foundations",
    thinkPrompt: "Is this question asking about an individual allele frequency (p or q) or a genotype frequency (p², 2pq, q²)?",
    yourTurnPrompt: "What data or numbers does the question give you? Which trait is dominant and which is recessive?",
    text: `### 🔎 WHAT IS THE QUESTION ASKING?
Let's clearly identify the goal before jumping into arithmetic!

### 🧬 POPULATION GENETICS CONCEPT
In Chapter 5, we always establish:
1. **The gene pool:** Diploid population where total alleles = $2 \\times N$.
2. **Allele frequencies:** $p$ (dominant) and $q$ (recessive), where $p + q = 1$.
3. **Genotype frequencies:** $p^2$ ($AA$), $2pq$ ($Aa$), and $q^2$ ($aa$).

### 💭 THINK ABOUT THIS
• What numbers or percentages are given in the problem?
• Which trait is **recessive**?

### ✏️ YOUR TURN
What is the first step you think we should take? (Hint: Can you find $q^2$?)`,
    suggestedActions: [
      { label: '💡 Hint 1: Think', actionText: 'Give me Hint 1: Think' },
      { label: '💡 Hint 2: Remember', actionText: 'Give me Hint 2: Remember formula' },
      { label: 'Check my answer', actionText: 'Check my answer' }
    ]
  };
}
