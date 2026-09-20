import { QuestionData } from '../types';

export const ADDITIONAL_QUESTIONS: QuestionData[] = [
  {
    id: "q6",
    number: "Question 6",
    title: "Albinism in Babies (14%) & Dimples in 1200 Students",
    source: "Past Year Question 2",
    category: "heterozygotes",
    difficulty: "Intermediate",
    questionText: "(b) In a population, 14% of the babies were born albino. Albinism is a recessive trait. Calculate the frequency of:\ni. Recessive allele [1 mark]\nii. Dominant allele [1 mark]\n\n(c) In a population of 1200 students in a college, only 200 students have a dimple. Having dimples is a dominant trait. Assuming the population is in genetic equilibrium:\ni. Calculate the allele frequency for dimples. [2 marks]\nii. Determine the number of students who are heterozygous for this trait. [2 marks]\niii. If two heterozygous individuals for this trait get married, what is the genotype frequency of their child who is homozygous dominant? [2 marks]",
    targetConcept: "Recognizing dominant vs recessive traits, solving dimple dominant trait via non-dimpled recessive individuals, and punnett square / genotype frequency",
    isHardyWeinberg: true,
    whyHwOrNonHw: "Explicitly states 'Assuming the population is in genetic equilibrium'.",
    detectorOptions: [
      { label: "Allele frequency for dimples (p) and number of heterozygous students (2pq × 1200)", isCorrect: true, feedback: "Correct! Notice that 200 have dimples (dominant), so 1000 do NOT have dimples (recessive q² = 1000/1200)." },
      { label: "Start calculation with q² = 200/1200", isCorrect: false, feedback: "CRITICAL PITFALL! Having dimples is dominant. You CANNOT set q² = 200/1200. Non-dimpled students are recessive: 1200 - 200 = 1000!" }
    ],
    totalMarks: 8,
    steps: [
      {
        stepNumber: 1,
        title: "Albinism: Recessive Allele Frequency",
        instruction: "14% born albino (q² = 14/100 = 0.14). Calculate q = √0.14.",
        expectedConcept: "q = √0.14 = 0.37",
        expectedSymbol: "q",
        acceptedAnswers: ["0.37", ".37"],
        tolerance: 0.01,
        hint1: "q = √0.14",
        hint2: "√0.14 ≈ 0.374 → 0.37",
        hint3: "0.37",
        explanation: "q² = 0.14, so q = √0.14 = 0.37 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 2,
        title: "Albinism: Dominant Allele Frequency",
        instruction: "p = 1 - 0.37.",
        expectedConcept: "p = 1 - 0.37 = 0.63",
        expectedSymbol: "p",
        acceptedAnswers: ["0.63", ".63"],
        tolerance: 0.01,
        hint1: "1 - 0.37 = 0.63",
        hint2: "0.63",
        hint3: "0.63",
        explanation: "p = 1 - 0.37 = 0.63 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 3,
        title: "Dimples: Identify Non-Dimple (Recessive) Count",
        instruction: "1200 students, 200 have dimples (dominant). How many students do NOT have dimples (recessive)?",
        expectedConcept: "Non-dimpled students = 1200 - 200 = 1000",
        acceptedAnswers: ["1000", "1,000"],
        tolerance: 0,
        hint1: "1200 - 200",
        hint2: "1000",
        hint3: "1000",
        explanation: "Non-dimpled (recessive) students = 1200 - 200 = 1000. q² = 1000/1200 = 0.833 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Dimples: Recessive (q) and Dominant (p) Allele Frequencies",
        instruction: "q² = 1000/1200 = 0.833. Calculate q = √0.833 = 0.913, then p = 1 - 0.913.",
        expectedConcept: "p = 1 - 0.913 = 0.087",
        expectedSymbol: "p",
        acceptedAnswers: ["0.087", ".087"],
        tolerance: 0.005,
        hint1: "q = √0.833 = 0.913. p = 1 - 0.913 = 0.087.",
        hint2: "0.087",
        hint3: "0.087",
        explanation: "q = √0.833 = 0.913. Allele frequency for dimples (dominant) p = 1 - 0.913 = 0.087 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 5,
        title: "Dimples: Number of Heterozygous Students",
        instruction: "Calculate 2pq = 2(0.087)(0.913) = 0.159. Number of students = 0.159 × 1200.",
        expectedConcept: "2pq × 1200 = 191 students",
        acceptedAnswers: ["191", "190.8", "191 students"],
        tolerance: 1,
        hint1: "0.159 × 1200 = 190.8",
        hint2: "Rounds to 191 students.",
        hint3: "191",
        explanation: "2pq = 2(0.087)(0.913) = 0.159. Heterozygous students = 0.159 × 1200 ≈ 191 students [2 marks]",
        marks: 2
      },
      {
        stepNumber: 6,
        title: "Dimples: Child of Two Heterozygotes",
        instruction: "If two heterozygous individuals get married, what is the genotype frequency of their child who is homozygous dominant?",
        expectedConcept: "p² = (0.087)² = 0.008 or 1/4 (0.25)",
        acceptedAnswers: ["0.008", ".008", "0.25", "1/4"],
        tolerance: 0.002,
        hint1: "The official answer scheme gives p² = (0.087)² = 0.008.",
        hint2: "(0.087)² = 0.007569 ≈ 0.008.",
        hint3: "0.008",
        explanation: "Frequency of homozygous dominant genotype, p² = (0.087)² = 0.008 [2 marks]",
        marks: 2
      }
    ],
    finalAnswerText: "Albinism: q = 0.37, p = 0.63. Dimples: dominant allele p = 0.087, recessive allele q = 0.913. Heterozygous students = 191.",
    officialAnswerScheme: [
      "q² = 14/100 = 0.14. Recessive allele q = √0.14 = 0.37 [1 mark]",
      "Dominant allele p = 1 - 0.37 = 0.63 [1 mark]",
      "Frequency of homozygous recessive genotype q² = 1000/1200 = 0.833 [1 mark]",
      "q = √0.833 = 0.913. Dominant allele p = 1 - 0.913 = 0.087 [1 mark]",
      "2pq = 2(0.087)(0.913) = 0.159. Number of students = 0.159 × 1200 = 190.8 ≈ 191 students [2 marks]",
      "Genotype frequency of child homozygous dominant = p² = (0.087)² = 0.008 [2 marks]"
    ]
  },
  {
    id: "q7",
    number: "Question 7",
    title: "Small Mammal Fur Colour Allele Counting (60 Yellow, 1440 Black)",
    source: "Past Year Question 3",
    category: "gene-pool",
    difficulty: "Foundation",
    questionText: "Fur colour for a small mammal is controlled by a pair of alleles, B for black and b for yellow. 60 individuals have yellow fur and 1440 individuals have black fur, of which 960 are pure-breeding (homozygous).\n\n(a) State the Hardy-Weinberg Law. [1 mark]\n(b) Calculate the total number of B and b alleles in the population. [2 marks]\n(c) If sexual reproduction occurs at random, calculate the frequency for the phenotype with yellow fur in the next generation. [2 marks]",
    targetConcept: "Allele counting in diploid organisms: BB contributes 2 B, Bb contributes 1 B and 1 b, bb contributes 2 b",
    isHardyWeinberg: true,
    whyHwOrNonHw: "Testing allele counting in diploid gene pool and random reproduction.",
    detectorOptions: [
      { label: "Total number of B and b alleles (Allele counting) & yellow fur phenotype frequency in next generation", isCorrect: true, feedback: "Spot on! Each diploid individual has 2 alleles. Pure-breeding black is BB (960), heterozygous black is Bb (1440 - 960 = 480), yellow is bb (60)." },
      { label: "Calculate only q²", isCorrect: false, feedback: "Part (b) specifically asks for total count of B and b alleles." }
    ],
    totalMarks: 5,
    steps: [
      {
        stepNumber: 1,
        title: "Break Down Genotypes",
        instruction: "Yellow (bb) = 60, Pure-breeding black (BB) = 960. Heterozygous black (Bb) = 1440 - 960. Calculate heterozygous black count.",
        expectedConcept: "Heterozygous black = 1440 - 960 = 480",
        acceptedAnswers: ["480", "480 individuals"],
        tolerance: 0,
        hint1: "1440 - 960",
        hint2: "480",
        hint3: "480",
        explanation: "Number of heterozygous genotype individuals = 1440 - 960 = 480 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 2,
        title: "Total Number of B Alleles",
        instruction: "Each BB individual carries 2 B alleles. Each Bb carries 1 B allele. Calculate total B alleles = (960 × 2) + 480.",
        expectedConcept: "Total B alleles = (960 × 2) + 480 = 2400 alleles",
        acceptedAnswers: ["2400", "2,400", "2400 alleles"],
        tolerance: 0,
        hint1: "960 × 2 = 1920. 1920 + 480 = 2400.",
        hint2: "2400",
        hint3: "2400",
        explanation: "Total number of B alleles = (960 × 2) + 480 = 2400 alleles [1 mark]",
        marks: 1
      },
      {
        stepNumber: 3,
        title: "Total Number of b Alleles",
        instruction: "Each bb carries 2 b alleles (60 × 2 = 120). Each Bb carries 1 b allele (480). Calculate total b alleles = (60 × 2) + 480.",
        expectedConcept: "Total b alleles = (60 × 2) + 480 = 600 alleles",
        acceptedAnswers: ["600", "600 alleles"],
        tolerance: 0,
        hint1: "120 + 480 = 600.",
        hint2: "600",
        hint3: "600",
        explanation: "Total number of b alleles = (60 × 2) + 480 = 600 alleles [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Frequency of Yellow Fur Phenotype in Next Generation",
        instruction: "Total individuals = 60 + 1440 = 1500. Yellow fur phenotype frequency q² = 60 / 1500.",
        expectedConcept: "q² = 60 / 1500 = 0.040",
        acceptedAnswers: ["0.04", "0.040", ".04"],
        tolerance: 0.005,
        hint1: "60 ÷ 1500",
        hint2: "0.04",
        hint3: "0.040",
        explanation: "Frequency of yellow fur phenotype, q² = 60/1500 = 0.040 @ 0.04 [2 marks]",
        marks: 2
      }
    ],
    finalAnswerText: "Total B alleles = 2400; Total b alleles = 600. Frequency of yellow fur phenotype in next generation = 0.040.",
    officialAnswerScheme: [
      "Hardy-Weinberg Principle states that frequencies of alleles and genotypes remain constant from generation to generation [1 mark]",
      "Number of homozygous recessive = 60; homozygous dominant = 960; heterozygous = 1440 - 960 = 480 [1 mark]",
      "Total number of B alleles = (960 × 2) + 480 = 2400 alleles [1 mark]",
      "Total number of b alleles = (60 × 2) + 480 = 600 alleles [1 mark]",
      "Frequency of yellow fur phenotype, q² = 60/1500 = 0.040 @ 0.04 [2 marks]"
    ]
  }
];
