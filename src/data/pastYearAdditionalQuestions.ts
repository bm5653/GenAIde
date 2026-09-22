import { QuestionData } from '../types';

export const ADDITIONAL_QUESTIONS: QuestionData[] = [
  {
    id: "q6",
    number: "Question 6",
    title: "Albinism in Babies (14%) & Dimples in 1200 Students",
    source: "PSPM 2023/2024 Question 2",
    sourceType: "PSPM",
    topic: "Allele Frequency",
    pathwayType: "multi-step-calculation",
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
        instruction: "14% of babies are born albino (recessive trait). Calculate the frequency of the recessive allele (q).",
        expectedConcept: "Frequency of recessive allele, q",
        expectedSymbol: "q",
        symbolDescription: "Frequency of recessive allele (albinism)",
        acceptedAnswers: ["0.37", ".37", "0.374"],
        tolerance: 0.01,
        hint1: "Albinism is recessive, so 14% represents the homozygous recessive genotype frequency (q² = 0.14).",
        hint2: "Use the formula: q = √(q²).",
        hint3: "Take the square root of the decimal frequency 0.14.",
        hint4: "Round your answer to 2 decimal places.",
        explanation: "q² = 0.14, so frequency of recessive allele, q = √0.14 = 0.37 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 2,
        title: "Albinism: Dominant Allele Frequency",
        instruction: "Calculate the frequency of the dominant allele (p) for normal pigmentation.",
        expectedConcept: "Frequency of dominant allele, p",
        expectedSymbol: "p",
        symbolDescription: "Frequency of dominant allele (normal pigmentation)",
        acceptedAnswers: ["0.63", ".63"],
        tolerance: 0.01,
        hint1: "Recall that the sum of dominant and recessive allele frequencies equals 1.",
        hint2: "Use the formula: p = 1 - q.",
        hint3: "Subtract your calculated value of q from 1.",
        hint4: "Verify that p + q = 1.00.",
        explanation: "Since p + q = 1, frequency of dominant allele, p = 1 - 0.37 = 0.63 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 3,
        title: "Dimples: Identify Non-Dimple (Recessive) Count",
        instruction: "In a college of 1200 students, 200 have dimples (dominant trait). Determine the number of students who do NOT have dimples (recessive phenotype).",
        expectedConcept: "Number of students without dimples",
        symbolDescription: "Number of non-dimpled (recessive) students",
        acceptedAnswers: ["1000", "1,000", "1000 students"],
        tolerance: 0,
        hint1: "Having dimples is the dominant phenotype (including homozygous dominant and heterozygous individuals).",
        hint2: "Students without dimples represent the homozygous recessive phenotype.",
        hint3: "Subtract the number of students with dimples from the total population of 1200.",
        hint4: "State the remaining count as the number of non-dimpled students.",
        explanation: "Non-dimpled (recessive) students = 1200 - 200 = 1000 students. q² = 1000/1200 = 0.833 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Dimples: Calculate Recessive Allele Frequency (q)",
        instruction: "Using q² = 1000 / 1200 = 0.833, calculate the frequency of the recessive allele (q) for non-dimples.",
        expectedConcept: "Frequency of recessive allele, q",
        expectedSymbol: "q",
        symbolDescription: "Frequency of recessive allele (no dimples)",
        acceptedAnswers: ["0.913", ".913", "0.91"],
        tolerance: 0.005,
        hint1: "Recall that the recessive allele frequency (q) is calculated from the square root of q².",
        hint2: "Apply the formula: q = √(q²).",
        hint3: "Take the square root of 1000/1200 (or 0.833).",
        hint4: "Round your answer to 3 decimal places.",
        explanation: "Frequency of recessive allele, q = √0.833 = 0.913 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 5,
        title: "Dimples: Calculate Dominant Allele Frequency (p)",
        instruction: "Calculate the allele frequency for dimples (dominant allele, p) using p = 1 - q.",
        expectedConcept: "Frequency of dominant allele, p",
        expectedSymbol: "p",
        symbolDescription: "Frequency of dominant allele (dimples)",
        acceptedAnswers: ["0.087", ".087", "0.09"],
        tolerance: 0.005,
        hint1: "Use the allele frequency relationship: p + q = 1.",
        hint2: "Rearrange the equation: p = 1 - q.",
        hint3: "Subtract your calculated value of q from 1.",
        hint4: "Round the result to 3 decimal places.",
        explanation: "Allele frequency for dimples (dominant allele), p = 1 - 0.913 = 0.087 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 6,
        title: "Dimples: Number of Heterozygous Students",
        instruction: "Determine the expected number of students who are heterozygous for dimples in the college of 1200 students.",
        expectedConcept: "Number of heterozygous students = 2pq × 1200",
        symbolDescription: "Number of heterozygous students",
        acceptedAnswers: ["191", "190.8", "191 students"],
        tolerance: 1,
        hint1: "Heterozygous individuals correspond to the 2pq term in the Hardy-Weinberg equation.",
        hint2: "First calculate the heterozygous frequency using 2pq = 2 × p × q.",
        hint3: "Multiply the calculated 2pq frequency by the total student population (1200).",
        hint4: "Round to the nearest whole number of students.",
        explanation: "2pq = 2(0.087)(0.913) = 0.159. Number of heterozygous students = 0.159 × 1200 = 190.8 ≈ 191 students [2 marks]",
        marks: 2
      },
      {
        stepNumber: 7,
        title: "Dimples: Child of Two Heterozygotes",
        instruction: "If two heterozygous individuals for this trait get married, calculate the genotype frequency of their child who is homozygous dominant.",
        expectedConcept: "Frequency of homozygous dominant genotype, p²",
        expectedSymbol: "p²",
        symbolDescription: "Genotype frequency of homozygous dominant child",
        acceptedAnswers: ["0.008", ".008", "0.0076", "0.25", "1/4"],
        tolerance: 0.002,
        hint1: "Recall that homozygous dominant genotype frequency in the population model is represented by p².",
        hint2: "Use the formula: p² = (p)².",
        hint3: "Square the dominant allele frequency (p = 0.087) calculated earlier.",
        hint4: "Round your answer to 3 decimal places.",
        explanation: "Frequency of homozygous dominant genotype, p² = (0.087)² = 0.008 [2 marks]",
        marks: 2
      }
    ],
    finalAnswerText: "Albinism: q = 0.37, p = 0.63. Dimples: dominant allele p = 0.087, recessive allele q = 0.913. Heterozygous students = 191.",
    officialAnswerScheme: [
      "q² = 14/100 = 0.14. Recessive allele q = √0.14 = 0.37 [1 mark]",
      "Dominant allele p = 1 - 0.37 = 0.63 [1 mark]",
      "Frequency of homozygous recessive genotype q² = 1000/1200 = 0.833 [1 mark]",
      "Recessive allele q = √0.833 = 0.913 [1 mark]",
      "Dominant allele p = 1 - 0.913 = 0.087 [1 mark]",
      "2pq = 2(0.087)(0.913) = 0.159. Number of students = 0.159 × 1200 = 190.8 ≈ 191 students [2 marks]",
      "Genotype frequency of child homozygous dominant = p² = (0.087)² = 0.008 [2 marks]"
    ]
  },
  {
    id: "q7",
    number: "Question 7",
    title: "Small Mammal Fur Colour Allele Counting (60 Yellow, 1440 Black)",
    source: "Tutorial Question 3",
    sourceType: "Tutorial",
    topic: "Gene Pool & Counting",
    pathwayType: "data-interpretation",
    category: "gene-pool",
    difficulty: "Basic",
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
        instruction: "60 individuals are yellow (bb) and 1440 are black. Among black individuals, 960 are pure-breeding (BB). Calculate the number of heterozygous black individuals (Bb).",
        expectedConcept: "Number of heterozygous black individuals",
        symbolDescription: "Number of heterozygous black individuals (Bb)",
        acceptedAnswers: ["480", "480 individuals"],
        tolerance: 0,
        hint1: "Black fur individuals include both homozygous dominant (BB) and heterozygous (Bb) genotypes.",
        hint2: "Use the formula: Number of Bb = (Total black individuals) - (Pure-breeding BB individuals).",
        hint3: "Subtract 960 pure-breeding black individuals from the 1440 total black individuals.",
        hint4: "State the difference as the count of heterozygous individuals.",
        explanation: "Number of heterozygous genotype individuals = 1440 - 960 = 480 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 2,
        title: "Total Number of B Alleles",
        instruction: "Each BB individual carries 2 B alleles and each Bb carries 1 B allele. Calculate the total number of B alleles in the population.",
        expectedConcept: "Total number of B alleles",
        symbolDescription: "Total number of B alleles",
        acceptedAnswers: ["2400", "2,400", "2400 alleles"],
        tolerance: 0,
        hint1: "Remember that each diploid homozygous dominant individual (BB) carries 2 B alleles, and each heterozygote (Bb) carries 1 B allele.",
        hint2: "Use the formula: Total B alleles = (2 × Number of BB) + (1 × Number of Bb).",
        hint3: "Multiply 960 by 2, and add the 480 heterozygous individuals.",
        hint4: "Sum the values to find the total count of B alleles.",
        explanation: "Total number of B alleles = (960 × 2) + 480 = 2400 alleles [1 mark]",
        marks: 1
      },
      {
        stepNumber: 3,
        title: "Total Number of b Alleles",
        instruction: "Each bb individual carries 2 b alleles and each Bb carries 1 b allele. Calculate the total number of b alleles in the population.",
        expectedConcept: "Total number of b alleles",
        symbolDescription: "Total number of b alleles",
        acceptedAnswers: ["600", "600 alleles"],
        tolerance: 0,
        hint1: "Each homozygous recessive individual (bb) carries 2 b alleles, and each heterozygote (Bb) carries 1 b allele.",
        hint2: "Use the formula: Total b alleles = (2 × Number of bb) + (1 × Number of Bb).",
        hint3: "Multiply the 60 yellow individuals by 2, and add the 480 heterozygous individuals.",
        hint4: "Calculate the total sum to find the count of b alleles.",
        explanation: "Total number of b alleles = (60 × 2) + 480 = 600 alleles [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Frequency of Yellow Fur Phenotype in Next Generation",
        instruction: "Assuming random sexual reproduction, calculate the frequency for the phenotype with yellow fur (q²) in the next generation.",
        expectedConcept: "Frequency of homozygous recessive genotype, q²",
        expectedSymbol: "q²",
        symbolDescription: "Frequency of yellow fur phenotype in next generation",
        acceptedAnswers: ["0.04", "0.040", ".04"],
        tolerance: 0.005,
        hint1: "Under random mating and equilibrium, the genotype frequency of the recessive phenotype (yellow fur, q²) remains constant.",
        hint2: "Formula: q² = (Number of yellow individuals) / (Total population size).",
        hint3: "Divide the 60 yellow individuals by the total population count (60 + 1440 = 1500).",
        hint4: "Express the fraction as a decimal value.",
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
  },
  {
    id: "q8",
    number: "Question 8",
    title: "Conditions for Hardy-Weinberg Equilibrium & Microevolution Factors",
    source: "Tutorial Question 4",
    sourceType: "Tutorial",
    topic: "Natural Selection",
    pathwayType: "conceptual",
    category: "natural-selection",
    difficulty: "Basic",
    questionText: "(a) State the five conditions necessary for a population to maintain genetic equilibrium under the Hardy-Weinberg law.\n(b) Explain why natural selection alters allele frequencies in a population over successive generations.\n(c) Distinguish between microevolution and macroevolution in population genetics terms.",
    targetConcept: "Five conditions of genetic equilibrium and microevolutionary mechanisms",
    isHardyWeinberg: true,
    whyHwOrNonHw: "Conceptual analysis of Hardy-Weinberg conditions and forces that disrupt equilibrium.",
    detectorOptions: [
      { label: "Five equilibrium assumptions, natural selection mechanism, and microevolution definition", isCorrect: true, feedback: "Spot on! This tests conceptual mastery: large population, random mating, no mutation, no migration, no natural selection." },
      { label: "Calculate numerical allele frequencies", isCorrect: false, feedback: "This is a conceptual question testing definitions, conditions, and biological mechanisms." }
    ],
    totalMarks: 8,
    steps: [
      {
        stepNumber: 1,
        title: "Identify Primary Equilibrium Conditions",
        instruction: "Select the set of 5 conditions required for a population to remain in Hardy-Weinberg equilibrium.",
        expectedConcept: "Large population, random mating, no mutation, no migration, no natural selection",
        acceptedAnswers: ["Large population size, random mating, no mutation, no migration, no natural selection"],
        isMultipleChoice: true,
        choiceOptions: [
          {
            label: "Large population size, random mating, no mutation, no gene flow/migration, no natural selection",
            value: "correct-hw-5",
            isCorrect: true,
            feedback: "Correct! These 5 conditions ensure that allele and genotype frequencies stay constant from generation to generation."
          },
          {
            label: "Small population size, non-random assortative mating, high mutation rate, active immigration, intense selection",
            value: "wrong-hw-5",
            isCorrect: false,
            feedback: "Incorrect. These are the 5 factors that CAUSE microevolution and disrupt equilibrium."
          }
        ],
        hint1: "Consider what conditions prevent changes to allele frequencies in a gene pool.",
        hint2: "Equilibrium requires the complete absence of evolutionary forces and truly random mating.",
        hint3: "Look for the option that includes a large population size and zero mutation, migration, or selection.",
        hint4: "Choose the combination specifying all five standard conditions.",
        explanation: "The 5 conditions for Hardy-Weinberg equilibrium: 1. Large population size, 2. Random mating, 3. No mutation, 4. No migration/gene flow, 5. No natural selection. [3 marks]",
        marks: 3
      },
      {
        stepNumber: 2,
        title: "Identify Concept: Mechanism of Natural Selection",
        instruction: "Explain how natural selection disrupts Hardy-Weinberg equilibrium and shifts allele frequencies.",
        expectedConcept: "Individuals with favourable traits have higher reproductive success, passing advantageous alleles to offspring at higher frequencies.",
        acceptedAnswers: ["differential reproductive success", "survival of the fittest", "favourable alleles increase", "differential reproduction"],
        isMultipleChoice: true,
        choiceOptions: [
          {
            label: "Individuals with advantageous phenotypes survive and reproduce more successfully, increasing the frequency of favourable alleles in the next generation.",
            value: "selection-mechanism",
            isCorrect: true,
            feedback: "Correct! Differential reproductive fitness causes adaptive alleles to increase in frequency over generations."
          },
          {
            label: "All individuals have equal survival and reproduction rates regardless of genotype.",
            value: "no-selection",
            isCorrect: false,
            feedback: "Incorrect. Equal survival describes a population with NO natural selection."
          }
        ],
        hint1: "Recall that natural selection operates on phenotypic differences among individuals.",
        hint2: "Consider how survival and reproductive success affect the transmission of alleles to the next generation.",
        hint3: "Favourable phenotypes confer higher reproductive fitness.",
        hint4: "Select the mechanism that explains how adaptive alleles increase in frequency.",
        explanation: "Natural selection leads to differential reproductive success: individuals with phenotypes better adapted to the environment leave more offspring, increasing the frequency of favourable alleles over generations. [3 marks]",
        marks: 3
      },
      {
        stepNumber: 3,
        title: "Explain & Answer: Microevolution vs Macroevolution",
        instruction: "State the definition of microevolution in population genetics.",
        expectedConcept: "Change in allele frequencies in a population's gene pool over successive generations.",
        acceptedAnswers: ["change in allele frequency", "change in allele frequencies in a population", "change in gene pool over generations"],
        isMultipleChoice: true,
        choiceOptions: [
          {
            label: "Microevolution is the change in allele or genotype frequencies within a single population's gene pool over generations.",
            value: "micro-def",
            isCorrect: true,
            feedback: "Correct! Microevolution represents generation-to-generation changes in allele frequencies within a gene pool."
          },
          {
            label: "Microevolution is the formation of entirely new taxonomic classes and kingdoms over millions of years.",
            value: "macro-def",
            isCorrect: false,
            feedback: "Incorrect. Broad-scale speciation and taxonomic divergence describe macroevolution."
          }
        ],
        hint1: "Focus on the biological scale of microevolution: changes within a gene pool over successive generations.",
        hint2: "Microevolution refers to changes in allele and genotype frequencies within a single population.",
        hint3: "Differentiate population-level genetic frequency shifts from broad-scale evolutionary divergence.",
        hint4: "Select the definition describing changes in gene frequencies across generations.",
        explanation: "Microevolution is defined as the change in allele or genotype frequencies within a population's gene pool over generations. [2 marks]",
        marks: 2
      }
    ],
    finalAnswerText: "Hardy-Weinberg conditions: Large population, random mating, no mutation, no migration, no natural selection. Microevolution is change in allele frequency within a population.",
    officialAnswerScheme: [
      "Five conditions for Hardy-Weinberg equilibrium: 1. Extremely large population size (no genetic drift), 2. Random mating (panmixia), 3. No net mutations, 4. No migration (no gene flow), 5. No natural selection [3 marks]",
      "Natural selection mechanism: Individuals with advantageous phenotypes have higher survival and reproductive success, transmitting beneficial alleles to progeny, thus changing allele frequencies [3 marks]",
      "Microevolution: A change in the allele frequencies of a population's gene pool from generation to generation [2 marks]"
    ]
  },
  {
    id: "q9",
    number: "Question 9",
    title: "Peppered Moths (Biston betularia) Industrial Melanism Data",
    source: "PSPM 2024/2025 Question 3",
    sourceType: "PSPM",
    topic: "Natural Selection",
    pathwayType: "data-interpretation",
    category: "natural-selection",
    difficulty: "Advanced",
    questionText: "In an industrial area of England, the peppered moth (Biston betularia) exists in two morphs: typical light-coloured morph (homozygous recessive, dd) and dark melanic morph (dominant, DD and Dd). A field census recorded the following data:\n\n• Year 1960 (heavy soot pollution): Out of 1,000 moths collected, 810 were dark melanic and 190 were light-coloured.\n• Year 1990 (after Clean Air Act): Out of 1,000 moths collected, 360 were dark melanic and 640 were light-coloured.\n\n(a) Calculate the frequency of the recessive allele (d) in 1960 and 1990 (to 3 decimal places). [4 marks]\n(b) Calculate the frequency of the dominant allele (D) in 1960 and 1990. [2 marks]\n(c) Interpret the biological trend observed between 1960 and 1990 in terms of directional selection and environmental change. [2 marks]",
    targetConcept: "Tracking recessive allele frequency shifts under changing selective pressures (Industrial Melanism)",
    isHardyWeinberg: false,
    whyHwOrNonHw: "Selection pressure changed drastically following the Clean Air Act, causing a directional shift in allele frequencies.",
    detectorOptions: [
      { label: "Allele frequencies in 1960 and 1990 from light morph counts (q² = 190/1000 and q² = 640/1000) & biological interpretation", isCorrect: true, feedback: "Spot on! Light morph is recessive (dd = q²), so we calculate q_1960 = √(0.190) and q_1990 = √(0.640)." },
      { label: "Assume dark morph is recessive", isCorrect: false, feedback: "Careful! In peppered moths, light morph is homozygous recessive (dd)." }
    ],
    totalMarks: 8,
    steps: [
      {
        stepNumber: 1,
        title: "Calculate 1960 Recessive Allele Frequency (q)",
        instruction: "In 1960, 190 out of 1000 moths were light-coloured (homozygous recessive, dd). Calculate the frequency of the recessive allele (q) in 1960 to 3 decimal places.",
        expectedConcept: "Frequency of recessive allele in 1960, q",
        expectedSymbol: "q",
        symbolDescription: "Frequency of recessive allele (d) in 1960",
        acceptedAnswers: ["0.436", ".436"],
        tolerance: 0.005,
        hint1: "Light moths are homozygous recessive, so q² = (Number of light moths in 1960) / (Total moths).",
        hint2: "Apply the formula: q = √(q²).",
        hint3: "Divide 190 by 1000, then take the square root of the quotient.",
        hint4: "Round your square root answer to 3 decimal places.",
        explanation: "In 1960: q² = 190/1000 = 0.190. Frequency of recessive allele, q = √0.190 = 0.436 [2 marks]",
        marks: 2
      },
      {
        stepNumber: 2,
        title: "Calculate 1990 Recessive Allele Frequency (q)",
        instruction: "In 1990, 640 out of 1000 moths were light-coloured (homozygous recessive, dd). Calculate the frequency of the recessive allele (q) in 1990 to 3 decimal places.",
        expectedConcept: "Frequency of recessive allele in 1990, q",
        expectedSymbol: "q",
        symbolDescription: "Frequency of recessive allele (d) in 1990",
        acceptedAnswers: ["0.8", "0.80", "0.800", ".8"],
        tolerance: 0.005,
        hint1: "Use the 1990 census data for light-coloured moths.",
        hint2: "Formula: q² = (Number of light moths in 1990) / (Total moths), then q = √(q²).",
        hint3: "Divide 640 by 1000 and take the square root of the resulting decimal.",
        hint4: "Express your final answer to 3 decimal places.",
        explanation: "In 1990: q² = 640/1000 = 0.640. Frequency of recessive allele, q = √0.640 = 0.800 [2 marks]",
        marks: 2
      },
      {
        stepNumber: 3,
        title: "Calculate Dominant Allele Frequency in 1960 (p)",
        instruction: "Using p + q = 1, calculate the frequency of dominant allele (p) in 1960.",
        expectedConcept: "Frequency of dominant allele in 1960, p",
        expectedSymbol: "p",
        symbolDescription: "Frequency of dominant allele (D) in 1960",
        acceptedAnswers: ["0.564", ".564"],
        tolerance: 0.005,
        hint1: "Use the allele frequency relationship: p = 1 - q.",
        hint2: "Substitute your 1960 value of q (from Step 1) into the formula.",
        hint3: "Subtract your 1960 q value from 1.",
        hint4: "Round your answer to 3 decimal places.",
        explanation: "1960: Frequency of dominant allele, p = 1 - 0.436 = 0.564 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Calculate Dominant Allele Frequency in 1990 (p)",
        instruction: "Using p + q = 1, calculate the frequency of dominant allele (p) in 1990.",
        expectedConcept: "Frequency of dominant allele in 1990, p",
        expectedSymbol: "p",
        symbolDescription: "Frequency of dominant allele (D) in 1990",
        acceptedAnswers: ["0.2", "0.20", "0.200", ".2"],
        tolerance: 0.005,
        hint1: "Use the formula: p = 1 - q.",
        hint2: "Substitute your 1990 value of q (from Step 2) into the formula.",
        hint3: "Subtract your 1990 q value from 1.",
        hint4: "Express the result to 3 decimal places.",
        explanation: "1990: Frequency of dominant allele, p = 1 - 0.800 = 0.200 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 5,
        title: "Interpret: Directional Selection & Environmental Change",
        instruction: "Explain the biological cause of the allele frequency shift from 1960 to 1990 in terms of directional selection.",
        expectedConcept: "Clean air reduced soot on tree trunks, making light moths better camouflaged from predators; directional selection favoured the light allele (d), increasing its frequency from 0.436 to 0.800.",
        acceptedAnswers: ["directional selection favours light moths", "clean air improves light moth camouflage", "predation selects against dark moths"],
        isMultipleChoice: true,
        choiceOptions: [
          {
            label: "Directional selection favoured light-coloured moths because cleaner lichens on tree bark provided better camouflage against bird predation, increasing the frequency of allele d from 0.436 to 0.800.",
            value: "correct-selection",
            isCorrect: true,
            feedback: "Correct! Reduced pollution restored lichen cover, shifting selective advantage back to the light phenotype."
          },
          {
            label: "Genetic drift randomly eliminated the dark allele without any environmental influence.",
            value: "wrong-drift",
            isCorrect: false,
            feedback: "Incorrect. The shift was driven by environmental changes affecting camouflage and bird predation (natural selection)."
          }
        ],
        hint1: "Consider how air quality legislation altered tree trunk coloration and lichen growth.",
        hint2: "Relate the camouflage advantage of light moths to differential bird predation.",
        hint3: "Think about which phenotype had higher survival and reproductive fitness in the cleaner environment.",
        hint4: "Select the explanation connecting reduced soot pollution to directional selection on moth phenotypes.",
        explanation: "As air quality improved and tree bark became lighter, light-coloured moths gained a camouflage advantage against bird predation. Directional selection favoured recessive allele d, causing its frequency to rise from 0.436 to 0.800. [2 marks]",
        marks: 2
      }
    ],
    finalAnswerText: "1960: q = 0.436, p = 0.564. 1990: q = 0.800, p = 0.200. Directional selection favoured the light recessive allele as clean air restored lichen camouflage.",
    officialAnswerScheme: [
      "1960: q² = 190/1000 = 0.190; Recessive allele q = √0.190 = 0.436 [2 marks]",
      "1990: q² = 640/1000 = 0.640; Recessive allele q = √0.640 = 0.800 [2 marks]",
      "Dominant allele p in 1960: p = 1 - 0.436 = 0.564 [1 mark]",
      "Dominant allele p in 1990: p = 1 - 0.800 = 0.200 [1 mark]",
      "Interpretation: Directional natural selection favoured light-coloured moths due to restored tree bark camouflage after pollution reduction, causing recessive allele frequency to increase significantly [2 marks]"
    ]
  }
];
