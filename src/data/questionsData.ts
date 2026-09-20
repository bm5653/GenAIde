import { QuestionData } from '../types';
import { miceCoatImg } from '../assets/images';

export const QUESTIONS_DATA: QuestionData[] = [
  {
    id: "q1",
    number: "Question 1",
    title: "Phenylketonuria (PKU) Frequency Comparison (1995 vs 2005)",
    source: "Structured Question 1",
    category: "population-change",
    difficulty: "Intermediate",
    questionText: "Phenylketonuria (PKU) is a genetic disease controlled by the recessive allele. It is also an inborn error of phenylalanine metabolism and leads to severe mental retardation. (All calculation must be in 4 decimal places).\n\nTABLE 1 shows the number of normal and abnormal individuals in a population:\n• Year 1995: 4996 normal, 4 abnormal (PKU), Total = 5000\n• Year 2005: 4992 normal, 8 abnormal (PKU), Total = 5000\n\n(a) Calculate the frequency of the recessive allele in 1995 and 2005. [6 marks]\n(b) Make a conclusion about the population based on your answer in (a). [1 mark]\n(c) State the assumptions that can be made if the allele and genotype frequencies of the population are constant in several generations. [3 marks]",
    targetConcept: "Recessive allele frequency (q) across two time periods and testing for genetic equilibrium",
    isHardyWeinberg: true,
    whyHwOrNonHw: "We calculate q for each generation to check whether allele frequencies remained constant or changed over time.",
    detectorOptions: [
      { label: "Frequency of dominant allele in two years", isCorrect: false, feedback: "The question asks for the frequency of the recessive allele (q) in 1995 and 2005, not dominant (p)." },
      { label: "Frequency of recessive allele (q) in 1995 and 2005", isCorrect: true, feedback: "Spot on! We need to calculate q for 1995 and q for 2005 from the abnormal individuals." },
      { label: "Total gene pool size in 1995", isCorrect: false, feedback: "Gene pool is not requested here. The question asks for recessive allele frequencies." },
      { label: "Number of heterozygous carriers", isCorrect: false, feedback: "The question specifically asks for the recessive allele frequency (q)." }
    ],
    totalMarks: 10,
    steps: [
      {
        stepNumber: 1,
        title: "Calculate q² for Year 1995",
        instruction: "Calculate the frequency of homozygous recessive genotype (q²) in 1995: 4 abnormal out of 5000.",
        expectedConcept: "Frequency of homozygous recessive genotype in 1995, q²",
        expectedSymbol: "q²",
        acceptedAnswers: ["0.0008", "4/5000", ".0008"],
        tolerance: 0.00005,
        hint1: "Abnormal individuals have PKU which is recessive, so their frequency is q².",
        hint2: "Divide the number of abnormal individuals (4) by total population (5000).",
        hint3: "4 ÷ 5000 = 0.0008",
        explanation: "Frequency of homozygous recessive genotype in 1995, q² = 4/5000 = 0.0008 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 2,
        title: "Calculate q for Year 1995",
        instruction: "Calculate the frequency of the recessive allele (q) in 1995 (to 4 decimal places).",
        expectedConcept: "Frequency of recessive allele in 1995, q = √q²",
        expectedSymbol: "q",
        acceptedAnswers: ["0.0283", ".0283"],
        tolerance: 0.0001,
        hint1: "Take the square root of q² to find q.",
        hint2: "q = √0.0008",
        hint3: "√0.0008 ≈ 0.028284, which rounds to 0.0283.",
        explanation: "Frequency of recessive allele in 1995, q = √0.0008 = 0.0283 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 3,
        title: "Calculate q² for Year 2005",
        instruction: "Calculate the frequency of homozygous recessive genotype (q²) in 2005: 8 abnormal out of 5000.",
        expectedConcept: "Frequency of homozygous recessive genotype in 2005, q²",
        expectedSymbol: "q²",
        acceptedAnswers: ["0.0016", "8/5000", ".0016"],
        tolerance: 0.00005,
        hint1: "Use the 2005 data: 8 abnormal out of 5000 total.",
        hint2: "q² = 8 / 5000",
        hint3: "8 ÷ 5000 = 0.0016",
        explanation: "Frequency of homozygous recessive genotype in 2005, q² = 8/5000 = 0.0016 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Calculate q for Year 2005",
        instruction: "Calculate the frequency of the recessive allele (q) in 2005 (to 4 decimal places).",
        expectedConcept: "Frequency of recessive allele in 2005, q = √q²",
        expectedSymbol: "q",
        acceptedAnswers: ["0.0400", ".0400"],
        tolerance: 0.0001,
        hint1: "Take the square root of 0.0016.",
        hint2: "q = √0.0016",
        hint3: "√0.0016 = 0.0400",
        explanation: "Frequency of recessive allele in 2005, q = √0.0016 = 0.0400 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 5,
        title: "Conclusion about Population Equilibrium",
        instruction: "Compare the recessive allele frequency in 1995 (q = 0.0283) and in 2005 (q = 0.0400). Based on this comparison, is the population in genetic equilibrium?",
        expectedConcept: "The population is not in equilibrium / evolving (recessive allele frequency changed from 0.0283 to 0.0400)",
        acceptedAnswers: ["not in equilibrium", "no", "not following equilibrium", "population is not in equilibrium", "it is not in equilibrium"],
        isMultipleChoice: true,
        choiceOptions: [
          {
            label: "No / Not in equilibrium (Not following equilibrium)",
            value: "not in equilibrium",
            isCorrect: true,
            feedback: "Correct! The recessive allele frequency changed from 0.0283 (1995) to 0.0400 (2005). Because allele frequencies are not constant over generations, the population is not in Hardy-Weinberg equilibrium."
          },
          {
            label: "Yes / In equilibrium (Following equilibrium)",
            value: "in equilibrium",
            isCorrect: false,
            feedback: "Incorrect. For a population to follow Hardy-Weinberg equilibrium, allele frequencies must remain constant across generations (q_1995 = q_2005). Here, q changed from 0.0283 to 0.0400, meaning microevolution is occurring."
          }
        ],
        hint1: "Compare the recessive allele frequencies: 1995 (q = 0.0283) vs 2005 (q = 0.0400). Did it stay constant?",
        hint2: "Since 0.0283 ≠ 0.0400, the allele frequency has changed (increased) over the 10-year period.",
        hint3: "Because the allele frequency changed across generations, the population is NOT in equilibrium.",
        explanation: "Conclusion: The population is not in equilibrium [1 mark] because the recessive allele frequency changed from 0.0283 in 1995 to 0.0400 in 2005.",
        marks: 1
      }
    ],
    finalAnswerText: "Recessive allele frequency in 1995 = 0.0283; in 2005 = 0.0400. The population is not in equilibrium.",
    officialAnswerScheme: [
      "Frequency of homozygous recessive genotype in 1995, q² = 4/5000 = 0.0008 [1 mark]",
      "Frequency of recessive allele in 1995, q = √0.0008 = 0.0283 [1 mark]",
      "Frequency of homozygous recessive genotype in 2005, q² = 8/5000 = 0.0016 [1 mark]",
      "Frequency of recessive allele in 2005, q = √0.0016 = 0.0400 [1 mark]",
      "Conclusion: The population is not in equilibrium [1 mark]",
      "Assumptions for constant frequencies: Large population size, Random fertilization/mating, No mutation, No migration, No natural selection [Any 3 = 3 marks]"
    ]
  },
  {
    id: "q2",
    number: "Question 2",
    title: "Mice Coat Colour (36% White) & Eyelashes Carriers",
    source: "Structured Question 2",
    category: "heterozygotes",
    difficulty: "Foundation",
    questionText: "(b) In a randomly breeding population of mice, black coat (H) is dominant to white coat (h). In the population, 36% have white coat. Calculate the genotypic frequency of black coated mice in this population. [3 marks]\n\n(c) In a human population, the frequency of recessive individuals for extra-long eyelashes is 90 per 1000. What is the percentage of individuals in this population that carry the recessive allele but display the phenotype of short eyelashes? [4 marks]",
    targetConcept: "Genotype frequency of dominant phenotype (p² + 2pq) and percentage of heterozygous carriers (2pq × 100%)",
    isHardyWeinberg: true,
    whyHwOrNonHw: "Randomly breeding population; follows Hardy-Weinberg equilibrium conditions.",
    detectorOptions: [
      { label: "Genotypic frequency of black mice (p² + 2pq) & Carrier percentage (2pq × 100%)", isCorrect: true, feedback: "Correct! Note that black mice include BOTH homozygous dominant (p²) and heterozygous (2pq)." },
      { label: "Allele frequency p only", isCorrect: false, feedback: "The question asks for genotype frequency of black coated mice, not just allele p." },
      { label: "Total number of white mice", isCorrect: false, feedback: "We are given percentage (36%), and asked for genotype frequency." },
      { label: "New population size", isCorrect: false, feedback: "No individuals were added or removed." }
    ],
    totalMarks: 7,
    imageUrl: miceCoatImg,
    imageCaption: "Phenotypic coat colour variation in Mus musculus: Black coat (dominant, H_) vs White coat (recessive, hh).",
    steps: [
      {
        stepNumber: 1,
        title: "Mice: Identify q² for White Coat",
        instruction: "White coat is recessive (h). Given 36% have white coat, write q² as a decimal.",
        expectedConcept: "Frequency of homozygous recessive genotype (white coat mice), q²",
        expectedSymbol: "q²",
        acceptedAnswers: ["0.36", ".36", "36/100"],
        tolerance: 0.01,
        hint1: "36% = 36 / 100.",
        hint2: "White coat is recessive, so q² = 0.36.",
        hint3: "q² = 0.36",
        explanation: "Frequency of homozygous recessive genotype (white coated mice), q² = 36/100 = 0.36 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 2,
        title: "Mice: Genotype Frequency of Black Coated Mice",
        instruction: "Since p² + 2pq + q² = 1, calculate the genotype frequency of black coated mice (p² + 2pq).",
        expectedConcept: "Genotype frequency of black coated mice = 1 - q²",
        acceptedAnswers: ["0.64", ".64", "1 - 0.36"],
        tolerance: 0.01,
        hint1: "Black mice have genotype HH or Hh, which equals p² + 2pq.",
        hint2: "Since (p² + 2pq) + q² = 1, black coated genotype frequency = 1 - q².",
        hint3: "1 - 0.36 = 0.64",
        explanation: "Genotype frequency of black coated mice, p² + 2pq = 1 - q² = 1 - 0.36 = 0.64 [1 mark]",
        marks: 2
      },
      {
        stepNumber: 3,
        title: "Eyelashes: Calculate q² from 90 per 1000",
        instruction: "For extra-long eyelashes (recessive), 90 per 1000 have the trait. Calculate q².",
        expectedConcept: "Frequency of homozygous recessive genotype, q²",
        expectedSymbol: "q²",
        acceptedAnswers: ["0.09", "0.090", ".09", "90/1000"],
        tolerance: 0.001,
        hint1: "90 divided by 1000.",
        hint2: "q² = 90 / 1000 = 0.090",
        hint3: "0.09",
        explanation: "Frequency of homozygous recessive genotype, q² = 90/1000 = 0.090 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Eyelashes: Calculate Recessive Allele q",
        instruction: "Calculate q = √q².",
        expectedConcept: "Frequency of recessive allele, q = √0.09",
        expectedSymbol: "q",
        acceptedAnswers: ["0.3", "0.30", "0.300", ".3"],
        tolerance: 0.01,
        hint1: "Take the square root of 0.09.",
        hint2: "√0.09 = 0.3",
        hint3: "q = 0.300",
        explanation: "Frequency of recessive allele, q = √0.09 = 0.300 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 5,
        title: "Eyelashes: Calculate Dominant Allele p",
        instruction: "Using p + q = 1, calculate p.",
        expectedConcept: "Frequency of dominant allele, p = 1 - q",
        expectedSymbol: "p",
        acceptedAnswers: ["0.7", "0.70", "0.700", ".7"],
        tolerance: 0.01,
        hint1: "p = 1 - 0.3",
        hint2: "1 - 0.3 = 0.7",
        hint3: "p = 0.700",
        explanation: "Frequency of dominant allele, p = 1 - 0.3 = 0.700 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 6,
        title: "Eyelashes: Percentage of Carriers (2pq × 100%)",
        instruction: "Calculate the percentage of individuals that carry the recessive allele but display short eyelashes (2pq × 100%).",
        expectedConcept: "Percentage of carriers = 2pq × 100%",
        acceptedAnswers: ["42%", "42", "42.0%"],
        tolerance: 0.5,
        hint1: "2pq = 2 × 0.7 × 0.3 = 0.42.",
        hint2: "To convert frequency to percentage, multiply by 100%.",
        hint3: "0.42 × 100% = 42%",
        explanation: "Frequency of heterozygous genotype 2pq = 2(0.7)(0.3) = 0.42. Percentage of carriers = 0.42 × 100 = 42% [1 mark]",
        marks: 1
      }
    ],
    finalAnswerText: "Black coated mice genotype frequency = 0.64. Percentage of eyelash carriers = 42%.",
    officialAnswerScheme: [
      "Frequency of homozygous recessive genotype (white coated mice), q² = 36/100 = 0.36 [1 mark]",
      "Since p² + 2pq + q² = 1 [1 mark]",
      "Genotype frequency of black coated mice, p² + 2pq = 1 - q² = 1 - 0.36 = 0.64 [1 mark]",
      "Frequency of homozygous recessive genotype, q² = 90/1000 = 0.090 [1 mark]",
      "Frequency of recessive allele, q = √0.09 = 0.300 [1 mark]",
      "Frequency of dominant allele, p = 1 - 0.3 = 0.700 [1 mark]",
      "Percentage of individual carries recessive allele = 2pq × 100 = 2(0.7)(0.3) × 100 = 42% [1 mark]"
    ]
  },
  {
    id: "q3",
    number: "Question 3",
    title: "Thalassemia in Human Population (12,750 Population)",
    source: "Past Year Question 8",
    category: "hardy-weinberg",
    difficulty: "Advanced",
    questionText: "Thalassemia is an inherited autosomal recessive blood disease in humans. Thalassemia major is severe anemia due to homozygous recessive condition, while thalassemia minor is a mild form of anemia shown in individuals with heterozygous genotype. In a population of 12,750, two individuals are suffering from thalassemia major.\n\n(a) Determine the frequencies of dominant and recessive alleles in the population (calculate up to five decimal places). [5 marks]\n(b) How many of the individuals would be suffering from thalassemia minor in the population? [2 marks]",
    targetConcept: "Autosomal recessive disease frequencies to 5 decimal places in a large population and heterozygous carrier count",
    isHardyWeinberg: true,
    whyHwOrNonHw: "The population is large (12,750 individuals) and assumed to be in Hardy-Weinberg equilibrium. Calculations follow the large population 5 decimal places rule.",
    detectorOptions: [
      { label: "Allele frequencies to 5 decimal places (p, q) and heterozygous count (2pq × 12,750)", isCorrect: true, feedback: "Correct! We start with q² = 2/12750 to 5 decimal places, find q, then p, then 2pq." },
      { label: "Calculate only phenotype frequencies", isCorrect: false, feedback: "We need allele frequencies to 5 decimal places." }
    ],
    totalMarks: 7,
    steps: [
      {
        stepNumber: 1,
        title: "Calculate q² (Homozygous Recessive) to 5 Decimal Places",
        instruction: "2 out of 12,750 have thalassemia major. Calculate q² = 2 / 12750.",
        expectedConcept: "q² = 2 / 12750",
        expectedSymbol: "q²",
        acceptedAnswers: ["0.00016", ".00016"],
        tolerance: 0.00001,
        hint1: "2 ÷ 12750",
        hint2: "0.0001568... rounds to 0.00016",
        hint3: "0.00016",
        explanation: "Frequency of homozygous recessive genotype, q² = 2/12750 = 0.00016 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 2,
        title: "Calculate Recessive Allele Frequency (q)",
        instruction: "Take q = √0.00016 (to 5 decimal places).",
        expectedConcept: "q = √0.00016",
        expectedSymbol: "q",
        acceptedAnswers: ["0.01265", ".01265"],
        tolerance: 0.00002,
        hint1: "√0.00016",
        hint2: "0.012649... rounds to 0.01265",
        hint3: "0.01265",
        explanation: "Frequency of recessive allele, q = √0.00016 = 0.01265 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 3,
        title: "Calculate Dominant Allele Frequency (p)",
        instruction: "p = 1 - q = 1 - 0.01265.",
        expectedConcept: "p = 1 - 0.01265",
        expectedSymbol: "p",
        acceptedAnswers: ["0.98735", ".98735"],
        tolerance: 0.00002,
        hint1: "1 - 0.01265",
        hint2: "0.98735",
        hint3: "0.98735",
        explanation: "Since p + q = 1, frequency of dominant allele, p = 1 - 0.01265 = 0.98735 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Thalassemia Minor Individuals (Heterozygotes)",
        instruction: "Calculate 2pq = 2(0.98735)(0.01265) and multiply by 12,750.",
        expectedConcept: "Number of thalassemia minor individuals = 2pq × 12750",
        acceptedAnswers: ["319", "318", "318.5"],
        tolerance: 1,
        hint1: "2pq = 0.02498.",
        hint2: "0.02498 × 12750 ≈ 318.5 → 319 individuals.",
        hint3: "319",
        explanation: "2pq = 2(0.98735)(0.01265) = 0.02498. Number of individuals = 0.02498 × 12750 = 319 [2 marks]",
        marks: 2
      }
    ],
    finalAnswerText: "q = 0.01265, p = 0.98735. Number of individuals suffering from thalassemia minor = 319.",
    officialAnswerScheme: [
      "q² = 2/12750 = 0.00016 [1 mark]",
      "q = √0.00016 = 0.01265 [1 mark]",
      "p = 1 - 0.01265 = 0.98735 [1 mark]",
      "2pq = 2(0.98735)(0.01265) = 0.02498 [1 mark]",
      "Number suffering from minor = 0.02498 × 12750 = 319 [1 mark]"
    ]
  },
  {
    id: "q4",
    number: "Question 4",
    title: "Wild Chickens Short Legs (16% Recessive) Next Generation Expansion",
    source: "Past Year Question 11",
    category: "next-generation",
    difficulty: "Intermediate",
    questionText: "In a population of 13,000 wild chickens, 16% have short legs which is a recessive trait. Assuming the population is in Hardy-Weinberg equilibrium, how many wild chickens are heterozygotes in the next generation if the population size increases to 15,000? [7 marks]",
    targetConcept: "Heterozygote genotype frequency applied to an expanded next generation population size",
    isHardyWeinberg: true,
    whyHwOrNonHw: "Explicitly states 'Assuming the population is in Hardy-Weinberg equilibrium'. Allele and genotype frequencies remain constant into the next generation.",
    detectorOptions: [
      { label: "Number of heterozygotes in next generation (2pq × 15,000)", isCorrect: true, feedback: "Spot on! Under H-W equilibrium, genotype frequencies stay constant, so we apply 2pq to the new population size 15,000." },
      { label: "Number of heterozygotes in original generation (2pq × 13,000)", isCorrect: false, feedback: "Careful! The question asks for the NEXT generation when population size increases to 15,000." }
    ],
    totalMarks: 7,
    steps: [
      {
        stepNumber: 1,
        title: "Identify q²",
        instruction: "16% have short legs (recessive). Write q² as a decimal.",
        expectedConcept: "q² = 16/100 = 0.16",
        expectedSymbol: "q²",
        acceptedAnswers: ["0.16", "0.160", ".16"],
        tolerance: 0.005,
        hint1: "16% = 0.16",
        hint2: "q² = 0.16",
        hint3: "0.160",
        explanation: "Frequency of homozygous recessive genotype, q² = 16/100 = 0.160 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 2,
        title: "Calculate q",
        instruction: "Take q = √0.16.",
        expectedConcept: "q = √0.16",
        expectedSymbol: "q",
        acceptedAnswers: ["0.4", "0.40", "0.400", ".4"],
        tolerance: 0.005,
        hint1: "√0.16 = 0.4",
        hint2: "0.400",
        hint3: "0.4",
        explanation: "Frequency of recessive allele, q = √0.16 = 0.400 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 3,
        title: "Calculate p",
        instruction: "Since p + q = 1, p = 1 - 0.4.",
        expectedConcept: "p = 1 - 0.4 = 0.6",
        expectedSymbol: "p",
        acceptedAnswers: ["0.6", "0.60", "0.600", ".6"],
        tolerance: 0.005,
        hint1: "1 - 0.4 = 0.6",
        hint2: "0.600",
        hint3: "0.6",
        explanation: "Since p + q = 1, frequency of dominant allele, p = 1 - 0.4 = 0.600 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Calculate 2pq",
        instruction: "Calculate heterozygous genotype frequency 2pq = 2(0.6)(0.4).",
        expectedConcept: "2pq = 2(0.6)(0.4) = 0.48",
        acceptedAnswers: ["0.48", "0.480", ".48"],
        tolerance: 0.005,
        hint1: "2 × 0.6 × 0.4",
        hint2: "0.48",
        hint3: "0.48",
        explanation: "Frequency of heterozygous genotype, 2pq = 2(0.6)(0.4) = 0.48 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 5,
        title: "Calculate Number of Heterozygotes in Next Generation (N = 15,000)",
        instruction: "Multiply 2pq by 15,000.",
        expectedConcept: "Number of heterozygotes in next generation = 2pq × 15000",
        acceptedAnswers: ["7200", "7,200", "7200 chickens"],
        tolerance: 0,
        hint1: "0.48 × 15000",
        hint2: "7200",
        hint3: "7200",
        explanation: "Number of heterozygotes in next generation = 2pq × 15000 = 0.48 × 15000 = 7200 chickens [3 marks]",
        marks: 3
      }
    ],
    finalAnswerText: "q = 0.40, p = 0.60, 2pq = 0.48. In next generation of 15,000 chickens, there are 7,200 heterozygotes.",
    officialAnswerScheme: [
      "p = frequency of dominant allele and q = frequency of recessive allele [1 mark]",
      "Frequency of homozygous recessive genotype, q² = 16/100 = 0.160 [1 mark]",
      "Frequency of recessive allele, q = √0.16 = 0.400 [1 mark]",
      "Since p + q = 1, frequency of dominant allele, p = 1 - 0.4 = 0.60 [1 mark]",
      "Frequency of heterozygous genotype, 2pq = 2(0.6)(0.4) = 0.48 [1 mark]",
      "Number of heterozygotes in the next generation = 2pq × 15000 = 0.48 × 15000 = 7200 chickens [2 marks]"
    ]
  },
  {
    id: "q5",
    number: "Question 5",
    title: "Tay-Sachs Disease (1 in 3600 Persons)",
    source: "Past Year Question 14",
    category: "genotype-frequency",
    difficulty: "Intermediate",
    questionText: "One in 3600 persons of a population inherits an autosomal recessive disorder called Tay-Sachs disease, which affects the central nervous system. Assuming that this population is in Hardy-Weinberg equilibrium, calculate (All calculations must be to 4 decimal places):\n\n(a) The percentage of dominant homozygous individuals. [4 marks]\n(b) The percentage of heterozygous individuals. [2 marks]",
    targetConcept: "Autosomal recessive trait in fraction (1/3600), calculating homozygous dominant percentage and carrier percentage",
    isHardyWeinberg: true,
    whyHwOrNonHw: "The population is assumed to be in Hardy-Weinberg equilibrium.",
    detectorOptions: [
      { label: "Percentage of dominant homozygous (p² × 100%) and heterozygous (2pq × 100%)", isCorrect: true, feedback: "Spot on! Convert fractions to 4 d.p., find q², q, p, then percentages." },
      { label: "Total number of sick individuals", isCorrect: false, feedback: "We are asked for percentages, not counts." }
    ],
    totalMarks: 6,
    steps: [
      {
        stepNumber: 1,
        title: "Calculate q² to 4 Decimal Places",
        instruction: "1 in 3600 persons has Tay-Sachs. Calculate q² = 1 / 3600.",
        expectedConcept: "q² = 1 / 3600 = 0.0003",
        expectedSymbol: "q²",
        acceptedAnswers: ["0.0003", ".0003", "1/3600"],
        tolerance: 0.00005,
        hint1: "1 ÷ 3600",
        hint2: "0.000277... rounds to 0.0003",
        hint3: "0.0003",
        explanation: "Frequency of homozygous recessive genotype, q² = 1/3600 = 0.0003 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 2,
        title: "Calculate q to 4 Decimal Places",
        instruction: "Take q = √0.0003.",
        expectedConcept: "q = √0.0003 = 0.0173",
        expectedSymbol: "q",
        acceptedAnswers: ["0.0173", ".0173"],
        tolerance: 0.0001,
        hint1: "√0.0003",
        hint2: "0.01732... rounds to 0.0173",
        hint3: "0.0173",
        explanation: "Frequency of recessive allele, q = √0.0003 = 0.0173 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 3,
        title: "Calculate p to 4 Decimal Places",
        instruction: "p = 1 - 0.0173.",
        expectedConcept: "p = 1 - 0.0173 = 0.9827",
        expectedSymbol: "p",
        acceptedAnswers: ["0.9827", ".9827"],
        tolerance: 0.0001,
        hint1: "1 - 0.0173",
        hint2: "0.9827",
        hint3: "0.9827",
        explanation: "Since p + q = 1, frequency of dominant allele, p = 1 - 0.0173 = 0.9827 [1 mark]",
        marks: 1
      },
      {
        stepNumber: 4,
        title: "Percentage of Dominant Homozygous (p² × 100%)",
        instruction: "p² = (0.9827)² = 0.9657. Convert to percentage.",
        expectedConcept: "Percentage of homozygous dominant = p² × 100% = 96.57%",
        acceptedAnswers: ["96.57%", "96.57", "95.6%", "95.6"],
        tolerance: 0.5,
        hint1: "(0.9827)² = 0.9657.",
        hint2: "0.9657 × 100% = 96.57%",
        hint3: "96.57%",
        explanation: "Frequency of homozygous dominant genotype, p² = (0.9827)² = 0.9657. Percentage = 0.9657 × 100 = 96.57% (or 95.6% based on unrounded q) [1 mark]",
        marks: 1
      },
      {
        stepNumber: 5,
        title: "Percentage of Heterozygous Individuals (2pq × 100%)",
        instruction: "Calculate 2pq = 2(0.9827)(0.0173) = 0.0340. Convert to percentage.",
        expectedConcept: "2pq × 100% = 3.4%",
        acceptedAnswers: ["3.4%", "3.4", "3.40%"],
        tolerance: 0.2,
        hint1: "2 × 0.9827 × 0.0173 = 0.0340.",
        hint2: "0.0340 × 100% = 3.4%.",
        hint3: "3.4%",
        explanation: "Frequency of heterozygous genotype 2pq = 2(0.9827)(0.0173) = 0.0340. Percentage = 0.0340 × 100 = 3.4% [2 marks]",
        marks: 2
      }
    ],
    finalAnswerText: "Homozygous dominant = 96.57%. Heterozygous = 3.4%.",
    officialAnswerScheme: [
      "q² = 1/3600 = 0.0003 [1 mark]",
      "q = √0.0003 = 0.0173 [1 mark]",
      "p = 1 - 0.0173 = 0.9827 [1 mark]",
      "p² = (0.9827)² = 0.9657. Percentage = 96.57% [1 mark]",
      "2pq = 2(0.9827)(0.0173) = 0.0340. Percentage = 3.4% [2 marks]"
    ]
  }
];

export const ALL_QUESTIONS = QUESTIONS_DATA;
