export interface ToolboxQuestionTask {
  id: string;
  label: string;
  symbol: string;
  expectedAnswer: string;
  acceptableAnswers: string[];
  unit?: string;
  tableCellReference: string;
  hint: string;
  explanation: string;
}

export interface ToolboxQuestion {
  id: number;
  title: string;
  species: string;
  populationN: number;
  recessiveCount: number;
  dominantTrait: string;
  recessiveTrait: string;
  scenario: string;
  questionText: string;
  tasks: ToolboxQuestionTask[];
  tableHighlightNote: string;
  examinerTip: string;
}

export const TOOLBOX_PRACTICE_QUESTIONS: ToolboxQuestion[] = [
  {
    id: 1,
    title: "Angus Cattle Coat Color",
    species: "Bos taurus (Angus Cattle)",
    populationN: 1000,
    recessiveCount: 160,
    dominantTrait: "Black coat (dominant)",
    recessiveTrait: "Red coat (recessive)",
    scenario: "In a herd of 1,000 Angus cattle in Hardy-Weinberg equilibrium, black coat color is dominant to red coat color. A survey counts 160 red cattle in the herd.",
    questionText: "Use the interactive POPGEN Table Generator with Total Population N = 1,000 and Recessive Individuals = 160 to find the required frequencies and counts below.",
    tasks: [
      {
        id: "q_freq",
        label: "Recessive Allele Frequency",
        symbol: "q",
        expectedAnswer: "0.400",
        acceptableAnswers: ["0.4", "0.40", "0.400"],
        tableCellReference: "Table Generator Row 1 (Step 2: Recessive Allele)",
        hint: "Look at the Recessive Phenotype row in the Table Generator: q = √(160/1000) = √0.160.",
        explanation: "q² = 160/1000 = 0.160. Therefore, recessive allele q = √0.160 = 0.400."
      },
      {
        id: "p_freq",
        label: "Dominant Allele Frequency",
        symbol: "p",
        expectedAnswer: "0.600",
        acceptableAnswers: ["0.6", "0.60", "0.600"],
        tableCellReference: "Table Generator Row 2 (Step 3: Dominant Allele)",
        hint: "From p + q = 1: p = 1 - 0.400.",
        explanation: "p = 1 - q = 1 - 0.400 = 0.600."
      },
      {
        id: "carrier_freq",
        label: "Heterozygous Genotype Frequency",
        symbol: "2pq",
        expectedAnswer: "0.480",
        acceptableAnswers: ["0.48", "0.480"],
        tableCellReference: "Table Generator Row 2 (Step 4a: Heterozygous Genotype)",
        hint: "2pq = 2 × p × q = 2 × 0.600 × 0.400.",
        explanation: "2pq = 2(0.600)(0.400) = 0.480."
      },
      {
        id: "carrier_count",
        label: "Number of Heterozygous Cattle",
        symbol: "2pq × N",
        expectedAnswer: "480",
        acceptableAnswers: ["480", "480 cattle", "480 individuals"],
        unit: "cattle",
        tableCellReference: "Table Generator Row 2 (Total Individuals column)",
        hint: "Multiply carrier frequency by total population: 0.480 × 1,000.",
        explanation: "Number of carriers = 2pq × N = 0.480 × 1,000 = 480 cattle."
      }
    ],
    tableHighlightNote: "Notice how Step 1 (q² = 0.160) flows naturally into Step 2 (q = 0.400), Step 3 (p = 0.600), and Step 4 (2pq = 0.480) in the table.",
    examinerTip: "Always confirm whether the question asks for frequency (0.480) or number of cattle (480)."
  },
  {
    id: 2,
    title: "Albinism in an Island Community",
    species: "Homo sapiens (Island Population)",
    populationN: 2500,
    recessiveCount: 25,
    dominantTrait: "Normal pigmentation",
    recessiveTrait: "Albinism (recessive)",
    scenario: "In an isolated human population of 2,500 individuals, albinism is an autosomal recessive condition. A clinical screening identifies exactly 25 individuals with albinism.",
    questionText: "Load N = 2,500 and Recessive = 25 into the Table Generator to determine the frequency of the recessive allele and carrier statistics.",
    tasks: [
      {
        id: "q2_freq",
        label: "Homozygous Recessive Genotype Frequency",
        symbol: "q²",
        expectedAnswer: "0.010",
        acceptableAnswers: ["0.01", "0.010", "0.0100"],
        tableCellReference: "Table Generator Row 1 (Step 1: Homozygous Recessive)",
        hint: "Divide recessive individuals (25) by total population (2,500).",
        explanation: "q² = 25 / 2,500 = 0.010."
      },
      {
        id: "q_freq",
        label: "Recessive Allele Frequency",
        symbol: "q",
        expectedAnswer: "0.100",
        acceptableAnswers: ["0.1", "0.10", "0.100"],
        tableCellReference: "Table Generator Row 1 (Step 2: Recessive Allele)",
        hint: "Take the square root of q²: √0.010.",
        explanation: "q = √0.010 = 0.100."
      },
      {
        id: "carrier_freq",
        label: "Heterozygous Carrier Frequency",
        symbol: "2pq",
        expectedAnswer: "0.180",
        acceptableAnswers: ["0.18", "0.180"],
        tableCellReference: "Table Generator Row 2 (Step 4a: Heterozygous Genotype)",
        hint: "p = 1 - 0.100 = 0.900. Then 2pq = 2(0.900)(0.100).",
        explanation: "p = 0.900, q = 0.100. 2pq = 2(0.900)(0.100) = 0.180."
      },
      {
        id: "carrier_count",
        label: "Number of Heterozygous Carriers",
        symbol: "2pq × N",
        expectedAnswer: "450",
        acceptableAnswers: ["450", "450 people", "450 carriers"],
        unit: "people",
        tableCellReference: "Table Generator Quick Summary Card (Carriers)",
        hint: "Multiply 0.180 by total population 2,500.",
        explanation: "Number of carriers = 0.180 × 2,500 = 450 people."
      }
    ],
    tableHighlightNote: "Even when only 1% (25 people) show the recessive condition, 18% (450 people) are silent carriers!",
    examinerTip: "Don't confuse q (0.100) with q² (0.010). Forgetting to take the square root loses marks."
  },
  {
    id: 3,
    title: "Pea Plant Stem Length",
    species: "Pisum sativum (Garden Pea)",
    populationN: 5000,
    recessiveCount: 1800,
    dominantTrait: "Tall stem (dominant)",
    recessiveTrait: "Dwarf stem (recessive)",
    scenario: "A botanical research plot contains 5,000 pea plants. Tall stem length is dominant to dwarf stem length. Exactly 1,800 plants have dwarf stems.",
    questionText: "Enter Total N = 5,000 and Recessive = 1,800 into the Table Generator to verify the allele frequencies and phenotypic distribution.",
    tasks: [
      {
        id: "q_freq",
        label: "Dwarf Recessive Allele Frequency",
        symbol: "q",
        expectedAnswer: "0.600",
        acceptableAnswers: ["0.6", "0.60", "0.600"],
        tableCellReference: "Table Generator Row 1 (Step 2: Recessive Allele)",
        hint: "q² = 1800/5000 = 0.360. Take the square root.",
        explanation: "q² = 1800 / 5000 = 0.360. q = √0.360 = 0.600."
      },
      {
        id: "p_freq",
        label: "Tall Dominant Allele Frequency",
        symbol: "p",
        expectedAnswer: "0.400",
        acceptableAnswers: ["0.4", "0.40", "0.400"],
        tableCellReference: "Table Generator Row 2 (Step 3: Dominant Allele)",
        hint: "p = 1 - q = 1 - 0.600.",
        explanation: "p = 1 - 0.600 = 0.400."
      },
      {
        id: "homo_dom_freq",
        label: "Homozygous Dominant Genotype Frequency",
        symbol: "p²",
        expectedAnswer: "0.160",
        acceptableAnswers: ["0.16", "0.160"],
        tableCellReference: "Table Generator Row 2 (Step 4b: Homozygous Dominant)",
        hint: "p² = (0.400)².",
        explanation: "p² = (0.400)² = 0.160."
      },
      {
        id: "dominant_total_count",
        label: "Total Number of Tall Plants",
        symbol: "(p² + 2pq) × N",
        expectedAnswer: "3200",
        acceptableAnswers: ["3200", "3200 plants", "3,200"],
        unit: "plants",
        tableCellReference: "Table Generator Dominant Row (Count / Total)",
        hint: "Total plants (5,000) minus dwarf plants (1,800), or (p² + 2pq) × 5,000.",
        explanation: "Tall plants include both homozygous tall (800) and heterozygous tall (2,400) = 3,200 plants."
      }
    ],
    tableHighlightNote: "Notice that dominant phenotype = homozygous dominant (800) + heterozygous (2,400) = 3,200 plants.",
    examinerTip: "Remember: dominant phenotype frequency is p² + 2pq = 1 - q², NOT just p²."
  },
  {
    id: 4,
    title: "Peppered Moth Melanism",
    species: "Biston betularia (Peppered Moth)",
    populationN: 10000,
    recessiveCount: 36,
    dominantTrait: "Melanic / Black wings (dominant)",
    recessiveTrait: "Light / Typical wings (recessive)",
    scenario: "In an industrial forest reserve of 10,000 peppered moths, melanic dark wings are dominant to light-colored peppered wings. A night light trap survey captures 36 light-colored moths.",
    questionText: "Set N = 10,000 and Recessive = 36 in the Table Generator to compute the precise allele frequencies and carrier numbers.",
    tasks: [
      {
        id: "q2_freq",
        label: "Homozygous Recessive Genotype Frequency",
        symbol: "q²",
        expectedAnswer: "0.0036",
        acceptableAnswers: ["0.0036", "0.004"],
        tableCellReference: "Table Generator Row 1 (Step 1)",
        hint: "36 divided by 10,000.",
        explanation: "q² = 36 / 10,000 = 0.0036."
      },
      {
        id: "q_freq",
        label: "Recessive Allele Frequency",
        symbol: "q",
        expectedAnswer: "0.060",
        acceptableAnswers: ["0.06", "0.060"],
        tableCellReference: "Table Generator Row 1 (Step 2)",
        hint: "√0.0036.",
        explanation: "q = √0.0036 = 0.060."
      },
      {
        id: "p_freq",
        label: "Dominant Allele Frequency",
        symbol: "p",
        expectedAnswer: "0.940",
        acceptableAnswers: ["0.94", "0.940"],
        tableCellReference: "Table Generator Row 2 (Step 3)",
        hint: "1 - 0.060.",
        explanation: "p = 1 - 0.060 = 0.940."
      },
      {
        id: "carrier_count",
        label: "Number of Heterozygous Carrier Moths",
        symbol: "2pq × N",
        expectedAnswer: "1128",
        acceptableAnswers: ["1128", "1,128", "1128 moths"],
        unit: "moths",
        tableCellReference: "Table Generator Row 2 (Heterozygous Count)",
        hint: "2pq = 2(0.940)(0.060) = 0.1128. Multiply by 10,000.",
        explanation: "Number of carriers = 2(0.940)(0.060) × 10,000 = 0.1128 × 10,000 = 1,128 moths."
      }
    ],
    tableHighlightNote: "Small recessive numbers (36 out of 10,000) produce 1,128 carriers—over 30 times more carriers than homozygous recessive individuals!",
    examinerTip: "When dealing with decimals with leading zeroes like 0.0036, keep the exact precision in your calculator before taking the square root."
  },
  {
    id: 5,
    title: "Gazelle Coat Stripe Variation",
    species: "Eudorcas thomsonii (Thomson's Gazelle)",
    populationN: 40000,
    recessiveCount: 640,
    dominantTrait: "Standard side stripe (dominant)",
    recessiveTrait: "Faint stripe (recessive)",
    scenario: "In a wildlife reserve of 40,000 gazelles, a faint side stripe is an autosomal recessive condition. A drone census counts 640 gazelles with the faint stripe.",
    questionText: "Load N = 40,000 and Recessive = 640 into the Table Generator to evaluate the entire genetic matrix.",
    tasks: [
      {
        id: "q2_freq",
        label: "Homozygous Recessive Genotype Frequency",
        symbol: "q²",
        expectedAnswer: "0.016",
        acceptableAnswers: ["0.016", "0.0160"],
        tableCellReference: "Table Generator Row 1 (Step 1)",
        hint: "640 / 40,000.",
        explanation: "q² = 640 / 40,000 = 0.016."
      },
      {
        id: "q_freq",
        label: "Recessive Allele Frequency",
        symbol: "q",
        expectedAnswer: "0.126",
        acceptableAnswers: ["0.126", "0.1265", "0.13"],
        tableCellReference: "Table Generator Row 1 (Step 2)",
        hint: "√0.016 ≈ 0.126.",
        explanation: "q = √0.016 = 0.126 (or 0.1265)."
      },
      {
        id: "p_freq",
        label: "Dominant Allele Frequency",
        symbol: "p",
        expectedAnswer: "0.874",
        acceptableAnswers: ["0.874", "0.8735", "0.87"],
        tableCellReference: "Table Generator Row 2 (Step 3)",
        hint: "1 - 0.126.",
        explanation: "p = 1 - 0.126 = 0.874."
      },
      {
        id: "homo_dom_count",
        label: "Number of Homozygous Dominant Gazelles",
        symbol: "p² × N",
        expectedAnswer: "30555",
        acceptableAnswers: ["30555", "30556", "30,555", "30,556"],
        unit: "gazelles",
        tableCellReference: "Table Generator Row 2 (Homozygous p² Count)",
        hint: "p² × 40,000 = (0.874)² × 40,000.",
        explanation: "Homozygous dominant = p² × N = (0.874)² × 40,000 ≈ 30,555 gazelles."
      }
    ],
    tableHighlightNote: "The table automatically splits the 39,360 dominant gazelles into 30,555 homozygous dominant (p²) and 8,805 heterozygous carriers (2pq).",
    examinerTip: "Notice how the total dominant individuals equals Homozygous Dominant + Heterozygotes."
  }
];
