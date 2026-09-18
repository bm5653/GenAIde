import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Dna, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Sliders, 
  Layers, 
  Scale, 
  Zap, 
  Info,
  Check,
  X,
  Play,
  Brain
} from 'lucide-react';

// Crisp inline SVG Beetle Component
interface BeetleProps {
  genotype: 'AA' | 'Aa' | 'aa';
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const BeetleVisual: React.FC<BeetleProps> = ({ genotype, selected, onClick, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-16 h-16 sm:w-20 sm:h-20'
  }[size];

  // Colors based on genotype
  // AA = Dominant Dark Obsidian
  // Aa = Heterozygous Dark with intermediate amber wing margin
  // aa = Recessive Golden Bronze
  const colors = {
    AA: {
      body: '#1e1b4b', // deep indigo/black
      elytraLeft: '#312e81',
      elytraRight: '#1e1b4b',
      accent: '#6366f1',
      label: 'AA',
      badgeColor: 'bg-indigo-900 text-indigo-100 border-indigo-700'
    },
    Aa: {
      body: '#2e1065', // deep purple
      elytraLeft: '#4c1d95',
      elytraRight: '#581c87',
      accent: '#a855f7',
      label: 'Aa',
      badgeColor: 'bg-purple-900 text-purple-100 border-purple-700'
    },
    aa: {
      body: '#78350f', // warm bronze
      elytraLeft: '#b45309',
      elytraRight: '#92400e',
      accent: '#f59e0b',
      label: 'aa',
      badgeColor: 'bg-amber-900 text-amber-100 border-amber-700'
    }
  }[genotype];

  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`relative cursor-pointer transition-transform select-none rounded-xl p-1 flex flex-col items-center justify-center ${
        selected 
          ? 'scale-110 ring-2 ring-purple-500 bg-purple-100/90 shadow-md' 
          : 'hover:scale-105 hover:bg-purple-50/60'
      }`}
    >
      <svg viewBox="0 0 100 100" className={`${sizeClasses} drop-shadow-xs`}>
        {/* Legs */}
        <path d="M 30 40 L 15 30 M 30 50 L 12 50 M 30 65 L 15 75" stroke={colors.body} strokeWidth="5" strokeLinecap="round" />
        <path d="M 70 40 L 85 30 M 70 50 L 88 50 M 70 65 L 85 75" stroke={colors.body} strokeWidth="5" strokeLinecap="round" />
        
        {/* Antennae */}
        <path d="M 45 25 Q 40 10 30 8" stroke={colors.body} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 55 25 Q 60 10 70 8" stroke={colors.body} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Head */}
        <circle cx="50" cy="28" r="11" fill={colors.body} />
        <circle cx="44" cy="25" r="2.5" fill="#f8fafc" />
        <circle cx="56" cy="25" r="2.5" fill="#f8fafc" />

        {/* Pronotum / Thorax */}
        <path d="M 35 36 Q 50 32 65 36 L 62 48 Q 50 46 38 48 Z" fill={colors.body} />

        {/* Elytra (Wing Cases) Left & Right */}
        <path d="M 49 49 Q 28 50 30 82 Q 40 92 49 88 Z" fill={colors.elytraLeft} stroke={colors.accent} strokeWidth="1.5" />
        <path d="M 51 49 Q 72 50 70 82 Q 60 92 51 88 Z" fill={colors.elytraRight} stroke={colors.accent} strokeWidth="1.5" />

        {/* Central suture line */}
        <line x1="50" y1="49" x2="50" y2="88" stroke="#0f172a" strokeWidth="2" />

        {/* Distinctive Genotype Markings */}
        {genotype === 'AA' && (
          <circle cx="50" cy="66" r="5" fill="#818cf8" opacity="0.9" />
        )}
        {genotype === 'Aa' && (
          <>
            <circle cx="42" cy="66" r="3.5" fill="#c084fc" />
            <circle cx="58" cy="66" r="3.5" fill="#fde047" />
          </>
        )}
        {genotype === 'aa' && (
          <circle cx="50" cy="66" r="5" fill="#fbbf24" opacity="0.9" />
        )}
      </svg>
      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border mt-0.5 ${colors.badgeColor}`}>
        {colors.label}
      </span>
    </div>
  );
};

export const HardyWeinbergAnimation: React.FC = () => {
  // Current Step: 1 to 6
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Allele frequency p (0.00 to 1.00)
  const [p, setP] = useState<number>(0.70);
  const q = Number((1 - p).toFixed(2));

  // Calculated Genotype Frequencies
  const p2 = Number((p * p).toFixed(4));
  const twoPq = Number((2 * p * q).toFixed(4));
  const q2 = Number((q * q).toFixed(4));

  // Selected individual beetle for inspection in Stage 1
  const [selectedBeetleId, setSelectedBeetleId] = useState<number | null>(0);
  const [groupOrganisms, setGroupOrganisms] = useState<boolean>(false);

  // Stage 4 Random fertilization state
  const [fertilizationPair, setFertilizationPair] = useState<{
    egg: 'A' | 'a';
    sperm: 'A' | 'a';
    result: 'AA' | 'Aa' | 'aa';
    pathway: string;
  } | null>(null);
  const [isCombining, setIsCombining] = useState<boolean>(false);
  const [fertilizationHistory, setFertilizationHistory] = useState<Array<'AA' | 'Aa' | 'aa'>>([]);

  // Stage 6 Think First & Mini Challenge state
  const [thinkFirstAnswer, setThinkFirstAnswer] = useState<string | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);
  const [showChallengeResult, setShowChallengeResult] = useState<boolean>(false);

  // Population composition for N = 24 beetles based on current p and q
  const populationBeetles = useMemo(() => {
    const total = 24;
    const countAA = Math.max(1, Math.round(total * p2));
    const countaa = Math.max(1, Math.round(total * q2));
    const countAa = Math.max(0, total - countAA - countaa);

    const beetles: Array<{ id: number; genotype: 'AA' | 'Aa' | 'aa' }> = [];
    let id = 0;
    for (let i = 0; i < countAA; i++) beetles.push({ id: id++, genotype: 'AA' });
    for (let i = 0; i < countAa; i++) beetles.push({ id: id++, genotype: 'Aa' });
    for (let i = 0; i < countaa; i++) beetles.push({ id: id++, genotype: 'aa' });

    return beetles;
  }, [p2, q2]);

  // Handle Combine Gametes Simulation
  const handleCombineGametes = () => {
    setIsCombining(true);
    // Draw egg based on p
    const egg: 'A' | 'a' = Math.random() < p ? 'A' : 'a';
    // Draw sperm based on p
    const sperm: 'A' | 'a' = Math.random() < p ? 'A' : 'a';

    let result: 'AA' | 'Aa' | 'aa';
    let pathway: string;

    if (egg === 'A' && sperm === 'A') {
      result = 'AA';
      pathway = 'Egg (A) + Sperm (A) → Homozygous Dominant (p × p = p²)';
    } else if (egg === 'A' && sperm === 'a') {
      result = 'Aa';
      pathway = 'Egg (A) + Sperm (a) → Heterozygote (p × q = pq)';
    } else if (egg === 'a' && sperm === 'A') {
      result = 'Aa';
      pathway = 'Egg (a) + Sperm (A) → Heterozygote (q × p = qp)';
    } else {
      result = 'aa';
      pathway = 'Egg (a) + Sperm (a) → Homozygous Recessive (q × q = q²)';
    }

    setTimeout(() => {
      setFertilizationPair({ egg, sperm, result, pathway });
      setFertilizationHistory(prev => [result, ...prev.slice(0, 15)]);
      setIsCombining(false);
    }, 600);
  };

  // Steps configuration
  const steps = [
    { num: 1, label: '1. Population', title: 'The Living Population' },
    { num: 2, label: '2. Alleles', title: 'Alleles & Frequencies (p, q)' },
    { num: 3, label: '3. Gametes', title: 'Meiosis & Gamete Pools' },
    { num: 4, label: '4. Fertilisation', title: 'Random Fertilisation' },
    { num: 5, label: '5. Hardy-Weinberg', title: 'Building p² + 2pq + q² = 1' },
    { num: 6, label: '6. Test Yourself', title: 'Think First & Challenge' }
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm overflow-hidden space-y-0">
      {/* Simulation Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-800/80 border border-purple-600 text-purple-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive Educational Simulation</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            From Alleles to the Hardy-Weinberg Equation
          </h3>
          <p className="text-xs text-purple-200 font-medium">
            Observe how individual alleles in beetles form gametes, combine at random, and derive <span className="font-mono text-amber-300">p² + 2pq + q² = 1</span>.
          </p>
        </div>

        {/* Philosophy Badge & Reset */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-700/80 text-[11px] font-semibold text-purple-200">
            <Brain className="w-3.5 h-3.5 text-purple-300" />
            <span>Think First. Calculate Second.</span>
          </div>
          <button
            onClick={() => {
              setP(0.70);
              setCurrentStep(1);
              setSelectedBeetleId(0);
              setFertilizationPair(null);
              setFertilizationHistory([]);
              setThinkFirstAnswer(null);
              setChallengeAnswer(null);
              setShowChallengeResult(false);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-700 text-purple-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors border border-purple-700"
            title="Reset simulation to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 6-Stage Progress Indicator Bar */}
      <div className="bg-purple-900/30 p-2 sm:p-3 border-b border-purple-100 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[540px] gap-1">
          {steps.map((step) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            return (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-800 text-white shadow-xs border border-purple-900'
                    : isCompleted
                    ? 'bg-purple-100/90 text-purple-900 hover:bg-purple-200/90 border border-purple-200'
                    : 'bg-gray-50 text-gray-500 hover:bg-purple-50 border border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black shrink-0 ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {step.num}
                  </span>
                )}
                <span className="truncate">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* =========================================================================
            STAGE 1: THE BEETLE POPULATION
           ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                  Stage 1 of 6 • Biological Metaphor
                </span>
                <h4 className="text-lg font-black text-purple-950">
                  A Natural Population of Beetles (N = 24)
                </h4>
              </div>

              {/* Grouping Toggle */}
              <button
                onClick={() => setGroupOrganisms(!groupOrganisms)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  groupOrganisms
                    ? 'bg-purple-800 text-white border-purple-900'
                    : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{groupOrganisms ? 'Show Scattered Habitat' : 'Group by Genotype'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
              Every individual organism carries <strong>two alleles</strong> for this gene locus. Click or tap any beetle to inspect its genetic constitution:
            </p>

            {/* Beetle Grid Stage */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-purple-50/70 to-emerald-50/40 border-2 border-dashed border-purple-200">
              {groupOrganisms ? (
                /* Grouped Layout */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* AA Group */}
                  <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-2">
                    <div className="text-xs font-black text-indigo-900 flex items-center justify-between">
                      <span>Homozygous Dominant (AA)</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px]">
                        {populationBeetles.filter(b => b.genotype === 'AA').length} Beetles
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {populationBeetles.filter(b => b.genotype === 'AA').map(b => (
                        <BeetleVisual 
                          key={b.id} 
                          genotype={b.genotype} 
                          selected={selectedBeetleId === b.id}
                          onClick={() => setSelectedBeetleId(b.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Aa Group */}
                  <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-2">
                    <div className="text-xs font-black text-purple-900 flex items-center justify-between">
                      <span>Heterozygous (Aa)</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px]">
                        {populationBeetles.filter(b => b.genotype === 'Aa').length} Beetles
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {populationBeetles.filter(b => b.genotype === 'Aa').map(b => (
                        <BeetleVisual 
                          key={b.id} 
                          genotype={b.genotype} 
                          selected={selectedBeetleId === b.id}
                          onClick={() => setSelectedBeetleId(b.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* aa Group */}
                  <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                    <div className="text-xs font-black text-amber-900 flex items-center justify-between">
                      <span>Homozygous Recessive (aa)</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                        {populationBeetles.filter(b => b.genotype === 'aa').length} Beetles
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {populationBeetles.filter(b => b.genotype === 'aa').map(b => (
                        <BeetleVisual 
                          key={b.id} 
                          genotype={b.genotype} 
                          selected={selectedBeetleId === b.id}
                          onClick={() => setSelectedBeetleId(b.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Scattered Natural Habitat */
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 place-items-center">
                  {populationBeetles.map((beetle) => (
                    <BeetleVisual
                      key={beetle.id}
                      genotype={beetle.genotype}
                      selected={selectedBeetleId === beetle.id}
                      onClick={() => setSelectedBeetleId(beetle.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Selected Beetle Inspection Card */}
            {selectedBeetleId !== null && (() => {
              const b = populationBeetles.find(item => item.id === selectedBeetleId) || populationBeetles[0];
              return (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex flex-col sm:flex-row items-center gap-4">
                  <BeetleVisual genotype={b.genotype} size="lg" />
                  <div className="text-xs sm:text-sm text-purple-950 space-y-1 flex-1">
                    <div className="font-extrabold text-base text-purple-900 flex items-center gap-2">
                      <span>Inspected Organism #{b.id + 1}: Genotype {b.genotype}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                        {b.genotype === 'AA' ? 'Homozygous Dominant' : b.genotype === 'Aa' ? 'Heterozygous Carrier' : 'Homozygous Recessive'}
                      </span>
                    </div>
                    <p className="text-purple-800">
                      <strong>Alleles contributed to gene pool:</strong>{' '}
                      {b.genotype === 'AA' && 'Two dominant alleles: (A) and (A)'}
                      {b.genotype === 'Aa' && 'One dominant allele (A) and one recessive allele (a)'}
                      {b.genotype === 'aa' && 'Two recessive alleles: (a) and (a)'}
                    </p>
                    <p className="text-[11px] text-purple-700">
                      Diploid count: 1 individual contributes exactly <strong>2 alleles</strong> to the population gene pool.
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Gene Pool Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 bg-white rounded-xl border border-purple-200 text-center">
                <div className="text-[10px] text-purple-600 font-bold uppercase">Total Individuals</div>
                <div className="text-lg font-black text-purple-950">N = 24</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-purple-200 text-center">
                <div className="text-[10px] text-purple-600 font-bold uppercase">Total Gene Pool</div>
                <div className="text-lg font-black text-purple-950">2 × 24 = 48 Alleles</div>
              </div>
              <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
                <div className="text-[10px] text-indigo-700 font-bold uppercase">Dominant Allele (A)</div>
                <div className="text-lg font-black text-indigo-950">
                  {populationBeetles.filter(b => b.genotype === 'AA').length * 2 + populationBeetles.filter(b => b.genotype === 'Aa').length}
                </div>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <div className="text-[10px] text-amber-700 font-bold uppercase">Recessive Allele (a)</div>
                <div className="text-lg font-black text-amber-950">
                  {populationBeetles.filter(b => b.genotype === 'aa').length * 2 + populationBeetles.filter(b => b.genotype === 'Aa').length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 2: ALLELES & FREQUENCIES (p, q)
           ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-purple-100 pb-3">
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                Stage 2 of 6 • Allele Frequencies
              </span>
              <h4 className="text-lg font-black text-purple-950">
                Understanding Allele Frequencies: p + q = 1
              </h4>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs sm:text-sm text-purple-900 leading-relaxed">
              When we break down the whole diploid population into its raw gene pool of alleles, we define:
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                <li><strong className="font-mono text-indigo-900">p</strong> = frequency of the dominant allele <span className="font-mono font-bold">A</span></li>
                <li><strong className="font-mono text-amber-900">q</strong> = frequency of the recessive allele <span className="font-mono font-bold">a</span></li>
                <li>Because there are only two alleles at this locus: <strong className="font-mono text-purple-950">p + q = 1.00</strong></li>
              </ul>
            </div>

            {/* Interactive p Slider Control */}
            <div className="p-5 bg-white rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <label className="text-sm font-black text-purple-950 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-700" />
                  <span>Adjust Dominant Allele Frequency (p):</span>
                </label>
                <div className="flex items-center gap-3 font-mono text-sm font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300">
                    p = {p.toFixed(2)} ({Math.round(p * 100)}%)
                  </span>
                  <span className="text-purple-400 font-sans font-bold">+</span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                    q = {q.toFixed(2)} ({Math.round(q * 100)}%)
                  </span>
                  <span className="text-purple-400 font-sans font-bold">=</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
                    1.00
                  </span>
                </div>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={p}
                onChange={(e) => setP(parseFloat(e.target.value))}
                className="w-full h-3 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-700"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-purple-700 font-semibold">Common Presets:</span>
                {[
                  { label: 'Syllabus Standard (0.70 / 0.30)', pVal: 0.70 },
                  { label: 'Equal Alleles (0.50 / 0.50)', pVal: 0.50 },
                  { label: 'High Dominant (0.80 / 0.20)', pVal: 0.80 },
                  { label: 'Rare Recessive (0.90 / 0.10)', pVal: 0.90 }
                ].map((preset) => (
                  <button
                    key={preset.pVal}
                    onClick={() => setP(preset.pVal)}
                    className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                      p === preset.pVal
                        ? 'bg-purple-800 text-white border-purple-900 shadow-2xs'
                        : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Visual Allele Pool (48 allele chips) */}
              <div className="space-y-2 pt-2 border-t border-purple-100">
                <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                  <span>Gene Pool Visualization (48 Alleles Proportionally Divided):</span>
                  <span>{Math.round(48 * p)} A alleles • {48 - Math.round(48 * p)} a alleles</span>
                </div>

                <div className="flex flex-wrap gap-1 p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                  {Array.from({ length: 48 }).map((_, i) => {
                    const isDominant = i < Math.round(48 * p);
                    return (
                      <motion.div
                        key={`chip-${i}`}
                        layout
                        className={`w-6 h-6 rounded-md font-mono text-xs font-black flex items-center justify-center shadow-2xs ${
                          isDominant 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-amber-500 text-amber-950'
                        }`}
                      >
                        {isDominant ? 'A' : 'a'}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 3: GAMETE POOLS (MEIOSIS)
           ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-purple-100 pb-3">
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                Stage 3 of 6 • Gametogenesis
              </span>
              <h4 className="text-lg font-black text-purple-950">
                Gamete Formation: Alleles Enter Sperm & Egg Pools
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
              During meiosis, homologous chromosomes segregate. Each haploid gamete (sperm or ovum) receives only <strong>one allele</strong>. Therefore, the frequency of alleles in the gamete pool matches <span className="font-mono font-bold">p</span> and <span className="font-mono font-bold">q</span> exactly!
            </p>

            {/* Maternal vs Paternal Gamete Pools Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Maternal Gamete Pool (Eggs) */}
              <div className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-extrabold text-rose-950 flex items-center gap-1.5">
                    <span>♀ Maternal Gamete Pool (Ova)</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                    p = {p.toFixed(2)}, q = {q.toFixed(2)}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center justify-around text-center">
                  <div>
                    <div className="text-2xl font-black text-indigo-900">{Math.round(p * 100)}%</div>
                    <div className="text-xs font-bold text-indigo-700">Egg with Allele A (p)</div>
                  </div>
                  <div className="h-8 w-px bg-rose-200" />
                  <div>
                    <div className="text-2xl font-black text-amber-900">{Math.round(q * 100)}%</div>
                    <div className="text-xs font-bold text-amber-700">Egg with Allele a (q)</div>
                  </div>
                </div>

                {/* Animated Gametes floating */}
                <div className="h-28 rounded-xl bg-rose-100/40 border border-dashed border-rose-300 relative overflow-hidden flex items-center justify-center gap-2">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const isA = i < Math.round(8 * p);
                    return (
                      <motion.div
                        key={`egg-${i}`}
                        className={`w-9 h-9 rounded-full font-mono text-xs font-black flex items-center justify-center shadow-md border ${
                          isA 
                            ? 'bg-indigo-600 text-white border-indigo-400' 
                            : 'bg-amber-400 text-amber-950 border-amber-300'
                        }`}
                        animate={{
                          y: [0, -10, 0],
                          x: [0, (i % 2 === 0 ? 5 : -5), 0]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.5 + (i % 3),
                          ease: "easeInOut",
                          delay: i * 0.2
                        }}
                      >
                        {isA ? 'A' : 'a'}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Paternal Gamete Pool (Sperm) */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border-2 border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-extrabold text-blue-950 flex items-center gap-1.5">
                    <span>♂ Paternal Gamete Pool (Sperm)</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                    p = {p.toFixed(2)}, q = {q.toFixed(2)}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-around text-center">
                  <div>
                    <div className="text-2xl font-black text-indigo-900">{Math.round(p * 100)}%</div>
                    <div className="text-xs font-bold text-indigo-700">Sperm with Allele A (p)</div>
                  </div>
                  <div className="h-8 w-px bg-blue-200" />
                  <div>
                    <div className="text-2xl font-black text-amber-900">{Math.round(q * 100)}%</div>
                    <div className="text-xs font-bold text-amber-700">Sperm with Allele a (q)</div>
                  </div>
                </div>

                {/* Animated Gametes floating */}
                <div className="h-28 rounded-xl bg-blue-100/40 border border-dashed border-blue-300 relative overflow-hidden flex items-center justify-center gap-2">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const isA = i < Math.round(8 * p);
                    return (
                      <motion.div
                        key={`sperm-${i}`}
                        className={`w-9 h-9 rounded-full font-mono text-xs font-black flex items-center justify-center shadow-md border ${
                          isA 
                            ? 'bg-indigo-600 text-white border-indigo-400' 
                            : 'bg-amber-400 text-amber-950 border-amber-300'
                        }`}
                        animate={{
                          y: [0, 10, 0],
                          x: [0, (i % 2 === 0 ? -5 : 5), 0]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.5 + (i % 3),
                          ease: "easeInOut",
                          delay: i * 0.2
                        }}
                      >
                        {isA ? 'A' : 'a'}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 4: RANDOM FERTILISATION / COMBINATION
           ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-purple-100 pb-3">
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                Stage 4 of 6 • Random Fertilisation
              </span>
              <h4 className="text-lg font-black text-purple-950">
                Random Fusion of Gametes: Forming Genotypes
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
              Click <strong>"Combine Gametes"</strong> to simulate random fertilization. Notice how gametes are drawn according to frequencies <span className="font-mono font-bold">p = {p.toFixed(2)}</span> and <span className="font-mono font-bold">q = {q.toFixed(2)}</span>:
            </p>

            {/* Interactive Fusion Stage */}
            <div className="p-6 rounded-2xl bg-purple-950 text-white space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Egg Source */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-rose-500/30 border border-rose-400 flex items-center justify-center text-sm font-black text-rose-200 shadow-inner">
                    ♀
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-rose-300">Maternal Egg</div>
                    <div className="text-sm font-mono font-bold">
                      {fertilizationPair ? `Allele ${fertilizationPair.egg}` : `P(A)=${p.toFixed(2)}, P(a)=${q.toFixed(2)}`}
                    </div>
                  </div>
                </div>

                {/* Combine Action Button */}
                <button
                  onClick={handleCombineGametes}
                  disabled={isCombining}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>{isCombining ? 'Fusing Gametes...' : 'Combine Gametes'}</span>
                </button>

                {/* Sperm Source */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/30 border border-blue-400 flex items-center justify-center text-sm font-black text-blue-200 shadow-inner">
                    ♂
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-blue-300">Paternal Sperm</div>
                    <div className="text-sm font-mono font-bold">
                      {fertilizationPair ? `Allele ${fertilizationPair.sperm}` : `P(A)=${p.toFixed(2)}, P(a)=${q.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Fusion Area */}
              <div className="h-32 bg-purple-900/60 rounded-xl border border-purple-700/80 relative flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {fertilizationPair && !isCombining ? (
                    <motion.div
                      key={fertilizationPair.pathway + fertilizationHistory.length}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full font-mono text-sm font-black flex items-center justify-center ${
                          fertilizationPair.egg === 'A' ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-amber-950'
                        }`}>
                          {fertilizationPair.egg}
                        </span>
                        <span className="text-purple-300 font-bold">+</span>
                        <span className={`w-8 h-8 rounded-full font-mono text-sm font-black flex items-center justify-center ${
                          fertilizationPair.sperm === 'A' ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-amber-950'
                        }`}>
                          {fertilizationPair.sperm}
                        </span>
                        <ArrowRight className="w-4 h-4 text-purple-400" />
                        <span className={`px-3 py-1 rounded-xl font-mono text-sm font-black border ${
                          fertilizationPair.result === 'AA' 
                            ? 'bg-indigo-900 text-indigo-100 border-indigo-500'
                            : fertilizationPair.result === 'Aa'
                            ? 'bg-purple-900 text-purple-100 border-purple-500'
                            : 'bg-amber-900 text-amber-100 border-amber-500'
                        }`}>
                          Genotype: {fertilizationPair.result}
                        </span>
                      </div>
                      <div className="text-xs text-amber-300 font-semibold text-center">
                        {fertilizationPair.pathway}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-xs text-purple-300 flex items-center gap-2">
                      <Play className="w-4 h-4 text-purple-400" />
                      <span>Press "Combine Gametes" above to produce an offspring zygote</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tally of Recent Simulated Offspring */}
              {fertilizationHistory.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-purple-800">
                  <div className="text-[11px] text-purple-300 font-bold">
                    Recent Simulated Offspring ({fertilizationHistory.length} total):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fertilizationHistory.map((g, idx) => (
                      <span
                        key={idx}
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          g === 'AA' ? 'bg-indigo-800 text-indigo-200' : g === 'Aa' ? 'bg-purple-800 text-purple-200' : 'bg-amber-800 text-amber-200'
                        }`}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Critical Concept Callout for 2pq */}
            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <LightbulbIcon />
                <span>Why is there a factor of 2 in 2pq?</span>
              </div>
              <p className="leading-relaxed">
                Notice that heterozygous (<strong className="font-mono">Aa</strong>) individuals can form through <strong>TWO independent fertilization routes</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <div className="p-2 bg-white rounded-lg border border-amber-300">
                  1. Egg A × Sperm a = <strong className="text-purple-900">p × q = pq</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-amber-300">
                  2. Egg a × Sperm A = <strong className="text-purple-900">q × p = qp</strong>
                </div>
              </div>
              <p className="pt-1 font-bold text-purple-900">
                Total Heterozygotes = pq + qp = 2pq!
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 5: BUILDING THE HARDY-WEINBERG EQUATION VISUALLY
           ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-purple-100 pb-3">
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                Stage 5 of 6 • The Mathematical Synthesis
              </span>
              <h4 className="text-lg font-black text-purple-950">
                Building the Hardy-Weinberg Equation: p² + 2pq + q² = 1
              </h4>
            </div>

            {/* Visual Derivation Tree */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Term 1: p² */}
              <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 space-y-2 text-center">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                  Homozygous Dominant
                </span>
                <div className="text-xs text-indigo-800 font-mono">A + A</div>
                <div className="text-xs text-indigo-700">p × p</div>
                <div className="text-3xl font-black text-indigo-950 font-mono">p²</div>
                <div className="text-xs font-mono font-bold bg-white p-2 rounded-lg border border-indigo-200 text-indigo-900">
                  {p.toFixed(2)}² = {p2.toFixed(4)} ({Math.round(p2 * 100)}%)
                </div>
              </div>

              {/* Term 2: 2pq */}
              <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 space-y-2 text-center">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                  Heterozygous Carrier
                </span>
                <div className="text-xs text-purple-800 font-mono">(A + a) OR (a + A)</div>
                <div className="text-xs text-purple-700">pq + qp</div>
                <div className="text-3xl font-black text-purple-950 font-mono">2pq</div>
                <div className="text-xs font-mono font-bold bg-white p-2 rounded-lg border border-purple-200 text-purple-900">
                  2({p.toFixed(2)})({q.toFixed(2)}) = {twoPq.toFixed(4)} ({Math.round(twoPq * 100)}%)
                </div>
              </div>

              {/* Term 3: q² */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-2 text-center">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Homozygous Recessive
                </span>
                <div className="text-xs text-amber-800 font-mono">a + a</div>
                <div className="text-xs text-amber-700">q × q</div>
                <div className="text-3xl font-black text-amber-950 font-mono">q²</div>
                <div className="text-xs font-mono font-bold bg-white p-2 rounded-lg border border-amber-200 text-amber-900">
                  {q.toFixed(2)}² = {q2.toFixed(4)} ({Math.round(q2 * 100)}%)
                </div>
              </div>
            </div>

            {/* Punnett Square Demonstration (2x2 Matrix) */}
            <div className="p-5 bg-white rounded-2xl border-2 border-purple-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-purple-950 flex items-center justify-between">
                <span>The 2 × 2 Random Fertilisation Punnett Matrix</span>
                <span className="text-[11px] font-mono text-purple-700">p = {p.toFixed(2)}, q = {q.toFixed(2)}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-purple-500 font-normal">♀ \ ♂</th>
                      <th className="p-2.5 bg-indigo-100 text-indigo-950 font-mono font-bold rounded-t-xl border border-indigo-200">
                        Sperm A (p = {p.toFixed(2)})
                      </th>
                      <th className="p-2.5 bg-amber-100 text-amber-950 font-mono font-bold rounded-t-xl border border-amber-200">
                        Sperm a (q = {q.toFixed(2)})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="p-2.5 bg-rose-100 text-rose-950 font-mono font-bold rounded-l-xl border border-rose-200">
                        Egg A (p = {p.toFixed(2)})
                      </th>
                      <td className="p-3 bg-indigo-50/70 border border-indigo-200 font-mono">
                        <div className="font-black text-indigo-950 text-base">AA (p²)</div>
                        <div className="text-xs text-indigo-700">{p2.toFixed(4)} ({Math.round(p2 * 100)}%)</div>
                      </td>
                      <td className="p-3 bg-purple-50/70 border border-purple-200 font-mono">
                        <div className="font-black text-purple-950 text-base">Aa (pq)</div>
                        <div className="text-xs text-purple-700">{(p * q).toFixed(4)} ({Math.round(p * q * 100)}%)</div>
                      </td>
                    </tr>
                    <tr>
                      <th className="p-2.5 bg-rose-100 text-rose-950 font-mono font-bold rounded-l-xl border border-rose-200">
                        Egg a (q = {q.toFixed(2)})
                      </th>
                      <td className="p-3 bg-purple-50/70 border border-purple-200 font-mono">
                        <div className="font-black text-purple-950 text-base">Aa (qp)</div>
                        <div className="text-xs text-purple-700">{(q * p).toFixed(4)} ({Math.round(q * p * 100)}%)</div>
                      </td>
                      <td className="p-3 bg-amber-50/70 border border-amber-200 font-mono">
                        <div className="font-black text-amber-950 text-base">aa (q²)</div>
                        <div className="text-xs text-amber-700">{q2.toFixed(4)} ({Math.round(q2 * 100)}%)</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Genotype Frequency Proportions Bar */}
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                <span>Total Expected Genotypic Distribution (p² + 2pq + q² = 1.000):</span>
                <span>AA: {Math.round(p2 * 100)}% | Aa: {Math.round(twoPq * 100)}% | aa: {Math.round(q2 * 100)}%</span>
              </div>

              {/* Segmented Bar */}
              <div className="h-6 w-full bg-gray-200 rounded-xl overflow-hidden flex font-mono text-[10px] font-bold text-white text-center leading-6">
                <div 
                  style={{ width: `${p2 * 100}%` }} 
                  className="bg-indigo-600 truncate transition-all duration-300"
                >
                  {p2 > 0.08 ? `p²=${Math.round(p2 * 100)}%` : ''}
                </div>
                <div 
                  style={{ width: `${twoPq * 100}%` }} 
                  className="bg-purple-600 truncate transition-all duration-300"
                >
                  {twoPq > 0.08 ? `2pq=${Math.round(twoPq * 100)}%` : ''}
                </div>
                <div 
                  style={{ width: `${q2 * 100}%` }} 
                  className="bg-amber-500 truncate transition-all duration-300"
                >
                  {q2 > 0.08 ? `q²=${Math.round(q2 * 100)}%` : ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 6: TEST YOURSELF & THINK FIRST CHALLENGE
           ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-purple-100 pb-3">
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                Stage 6 of 6 • Active Verification
              </span>
              <h4 className="text-lg font-black text-purple-950">
                Think First. Calculate Second. Use AI Wisely.
              </h4>
            </div>

            {/* Interaction 1: THINK FIRST PREDICTION */}
            <div className="p-5 bg-white rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
                <Brain className="w-4 h-4 text-purple-700" />
                <span>THINK FIRST PREDICTION:</span>
              </div>

              <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
                Suppose a beetle population has allele frequencies <strong className="font-mono">p = 0.70</strong> and <strong className="font-mono">q = 0.30</strong>. 
                Without calculating, which genotype do you predict will be the most common in the next generation under Hardy-Weinberg equilibrium?
              </p>

              {/* Prediction Options */}
              <div className="grid grid-cols-3 gap-2">
                {['AA', 'Aa', 'aa'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setThinkFirstAnswer(option)}
                    className={`py-2.5 px-3 rounded-xl font-mono text-sm font-bold border transition-all ${
                      thinkFirstAnswer === option
                        ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                        : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border-purple-200'
                    }`}
                  >
                    [{option}]
                  </button>
                ))}
              </div>

              {/* Think First Feedback */}
              {thinkFirstAnswer !== null && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm space-y-1.5 animate-in fade-in duration-200 ${
                  thinkFirstAnswer === 'AA'
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border border-amber-300 text-amber-950'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {thinkFirstAnswer === 'AA' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Insight Verified: AA is the Most Common (49%)</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Not quite: Notice the High Dominant Allele Frequency</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    Here, <strong className="font-mono">p² = (0.70)² = 0.49 (49%)</strong>, while <strong className="font-mono">2pq = 2(0.70)(0.30) = 0.42 (42%)</strong> and <strong className="font-mono">q² = (0.30)² = 0.09 (9%)</strong>.
                  </p>
                  <p className="text-[11px] font-medium text-purple-900">
                    💡 <em>Remember:</em> When p = 0.50, heterozygotes (2pq = 50%) are the most common! But when p &gt; 0.60, the homozygous dominant genotype p² dominates.
                  </p>
                </div>
              )}
            </div>

            {/* Interaction 2: UNLOCK THE GENOTYPE MINI CHALLENGE */}
            <div className="p-5 bg-purple-950 text-white rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-purple-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="font-black text-sm text-amber-300 uppercase tracking-wider">
                    Unlock the Genotype Challenge
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-300">
                  Matriculation Formatted
                </span>
              </div>

              <div className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                Given allele frequencies <span className="font-mono font-bold text-amber-300">p = 0.70</span> and <span className="font-mono font-bold text-amber-300">q = 0.30</span> in a randomly mating beetle population fulfilling all Hardy-Weinberg assumptions:
                <div className="font-bold text-white mt-1">
                  What is the expected frequency of heterozygous (<span className="font-mono">Aa</span>) individuals?
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 1, label: 'A. 0.21', isCorrect: false, explanation: 'Trap: 0.21 is pq only. You forgot to multiply by 2 (for both maternal and paternal combinations)!' },
                  { id: 2, label: 'B. 0.42', isCorrect: true, explanation: 'Correct! 2pq = 2 × 0.70 × 0.30 = 0.42 (42%). Under H-W equilibrium, 42% of beetles are heterozygous.' },
                  { id: 3, label: 'C. 0.49', isCorrect: false, explanation: '0.49 is p² (homozygous dominant AA), not the heterozygous frequency.' },
                  { id: 4, label: 'D. 0.09', isCorrect: false, explanation: '0.09 is q² (homozygous recessive aa), not the heterozygous frequency.' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setChallengeAnswer(opt.id);
                      setShowChallengeResult(true);
                    }}
                    className={`p-3 rounded-xl text-left text-xs font-bold transition-all border ${
                      challengeAnswer === opt.id
                        ? opt.isCorrect
                          ? 'bg-emerald-900 text-white border-emerald-400'
                          : 'bg-rose-900 text-white border-rose-400'
                        : 'bg-purple-900/80 hover:bg-purple-800 text-purple-100 border-purple-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Challenge Explanation */}
              {showChallengeResult && challengeAnswer !== null && (
                <div className="p-4 rounded-xl bg-purple-900/90 border border-purple-700 text-xs space-y-2 animate-in fade-in duration-150">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Official Matriculation Marking Scheme & Working:</span>
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950 p-2.5 rounded-lg space-y-1">
                    <div>1. Frequency of heterozygote genotype = 2pq [1 mark]</div>
                    <div>2. = 2 × (0.70) × (0.30) [1 mark]</div>
                    <div className="font-bold text-amber-300">3. = 0.42 (or 42% of the population) [1 mark]</div>
                  </div>
                  <p className="text-purple-300 text-[11px] leading-relaxed">
                    Under Hardy-Weinberg equilibrium, the heterozygous genotype frequency is always computed as 2pq because fertilisation can occur in two reciprocal ways (A egg × a sperm, or a egg × A sperm).
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Paced Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-100">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-purple-200 text-purple-900 hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-bold text-purple-700">
            Step {currentStep} of {steps.length}
          </span>

          <button
            onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
            disabled={currentStep === steps.length}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-800 hover:bg-purple-900 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple inline helper icon for lightbulb
function LightbulbIcon() {
  return (
    <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}
