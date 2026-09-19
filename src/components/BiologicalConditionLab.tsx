import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Layers,
  ArrowRight,
  Sparkles,
  Dna,
  Scale,
  Users,
  Shuffle,
  Eye,
  Sliders,
  Award,
  ChevronRight,
  Info,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

// Single Beetle Component for Population Display
interface BeetleItemProps {
  id: number;
  genotype: 'AA' | 'Aa' | 'aa';
  selected?: boolean;
  isMutated?: boolean;
  onClick?: () => void;
}

const BeetleItem: React.FC<BeetleItemProps> = ({ id, genotype, selected, isMutated, onClick }) => {
  const meta = {
    AA: {
      body: '#1e1b4b',
      leftWing: '#3730a3',
      rightWing: '#312e81',
      accent: '#818cf8',
      label: 'AA',
      badgeClass: 'bg-indigo-950 text-indigo-200 border-indigo-700'
    },
    Aa: {
      body: '#2e1065',
      leftWing: '#6b21a8',
      rightWing: '#581c87',
      accent: '#c084fc',
      label: 'Aa',
      badgeClass: 'bg-purple-950 text-purple-200 border-purple-700'
    },
    aa: {
      body: '#78350f',
      leftWing: '#d97706',
      rightWing: '#b45309',
      accent: '#fcd34d',
      label: 'aa',
      badgeClass: 'bg-amber-950 text-amber-200 border-amber-700'
    }
  }[genotype];

  return (
    <button
      type="button"
      onClick={onClick}
      title={`Beetle #${id + 1} • Genotype: ${genotype}`}
      className={`relative p-1 rounded-xl flex flex-col items-center justify-center transition-all transform cursor-pointer select-none ${
        selected
          ? 'scale-115 ring-2 ring-purple-500 bg-purple-100 shadow-md z-10'
          : 'hover:scale-108 hover:bg-purple-50/80'
      }`}
    >
      {isMutated && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
      )}
      <svg viewBox="0 0 100 100" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-2xs">
        {/* Legs */}
        <path d="M 28 38 L 12 28 M 28 50 L 10 50 M 28 64 L 14 74" stroke={meta.body} strokeWidth="6" strokeLinecap="round" />
        <path d="M 72 38 L 88 28 M 72 50 L 90 50 M 72 64 L 86 74" stroke={meta.body} strokeWidth="6" strokeLinecap="round" />
        {/* Antennae */}
        <path d="M 44 24 Q 38 10 28 8" stroke={meta.body} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 56 24 Q 62 10 72 8" stroke={meta.body} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Head */}
        <circle cx="50" cy="28" r="11" fill={meta.body} />
        {/* Elytra (Wing Cases) */}
        <path d="M 49 44 Q 26 46 28 82 Q 40 92 49 88 Z" fill={meta.leftWing} stroke={meta.accent} strokeWidth="2" />
        <path d="M 51 44 Q 74 46 72 82 Q 60 92 51 88 Z" fill={meta.rightWing} stroke={meta.accent} strokeWidth="2" />
        {/* Genotype markings */}
        {genotype === 'AA' && (
          <circle cx="50" cy="65" r="4.5" fill="#a5b4fc" />
        )}
        {genotype === 'Aa' && (
          <>
            <circle cx="42" cy="65" r="3" fill="#e9d5ff" />
            <circle cx="58" cy="65" r="3" fill="#fef08a" />
          </>
        )}
        {genotype === 'aa' && (
          <circle cx="50" cy="65" r="4.5" fill="#fde047" />
        )}
      </svg>
      <span className={`text-[8.5px] font-mono font-bold px-1 rounded border leading-none mt-0.5 ${meta.badgeClass}`}>
        {meta.label}
      </span>
    </button>
  );
};

export interface HistoryRecord {
  gen: number;
  p: number;
  q: number;
  p2: number;
  twoPq: number;
  q2: number;
  countAA: number;
  countAa: number;
  countaa: number;
  totalN: number;
  status: 'EQUILIBRIUM' | 'FLUCTUATION' | 'VIOLATED';
  activeViolations: string[];
}

export const BiologicalConditionLab: React.FC = () => {
  // Gate: Enter Lab screen
  const [labEntered, setLabEntered] = useState<boolean>(false);

  // The 5 Fundamental Biological Conditions (Initially all satisfied/true)
  const [largePop, setLargePop] = useState<boolean>(true);
  const [randomMating, setRandomMating] = useState<boolean>(true);
  const [noMutation, setNoMutation] = useState<boolean>(true);
  const [noMigration, setNoMigration] = useState<boolean>(true);
  const [noSelection, setNoSelection] = useState<boolean>(true);

  // Sub-parameters for broken conditions:
  // 1. Genetic Drift: Pop Size
  const [driftPopSize, setDriftPopSize] = useState<number>(10);
  // 2. Non-Random Mating: type
  const [matingType, setMatingType] = useState<'assortative' | 'disassortative'>('assortative');
  // 3. Mutation Rate and direction
  const [mutationRate, setMutationRate] = useState<number>(0.05);
  const [mutationDirection, setMutationDirection] = useState<'A_to_a' | 'a_to_A'>('A_to_a');
  // 4. Migration Rate and immigrant frequency
  const [migrationRate, setMigrationRate] = useState<number>(0.15);
  const immigrantP = 0.20; // 80% a, 20% A
  // 5. Natural Selection: Advantageous Genotype & Pressure
  const [favoredGenotype, setFavoredGenotype] = useState<'AA' | 'Aa' | 'aa'>('AA');
  const [selectionPressure, setSelectionPressure] = useState<number>(0.50); // 50% relative disadvantage to non-favored

  // Simulation Status State
  const [generation, setGeneration] = useState<number>(0);
  const [p, setP] = useState<number>(0.70);
  const q = useMemo(() => Number((1 - p).toFixed(4)), [p]);

  // Selected individual for inspection
  const [selectedBeetleId, setSelectedBeetleId] = useState<number | null>(0);
  const [groupBeetles, setGroupBeetles] = useState<boolean>(false);

  // Transition Animation states
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionPhase, setTransitionPhase] = useState<string>('');
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  // Think First Prediction Feature
  const [predictionActive, setPredictionActive] = useState<boolean>(false);
  const [predictedDirection, setPredictedDirection] = useState<'increase' | 'decrease' | 'stable' | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<{
    submitted: boolean;
    correct: boolean;
    observeText: string;
    explainText: string;
  } | null>(null);

  // Active violations list
  const violatedList = useMemo(() => {
    const list: string[] = [];
    if (!largePop) list.push('Small Population (Genetic Drift)');
    if (!randomMating) list.push('Non-Random Mating');
    if (!noMutation) list.push('Mutation');
    if (!noMigration) list.push('Migration (Gene Flow)');
    if (!noSelection) list.push('Natural Selection');
    return list;
  }, [largePop, randomMating, noMutation, noMigration, noSelection]);

  // Initial population generation 0 (N = 50 beetles)
  // p = 0.70 -> p2 = 0.49 (25), 2pq = 0.42 (21), q2 = 0.09 (4)
  const [history, setHistory] = useState<HistoryRecord[]>([
    {
      gen: 0,
      p: 0.70,
      q: 0.30,
      p2: 0.49,
      twoPq: 0.42,
      q2: 0.09,
      countAA: 25,
      countAa: 21,
      countaa: 4,
      totalN: 50,
      status: 'EQUILIBRIUM',
      activeViolations: []
    }
  ]);

  const latest = history[history.length - 1];
  const initial = history[0];
  const deltaP = Number((latest.p - initial.p).toFixed(4));
  const deltaQ = Number((latest.q - initial.q).toFixed(4));

  // Determine current population size based on drift
  const currentTotalN = useMemo(() => {
    return !largePop ? driftPopSize : 50;
  }, [largePop, driftPopSize]);

  // Generate population beetles array
  const currentBeetles = useMemo(() => {
    const beetles: Array<{ id: number; genotype: 'AA' | 'Aa' | 'aa'; isMutated?: boolean }> = [];
    let id = 0;
    for (let i = 0; i < latest.countAA; i++) beetles.push({ id: id++, genotype: 'AA' });
    for (let i = 0; i < latest.countAa; i++) beetles.push({ id: id++, genotype: 'Aa' });
    for (let i = 0; i < latest.countaa; i++) beetles.push({ id: id++, genotype: 'aa' });
    return beetles;
  }, [latest]);

  // Determine intelligent status
  const currentStatus: 'EQUILIBRIUM' | 'FLUCTUATION' | 'VIOLATED' = useMemo(() => {
    if (violatedList.length === 0) {
      return 'EQUILIBRIUM';
    }
    // If only drift is active, and p hasn't drastically shifted yet, indicate fluctuation
    if (violatedList.length === 1 && !largePop && Math.abs(deltaP) < 0.06) {
      return 'FLUCTUATION';
    }
    return 'VIOLATED';
  }, [violatedList, largePop, deltaP]);

  // Prompt prediction when a condition is violated for the first time
  const handleToggleCondition = (conditionKey: string) => {
    if (conditionKey === 'largePop') setLargePop(prev => !prev);
    if (conditionKey === 'randomMating') setRandomMating(prev => !prev);
    if (conditionKey === 'noMutation') setNoMutation(prev => !prev);
    if (conditionKey === 'noMigration') setNoMigration(prev => !prev);
    if (conditionKey === 'noSelection') setNoSelection(prev => !prev);

    // Trigger Think First prediction prompt
    setPredictionActive(true);
    setPredictedDirection(null);
    setPredictionFeedback(null);
  };

  // Run next biological generation step
  const executeGenerationStep = () => {
    setIsTransitioning(true);
    setTransitionPhase('Mating & Gamete Pool Formation...');

    setTimeout(() => {
      setTransitionPhase('Applying Evolutionary Pressures & Offspring Development...');

      setTimeout(() => {
        let newP = p;
        const currentP = p;

        // 1. Natural Selection
        if (!noSelection) {
          let wAA = 1.0;
          let wAa = 1.0;
          let waa = 1.0;

          if (favoredGenotype === 'AA') {
            wAa = 1.0 - selectionPressure * 0.4;
            waa = 1.0 - selectionPressure;
          } else if (favoredGenotype === 'Aa') {
            wAA = 1.0 - selectionPressure * 0.5;
            waa = 1.0 - selectionPressure * 0.5;
          } else if (favoredGenotype === 'aa') {
            wAA = 1.0 - selectionPressure;
            wAa = 1.0 - selectionPressure * 0.4;
          }

          const meanW = (newP * newP * wAA) + (2 * newP * (1 - newP) * wAa) + ((1 - newP) * (1 - newP) * waa);
          newP = ((newP * newP * wAA) + (newP * (1 - newP) * wAa)) / meanW;
        }

        // 2. Mutation
        if (!noMutation) {
          if (mutationDirection === 'A_to_a') {
            newP = newP * (1 - mutationRate);
          } else {
            newP = newP + (1 - newP) * mutationRate;
          }
        }

        // 3. Migration (Gene Flow)
        if (!noMigration) {
          newP = (1 - migrationRate) * newP + migrationRate * immigrantP;
        }

        // 4. Genetic Drift (Binomial Sampling in small populations)
        const targetN = !largePop ? driftPopSize : 50;
        if (!largePop) {
          const totalAlleles = targetN * 2;
          let sampledDominant = 0;
          for (let i = 0; i < totalAlleles; i++) {
            if (Math.random() < newP) sampledDominant++;
          }
          newP = sampledDominant / totalAlleles;
        }

        // Boundary clamp
        newP = Math.max(0.00, Math.min(1.00, Number(newP.toFixed(4))));
        const newQ = Number((1 - newP).toFixed(4));

        // 5. Genotype frequency calculation (Hardy-Weinberg vs Inbreeding/Assortative Mating)
        let fAA = newP * newP;
        let fAa = 2 * newP * newQ;
        let faa = newQ * newQ;

        // Non-Random Mating modifies genotype frequencies WITHOUT changing allele frequency!
        if (!randomMating) {
          if (matingType === 'assortative') {
            const F = 0.50; // inbreeding coefficient
            fAA = newP * newP + F * newP * newQ;
            fAa = 2 * newP * newQ * (1 - F);
            faa = newQ * newQ + F * newP * newQ;
          } else {
            // disassortative
            const excessHet = Math.min(newP * newQ * 0.4, fAA * 0.5, faa * 0.5);
            fAA = Math.max(0, fAA - excessHet);
            faa = Math.max(0, faa - excessHet);
            fAa = Math.min(1.0, fAa + 2 * excessHet);
          }
        }

        // Allocate beetles to integer counts
        let countAA = Math.round(fAA * targetN);
        let countaa = Math.round(faa * targetN);
        let countAa = targetN - countAA - countaa;

        if (countAa < 0) {
          countAa = 0;
          if (countAA + countaa > targetN) {
            countAA = targetN - countaa;
          }
        }

        const nextGen = generation + 1;
        setP(newP);
        setGeneration(nextGen);

        const newRecord: HistoryRecord = {
          gen: nextGen,
          p: newP,
          q: newQ,
          p2: Number(fAA.toFixed(4)),
          twoPq: Number(fAa.toFixed(4)),
          q2: Number(faa.toFixed(4)),
          countAA,
          countAa,
          countaa,
          totalN: targetN,
          status: violatedList.length === 0 ? 'EQUILIBRIUM' : (!largePop && Math.abs(newP - 0.7) < 0.05 ? 'FLUCTUATION' : 'VIOLATED'),
          activeViolations: [...violatedList]
        };

        setHistory(prev => [...prev.slice(-24), newRecord]);
        setIsTransitioning(false);
        setTransitionPhase('');

        // Evaluate Think First prediction if active
        if (predictedDirection) {
          const actualChange = newP > currentP + 0.005 ? 'increase' : (newP < currentP - 0.005 ? 'decrease' : 'stable');
          const isCorrect = actualChange === predictedDirection;
          
          let explain = '';
          if (!noSelection) {
            explain = `Natural selection preferentially favored the ${favoredGenotype} genotype, causing the frequency of the associated allele to ${actualChange}.`;
          } else if (!randomMating) {
            explain = `Assortative non-random mating shifted homozygote vs heterozygote genotype ratios while p and q allele frequencies remained approximately stable!`;
          } else if (!noMutation) {
            explain = `Unidirectional mutation shifted allele frequencies in the direction of the mutating gene pool.`;
          } else if (!noMigration) {
            explain = `Immigrant gene flow introduced foreign alleles into the resident population, altering allele frequencies.`;
          } else if (!largePop) {
            explain = `In a small population of N = ${driftPopSize}, random sampling error (genetic drift) caused allele frequencies to fluctuate by chance.`;
          } else {
            explain = `All 5 conditions were satisfied, so allele frequencies remained in stable genetic equilibrium.`;
          }

          setPredictionFeedback({
            submitted: true,
            correct: isCorrect,
            observeText: `Generation ${nextGen}: Allele p shifted from ${currentP.toFixed(2)} to ${newP.toFixed(2)} (${actualChange}).`,
            explainText: explain
          });
        }
      }, 350);
    }, 350);
  };

  // Run 5 generations in succession
  const handleRunFive = () => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      executeGenerationStep();
      if (count >= 5) clearInterval(interval);
    }, 750);
  };

  // Auto-play effect
  useEffect(() => {
    let timer: any = null;
    if (autoPlay) {
      timer = setInterval(() => {
        executeGenerationStep();
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [autoPlay, p, largePop, randomMating, noMutation, noMigration, noSelection, driftPopSize, favoredGenotype, selectionPressure, mutationRate, migrationRate]);

  // Full Lab Reset
  const handleResetLab = () => {
    setAutoPlay(false);
    setIsTransitioning(false);
    setGeneration(0);
    setP(0.70);
    setLargePop(true);
    setRandomMating(true);
    setNoMutation(true);
    setNoMigration(true);
    setNoSelection(true);
    setDriftPopSize(10);
    setSelectionPressure(0.50);
    setFavoredGenotype('AA');
    setMutationRate(0.05);
    setMigrationRate(0.15);
    setPredictionActive(false);
    setPredictedDirection(null);
    setPredictionFeedback(null);
    setHistory([
      {
        gen: 0,
        p: 0.70,
        q: 0.30,
        p2: 0.49,
        twoPq: 0.42,
        q2: 0.09,
        countAA: 25,
        countAa: 21,
        countaa: 4,
        totalN: 50,
        status: 'EQUILIBRIUM',
        activeViolations: []
      }
    ]);
  };

  // Render Enter the Lab Gate screen if not entered
  if (!labEntered) {
    return (
      <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-3xl border-2 border-purple-400/40 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-widest">
          <Dna className="w-4 h-4 animate-spin-slow" />
          <span>Interactive Virtual Laboratory</span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            🧬 HARDY-WEINBERG BIOLOGICAL CONDITION LAB
          </h3>
          <p className="text-base sm:text-lg text-purple-200 font-semibold">
            Can this population remain genetically stable?
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-purple-900/60 rounded-2xl border border-purple-700/80 text-sm sm:text-base text-purple-100 leading-relaxed max-w-3xl">
          Hardy-Weinberg equilibrium describes a population in which <strong>allele frequencies remain constant from generation to generation</strong> when specific conditions are maintained. Step inside this interactive genetics laboratory to control the 5 biological conditions, test evolutionary forces, and discover what keeps populations in equilibrium.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-3xl">
          <div className="p-3 bg-purple-950/70 rounded-xl border border-purple-800 text-center">
            <span className="text-[11px] font-bold text-purple-300 uppercase block">Starting Gene Pool</span>
            <span className="text-base font-black text-amber-300 font-mono">p = 0.70, q = 0.30</span>
          </div>
          <div className="p-3 bg-purple-950/70 rounded-xl border border-purple-800 text-center">
            <span className="text-[11px] font-bold text-purple-300 uppercase block">Starting Population</span>
            <span className="text-base font-black text-indigo-300 font-mono">N = 50 Individuals</span>
          </div>
          <div className="p-3 bg-purple-950/70 rounded-xl border border-purple-800 text-center">
            <span className="text-[11px] font-bold text-purple-300 uppercase block">Experimental Target</span>
            <span className="text-base font-black text-emerald-300 font-mono">Test 5 Conditions</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setLabEntered(true)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/25 flex items-center gap-3 transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
          >
            <span>ENTER THE LAB</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Active Laboratory Workspace
  return (
    <div className="bg-white rounded-3xl border-2 border-purple-300 shadow-md overflow-hidden space-y-0 transition-all">
      {/* Lab Header Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white border-b-2 border-purple-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-800/90 text-purple-200 border border-purple-600 text-xs font-black uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Digital Biology Laboratory</span>
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-900/90 border border-indigo-700 text-indigo-200">
              Gen {generation}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🧬 HARDY-WEINBERG BIOLOGICAL CONDITION LAB</span>
          </h3>
          <p className="text-xs sm:text-sm text-purple-200 font-medium">
            Central Inquiry: <strong>Can I keep this population in Hardy-Weinberg equilibrium?</strong>
          </p>
        </div>

        {/* Global Reset & Pause Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              autoPlay
                ? 'bg-amber-500 text-amber-950 border-amber-400 shadow-md'
                : 'bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white border-purple-700'
            }`}
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoPlay ? 'PAUSE' : 'AUTO RUN'}</span>
          </button>

          <button
            onClick={handleResetLab}
            className="px-3.5 py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset population and all conditions back to Generation 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET LAB</span>
          </button>
        </div>
      </div>

      {/* Dynamic Status Indicator Banner */}
      <div className={`p-4 sm:p-5 border-b-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        currentStatus === 'EQUILIBRIUM'
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : currentStatus === 'FLUCTUATION'
          ? 'bg-amber-50 border-amber-300 text-amber-950'
          : 'bg-red-50 border-red-300 text-red-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            currentStatus === 'EQUILIBRIUM'
              ? 'bg-emerald-600 text-white shadow-sm'
              : currentStatus === 'FLUCTUATION'
              ? 'bg-amber-500 text-white shadow-sm animate-bounce'
              : 'bg-red-600 text-white shadow-sm animate-pulse'
          }`}>
            {currentStatus === 'EQUILIBRIUM' && <CheckCircle2 className="w-6 h-6" />}
            {currentStatus === 'FLUCTUATION' && <Activity className="w-6 h-6" />}
            {currentStatus === 'VIOLATED' && <AlertTriangle className="w-6 h-6" />}
          </div>

          <div>
            <div className="text-sm sm:text-base font-black tracking-tight">
              {currentStatus === 'EQUILIBRIUM' && '🟢 HARDY-WEINBERG CONDITIONS SATISFIED (EQUILIBRIUM DETECTED)'}
              {currentStatus === 'FLUCTUATION' && '🟡 STOCHASTIC FLUCTUATION DETECTED (GENETIC DRIFT)'}
              {currentStatus === 'VIOLATED' && '🔴 HARDY-WEINBERG CONDITION(S) VIOLATED (EVOLUTION OCCURRING)'}
            </div>
            <div className="text-xs font-semibold leading-relaxed">
              {currentStatus === 'EQUILIBRIUM' && 'Population is expected to remain in equilibrium. Allele frequencies p and q stay constant across generations.'}
              {currentStatus === 'FLUCTUATION' && 'Allele frequencies are drifting randomly due to small population sampling error.'}
              {currentStatus === 'VIOLATED' && (
                <span>
                  Active Evolutionary Forces: <strong>{violatedList.join(' • ')}</strong>. Allele or genotype frequencies are shifting over time.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Frequency Shift Gauges */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
            <span className="text-purple-600 text-[10px] block uppercase font-sans">Allele A</span>
            <span className="text-indigo-950 font-black">p = {latest.p.toFixed(3)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
            <span className="text-purple-600 text-[10px] block uppercase font-sans">Allele a</span>
            <span className="text-amber-900 font-black">q = {latest.q.toFixed(3)}</span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border font-sans text-[11px] font-extrabold ${
            Math.abs(deltaP) < 0.01
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-red-100 text-red-900 border-red-300'
          }`}>
            {Math.abs(deltaP) < 0.01 ? 'STABLE' : `Δp: ${deltaP >= 0 ? `+${deltaP.toFixed(2)}` : deltaP.toFixed(2)}`}
          </div>
        </div>
      </div>

      {/* Think First Challenge Alert Box (Appears when student toggles a condition) */}
      {predictionActive && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white border-b-2 border-purple-700 animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black tracking-wide uppercase">
                  THINK FIRST
                </span>
                <span className="text-xs text-purple-200 font-bold">
                  Formulate a biological hypothesis before advancing the generation!
                </span>
              </div>
              <button
                onClick={() => setPredictionActive(false)}
                className="text-xs text-purple-300 hover:text-white underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            <div className="font-bold text-sm sm:text-base">
              You altered the Hardy-Weinberg conditions ({violatedList.join(', ') || 'All Restored'}). What do you predict will happen to dominant allele frequency (p)?
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setPredictedDirection('increase')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  predictedDirection === 'increase'
                    ? 'bg-emerald-400 text-emerald-950 ring-2 ring-white'
                    : 'bg-purple-800 hover:bg-purple-700 text-white border border-purple-600'
                }`}
              >
                ▲ Increase
              </button>
              <button
                onClick={() => setPredictedDirection('decrease')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  predictedDirection === 'decrease'
                    ? 'bg-red-400 text-red-950 ring-2 ring-white'
                    : 'bg-purple-800 hover:bg-purple-700 text-white border border-purple-600'
                }`}
              >
                ▼ Decrease
              </button>
              <button
                onClick={() => setPredictedDirection('stable')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  predictedDirection === 'stable'
                    ? 'bg-amber-400 text-amber-950 ring-2 ring-white'
                    : 'bg-purple-800 hover:bg-purple-700 text-white border border-purple-600'
                }`}
              >
                ■ Remain Approximately Stable
              </button>

              <button
                onClick={executeGenerationStep}
                className="ml-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-purple-950 font-black text-xs shadow hover:from-emerald-300 hover:to-teal-300 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-purple-950" />
                <span>TEST HYPOTHESIS & RUN NEXT GEN</span>
              </button>
            </div>

            {predictionFeedback && (
              <div className="mt-3 p-3.5 rounded-xl bg-purple-950/90 border border-purple-500 text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    predictionFeedback.correct ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'
                  }`}>
                    {predictionFeedback.correct ? 'PREDICTION CONFIRMED' : 'UNEXPECTED OUTCOME'}
                  </span>
                  <span className="font-bold text-purple-200">
                    OBSERVE: {predictionFeedback.observeText}
                  </span>
                </div>
                <div className="text-purple-100 leading-relaxed">
                  <strong>EXPLAIN:</strong> {predictionFeedback.explainText}
                </div>
                <div className="text-[11px] text-amber-300 font-bold pt-1">
                  💡 Habit: Think First. Calculate Second. Use AI Wisely.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN LAB WORKSPACE: Left (Population Habitat) & Right (Condition Control Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* LEFT / MAIN AREA: Biological Population Simulation (Col 7) */}
        <div className="lg:col-span-7 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-purple-200 space-y-4 bg-purple-50/20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-extrabold text-purple-600 uppercase tracking-wider">
                Living Gene Pool Habitat
              </div>
              <h4 className="text-lg font-black text-purple-950">
                Population Overview ({currentTotalN} Organisms)
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setGroupBeetles(!groupBeetles)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-purple-200 bg-white hover:bg-purple-100 text-purple-900 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{groupBeetles ? 'Scatter Organisms' : 'Group by Genotype'}</span>
              </button>
            </div>
          </div>

          {/* Biological Reproduction Animation Overlay Banner */}
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3 rounded-xl bg-purple-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                <span>{transitionPhase}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Population Habitat Enclosure (Beetle Canvas) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white via-purple-50/40 to-emerald-50/20 border-2 border-purple-200 relative min-h-[280px]">
            {groupBeetles ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* AA Group */}
                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-indigo-950">AA Homozygotes</span>
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-900">
                      {latest.countAA} ({Math.round((latest.countAA / currentTotalN) * 100)}%)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
                    {currentBeetles.filter(b => b.genotype === 'AA').map(b => (
                      <BeetleItem
                        key={b.id}
                        id={b.id}
                        genotype={b.genotype}
                        selected={selectedBeetleId === b.id}
                        onClick={() => setSelectedBeetleId(b.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Aa Group */}
                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-purple-950">Aa Heterozygotes</span>
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">
                      {latest.countAa} ({Math.round((latest.countAa / currentTotalN) * 100)}%)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
                    {currentBeetles.filter(b => b.genotype === 'Aa').map(b => (
                      <BeetleItem
                        key={b.id}
                        id={b.id}
                        genotype={b.genotype}
                        selected={selectedBeetleId === b.id}
                        onClick={() => setSelectedBeetleId(b.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* aa Group */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-amber-950">aa Recessives</span>
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                      {latest.countaa} ({Math.round((latest.countaa / currentTotalN) * 100)}%)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
                    {currentBeetles.filter(b => b.genotype === 'aa').map(b => (
                      <BeetleItem
                        key={b.id}
                        id={b.id}
                        genotype={b.genotype}
                        selected={selectedBeetleId === b.id}
                        onClick={() => setSelectedBeetleId(b.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2 place-items-center">
                {currentBeetles.map(beetle => (
                  <BeetleItem
                    key={beetle.id}
                    id={beetle.id}
                    genotype={beetle.genotype}
                    selected={selectedBeetleId === beetle.id}
                    onClick={() => setSelectedBeetleId(beetle.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Individual Beetle Inspector Tooltip */}
          {selectedBeetleId !== null && (() => {
            const inspected = currentBeetles.find(b => b.id === selectedBeetleId) || currentBeetles[0];
            return (
              <div className="p-3.5 bg-white rounded-xl border-2 border-purple-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <BeetleItem id={inspected.id} genotype={inspected.genotype} />
                  <div>
                    <div className="font-extrabold text-purple-950 text-sm flex items-center gap-2">
                      <span>Individual #{inspected.id + 1}</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                        Genotype: {inspected.genotype}
                      </span>
                    </div>
                    <div className="text-purple-800 text-[11px] mt-0.5">
                      Phenotype: {
                        inspected.genotype === 'AA'
                          ? 'Dark Obsidian Dominant'
                          : inspected.genotype === 'Aa'
                          ? 'Purple Heterozygote (Dominant A expressed)'
                          : 'Golden Bronze Recessive'
                      }
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 font-medium">
                  Gamete contribution: <strong>{inspected.genotype === 'AA' ? 'A + A' : inspected.genotype === 'Aa' ? 'A + a' : 'a + a'}</strong>
                </div>
              </div>
            );
          })()}

          {/* Active Generation Primary Action Controls */}
          <div className="p-4 bg-purple-950 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                Laboratory Advancement
              </div>
              <div className="text-sm font-black">
                Advance: Gen {generation} → Gen {generation + 1}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={executeGenerationStep}
                disabled={isTransitioning}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>▶ RUN NEXT GENERATION</span>
              </button>

              <button
                onClick={handleRunFive}
                disabled={isTransitioning}
                className="px-3.5 py-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-purple-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-purple-700 transition-colors cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>+5 Gens</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT / CONTROL AREA: The 5 Hardy-Weinberg Conditions (Col 5) */}
        <div className="lg:col-span-5 p-5 sm:p-6 space-y-4 bg-white">
          <div className="border-b border-purple-100 pb-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-purple-950 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-700" />
                <span>5 Biological Conditions Controls</span>
              </h4>
              <button
                onClick={() => {
                  setLargePop(true);
                  setRandomMating(true);
                  setNoMutation(true);
                  setNoMigration(true);
                  setNoSelection(true);
                }}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-950 underline cursor-pointer"
              >
                Satisfy All 5
              </button>
            </div>
            <p className="text-xs text-purple-800">
              Flip any laboratory control to introduce that evolutionary force:
            </p>
          </div>

          <div className="space-y-3">
            {/* Condition 1: Large Population */}
            <div className={`p-3.5 rounded-2xl border-2 transition-all ${
              largePop ? 'bg-white border-emerald-200' : 'bg-red-50/60 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${largePop ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
                  <div>
                    <div className="font-black text-xs text-purple-950">① LARGE POPULATION</div>
                    <div className="text-[11px] font-bold text-purple-700">
                      {largePop ? 'Condition satisfied (N = 50)' : 'Violated: Genetic Drift Active'}
                    </div>
                  </div>
                </div>

                {/* Tactile Switch Button */}
                <button
                  type="button"
                  onClick={() => handleToggleCondition('largePop')}
                  className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    largePop ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      largePop ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Extended controls when violated: Genetic Drift Lab */}
              {!largePop && (
                <div className="mt-2.5 pt-2.5 border-t border-red-200 space-y-2 text-xs">
                  <div className="font-extrabold text-red-950 flex items-center justify-between">
                    <span>GENETIC DRIFT LAB: Population Size</span>
                    <span className="font-mono text-red-700">N = {driftPopSize}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[50, 25, 10, 5].map((size) => (
                      <button
                        key={size}
                        onClick={() => setDriftPopSize(size)}
                        className={`py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          driftPopSize === size
                            ? 'bg-red-600 text-white shadow-2xs'
                            : 'bg-white text-red-900 border border-red-200 hover:bg-red-100'
                        }`}
                      >
                        N = {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-red-900/90 leading-tight">
                    *In small populations, random sampling error causes allele frequencies to fluctuate by chance alone.*
                  </p>
                </div>
              )}
            </div>

            {/* Condition 2: Random Mating */}
            <div className={`p-3.5 rounded-2xl border-2 transition-all ${
              randomMating ? 'bg-white border-emerald-200' : 'bg-red-50/60 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${randomMating ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
                  <div>
                    <div className="font-black text-xs text-purple-950">② RANDOM MATING</div>
                    <div className="text-[11px] font-bold text-purple-700">
                      {randomMating ? 'Condition satisfied' : 'Violated: Non-Random Mating'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCondition('randomMating')}
                  className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    randomMating ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      randomMating ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Extended controls when violated: Non-Random Mating Lab */}
              {!randomMating && (
                <div className="mt-2.5 pt-2.5 border-t border-red-200 space-y-2 text-xs">
                  <div className="font-extrabold text-red-950">NON-RANDOM MATING LAB: Mating Preference</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMatingType('assortative')}
                      className={`p-1.5 rounded-lg font-bold text-[11px] text-center transition-all cursor-pointer ${
                        matingType === 'assortative'
                          ? 'bg-red-600 text-white shadow-2xs'
                          : 'bg-white text-red-900 border border-red-200'
                      }`}
                    >
                      Assortative (Like mates with Like)
                    </button>
                    <button
                      onClick={() => setMatingType('disassortative')}
                      className={`p-1.5 rounded-lg font-bold text-[11px] text-center transition-all cursor-pointer ${
                        matingType === 'disassortative'
                          ? 'bg-red-600 text-white shadow-2xs'
                          : 'bg-white text-red-900 border border-red-200'
                      }`}
                    >
                      Disassortative (Opposites Mate)
                    </button>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950 leading-tight">
                    <strong>Critical Biological Fact:</strong> Non-random mating alters <strong>GENOTYPE frequencies</strong> (excess homozygotes) even when <strong>ALLELE frequencies p & q remain constant!</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Condition 3: No Mutation */}
            <div className={`p-3.5 rounded-2xl border-2 transition-all ${
              noMutation ? 'bg-white border-emerald-200' : 'bg-red-50/60 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${noMutation ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
                  <div>
                    <div className="font-black text-xs text-purple-950">③ NO MUTATION</div>
                    <div className="text-[11px] font-bold text-purple-700">
                      {noMutation ? 'Condition satisfied' : 'Violated: Mutation Active'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCondition('noMutation')}
                  className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    noMutation ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      noMutation ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Extended controls: Mutation Lab */}
              {!noMutation && (
                <div className="mt-2.5 pt-2.5 border-t border-red-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-red-950">MUTATION LAB: Mutation Rate</span>
                    <span className="font-mono text-red-700">μ = {(mutationRate * 100).toFixed(0)}% per gen</span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.15"
                    step="0.01"
                    value={mutationRate}
                    onChange={(e) => setMutationRate(parseFloat(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-red-900 font-bold">Direction:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setMutationDirection('A_to_a')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          mutationDirection === 'A_to_a' ? 'bg-red-600 text-white' : 'bg-white text-red-800 border border-red-200'
                        }`}
                      >
                        A → a
                      </button>
                      <button
                        onClick={() => setMutationDirection('a_to_A')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          mutationDirection === 'a_to_A' ? 'bg-red-600 text-white' : 'bg-white text-red-800 border border-red-200'
                        }`}
                      >
                        a → A
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Condition 4: No Migration */}
            <div className={`p-3.5 rounded-2xl border-2 transition-all ${
              noMigration ? 'bg-white border-emerald-200' : 'bg-red-50/60 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${noMigration ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
                  <div>
                    <div className="font-black text-xs text-purple-950">④ NO MIGRATION (GENE FLOW)</div>
                    <div className="text-[11px] font-bold text-purple-700">
                      {noMigration ? 'Condition satisfied' : 'Violated: Gene Flow Active'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCondition('noMigration')}
                  className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    noMigration ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      noMigration ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Extended controls: Migration Lab with 2 Populations */}
              {!noMigration && (
                <div className="mt-2.5 pt-2.5 border-t border-red-200 space-y-2 text-xs">
                  <div className="font-extrabold text-red-950">MIGRATION LAB: 2 Populations Interaction</div>
                  <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                    <div className="p-2 bg-purple-100 rounded-lg border border-purple-300">
                      <span className="font-bold text-purple-950 block">POPULATION A (Resident)</span>
                      <span className="font-mono text-purple-900 font-bold">p = {p.toFixed(2)}</span>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-lg border border-amber-300">
                      <span className="font-bold text-amber-950 block">POPULATION B (Immigrants)</span>
                      <span className="font-mono text-amber-900 font-bold">p = 0.20, q = 0.80</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-red-950 text-[11px]">Migration Rate (m):</span>
                    <span className="font-mono text-red-700 font-bold">{(migrationRate * 100).toFixed(0)}% immigrants</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.30"
                    step="0.05"
                    value={migrationRate}
                    onChange={(e) => setMigrationRate(parseFloat(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Condition 5: No Natural Selection */}
            <div className={`p-3.5 rounded-2xl border-2 transition-all ${
              noSelection ? 'bg-white border-emerald-200' : 'bg-red-50/60 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${noSelection ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
                  <div>
                    <div className="font-black text-xs text-purple-950">⑤ NO NATURAL SELECTION</div>
                    <div className="text-[11px] font-bold text-purple-700">
                      {noSelection ? 'Condition satisfied' : 'Violated: Selection Pressure'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCondition('noSelection')}
                  className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    noSelection ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      noSelection ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Extended controls: Natural Selection Lab */}
              {!noSelection && (
                <div className="mt-2.5 pt-2.5 border-t border-red-200 space-y-2 text-xs">
                  <div className="font-extrabold text-red-950">
                    NATURAL SELECTION LAB: Which genotype has reproductive advantage?
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['AA', 'Aa', 'aa'] as const).map((geno) => (
                      <button
                        key={geno}
                        onClick={() => setFavoredGenotype(geno)}
                        className={`py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          favoredGenotype === geno
                            ? 'bg-red-600 text-white shadow-2xs'
                            : 'bg-white text-red-900 border border-red-200 hover:bg-red-100'
                        }`}
                      >
                        Genotype {geno}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-red-950 text-[11px]">Selection Pressure (s):</span>
                    <span className="font-mono text-red-700 font-bold">{(selectionPressure * 100).toFixed(0)}% differential</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.90"
                    step="0.10"
                    value={selectionPressure}
                    onChange={(e) => setSelectionPressure(parseFloat(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />

                  <div className="p-2 bg-red-100/70 rounded-lg text-[11px] text-red-950 leading-tight">
                    *Natural selection changes allele frequencies because individuals differ in reproductive success.*
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Live Statistics Panel, Real-time Graphs & Matriculation Synthesis */}
      <div className="p-5 sm:p-6 bg-purple-50/40 border-t-2 border-purple-200 space-y-6">
        {/* Section 16: Live Statistics Panel */}
        <div className="bg-white p-5 rounded-2xl border-2 border-purple-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <h4 className="text-sm font-black text-purple-950 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-700" />
              <span>Live Population Statistics (Generation {generation})</span>
            </h4>
            <div className="text-xs font-mono font-bold text-purple-700">
              Total Individuals: N = {currentTotalN}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            {/* Allele p */}
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">Allele A Freq (p)</span>
              <span className="text-xl font-black text-indigo-950 font-mono">{latest.p.toFixed(3)}</span>
              <span className="text-[10px] text-indigo-800 block mt-0.5">{(latest.p * 100).toFixed(1)}%</span>
            </div>

            {/* Allele q */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Allele a Freq (q)</span>
              <span className="text-xl font-black text-amber-950 font-mono">{latest.q.toFixed(3)}</span>
              <span className="text-[10px] text-amber-800 block mt-0.5">{(latest.q * 100).toFixed(1)}%</span>
            </div>

            {/* Genotype AA */}
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">Homozygous Dominant (p²)</span>
              <span className="text-xl font-black text-purple-950 font-mono">{latest.p2.toFixed(3)}</span>
              <span className="text-[10px] text-purple-800 block mt-0.5">{latest.countAA} beetles ({((latest.countAA / currentTotalN) * 100).toFixed(0)}%)</span>
            </div>

            {/* Genotype Aa */}
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">Heterozygous (2pq)</span>
              <span className="text-xl font-black text-purple-950 font-mono">{latest.twoPq.toFixed(3)}</span>
              <span className="text-[10px] text-purple-800 block mt-0.5">{latest.countAa} beetles ({((latest.countAa / currentTotalN) * 100).toFixed(0)}%)</span>
            </div>

            {/* Genotype aa */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Homozygous Recessive (q²)</span>
              <span className="text-xl font-black text-amber-950 font-mono">{latest.q2.toFixed(3)}</span>
              <span className="text-[10px] text-amber-800 block mt-0.5">{latest.countaa} beetles ({((latest.countaa / currentTotalN) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Sections 17 & 18: Live Generational Graphs (Allele Frequency + Genotype Frequency) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Graph 1: Allele Frequency Across Generations (p and q) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-purple-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-black text-xs sm:text-sm text-purple-950">
                  Allele Frequency Across Generations
                </h5>
                <p className="text-[11px] text-purple-700">
                  Horizontal lines = Equilibrium. Curved/fluctuating lines = Evolution.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                <span className="inline-flex items-center gap-1 text-indigo-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> p (A)
                </span>
                <span className="inline-flex items-center gap-1 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> q (a)
                </span>
              </div>
            </div>

            {/* SVG Line Graph */}
            <div className="h-44 w-full relative">
              <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                {/* Y-axis gridlines */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((val) => {
                  const y = 140 - val * 120;
                  return (
                    <g key={val}>
                      <line x1="30" y1={y} x2="390" y2={y} stroke="#e9d5ff" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="25" y={y + 3} textAnchor="end" fontSize="9" fill="#7e22ce" fontFamily="monospace">
                        {val.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* X and Y axes */}
                <line x1="30" y1="20" x2="30" y2="140" stroke="#9333ea" strokeWidth="1.5" />
                <line x1="30" y1="140" x2="390" y2="140" stroke="#9333ea" strokeWidth="1.5" />

                {/* Path for p */}
                {history.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#4338ca"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={history.map((rec, i) => {
                      const x = 30 + (i / Math.max(1, history.length - 1)) * 350;
                      const y = 140 - rec.p * 120;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                )}

                {/* Path for q */}
                {history.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={history.map((rec, i) => {
                      const x = 30 + (i / Math.max(1, history.length - 1)) * 350;
                      const y = 140 - rec.q * 120;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                )}

                {/* Data points for latest generation */}
                {history.map((rec, i) => {
                  const x = 30 + (i / Math.max(1, history.length - 1)) * 350;
                  const yP = 140 - rec.p * 120;
                  const yQ = 140 - rec.q * 120;
                  return (
                    <g key={rec.gen}>
                      <circle cx={x} cy={yP} r={i === history.length - 1 ? 4.5 : 2.5} fill="#4338ca" />
                      <circle cx={x} cy={yQ} r={i === history.length - 1 ? 4.5 : 2.5} fill="#f59e0b" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-purple-700 font-mono px-6">
              <span>Gen {history[0].gen}</span>
              <span>Gen {latest.gen}</span>
            </div>
          </div>

          {/* Graph 2: Genotype Frequency Across Generations (AA, Aa, aa) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-purple-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-black text-xs sm:text-sm text-purple-950">
                  Genotype Frequency Across Generations
                </h5>
                <p className="text-[11px] text-purple-700">
                  Reveals non-random mating shifts in homozygote vs heterozygote ratios.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                <span className="text-indigo-700">AA (p²)</span>
                <span className="text-purple-700">Aa (2pq)</span>
                <span className="text-amber-700">aa (q²)</span>
              </div>
            </div>

            {/* SVG Genotype Line Graph */}
            <div className="h-44 w-full relative">
              <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                {/* Y-axis gridlines */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((val) => {
                  const y = 140 - val * 120;
                  return (
                    <g key={val}>
                      <line x1="30" y1={y} x2="390" y2={y} stroke="#e9d5ff" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="25" y={y + 3} textAnchor="end" fontSize="9" fill="#7e22ce" fontFamily="monospace">
                        {val.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                <line x1="30" y1="20" x2="30" y2="140" stroke="#9333ea" strokeWidth="1.5" />
                <line x1="30" y1="140" x2="390" y2="140" stroke="#9333ea" strokeWidth="1.5" />

                {/* AA line */}
                {history.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#312e81"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    points={history.map((rec, i) => {
                      const x = 30 + (i / Math.max(1, history.length - 1)) * 350;
                      const y = 140 - rec.p2 * 120;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                )}

                {/* Aa line */}
                {history.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    points={history.map((rec, i) => {
                      const x = 30 + (i / Math.max(1, history.length - 1)) * 350;
                      const y = 140 - rec.twoPq * 120;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                )}

                {/* aa line */}
                {history.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    points={history.map((rec, i) => {
                      const x = 30 + (i / Math.max(1, history.length - 1)) * 350;
                      const y = 140 - rec.q2 * 120;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                )}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-purple-700 font-mono px-6">
              <span>Gen {history[0].gen}</span>
              <span>Gen {latest.gen}</span>
            </div>
          </div>
        </div>

        {/* Section 26: Final Student Takeaway & Synthesis */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl border-2 border-purple-700 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Matriculation Biology Core Conclusion</span>
          </div>

          <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            CAN YOU KEEP THE POPULATION IN EQUILIBRIUM?
          </h4>

          <div className="space-y-2 text-xs sm:text-sm text-purple-100 leading-relaxed max-w-4xl">
            <p>
              • <strong>Hardy-Weinberg equilibrium is maintained</strong> when the assumptions of the model are satisfied (large population, random mating, no mutation, no gene flow, no natural selection). Under these conditions, allele frequencies $p$ and $q$ remain unchanged generation after generation.
            </p>
            <p>
              • <strong>When evolutionary forces</strong> such as natural selection, mutation, gene flow, or genetic drift act on a population, allele frequencies change over time—and this change in allele frequency constitutes biological evolution.
            </p>
            <p>
              • <strong>Non-random mating</strong> can change genotype frequencies (e.g. inflating homozygotes in inbreeding) without necessarily altering allele frequencies $p$ and $q$.
            </p>
          </div>

          <div className="pt-2 border-t border-purple-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-mono font-extrabold text-amber-300 tracking-wider">
              THINK FIRST. CALCULATE SECOND. USE AI WISELY.
            </span>
            <span className="text-purple-300 font-medium">
              Malaysian Matriculation Biology (SB015) • Topic 5: Population Genetics
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
