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
    hint: "Guidance: In Hardy-Weinberg calculations, consider which phenotype corresponds to a single, unambiguous genotype. Does the dominant phenotype represent one genotype or two?",
    modelWorking: [
      {
        stepTitle: "Step 1: Identify Homozygous Recessive Phenotype Frequency (q²)",
        working: "q² = Number of white-horned goats / Total goats = 320 / 2000 = 0.160",
        marks: 1
      },
      {
        stepTitle: "Step 2: Calculate Recessive Allele Frequency (q)",
        working: "q = √q² = √0.160 = 0.400",
        marks: 1
      },
      {
        stepTitle: "Step 3: Calculate Dominant Allele Frequency (p)",
        working: "p = 1 - q = 1 - 0.400 = 0.600",
        marks: 1
      }
    ],
    examinerTips: [
      "Never start calculations using the dominant phenotype number because it masks two distinct genotypes (p² and 2pq).",
      "Always start with the homozygous recessive phenotype because its genotype is unambiguous (q²)."
    ]
  },
  {
    id: 2,
    title: "The Carrier Frequency Multiplier Trap (2pq vs pq)",
    scenario: "In a human population of 10,000 people, the recessive allele frequency for cystic fibrosis is q = 0.020. The dominant normal allele frequency is p = 0.980.",
    questionText: "Calculate the expected number of healthy carrier individuals (heterozygotes) in this population.",
    trapsCovered: [
      { id: 4, name: "Forgetting the '2' in 2pq" },
      { id: 3, name: "Frequency vs Count Confusion" }
    ],
    options: [
      {
        text: "Number of carriers = p × q = 0.980 × 0.020 = 0.0196 individuals",
        isCorrect: false,
        trapName: "Pitfall #4: Forgetting the '2' in 2pq AND Pitfall #3: Confusing Frequency with Count",
        feedback: "Double Examiner Penalty! First, carrier frequency is 2pq, not pq. Second, 0.0196 is a frequency (proportion), not a count of individuals. You must multiply by N = 10,000!"
      },
      {
        text: "Number of carriers = p × q × 10000 = 0.0196 × 10000 = 196 people",
        isCorrect: false,
        trapName: "Pitfall #4: Forgetting the '2' in 2pq",
        feedback: "Examiner Penalty! You calculated pq × N instead of 2pq × N. Heterozygous genotype frequency has a coefficient of 2 because an individual can inherit 'A' from egg and 'a' from sperm, OR 'a' from egg and 'A' from sperm!"
      },
      {
        text: "Number of carriers = 2pq = 2 × 0.980 × 0.020 = 0.0392",
        isCorrect: false,
        trapName: "Pitfall #3: Confusing Frequency with Count",
        feedback: "Examiner Penalty! The question asked for the NUMBER of individuals, but you stopped at the frequency (0.0392 or 3.92%). You must multiply by total population (10,000) to get 392 people."
      },
      {
        text: "Carrier frequency = 2pq = 2(0.980)(0.020) = 0.0392; Number of carriers = 0.0392 × 10,000 = 392 people",
        isCorrect: true,
        feedback: "✓ Correct Step! Excellent! [3 marks] You used the complete term 2pq and converted the genotype frequency into an individual population count."
      }
    ],
    hint: "Guidance: Think about how many ways a heterozygote can be formed from parental gametes (recall the binomial expansion). Also check the wording: does it ask for a proportion or an actual count of people?",
    modelWorking: [
      {
        stepTitle: "Step 1: State Heterozygous Carrier Frequency Formula",
        working: "Carrier frequency = 2pq = 2 × 0.980 × 0.020 = 0.0392",
        marks: 2
      },
      {
        stepTitle: "Step 2: Convert Genotype Frequency to Number of Individuals",
        working: "Number of carriers = 2pq × Total population (N) = 0.0392 × 10,000 = 392 individuals",
        marks: 1
      }
    ],
    examinerTips: [
      "Remember that (p + q)² = p² + 2pq + q². Heterozygotes always appear twice in a Punnett square.",
      "Check the units of the question: 'frequency' means a decimal between 0 and 1; 'number' or 'how many' means an integer count of individuals."
    ]
  },
  {
    id: 3,
    title: "Gene Pool Alleles vs Diploid Individuals Trap",
    scenario: "In a diploid population of 500 fruit flies, red eyes (R) are dominant to sepia eyes (r). The count of alleles in the gene pool is being determined.",
    questionText: "How many total alleles are present in the gene pool of this population, and if there are 100 homozygous dominant (RR), 250 heterozygous (Rr), and 150 homozygous recessive (rr) flies, what is the exact number of 'r' alleles?",
    trapsCovered: [
      { id: 9, name: "Gene Pool Allele Count vs Individual Count (2N vs N)" }
    ],
    options: [
      {
        text: "Total alleles = 500; number of 'r' alleles = 150",
        isCorrect: false,
        trapName: "Pitfall #9: Gene Pool Allele Count vs Individual Count (2N vs N)",
        feedback: "Examiner Penalty! Each fruit fly is diploid and carries TWO alleles. In 500 flies, total alleles = 500 × 2 = 1,000 alleles! Also, heterozygous flies carry one 'r' allele each."
      },
      {
        text: "Total alleles = 1,000; number of 'r' alleles = (2 × 150) + 250 = 550 alleles",
        isCorrect: true,
        feedback: "✓ Correct Step! Spot on! [3 marks] Total gene pool = 2N = 1,000. 'r' alleles = (2 × 150 rr) + (1 × 250 Rr) = 300 + 250 = 550 alleles. Frequency q = 550/1000 = 0.550."
      },
      {
        text: "Total alleles = 1,000; number of 'r' alleles = 150 × 2 = 300 alleles",
        isCorrect: false,
        trapName: "Overlooking Heterozygous Allele Contribution",
        feedback: "Examiner Penalty! You counted the 300 'r' alleles from the 150 homozygous recessive flies, but completely ignored the 250 'r' alleles contributed by the 250 heterozygous flies!"
      },
      {
        text: "Total alleles = 500; number of 'r' alleles = (2 × 150) + 250 = 550 alleles",
        isCorrect: false,
        trapName: "Diploid Population Size Error",
        feedback: "Examiner Penalty! 550 alleles out of 500 total is mathematically impossible. A diploid population of N individuals has 2N total alleles in its gene pool."
      }
    ],
    hint: "Guidance: Remember that organisms in this population are diploid, meaning each individual possesses two alleles. Heterozygotes carry one dominant allele and one recessive allele.",
    modelWorking: [
      {
        stepTitle: "Step 1: Calculate Total Gene Pool Alleles",
        working: "Total gene pool = 2 × N = 2 × 500 = 1,000 alleles",
        marks: 1
      },
      {
        stepTitle: "Step 2: Calculate Total Count of Recessive 'r' Alleles",
        working: "Number of 'r' alleles = (2 × 150 rr) + (1 × 250 Rr) = 300 + 250 = 550 alleles",
        marks: 1
      },
      {
        stepTitle: "Step 3: Calculate Allele Frequency (q)",
        working: "q = 550 / 1000 = 0.550",
        marks: 1
      }
    ],
    examinerTips: [
      "In allele counting problems, diploid organisms have 2 alleles per locus. Total gene pool = 2N.",
      "Heterozygotes contribute 1 dominant allele and 1 recessive allele to the gene pool."
    ]
  },
  {
    id: 4,
    title: "Premature Rounding & Significant Figures Trap",
    scenario: "In a survey of 800 cats, 50 have folded ears (recessive phenotype). A student computes q² = 50/800 = 0.0625.",
    questionText: "Which rounding and calculation strategy complies with Matriculation examination conventions?",
    trapsCovered: [
      { id: 10, name: "Decimal Places & Rounding Violations" }
    ],
    options: [
      {
        text: "Round q² immediately to 1 decimal place: q² ≈ 0.1, so q = √0.1 = 0.316, p = 0.684",
        isCorrect: false,
        trapName: "Pitfall #10: Premature Aggressive Rounding",
        feedback: "Examiner Penalty! Rounding 0.0625 to 0.1 introduces a catastrophic error of over 60%! Keep full precision (0.0625) in your calculator."
      },
      {
        text: "Keep exact intermediate value: q² = 0.0625, then calculate q = √0.0625 = 0.250, then p = 1 - 0.250 = 0.750",
        isCorrect: true,
        feedback: "✓ Correct Step! Perfect! [3 marks] Exact intermediate calculation produces accurate allele frequencies without rounding drift."
      },
      {
        text: "Round q to 0.3, then p = 1 - 0.3 = 0.7, so carrier frequency = 2 × 0.7 × 0.3 = 0.42",
        isCorrect: false,
        trapName: "Premature Rounding of Allele Frequencies",
        feedback: "Examiner Penalty! √0.0625 is exactly 0.25. Forcing it to 0.3 corrupts all subsequent genotype calculations."
      },
      {
        text: "Leave answers as unsimplified fractions: q = √(50/800)",
        isCorrect: false,
        trapName: "Leaving Values in Non-Decimal Exam Format",
        feedback: "Examiner Penalty! Matriculation biology examiners require final allele and genotype frequencies expressed as decimals to 2 or 3 decimal places."
      }
    ],
    hint: "Guidance: Check the exact square root of 0.0625 on your calculator before performing any rounding. In Matriculation exams, never round numbers during intermediate steps.",
    modelWorking: [
      {
        stepTitle: "Step 1: Calculate q² with Exact Decimal",
        working: "q² = 50 / 800 = 0.0625",
        marks: 1
      },
      {
        stepTitle: "Step 2: Calculate q using Exact Square Root",
        working: "q = √0.0625 = 0.250 (3 d.p.)",
        marks: 1
      },
      {
        stepTitle: "Step 3: Calculate Dominant Allele Frequency (p)",
        working: "p = 1 - q = 1 - 0.250 = 0.750 (3 d.p.)",
        marks: 1
      }
    ],
    examinerTips: [
      "Do NOT round during intermediate steps. Store intermediate values in your calculator memory.",
      "Present final frequencies to 2 or 3 decimal places (e.g. 0.250 and 0.750)."
    ]
  },
  {
    id: 5,
    title: "Post-Selection Generation Trap",
    scenario: "A population of beetles has allele frequencies p = 0.600 and q = 0.400. A pesticide spray kills 100% of homozygous recessive beetles (rr) before they reproduce. The surviving beetles breed randomly with no further pesticide exposure.",
    questionText: "Can Hardy-Weinberg equations be immediately applied to the surviving generation before recalculating new allele frequencies?",
    trapsCovered: [
      { id: 14, name: "Lethal Alleles / Post-Selection Recalculation Trap" },
      { id: 16, name: "Missing the Explicit Hardy-Weinberg Assumption" }
    ],
    options: [
      {
        text: "Yes, because the remaining beetles are in equilibrium, so q remains 0.400 in the next generation",
        isCorrect: false,
        trapName: "Pitfall #14: Ignoring Natural Selection Impact on Allele Frequencies",
        feedback: "Examiner Penalty! Killing all 'rr' individuals eliminates many 'r' alleles from the gene pool! Allele frequency q DROPS significantly, so you cannot assume q remains 0.400!"
      },
      {
        text: "No. You must first count the surviving genotypes (p² and 2pq), calculate NEW allele frequencies p' and q' from the surviving gene pool, and state the assumption that subsequent breeding satisfies Hardy-Weinberg conditions.",
        isCorrect: true,
        feedback: "✓ Correct Step! Outstanding exam technique! [4 marks] Severe selection breaks equilibrium. You must recalculate p' and q' based on surviving individuals before predicting subsequent generations."
      },
      {
        text: "Yes, just set q = 0 because all recessive beetles died",
        isCorrect: false,
        trapName: "Overlooking Recessive Alleles Hidden in Heterozygotes",
        feedback: "Examiner Penalty! Heterozygous beetles (2pq) carry the recessive allele and survived the pesticide. The 'r' allele is NOT extinct (q is not 0)!"
      },
      {
        text: "No, Hardy-Weinberg can never again be applied to this population under any circumstance",
        isCorrect: false,
        trapName: "Assuming Evolution is Permanent Disequilibrium",
        feedback: "Examiner Penalty! Once selection ceases and random mating resumes in a large population, Hardy-Weinberg equilibrium is re-established in the following generation with the new allele frequencies."
      }
    ],
    hint: "Guidance: When selection eliminates individuals before they breed, the alleles they carried are lost from the breeding pool. Can you apply the previous generation's frequencies directly, or do you need to recalculate from the survivors?",
    modelWorking: [
      {
        stepTitle: "Step 1: Analyze Survivor Genotypes",
        working: "Survivors consist of RR (p² = 0.36) and Rr (2pq = 0.48). Total survivor frequency = 0.36 + 0.48 = 0.84.",
        marks: 1
      },
      {
        stepTitle: "Step 2: Recalculate New Allele Frequencies in Gene Pool",
        working: "New q' = (1/2 × 0.48) / 0.84 = 0.24 / 0.84 ≈ 0.286; New p' = 1 - 0.286 = 0.714",
        marks: 2
      },
      {
        stepTitle: "Step 3: State Explicit Equilibrium Assumption",
        working: "Assume random mating and no further selection occurs for subsequent generations.",
        marks: 1
      }
    ],
    examinerTips: [
      "Natural selection removes alleles from the gene pool. You must always recalculate allele frequencies using the surviving population.",
      "Recessive lethal alleles persist in populations because they are protected in heterozygous carriers."
    ]
  }
];

