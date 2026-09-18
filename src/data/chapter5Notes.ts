import { 
  hwLargePopulationImg, 
  hwRandomMatingImg, 
  hwNoMutationImg, 
  hwNoMigrationImg, 
  hwNoSelectionImg 
} from '../assets/images';

export interface ConditionInfo {
  id: number;
  condition: string;
  shortTitle: string;
  explanation: string;
  violationEffect: string;
  miniExample: string;
  relatedEvolutionFactor: string;
  imageUrl: string;
  imageCaption: string;
  animationKey: 'large-population' | 'random-mating' | 'no-mutation' | 'no-migration' | 'no-selection';
}

export const HARDY_WEINBERG_CONDITIONS: ConditionInfo[] = [
  {
    id: 1,
    condition: "1. Large population size",
    shortTitle: "Large Population",
    explanation: "In a very large population, any change in allele frequencies due to random chance is negligible. Genetic drift does not cause allele frequencies to change significantly.",
    violationEffect: "Small population size leads to Genetic Drift (random fluctuation of allele frequencies purely by chance, which can cause alleles to be lost or fixed).",
    miniExample: "If 2 out of 10 butterflies die, 20% of the gene pool changes. If 2 out of 10,000 die, the change is practically zero.",
    relatedEvolutionFactor: "Small population size (leads to Genetic Drift)",
    imageUrl: hwLargePopulationImg,
    imageCaption: "A massive population of thousands of individuals buffers against random genetic drift.",
    animationKey: "large-population"
  },
  {
    id: 2,
    condition: "2. Random mating / random fertilization",
    shortTitle: "Random Mating",
    explanation: "Individuals must pair and mate entirely by chance, with no preference for genotypes or phenotypes. Every individual has an equal chance to mate freely.",
    violationEffect: "Non-random mating (sexual selection, assortative mating, or inbreeding) changes genotype frequencies from H-W proportions.",
    miniExample: "If female peacocks only choose males with the largest tail feathers, the allele for large feathers increases over generations.",
    relatedEvolutionFactor: "Non-random mating / sexual selection",
    imageUrl: hwRandomMatingImg,
    imageCaption: "Gametes (sperm & ova) fuse randomly with probabilities determined purely by p and q.",
    animationKey: "random-mating"
  },
  {
    id: 3,
    condition: "3. No mutation",
    shortTitle: "No Mutation",
    explanation: "No new alleles are introduced into the gene pool through spontaneous DNA mutations, and alleles do not mutate from one form to another.",
    violationEffect: "Mutations create new alleles or change allele frequencies directly, introducing novel genetic variation.",
    miniExample: "A point mutation in gene A creates a novel allele a', shifting the gene pool equilibrium.",
    relatedEvolutionFactor: "Mutation introduces new alleles",
    imageUrl: hwNoMutationImg,
    imageCaption: "DNA base sequences remain conserved with 100% replication fidelity.",
    animationKey: "no-mutation"
  },
  {
    id: 4,
    condition: "4. No migration",
    shortTitle: "No Migration",
    explanation: "No individuals enter (immigrate) or leave (emigrate) the population. Hence, there is no gene flow between populations.",
    violationEffect: "Migration causes Gene Flow (transfer of genetic material from one population to another), introducing or removing alleles.",
    miniExample: "1000 homozygous brown goats arriving at an island introduces 2000 dominant alleles, changing allele frequencies.",
    relatedEvolutionFactor: "Migration causes Gene Flow",
    imageUrl: hwNoMigrationImg,
    imageCaption: "A geographically isolated population with closed gene pool boundaries.",
    animationKey: "no-migration"
  },
  {
    id: 5,
    condition: "5. No natural selection",
    shortTitle: "No Natural Selection",
    explanation: "All individuals are sexually active and equally fertile, so that alleles have the same level of reproductive advantages and disadvantages in the environment.",
    violationEffect: "Natural selection favors individuals with advantageous phenotypes, causing those alleles to become more common.",
    miniExample: "Fair insects on dark tree bark are more easily spotted by predators and killed, reducing the fair allele frequency.",
    relatedEvolutionFactor: "Natural selection favors fit phenotypes",
    imageUrl: hwNoSelectionImg,
    imageCaption: "All color morphs and phenotypes enjoy equal viability and reproductive fitness.",
    animationKey: "no-selection"
  }
];

export const DECIMAL_RULES = [
  { range: "10 - 99", decimals: 1, rule: "1 decimal place" },
  { range: "100 - 999", decimals: 2, rule: "2 decimal places (also if pop. size is given in %)" },
  { range: "1000 and above", decimals: 3, rule: "3 decimal places (unless question states 4 or 5 d.p.)" }
];

export const POPGEN_SYMBOLS = [
  {
    symbol: "p",
    name: "Frequency of dominant allele",
    equation: "p = 1 - q",
    meaning: "The proportion of all alleles in the gene pool that are the dominant allele (e.g. allele A or B).",
    whenToUse: "When asked for allele frequency of the dominant allele or when calculating p² and 2pq.",
    example: "If q = 0.4, then p = 1 - 0.4 = 0.6."
  },
  {
    symbol: "q",
    name: "Frequency of recessive allele",
    equation: "q = √q²",
    meaning: "The proportion of all alleles in the gene pool that are the recessive allele (e.g. allele a or b).",
    whenToUse: "The fundamental starting point! Always calculate q first from homozygous recessive genotype frequency (√q²).",
    example: "If 16% have white fur (q² = 0.16), then q = √0.16 = 0.4."
  },
  {
    symbol: "p²",
    name: "Frequency of homozygous dominant genotype",
    equation: "p² = (p)²",
    meaning: "The proportion of individuals in the population with genotype AA or BB.",
    whenToUse: "When asked for the genotype frequency of homozygous dominant individuals.",
    example: "If p = 0.6, p² = (0.6)² = 0.36."
  },
  {
    symbol: "q²",
    name: "Frequency of homozygous recessive genotype",
    equation: "q² = Number of recessive individuals / Total individuals",
    meaning: "The proportion of individuals showing the recessive phenotype (e.g. genotype aa).",
    whenToUse: "ALWAYS START HERE! Because recessive phenotype directly reveals the homozygous genotype (aa).",
    example: "4 out of 5000 individuals have disease: q² = 4 / 5000 = 0.0008."
  },
  {
    symbol: "2pq",
    name: "Frequency of heterozygous genotype (Carriers)",
    equation: "2pq = 2 × p × q",
    meaning: "The proportion of individuals with genotype Aa or Bb. In recessive disorders, these are normal-looking carriers.",
    whenToUse: "When asked for heterozygous genotype frequency, carriers, or when calculating carrier count.",
    example: "If p = 0.7 and q = 0.3, 2pq = 2(0.7)(0.3) = 0.42 (42%)."
  }
];

export const FORMULA_MEMORY_DRILLS = [
  {
    question: "The question asks for the 'number of heterozygous individuals' in a population of size N.",
    correctChoice: "2pq × N",
    choices: [
      { label: "q² × N", isCorrect: false, explanation: "q² × N gives the number of homozygous recessive individuals, not heterozygotes." },
      { label: "p² × N", isCorrect: false, explanation: "p² × N gives the number of homozygous dominant individuals." },
      { label: "2pq × N", isCorrect: true, explanation: "Correct! 2pq is the heterozygous genotype frequency; multiply by total individuals N to get the count." },
      { label: "p + q", isCorrect: false, explanation: "p + q = 1 is the sum of allele frequencies, not an individual count." }
    ]
  },
  {
    question: "The question asks for the 'frequency of the recessive allele'. What symbol must you find?",
    correctChoice: "q",
    choices: [
      { label: "q²", isCorrect: false, explanation: "q² is the frequency of the homozygous recessive GENOTYPE. Allele frequency is q." },
      { label: "q", isCorrect: true, explanation: "Correct! q represents the frequency of the recessive allele, obtained by √q²." },
      { label: "p", isCorrect: false, explanation: "p is the frequency of the DOMINANT allele." },
      { label: "2pq", isCorrect: false, explanation: "2pq is the frequency of heterozygous individuals." }
    ]
  },
  {
    question: "The question asks for the 'percentage of individuals with dominant phenotype'.",
    correctChoice: "(p² + 2pq) × 100% or (1 - q²) × 100%",
    choices: [
      { label: "p² × 100%", isCorrect: false, explanation: "p² only accounts for homozygous dominant; dominant phenotype also includes heterozygotes (2pq)!" },
      { label: "(p² + 2pq) × 100%", isCorrect: true, explanation: "Correct! Individuals showing the dominant trait include BOTH homozygous dominant (p²) and heterozygous (2pq)." },
      { label: "2pq × 100%", isCorrect: false, explanation: "2pq is only the heterozygous fraction, missing the homozygous dominant individuals." },
      { label: "p × 100%", isCorrect: false, explanation: "p is an allele frequency, not a phenotype frequency." }
    ]
  },
  {
    question: "You are given that 36% of mice have white coats (recessive). What is your FIRST step?",
    correctChoice: "Calculate q² = 36/100 = 0.36",
    choices: [
      { label: "Calculate p² = 64/100", isCorrect: false, explanation: "NEVER assume black coat mice are all homozygous dominant. They consist of both p² and 2pq!" },
      { label: "Calculate q² = 36/100 = 0.36", isCorrect: true, explanation: "Correct! Always start with recessive trait because recessive phenotype = homozygous recessive genotype (q²)." },
      { label: "Calculate p = 1 - 0.36", isCorrect: false, explanation: "You cannot subtract genotype frequency q² from allele frequency formula p + q = 1!" },
      { label: "Calculate 2pq", isCorrect: false, explanation: "You need p and q first before you can calculate 2pq." }
    ]
  }
];
