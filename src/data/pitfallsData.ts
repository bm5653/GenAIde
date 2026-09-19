import { PitfallItem, PitfallPracticeQuestion } from '../types';

export const PITFALLS_DATA: PitfallItem[] = [
  {
    id: 1,
    title: "Starting with the Dominant Trait",
    subtitle: "NEVER begin calculations using dominant phenotype numbers",
    whyItHappens: "Students see dominant numbers (e.g. 1500 brown goats out of 2000) and instinctively try to calculate p² = 1500/2000.",
    howToSpotIt: "The problem mentions a dominant trait, but dominant individuals are a mix of homozygous dominant (p²) AND heterozygous (2pq).",
    howToAvoidIt: "Always identify the RECESSIVE phenotype first! Calculate recessive count = Total - Dominant, then find q² = Recessive / Total.",
    badExample: "Brown is dominant (1500/2000). Student writes: p² = 1500/2000 = 0.75 ❌",
    goodExample: "White is recessive (500/2000). Student writes: q² = 500/2000 = 0.25, then q = √0.25 = 0.5, p = 0.5. ✓",
    miniQuiz: {
      question: "In a population of 1000 sheep, 800 have normal fur (dominant) and 200 have non-uniform fur (recessive). What is your first step?",
      options: [
        { text: "Calculate p² = 800/1000 = 0.80", isCorrect: false, feedback: "Incorrect! Dominant sheep consist of both p² and 2pq. You cannot equate 800/1000 to p²." },
        { text: "Calculate q² = 200/1000 = 0.20", isCorrect: true, feedback: "Correct! Non-uniform fur is recessive, which directly reveals homozygous recessive genotype q²." },
        { text: "Calculate p = √0.80", isCorrect: false, feedback: "Incorrect. You cannot take the square root of dominant phenotype frequency." }
      ]
    }
  },
  {
    id: 2,
    title: "Confusing q with q²",
    subtitle: "q is an ALLELE frequency; q² is a GENOTYPE frequency",
    whyItHappens: "Students forget to take the square root of q² to find q, or accidentally square q when they already have q².",
    howToSpotIt: "If you divide recessive individuals by total population, you have q², NOT q.",
    howToAvoidIt: "Always write the symbol explicitly: First write 'Frequency of homozygous recessive genotype, q² = ...', then on the next line write 'Frequency of recessive allele, q = √q²'.",
    badExample: "q² = 0.36 → Student writes: p = 1 - 0.36 = 0.64 ❌",
    goodExample: "q² = 0.36 → q = √0.36 = 0.6 → p = 1 - 0.6 = 0.4. ✓",
    miniQuiz: {
      question: "If 16% of a population has white fur (recessive), what is the frequency of the recessive allele (q)?",
      options: [
        { text: "0.16", isCorrect: false, feedback: "0.16 is q² (genotype frequency), not q!" },
        { text: "0.40", isCorrect: true, feedback: "Spot on! q = √0.16 = 0.40." },
        { text: "0.84", isCorrect: false, feedback: "0.84 is 1 - 0.16, which erroneously mixes genotype and allele formulas." }
      ]
    }
  },
  {
    id: 3,
    title: "Confusing p with p²",
    subtitle: "p is the dominant allele; p² is homozygous dominant genotype",
    whyItHappens: "Students confuse the frequency of the allele 'A' with the frequency of the genotype 'AA'.",
    howToSpotIt: "Check if the question asks for 'dominant allele frequency' (p) or 'homozygous dominant genotype frequency' (p²).",
    howToAvoidIt: "Highlight the keyword in the question: 'allele' means single letter (p), 'genotype' means double letters (p²).",
    badExample: "Question asks for homozygous dominant genotype frequency. Student leaves answer as p = 0.7 ❌",
    goodExample: "Student squares p: p² = (0.7)² = 0.49. ✓",
    miniQuiz: {
      question: "If the dominant allele frequency p is 0.7, what is the frequency of the homozygous dominant genotype?",
      options: [
        { text: "0.7", isCorrect: false, feedback: "0.7 is the allele frequency p." },
        { text: "0.49", isCorrect: true, feedback: "Correct! p² = (0.7)² = 0.49." },
        { text: "0.3", isCorrect: false, feedback: "0.3 is q = 1 - p." }
      ]
    }
  },
  {
    id: 4,
    title: "Forgetting the Factor of 2 in 2pq",
    subtitle: "Heterozygous frequency is 2 × p × q, NOT p × q",
    whyItHappens: "Students multiply p and q together and forget the multiplier 2 from the binomial expansion (p+q)² = p² + 2pq + q².",
    howToSpotIt: "Heterozygous individuals receive allele A from mom and a from dad, OR a from mom and A from dad (two combinations: Aa and aA).",
    howToAvoidIt: "Always write the formula '2pq = 2(p)(q)' explicitly before substituting numbers.",
    badExample: "p = 0.6, q = 0.4. Student writes: Heterozygous = 0.6 × 0.4 = 0.24 ❌",
    goodExample: "2pq = 2(0.6)(0.4) = 0.48. ✓",
    miniQuiz: {
      question: "If p = 0.8 and q = 0.2, what is the heterozygous genotype frequency?",
      options: [
        { text: "0.16", isCorrect: false, feedback: "0.16 is just p × q; you forgot to multiply by 2!" },
        { text: "0.32", isCorrect: true, feedback: "Correct! 2pq = 2(0.8)(0.2) = 0.32." },
        { text: "0.64", isCorrect: false, feedback: "0.64 is p² = (0.8)²." }
      ]
    }
  },
  {
    id: 5,
    title: "Giving Frequency Instead of Number of Individuals",
    subtitle: "A frequency is a decimal between 0 and 1; a count is an integer count",
    whyItHappens: "Students stop after calculating 2pq or p² and forget to multiply by the total population size N.",
    howToSpotIt: "Read the final question sentence: Does it say 'frequency' or 'how many / number of individuals'?",
    howToAvoidIt: "If the question asks 'how many', you MUST multiply: Number = Frequency × Population Size.",
    badExample: "Question: 'How many wild chickens are heterozygotes in 15,000?' Student answers: 0.48 ❌",
    goodExample: "Number of heterozygotes = 2pq × 15,000 = 0.48 × 15,000 = 7,200 chickens. ✓",
    miniQuiz: {
      question: "In a population of 5000, 2pq = 0.18. How many heterozygous individuals are there?",
      options: [
        { text: "0.18", isCorrect: false, feedback: "0.18 is the frequency, not the number of individuals." },
        { text: "900 individuals", isCorrect: true, feedback: "Correct! 0.18 × 5000 = 900 individuals." },
        { text: "180 individuals", isCorrect: false, feedback: "Math error: 0.18 × 5000 is 900." }
      ]
    }
  },
  {
    id: 6,
    title: "Giving Percentage When Asked for Frequency",
    subtitle: "Or giving frequency when asked for percentage",
    whyItHappens: "Students conflate the two forms: 0.42 is a frequency; 42% is a percentage.",
    howToSpotIt: "Check if the question specifies 'What is the percentage...' or 'What is the frequency...'.",
    howToAvoidIt: "For frequency, keep as decimal (e.g. 0.42). For percentage, multiply by 100 and write '%' (e.g. 42%).",
    badExample: "Question: 'What is the percentage of carriers?' Student answers: 0.42 ❌",
    goodExample: "Percentage of carriers = 2pq × 100% = 0.42 × 100% = 42%. ✓",
    miniQuiz: {
      question: "The question asks: 'What is the percentage of carriers?' If 2pq = 0.0340, what is the answer?",
      options: [
        { text: "0.0340", isCorrect: false, feedback: "This is the frequency, not the percentage." },
        { text: "3.4%", isCorrect: true, feedback: "Correct! 0.0340 × 100% = 3.4%." },
        { text: "34%", isCorrect: false, feedback: "0.0340 × 100 = 3.4, not 34." }
      ]
    }
  },
  {
    id: 7,
    title: "Applying Hardy-Weinberg Blindly After Population Change",
    subtitle: "Immigration, culling, or disaster breaks H-W equilibrium!",
    whyItHappens: "When 1000 brown goats are added or all fair insects are killed, students still try to use p + q = 1 or p² + 2pq + q² = 1.",
    howToSpotIt: "Words like 'all fair insects were killed', 'adds 1000 goats', 'migrated out', 'died from fatal disease'.",
    howToAvoidIt: "STOP! Use the Gene Pool Allele-Counting Method: New Population Size → Remaining Genotypes → Total Alleles (2 × N) → Count Dominant / Recessive Alleles.",
    badExample: "All grey hamsters killed. Student writes: new q² = 0, so p = 1 ❌",
    goodExample: "Count remaining alleles in surviving black hamsters (homozygous dominant + heterozygous) and divide by new total alleles. ✓",
    miniQuiz: {
      question: "If 1000 homozygous dominant cows are added to a herd of 2000 cows, can you use p + q = 1 to find the new allele frequency directly?",
      options: [
        { text: "Yes, because the cows mate randomly.", isCorrect: false, feedback: "No! Adding 1000 individuals is immigration/gene flow, which breaks equilibrium." },
        { text: "No, you must calculate the new gene pool by counting all alleles.", isCorrect: true, feedback: "Spot on! Immigration introduces new alleles, so you must use the gene pool allele-counting method." }
      ]
    }
  },
  {
    id: 8,
    title: "Forgetting That Diploid Organisms Carry 2 Alleles Per Gene",
    subtitle: "Gene pool size = 2 × Total number of individuals",
    whyItHappens: "Students divide by the number of individuals instead of the number of alleles in the gene pool.",
    howToSpotIt: "When calculating allele frequency in a non-H-W population, denominator is 2 × N, NOT N.",
    howToAvoidIt: "Remember: Homozygous (AA or aa) contributes 2 alleles. Heterozygous (Aa) contributes 1 allele. Total alleles = 2 × N.",
    badExample: "Total new individuals = 950. Student writes: New allele frequency = 1000 / 950 ❌ (Gives a frequency > 1!)",
    goodExample: "Total alleles = 950 × 2 = 1900. New allele frequency = 1000 / 1900 = 0.53. ✓",
    miniQuiz: {
      question: "A population has 300 diploid individuals. What is the total number of alleles in the tallness gene pool?",
      options: [
        { text: "300 alleles", isCorrect: false, feedback: "Diploid organisms have 2 alleles for each gene!" },
        { text: "600 alleles", isCorrect: true, feedback: "Correct! 2 × 300 = 600 alleles." },
        { text: "150 alleles", isCorrect: false, feedback: "Incorrect." }
      ]
    }
  },
  {
    id: 9,
    title: "Violating the Decimal-Place Requirements",
    subtitle: "Always follow the question's specification or the official standard rules",
    whyItHappens: "Students round indiscriminately (e.g. rounding 0.0283 to 0.03 when 4 d.p. is required).",
    howToSpotIt: "Does the question state '(All calculations must be in 4 decimal places)'?",
    howToAvoidIt: "If specified, use that exact precision. If not specified: 10-99 (1 d.p.), 100-999 (2 d.p.), 1000+ (3 d.p.).",
    badExample: "Question specifies 4 decimal places. Student writes: q = 0.03 ❌",
    goodExample: "Student writes: q = 0.0283. ✓",
    miniQuiz: {
      question: "A question states: '(All calculation must be in 4 decimal places)'. If q = √0.0008 = 0.028284..., what should you write?",
      options: [
        { text: "0.03", isCorrect: false, feedback: "This is only 2 decimal places and loses accuracy marks." },
        { text: "0.028", isCorrect: false, feedback: "This is 3 decimal places." },
        { text: "0.0283", isCorrect: true, feedback: "Correct! Exactly 4 decimal places." }
      ]
    }
  },
  {
    id: 10,
    title: "Forgetting to Label Symbols and Units",
    subtitle: "Label p, q, p², q², 2pq and include units for counts",
    whyItHappens: "Students write bare calculations like '2 × 0.7 × 0.3 = 0.42' without stating what it represents.",
    howToSpotIt: "Matriculation mark schemes allocate explicit marks for defining symbols and stating the formula name.",
    howToAvoidIt: "Always write: 'Frequency of heterozygous genotype, 2pq = ...' and 'Number of flies = ... flies'.",
    badExample: "4050/5000 = 0.81 ❌ (No symbol, no explanation)",
    goodExample: "Frequency of homozygous recessive genotype, q² = 4050/5000 = 0.810 [1 mark] ✓",
    miniQuiz: {
      question: "In an exam, which format is awarded full marks for calculating recessive allele frequency?",
      options: [
        { text: "√0.81 = 0.90", isCorrect: false, feedback: "Lacks symbol definition and description." },
        { text: "Frequency of recessive allele, q = √0.81 = 0.900", isCorrect: true, feedback: "Correct! Explicitly describes the parameter and symbol with correct precision." }
      ]
    }
  },
  {
    id: 11,
    title: "Using Symbols When Population is NOT in Hardy-Weinberg",
    subtitle: "Rule 1 of Summary Notes: DO NOT USE SYMBOLS if population does not follow H-W",
    whyItHappens: "Students use 'p' and 'q' when analyzing an evolving or directly counted gene pool.",
    howToSpotIt: "In non-H-W gene pool questions (e.g. 70 TT, 20 Tt, 10 tt), the population is not in H-W equilibrium.",
    howToAvoidIt: "Write out in full: 'Frequency of dominant allele = ...' instead of 'p = ...'.",
    badExample: "Population is not in equilibrium. Student writes: p = 0.73 ❌",
    goodExample: "New frequency of dominant allele = 0.73. ✓",
    miniQuiz: {
      question: "If a population does not follow Hardy-Weinberg condition, should you use p and q symbols?",
      options: [
        { text: "Yes, always use p and q.", isCorrect: false, feedback: "According to Matriculation Biology Chapter 5 Rule 1: DO NOT USE SYMBOLS if population does not follow H-W condition." },
        { text: "No, write out the full words (e.g. Frequency of dominant allele).", isCorrect: true, feedback: "Correct! Write full verbal terms when population is not in equilibrium." }
      ]
    }
  },
  {
    id: 12,
    title: "Forgetting to Calculate New Population Size After Removal or Migration",
    subtitle: "The denominator changes when individuals die, are culled, or migrate",
    whyItHappens: "Students divide by the original population size instead of the new total.",
    howToSpotIt: "If 50 died from 200, the new population is 150, NOT 200.",
    howToAvoidIt: "Step 1 of any population change problem: Calculate New N = Original N ± Changed Individuals.",
    badExample: "200 fish, 50 died, 30 survivors recessive. Student writes: q² = 30 / 200 ❌",
    goodExample: "Survivors = 200 - 50 = 150. q² = 30 / 150 = 0.20. ✓",
    miniQuiz: {
      question: "In a population of 600 hamsters, all 216 grey hamsters are killed. What is the new population size?",
      options: [
        { text: "600 hamsters", isCorrect: false, feedback: "216 were killed, so they are no longer part of the population!" },
        { text: "384 hamsters", isCorrect: true, feedback: "Correct! 600 - 216 = 384 hamsters." },
        { text: "216 hamsters", isCorrect: false, feedback: "216 was the number killed." }
      ]
    }
  },
  {
    id: 13,
    title: "Dominant Phenotype is p² + 2pq, NOT Just p²",
    subtitle: "Both homozygous dominant AND heterozygotes show the dominant phenotype",
    whyItHappens: "Students forget that heterozygous individuals carry the dominant allele and therefore express the dominant trait.",
    howToSpotIt: "When asked for the frequency or number of individuals showing the dominant trait.",
    howToAvoidIt: "Dominant phenotype frequency = p² + 2pq = 1 - q².",
    badExample: "Dominant phenotype frequency = p² ❌",
    goodExample: "Dominant phenotype frequency = p² + 2pq (or 1 - q²). ✓",
    miniQuiz: {
      question: "If p² = 0.12 and 2pq = 0.46, what is the frequency of the dominant phenotype?",
      options: [
        { text: "0.12", isCorrect: false, feedback: "0.12 is only homozygous dominant. Heterozygotes also display dominant phenotype!" },
        { text: "0.58", isCorrect: true, feedback: "Correct! 0.12 + 0.46 = 0.58." },
        { text: "0.46", isCorrect: false, feedback: "0.46 is only the heterozygous fraction." }
      ]
    }
  },
  {
    id: 14,
    title: "Premature Rounding During Intermediate Steps",
    subtitle: "Keep unrounded numbers in your calculator until the final answer",
    whyItHappens: "Rounding intermediate values like q or 2pq leads to compounding rounding errors in subsequent steps.",
    howToSpotIt: "Final calculated answer deviates by 1-2% from mark scheme.",
    howToAvoidIt: "Use stored memory in your calculator and only round the final stated answer to the required decimal places.",
    badExample: "q = 0.01265 → rounds to 0.01 → p = 0.99 → huge error in 2pq ❌",
    goodExample: "Keeps full precision in calculator: q = 0.01265, p = 0.98735, 2pq = 0.02498. ✓",
    miniQuiz: {
      question: "When should you round your values during a multi-step Population Genetics calculation?",
      options: [
        { text: "Round to 1 decimal place after every step.", isCorrect: false, feedback: "Premature rounding causes compounding calculation errors." },
        { text: "Maintain full calculator precision and round only at the final reported steps.", isCorrect: true, feedback: "Correct! This ensures maximum accuracy matching examination mark schemes." }
      ]
    }
  },
  {
    id: 15,
    title: "Subtracting Genotype Frequency from Allele Formula",
    subtitle: "p + q = 1 applies ONLY to alleles; p² + 2pq + q² = 1 applies to genotypes",
    whyItHappens: "Students see q² = 0.36 and immediately write p = 1 - 0.36 = 0.64.",
    howToSpotIt: "You cannot mix alleles (p, q) and genotypes (p², q², 2pq) in the same linear sum.",
    howToAvoidIt: "First take the square root to get allele q (q = √0.36 = 0.6), THEN use p = 1 - q.",
    badExample: "q² = 0.36 → p = 1 - 0.36 = 0.64 ❌",
    goodExample: "q² = 0.36 → q = √0.36 = 0.6 → p = 1 - 0.6 = 0.4. ✓",
    miniQuiz: {
      question: "If q² = 0.49, can you calculate p as 1 - 0.49?",
      options: [
        { text: "Yes, because p + q = 1.", isCorrect: false, feedback: "0.49 is q², NOT q! You cannot subtract q² from 1 to find p." },
        { text: "No, you must first take q = √0.49 = 0.7, then p = 1 - 0.7 = 0.3.", isCorrect: true, feedback: "Spot on! You must convert genotype frequency to allele frequency first." }
      ]
    }
  },
  {
    id: 16,
    title: "Assuming Next Generation is in Equilibrium Without Stating Assumptions",
    subtitle: "Exit Ticket & Population change questions require H-W breeding assumption",
    whyItHappens: "When population size changes (e.g. disease survivors, next generation of 1000), students calculate without noting that Hardy-Weinberg conditions must be assumed.",
    howToSpotIt: "Questions that ask for next generation phenotype or genotype frequencies after a mortality or expansion event.",
    howToAvoidIt: "Always state the assumption: 'Assuming the survivor population subsequently breeds under Hardy-Weinberg equilibrium'.",
    badExample: "Blindly computing next generation without recognizing the biological assumption ❌",
    goodExample: "Stating: 'To predict the next generation, we assume the survivors mate randomly under Hardy-Weinberg conditions.' ✓",
    miniQuiz: {
      question: "After 50 individuals die from a fatal disease, can we predict next generation genotype frequencies?",
      options: [
        { text: "Yes, automatically without any assumptions.", isCorrect: false, feedback: "Incorrect. We must explicitly assume that subsequent breeding follows Hardy-Weinberg conditions." },
        { text: "Yes, under the assumption that the survivor population subsequently breeds under Hardy-Weinberg equilibrium.", isCorrect: true, feedback: "Correct! This is the essential biological assumption highlighted in the teacher notes." }
      ]
    }
  }
];

export const PITFALL_PRACTICE_QUESTIONS: PitfallPracticeQuestion[] = [
  {
    id: 1,
    title: "Dominant Phenotype vs Homozygous Dominant Trap",
    scenario: "In a randomly mating population of 2,000 mountain goats in Hardy-Weinberg equilibrium, 1,680 have black horns (dominant phenotype) and 320 have white horns (recessive phenotype).",
    questionText: "A student wants to calculate the frequency of the dominant allele in this population. Which is the correct initial step and dominant allele frequency (p)?",
    trapsCovered: [
      { id: 1, name: "Starting with the Dominant Trait" },
      { id: 13, name: "Dominant Phenotype is p² + 2pq, NOT Just p²" }
    ],
    options: [
      {
        text: "Equate black horns directly to homozygous dominant genotype: p² = 1680/2000 = 0.840, so dominant allele p = √0.840 = 0.917",
        isCorrect: false,
        trapName: "Pitfall #1 & #13: Starting with the Dominant Trait",
        feedback: "Examiner Penalty! Black-horned goats display the dominant phenotype, which consists of BOTH homozygous dominant (p²) AND heterozygous (2pq) individuals. You cannot equate 1680/2000 to p²!"
      },
      {
        text: "Calculate recessive phenotype frequency q² = 320/2000 = 0.160, find q = √0.160 = 0.400, then dominant allele p = 1 - 0.400 = 0.600",
        isCorrect: true,
        feedback: "✓ Correct Step! Well done! [3 marks] White horns represent the homozygous recessive phenotype (q²). Finding q = √0.160 = 0.400 and p = 1 - q = 0.600 follows the official Matriculation standard."
      },
      {
        text: "Equate recessive count directly to allele frequency: q = 320/2000 = 0.160, so dominant allele p = 1 - 0.160 = 0.840",
        isCorrect: false,
        trapName: "Pitfall #2: Confusing q with q²",
        feedback: "Examiner Penalty! 320/2000 = 0.160 is the GENOTYPE frequency (q²), not the allele frequency (q). You forgot to take the square root (√0.160 = 0.400)!"
      },
      {
        text: "Calculate p = 1680/2000 = 0.840 directly as the dominant allele frequency",
        isCorrect: false,
        trapName: "Confusing Phenotype Proportion with Allele Frequency",
        feedback: "Examiner Penalty! 1680/2000 is the proportion of dominant phenotypic individuals (p² + 2pq), not the single allele frequency (p)."
      }
    ],
    modelWorking: [
      {
        stepTitle: "Step 1: Recessive Genotype Frequency",
        working: "Frequency of homozygous recessive genotype, q² = 320 / 2000 = 0.160",
        marks: 1
      },
      {
        stepTitle: "Step 2: Recessive Allele Frequency",
        working: "Frequency of recessive allele, q = √0.160 = 0.400",
        marks: 1
      },
      {
        stepTitle: "Step 3: Dominant Allele Frequency",
        working: "Since p + q = 1, frequency of dominant allele, p = 1 - 0.400 = 0.600",
        marks: 1
      }
    ],
    examinerTips: [
      "Rule of Thumb: ALWAYS look for the recessive trait first! Recessive phenotype is the only one whose genotype is unambiguously known (always homozygous recessive q²).",
      "Writing 'p² = dominant number / total' is the #1 reason students score zero on Matriculation Population Genetics questions."
    ]
  },
  {
    id: 2,
    title: "Immigration / Addition of Dominant Individuals Trap",
    scenario: "A farmer maintains a herd of 2,000 cattle where the recessive white coat frequency is q² = 0.250 (q = 0.500, p = 0.500). The herd consists of 500 homozygous brown (p²), 1,000 heterozygous brown (2pq), and 500 white (q²). The farmer then buys and introduces 1,000 homozygous dominant brown cattle into the herd.",
    questionText: "Calculate the new frequency of the dominant allele in the herd. Which method and calculation strictly adheres to examination requirements?",
    trapsCovered: [
      { id: 7, name: "Applying Hardy-Weinberg Blindly After Population Change" },
      { id: 8, name: "Forgetting That Diploid Organisms Carry 2 Alleles Per Gene" },
      { id: 11, name: "Using Symbols When Population is NOT in Hardy-Weinberg" }
    ],
    options: [
      {
        text: "Since brown cattle were added, new dominant frequency = (500 + 1000) / 3000 = 0.500 using Hardy-Weinberg p + q = 1",
        isCorrect: false,
        trapName: "Pitfall #7 & #8: Applying H-W Formulas and Omitting Diploid 2N Factor",
        feedback: "Examiner Penalty! Adding 1,000 cattle is immigration/gene flow, which breaks Hardy-Weinberg equilibrium. Also, cattle are diploid; you cannot divide individual counts by total cows to get allele frequency."
      },
      {
        text: "Total cattle = 2000 + 1000 = 3000. Total alleles in gene pool = 2 × 3000 = 6000. Dominant alleles = 2(1500) + 1000 = 4000. New dominant allele frequency = 4000 / 6000 = 0.667",
        isCorrect: true,
        feedback: "✓ Correct Step! Well done! [2 marks] Excellent! You recognized that immigration changes the gene pool, correctly counted alleles using the 2N denominator, and avoided using the symbol 'p'."
      },
      {
        text: "Add 1000 to the original p = 0.500, so new p = (1000 + 500) / 2000 = 0.750",
        isCorrect: false,
        trapName: "Pitfall #7 & #12: Mixing Individual Numbers with Frequencies and Old Population Size",
        feedback: "Examiner Penalty! You cannot add integer numbers of individuals directly into allele frequency fractions, and the population is no longer 2,000."
      },
      {
        text: "Calculate dominant alleles as 1,500 and divide by 3,000 cattle to get 0.500",
        isCorrect: false,
        trapName: "Pitfall #8: Forgetting Diploid Organisms Carry 2 Alleles (2N)",
        feedback: "Examiner Penalty! Homozygous dominant individuals carry TWO dominant alleles each (2 × 1500 = 3000), plus heterozygous contribute 1,000 alleles. Denominator must be total alleles (2 × 3000 = 6000)."
      }
    ],
    modelWorking: [
      {
        stepTitle: "Step 1: Total Population & Gene Pool Alleles",
        working: "New total population = 2000 + 1000 = 3000 cattle. Total alleles in gene pool = 2 × 3000 = 6000 alleles.",
        marks: 1
      },
      {
        stepTitle: "Step 2: Dominant Alleles Count",
        working: "Number of new homozygous dominant = 500 + 1000 = 1500; Heterozygous = 1000. Total dominant alleles = 2(1500) + 1000 = 4000 alleles.",
        marks: 1
      },
      {
        stepTitle: "Step 3: New Dominant Allele Frequency",
        working: "New dominant allele frequency = 4000 / 6000 = 0.667 (or 2/3) [Do not use symbol 'p']",
        marks: 1
      }
    ],
    examinerTips: [
      "Rule 1 in Teacher Notes: DO NOT USE SYMBOLS (p, q) if the population does not follow Hardy-Weinberg equilibrium. Write out in full: 'New dominant allele frequency'.",
      "Always remember the gene pool size for a diploid gene is 2 × Total Population (2N)."
    ]
  },
  {
    id: 3,
    title: "Carrier Calculation — 2pq vs Frequency vs Number of Individuals Trap",
    scenario: "In a wild chicken population of 15,000 birds in Hardy-Weinberg equilibrium, 16% of the chickens have short legs, an autosomal recessive trait.",
    questionText: "A question asks: 'How many wild chickens in this population are heterozygotes?' Which calculation and answer is awarded full marks?",
    trapsCovered: [
      { id: 4, name: "Forgetting the Factor of 2 in 2pq" },
      { id: 5, name: "Giving Frequency Instead of Number of Individuals" },
      { id: 2, name: "Confusing q with q²" }
    ],
    options: [
      {
        text: "Recessive allele q = 0.16, dominant p = 0.84. Heterozygotes = 2(0.84)(0.16) × 15000 = 4032 chickens",
        isCorrect: false,
        trapName: "Pitfall #2: Confusing q with q²",
        feedback: "Examiner Penalty! 16% (0.16) is the genotype frequency (q²), NOT the allele frequency (q). You forgot that q = √0.16 = 0.40!"
      },
      {
        text: "q² = 0.16 → q = 0.40, p = 0.60. Heterozygote frequency = 0.60 × 0.40 = 0.24, so answer is 0.24 chickens",
        isCorrect: false,
        trapName: "Pitfall #4 & #5: Forgot Factor of 2 in 2pq and Forgot to Multiply by Population",
        feedback: "Examiner Penalty! Heterozygous frequency is 2pq = 2(0.6)(0.4) = 0.48 (you forgot the factor of 2!), and 0.48 is a frequency, not a number of chickens."
      },
      {
        text: "q² = 0.16 → q = √0.16 = 0.40, p = 1 - 0.40 = 0.60. Frequency of heterozygotes 2pq = 2(0.60)(0.40) = 0.48. Number of heterozygotes = 0.48 × 15,000 = 7,200 chickens",
        isCorrect: true,
        feedback: "✓ Correct Step! Well done! [3 marks] Perfect! You included the factor of 2 in 2pq and correctly multiplied the frequency by the total population (15,000) to find the number of individuals."
      },
      {
        text: "q² = 0.16 → q = 0.40, p = 0.60. Final answer = 2pq = 2(0.60)(0.40) = 0.48",
        isCorrect: false,
        trapName: "Pitfall #5: Giving Frequency Instead of Number of Individuals",
        feedback: "Examiner Penalty! The question specifically asked 'HOW MANY wild chickens...', requiring an integer count (7,200 chickens), not just the decimal frequency 0.48."
      }
    ],
    modelWorking: [
      {
        stepTitle: "Step 1: Recessive Genotype & Allele Frequencies",
        working: "Frequency of homozygous recessive genotype, q² = 16/100 = 0.160; Frequency of recessive allele, q = √0.160 = 0.400",
        marks: 1
      },
      {
        stepTitle: "Step 2: Dominant Allele & Heterozygous Genotype Frequency",
        working: "Frequency of dominant allele, p = 1 - 0.400 = 0.600; Frequency of heterozygous genotype, 2pq = 2(0.600)(0.400) = 0.480",
        marks: 1
      },
      {
        stepTitle: "Step 3: Number of Heterozygous Chickens",
        working: "Number of heterozygotes in population = 2pq × 15,000 = 0.480 × 15,000 = 7,200 chickens",
        marks: 1
      }
    ],
    examinerTips: [
      "Always reread the question prompt: 'Frequency' means a decimal between 0 and 1; 'How many' means an integer count of organisms.",
      "The binomial expansion is (p + q)² = p² + 2pq + q². Heterozygotes have TWO combinations (Aa and aA), so never omit the factor of 2!"
    ]
  },
  {
    id: 4,
    title: "Selective Removal / Disease Culling Mortality Trap",
    scenario: "A wild hamster population of 600 individuals consists of 96 homozygous dominant black hamsters (BB), 288 heterozygous black hamsters (Bb), and 216 homozygous recessive grey hamsters (bb). An outbreak of a viral epidemic suddenly kills ALL 216 grey hamsters.",
    questionText: "What is the new frequency of the recessive allele (b) among the surviving hamsters?",
    trapsCovered: [
      { id: 7, name: "Assuming Recessive Allele is Completely Lost (q = 0)" },
      { id: 12, name: "Forgetting to Calculate New Population Size After Removal" },
      { id: 8, name: "Forgetting That Diploid Organisms Carry 2 Alleles Per Gene" }
    ],
    options: [
      {
        text: "Since all 216 grey hamsters died, the recessive allele is completely eliminated from the population, so new recessive frequency = 0.000",
        isCorrect: false,
        trapName: "Pitfall #7: Recessive Allele Extinction Fallacy",
        feedback: "Examiner Penalty! Even though all homozygous recessive (bb) hamsters died, the recessive allele 'b' remains hidden in the 288 surviving heterozygous black hamsters (Bb)!"
      },
      {
        text: "Divide surviving recessive alleles by original population size: 288 / (2 × 600) = 288 / 1200 = 0.240",
        isCorrect: false,
        trapName: "Pitfall #12: Forgetting to Calculate New Population Size After Removal",
        feedback: "Examiner Penalty! The dead hamsters are no longer in the population! The new population is 600 - 216 = 384, so total alleles is 2 × 384 = 768, NOT 1,200."
      },
      {
        text: "Surviving hamsters = 600 - 216 = 384. Total gene pool alleles = 2 × 384 = 768. Recessive alleles in surviving heterozygotes = 288. New recessive allele frequency = 288 / 768 = 0.375",
        isCorrect: true,
        feedback: "✓ Correct Step! Well done! [3 marks] Masterful! You updated the denominator to 384 survivors (768 total alleles) and recognized that surviving heterozygotes carry 288 recessive alleles."
      },
      {
        text: "Surviving hamsters = 384. Divide heterozygous count by survivor count: 288 / 384 = 0.750",
        isCorrect: false,
        trapName: "Pitfall #8: Confusing Genotype Fraction with Allele Frequency (Omitted 2N)",
        feedback: "Examiner Penalty! 288/384 is the proportion of heterozygous individuals, not the allele frequency. Each diploid hamster carries 2 alleles, so the denominator is 2 × 384 = 768."
      }
    ],
    modelWorking: [
      {
        stepTitle: "Step 1: Surviving Population & New Gene Pool Size",
        working: "Surviving population = 600 - 216 = 384 hamsters. Total alleles in new gene pool = 2 × 384 = 768 alleles.",
        marks: 1
      },
      {
        stepTitle: "Step 2: Remaining Recessive Alleles Count",
        working: "Surviving genotypes: 96 BB (contribute 0 'b' alleles), 288 Bb (contribute 288 × 1 = 288 'b' alleles). Total 'b' alleles = 288.",
        marks: 1
      },
      {
        stepTitle: "Step 3: New Recessive Allele Frequency",
        working: "New frequency of recessive allele = 288 / 768 = 0.375 [Do not use symbol 'q']",
        marks: 1
      }
    ],
    examinerTips: [
      "Whenever mortality, disease, or culling occurs: Step 1 MUST be calculating the NEW population size: New N = Original N - Dead.",
      "Recessive alleles are never eliminated in one generation if heterozygotes survive; they remain protected inside diploid carriers."
    ]
  },
  {
    id: 5,
    title: "Decimal Places Precision & Percentage Format Trap",
    scenario: "One in 3,600 newborns in a population inherits an autosomal recessive metabolic disorder. The examination rubric states explicitly: '(All calculations must be in 4 decimal places. State final carrier rate as a percentage)'.",
    questionText: "Which student solution strictly satisfies the official Matriculation examination rubric?",
    trapsCovered: [
      { id: 9, name: "Violating the Decimal-Place Requirements" },
      { id: 6, name: "Giving Percentage When Asked for Frequency (or vice-versa)" },
      { id: 14, name: "Premature Rounding During Intermediate Steps" }
    ],
    options: [
      {
        text: "q = √0.0003 = 0.02, p = 0.98, 2pq = 2(0.98)(0.02) = 0.0392 = 3.92%",
        isCorrect: false,
        trapName: "Pitfall #9 & #14: Premature Rounding to 2 Decimal Places Instead of Required 4",
        feedback: "Examiner Penalty! Rounding q prematurely to 0.02 (instead of 0.0173) creates a massive 15% error in the final calculation. The rubric explicitly demanded 4 decimal places throughout."
      },
      {
        text: "q² = 1/3600 = 0.0003. Recessive allele q = √0.0003 = 0.0173. Dominant allele p = 1 - 0.0173 = 0.9827. Carrier frequency 2pq = 2(0.9827)(0.0173) = 0.0340. Percentage of carriers = 0.0340 × 100% = 3.40%",
        isCorrect: true,
        feedback: "✓ Correct Step! Well done! [3 marks] Flawless! You adhered to the 4 decimal places requirement at every step, avoided premature rounding, and formatted the final answer with a percentage sign (%)."
      },
      {
        text: "q² = 1/3600 = 0.0003, q = 0.0173, p = 0.9827, 2pq = 0.0340",
        isCorrect: false,
        trapName: "Pitfall #6: Giving Frequency Instead of Percentage",
        feedback: "Examiner Penalty! The question rubric stated: 'State final carrier rate as a percentage'. Leaving it as 0.0340 loses the final answer mark."
      },
      {
        text: "Directly calculate carriers: 2 × (1/3600) × 100% = 0.0556%",
        isCorrect: false,
        trapName: "Pitfall #2 & #15: Multiplied Genotype Frequency Directly Without Finding Alleles",
        feedback: "Examiner Penalty! 1/3600 is q². You cannot plug q² into 2pq without first finding allele frequencies p and q."
      }
    ],
    modelWorking: [
      {
        stepTitle: "Step 1: Homozygous Recessive Genotype Frequency (4 d.p.)",
        working: "Frequency of homozygous recessive genotype, q² = 1 / 3600 = 0.0003",
        marks: 1
      },
      {
        stepTitle: "Step 2: Allele Frequencies q and p (4 d.p.)",
        working: "Frequency of recessive allele, q = √0.0003 = 0.0173; Frequency of dominant allele, p = 1 - 0.0173 = 0.9827",
        marks: 1
      },
      {
        stepTitle: "Step 3: Heterozygous Carrier Frequency & Percentage",
        working: "Frequency of heterozygous genotype, 2pq = 2(0.9827)(0.0173) = 0.0340; Percentage of carriers = 0.0340 × 100% = 3.40% (or 3.4%)",
        marks: 1
      }
    ],
    examinerTips: [
      "When a rubric explicitly specifies decimal places (e.g. 4 d.p.), ANY premature rounding in intermediate steps (like rounding q to 0.02) causes immediate forfeiture of accuracy marks.",
      "Always check if the answer should end with '%' (percentage) or as a decimal between 0 and 1 (frequency)."
    ]
  }
];
