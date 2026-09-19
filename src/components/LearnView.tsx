import React, { useState } from 'react';
import { 
  HARDY_WEINBERG_CONDITIONS, 
  POPGEN_SYMBOLS, 
  DECIMAL_RULES, 
  FORMULA_MEMORY_DRILLS 
} from '../data/chapter5Notes';
import { 
  Dna, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Sliders, 
  Sparkles,
  HelpCircle,
  TrendingUp,
  Layers,
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';
import { 
  platycladusImg, 
  redFlowerImg, 
  pinkFlowerImg, 
  whiteFlowerImg 
} from '../assets/images';
import { ConditionAnimatedVisual } from './ConditionAnimatedVisual';
import { HardyWeinbergAnimation } from './HardyWeinbergAnimation';
import { BiologicalConditionLab } from './BiologicalConditionLab';

export const LearnView: React.FC = () => {
  const [activeSubtopic, setActiveSubtopic] = useState<'5.1' | '5.2' | 'table' | 'symbols' | 'rules'>('5.1');

  // Interactive Example 1: Gene Pool Platycladus orientalis simulation
  const [ttCount, setTtCount] = useState<number>(70); // TT
  const [hetCount, setHetCount] = useState<number>(20); // Tt
  const [recCount, setRecCount] = useState<number>(10); // tt

  const totalPlants = ttCount + hetCount + recCount;
  const tDominantAlleles = (ttCount * 2) + hetCount;
  const tRecessiveAlleles = (recCount * 2) + hetCount;
  const totalAlleles = totalPlants * 2;
  const freqT = totalAlleles > 0 ? (tDominantAlleles / totalAlleles).toFixed(3) : "0.000";
  const freqt = totalAlleles > 0 ? (tRecessiveAlleles / totalAlleles).toFixed(3) : "0.000";

  // Interactive Example 2: Flower Colours Incomplete Dominance
  const [redFlowers, setRedFlowers] = useState<number>(320); // CRCR
  const [pinkFlowers, setPinkFlowers] = useState<number>(160); // CRCW
  const [whiteFlowers, setWhiteFlowers] = useState<number>(20); // CWCW

  const totalFlowers = redFlowers + pinkFlowers + whiteFlowers;
  const flowerGenePool = totalFlowers * 2;
  const crAlleles = (redFlowers * 2) + pinkFlowers;
  const cwAlleles = (whiteFlowers * 2) + pinkFlowers;
  const freqCR = flowerGenePool > 0 ? (crAlleles / flowerGenePool).toFixed(3) : "0.000";
  const freqCW = flowerGenePool > 0 ? (cwAlleles / flowerGenePool).toFixed(3) : "0.000";

  // Active symbol selection in 5.2
  const [selectedSymbol, setSelectedSymbol] = useState(POPGEN_SYMBOLS[1]); // q² by default

  // Active condition selection
  const [selectedCondition, setSelectedCondition] = useState(HARDY_WEINBERG_CONDITIONS[0]);

  // Formula drill state
  const [drillIndex, setDrillIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const currentDrill = FORMULA_MEMORY_DRILLS[drillIndex];

  return (
    <div className="space-y-6 pb-12">
      {/* Subtopic Switcher Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-purple-100/70 rounded-xl border border-purple-200">
        <button
          onClick={() => setActiveSubtopic('5.1')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubtopic === '5.1'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'text-purple-900 hover:bg-purple-200/80'
          }`}
        >
          <Dna className="w-4 h-4" />
          5.1 Gene Pool Concept
        </button>

        <button
          onClick={() => setActiveSubtopic('5.2')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubtopic === '5.2'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'text-purple-900 hover:bg-purple-200/80'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          5.2 Hardy-Weinberg Law
        </button>

        <button
          onClick={() => setActiveSubtopic('symbols')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubtopic === 'symbols'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'text-purple-900 hover:bg-purple-200/80'
          }`}
        >
          <Layers className="w-4 h-4" />
          Formula & Symbols
        </button>

        <button
          onClick={() => setActiveSubtopic('table')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubtopic === 'table'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'text-purple-900 hover:bg-purple-200/80'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          The POPGEN Table
        </button>

        <button
          onClick={() => setActiveSubtopic('rules')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubtopic === 'rules'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'text-purple-900 hover:bg-purple-200/80'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Calculation Rules
        </button>
      </div>

      {/* SECTION 5.1: GENE POOL CONCEPT */}
      {activeSubtopic === '5.1' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-900 font-extrabold text-xs rounded-full">
              Topic 5.1 — Core Definition
            </div>
            <h2 className="text-2xl font-black text-purple-950">
              The Gene Pool Concept
            </h2>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-sm sm:text-base text-purple-950 leading-relaxed">
              <strong>Gene Pool Definition:</strong> Total number of genes and their different alleles that are present in a population of a particular species of organisms at a given time.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-purple-200 bg-white space-y-1.5">
                <div className="font-bold text-sm text-purple-900">Homozygous Dominant (TT)</div>
                <div className="text-xs text-purple-700">Carries <strong>2 dominant alleles</strong> (T and T) for the gene.</div>
                <div className="text-xs font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded inline-block">2 × T</div>
              </div>
              <div className="p-4 rounded-xl border border-purple-200 bg-white space-y-1.5">
                <div className="font-bold text-sm text-purple-900">Heterozygous (Tt)</div>
                <div className="text-xs text-purple-700">Carries <strong>1 dominant allele + 1 recessive allele</strong> (T and t).</div>
                <div className="text-xs font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded inline-block">1 × T + 1 × t</div>
              </div>
              <div className="p-4 rounded-xl border border-purple-200 bg-white space-y-1.5">
                <div className="font-bold text-sm text-purple-900">Homozygous Recessive (tt)</div>
                <div className="text-xs text-purple-700">Carries <strong>2 recessive alleles</strong> (t and t) for the gene.</div>
                <div className="text-xs font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded inline-block">2 × t</div>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>The Diploid Rule:</strong> Because organisms are diploid, each individual carries <strong>2 alleles</strong> for each gene. Therefore, <span className="font-mono font-bold">Gene Pool Size = 2 × Total Individuals</span>.
              </div>
            </div>
          </div>

          {/* Interactive Example 1: Platycladus orientalis Gene Pool */}
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Interactive Example 1</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Fill Your Own Numbers
                  </span>
                </div>
                <h3 className="text-lg font-bold text-purple-950 mt-0.5">
                  Gene Pool for Tallness in <em>Platycladus orientalis</em> Plants
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-purple-100 text-purple-800 font-mono px-2.5 py-1 rounded-full font-semibold">
                  Total Plants: <strong>{totalPlants}</strong>
                </span>
                <span className="text-xs bg-amber-100 text-amber-800 font-mono px-2.5 py-1 rounded-full font-semibold">
                  Gene Pool: <strong>{totalAlleles} alleles</strong>
                </span>
              </div>
            </div>

            {/* Specimen Photo & Problem Description */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-purple-50/70 p-4 rounded-xl border border-purple-200">
              <div className="md:col-span-4 shrink-0">
                <div className="relative rounded-xl overflow-hidden border-2 border-purple-300 shadow-2xs group">
                  <img 
                    src={platycladusImg} 
                    alt="Platycladus orientalis foliage" 
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-purple-950/80 backdrop-blur-xs text-white p-2 text-[11px] leading-tight">
                    <strong className="block font-sans text-purple-200">Platycladus orientalis</strong>
                    Chinese arborvitae (conifer) • Diploid (2n = 22)
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5 text-xs sm:text-sm text-purple-950">
                  <p className="font-semibold text-purple-900">
                    <strong>Question:</strong> In a sample population of <em>Platycladus orientalis</em>, tallness (<strong className="font-mono">T</strong>) is dominant over dwarfness (<strong className="font-mono">t</strong>). Organisms are diploid, so each individual carries 2 alleles.
                  </p>
                  <p className="text-purple-800 text-xs leading-relaxed">
                    You can directly <strong>fill in the number of plants</strong> below or use the steppers to explore how the gene pool and allele frequencies change dynamically:
                  </p>
                </div>

                {/* Preset Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-purple-200/80">
                  <span className="text-[11px] font-bold text-purple-700">Quick Presets:</span>
                  <button
                    onClick={() => { setTtCount(70); setHetCount(20); setRecCount(10); }}
                    className="text-xs px-2.5 py-1 rounded-md bg-purple-200 hover:bg-purple-300 text-purple-900 font-semibold transition-colors"
                  >
                    Standard (70 TT, 20 Tt, 10 tt)
                  </button>
                  <button
                    onClick={() => { setTtCount(150); setHetCount(60); setRecCount(40); }}
                    className="text-xs px-2.5 py-1 rounded-md bg-purple-200 hover:bg-purple-300 text-purple-900 font-semibold transition-colors"
                  >
                    Variant B (150 TT, 60 Tt, 40 tt)
                  </button>
                  <button
                    onClick={() => { setTtCount(0); setHetCount(0); setRecCount(0); }}
                    className="text-xs px-2 py-1 rounded-md bg-white hover:bg-purple-100 text-purple-700 border border-purple-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Adjustable Inputs: Students Fill In On Their Own */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <span>Enter Number of Plants for Each Genotype:</span>
                <span className="text-purple-600 font-normal">(Type custom numbers or click + / -)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* TT Input */}
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-900">Homozygous Tall</span>
                    <span className="font-mono text-xs font-black bg-purple-200 text-purple-900 px-2 py-0.5 rounded">TT</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-purple-700 font-semibold block">Number of plants:</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={ttCount} 
                      onChange={(e) => setTtCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-center font-mono font-extrabold text-xl p-2 bg-white rounded-lg border-2 border-purple-300 text-purple-950 focus:border-purple-600 focus:outline-hidden" 
                      placeholder="e.g. 70"
                    />
                    
                    {/* Steppers */}
                    <div className="flex items-center justify-center gap-1 pt-1">
                      <button
                        onClick={() => setTtCount(Math.max(0, ttCount - 10))}
                        className="px-2 py-0.5 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-bold"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => setTtCount(Math.max(0, ttCount - 1))}
                        className="p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setTtCount(ttCount + 1)}
                        className="p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setTtCount(ttCount + 10)}
                        className="px-2 py-0.5 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-bold"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-purple-800 bg-white/80 p-2 rounded-lg border border-purple-100">
                    <div>Carries: <strong>2 dominant alleles (T and T)</strong></div>
                    <div className="mt-0.5 text-purple-950 font-bold">
                      Contributes: {ttCount} × 2 = <span className="text-emerald-700 font-mono font-extrabold">{ttCount * 2}</span> T alleles
                    </div>
                  </div>
                </div>

                {/* Tt Input */}
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-900">Heterozygous Tall</span>
                    <span className="font-mono text-xs font-black bg-purple-200 text-purple-900 px-2 py-0.5 rounded">Tt</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-purple-700 font-semibold block">Number of plants:</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={hetCount} 
                      onChange={(e) => setHetCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-center font-mono font-extrabold text-xl p-2 bg-white rounded-lg border-2 border-purple-300 text-purple-950 focus:border-purple-600 focus:outline-hidden" 
                      placeholder="e.g. 20"
                    />
                    
                    {/* Steppers */}
                    <div className="flex items-center justify-center gap-1 pt-1">
                      <button
                        onClick={() => setHetCount(Math.max(0, hetCount - 10))}
                        className="px-2 py-0.5 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-bold"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => setHetCount(Math.max(0, hetCount - 1))}
                        className="p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setHetCount(hetCount + 1)}
                        className="p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setHetCount(hetCount + 10)}
                        className="px-2 py-0.5 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-bold"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-purple-800 bg-white/80 p-2 rounded-lg border border-purple-100">
                    <div>Carries: <strong>1 dominant (T) + 1 recessive (t)</strong></div>
                    <div className="mt-0.5 text-purple-950 font-bold">
                      Contributes: <span className="text-emerald-700 font-mono font-extrabold">{hetCount}</span> T + <span className="text-amber-700 font-mono font-extrabold">{hetCount}</span> t alleles
                    </div>
                  </div>
                </div>

                {/* tt Input */}
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-900">Homozygous Dwarf</span>
                    <span className="font-mono text-xs font-black bg-purple-200 text-purple-900 px-2 py-0.5 rounded">tt</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-purple-700 font-semibold block">Number of plants:</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={recCount} 
                      onChange={(e) => setRecCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-center font-mono font-extrabold text-xl p-2 bg-white rounded-lg border-2 border-purple-300 text-purple-950 focus:border-purple-600 focus:outline-hidden" 
                      placeholder="e.g. 10"
                    />
                    
                    {/* Steppers */}
                    <div className="flex items-center justify-center gap-1 pt-1">
                      <button
                        onClick={() => setRecCount(Math.max(0, recCount - 10))}
                        className="px-2 py-0.5 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-bold"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => setRecCount(Math.max(0, recCount - 1))}
                        className="p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setRecCount(recCount + 1)}
                        className="p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setRecCount(recCount + 10)}
                        className="px-2 py-0.5 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-bold"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-purple-800 bg-white/80 p-2 rounded-lg border border-purple-100">
                    <div>Carries: <strong>2 recessive alleles (t and t)</strong></div>
                    <div className="mt-0.5 text-purple-950 font-bold">
                      Contributes: {recCount} × 2 = <span className="text-amber-700 font-mono font-extrabold">{recCount * 2}</span> t alleles
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Results Box */}
            <div className="p-5 bg-purple-950 text-white rounded-2xl space-y-3 text-xs sm:text-sm border border-purple-800 shadow-md">
              <div className="flex items-center justify-between border-b border-purple-800 pb-2">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Step-by-Step Gene Pool Working (Each Step Verified):</span>
                </div>
                <span className="text-[11px] font-mono text-purple-300">
                  Formula: Gene Pool Size = 2 × Total Plants
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-purple-100 pt-1">
                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 1: Total Individuals (N)
                  </div>
                  <div className="font-mono text-sm">
                    {ttCount} + {hetCount} + {recCount} = <strong className="text-amber-300 font-bold">{totalPlants} plants</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">Sum of all individuals across genotypes.</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 2: Gene Pool Size (Total Alleles)
                  </div>
                  <div className="font-mono text-sm">
                    2 × {totalPlants} = <strong className="text-amber-300 font-bold">{totalAlleles} alleles</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">Diploid rule: Each plant possesses 2 alleles.</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 3: Total Dominant Alleles (T)
                  </div>
                  <div className="font-mono text-sm">
                    (2 × {ttCount}) + {hetCount} = <strong className="text-emerald-300 font-bold">{tDominantAlleles} T alleles</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">From homozygous dominant (2×) + heterozygous (1×).</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 4: Total Recessive Alleles (t)
                  </div>
                  <div className="font-mono text-sm">
                    (2 × {recCount}) + {hetCount} = <strong className="text-emerald-300 font-bold">{tRecessiveAlleles} t alleles</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">From homozygous recessive (2×) + heterozygous (1×).</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 5: Dominant Allele Frequency (T)
                  </div>
                  <div className="font-mono text-sm">
                    {tDominantAlleles} ÷ {totalAlleles || 1} = <strong className="text-amber-300 font-bold">{freqT}</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">Proportion of T alleles in the entire gene pool.</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 6: Recessive Allele Frequency (t)
                  </div>
                  <div className="font-mono text-sm">
                    {tRecessiveAlleles} ÷ {totalAlleles || 1} = <strong className="text-amber-300 font-bold">{freqt}</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">Check: {freqT} + {freqt} = {(parseFloat(freqT) + parseFloat(freqt)).toFixed(3)} ✓</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Example 2: Flower Colors (Incomplete Dominance) with Flower Photos */}
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Interactive Example 2</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Flower Colors & Incomplete Dominance
                  </span>
                </div>
                <h3 className="text-lg font-bold text-purple-950 mt-0.5">
                  Gene Pool Calculation for Snapdragon / Four O'Clock Flower Colours
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-purple-100 text-purple-800 font-mono px-2.5 py-1 rounded-full font-semibold">
                  Total Flowers: <strong>{totalFlowers}</strong>
                </span>
                <span className="text-xs bg-rose-100 text-rose-800 font-mono px-2.5 py-1 rounded-full font-semibold">
                  Gene Pool: <strong>{flowerGenePool} alleles</strong>
                </span>
              </div>
            </div>

            {/* Problem Description & Presets */}
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3 text-xs sm:text-sm text-purple-950">
              <p className="leading-relaxed">
                <strong>Question:</strong> In a plant population displaying incomplete dominance for flower color, there are plants with <strong>red flowers</strong> (C<sup>R</sup>C<sup>R</sup>), <strong>pink flowers</strong> (C<sup>R</sup>C<sup>W</sup>), and <strong>white flowers</strong> (C<sup>W</sup>C<sup>W</sup>). Determine the gene pool size and the allele frequencies for C<sup>R</sup> and C<sup>W</sup>.
              </p>
              
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-200">
                <span className="text-[11px] font-bold text-purple-700">Quick Presets:</span>
                <button
                  onClick={() => { setRedFlowers(320); setPinkFlowers(160); setWhiteFlowers(20); }}
                  className="text-xs px-2.5 py-1 rounded-md bg-purple-200 hover:bg-purple-300 text-purple-900 font-semibold transition-colors"
                >
                  Standard Sample (320 Red, 160 Pink, 20 White)
                </button>
                <button
                  onClick={() => { setRedFlowers(250); setPinkFlowers(500); setWhiteFlowers(250); }}
                  className="text-xs px-2.5 py-1 rounded-md bg-purple-200 hover:bg-purple-300 text-purple-900 font-semibold transition-colors"
                >
                  1:2:1 Ratio (250 Red, 500 Pink, 250 White)
                </button>
                <button
                  onClick={() => { setRedFlowers(0); setPinkFlowers(0); setWhiteFlowers(0); }}
                  className="text-xs px-2 py-1 rounded-md bg-white hover:bg-purple-100 text-purple-700 border border-purple-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>

            {/* Visual Flower Cards with Real Botanical Photos & Number Inputs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <span>Flower Phenotypes & Adjustable Number of Plants:</span>
                <span className="text-purple-600 font-normal">(Students can fill in numbers on their own)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Red Flower Card */}
                <div className="bg-white rounded-2xl border-2 border-rose-200 overflow-hidden shadow-2xs hover:border-rose-400 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="relative h-36 overflow-hidden bg-rose-50">
                      <img 
                        src={redFlowerImg} 
                        alt="Red flower phenotype" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 bg-rose-900/90 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">
                        C<sup>R</sup>C<sup>R</sup>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-rose-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Homozygous Red
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-rose-950">Red Flower Plants</span>
                        <span className="text-[11px] text-rose-700 font-mono">2 × C<sup>R</sup> alleles</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-rose-800 font-semibold block">Enter count:</label>
                        <input 
                          type="number" 
                          min="0" 
                          value={redFlowers} 
                          onChange={(e) => setRedFlowers(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full text-center font-mono font-extrabold text-xl p-2 bg-rose-50/50 rounded-lg border-2 border-rose-300 text-rose-950 focus:border-rose-600 focus:outline-hidden" 
                          placeholder="e.g. 320"
                        />
                        
                        {/* Steppers */}
                        <div className="flex items-center justify-center gap-1 pt-1">
                          <button
                            onClick={() => setRedFlowers(Math.max(0, redFlowers - 20))}
                            className="px-2 py-0.5 text-xs bg-rose-100 hover:bg-rose-200 text-rose-900 rounded font-bold"
                          >
                            -20
                          </button>
                          <button
                            onClick={() => setRedFlowers(Math.max(0, redFlowers - 1))}
                            className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setRedFlowers(redFlowers + 1)}
                            className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setRedFlowers(redFlowers + 20)}
                            className="px-2 py-0.5 text-xs bg-rose-100 hover:bg-rose-200 text-rose-900 rounded font-bold"
                          >
                            +20
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50 border-t border-rose-100 text-[11px] text-rose-950">
                    Contributes: {redFlowers} × 2 = <strong className="font-mono text-rose-700">{redFlowers * 2}</strong> C<sup>R</sup> alleles
                  </div>
                </div>

                {/* Pink Flower Card */}
                <div className="bg-white rounded-2xl border-2 border-pink-200 overflow-hidden shadow-2xs hover:border-pink-400 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="relative h-36 overflow-hidden bg-pink-50">
                      <img 
                        src={pinkFlowerImg} 
                        alt="Pink flower phenotype" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 bg-pink-900/90 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">
                        C<sup>R</sup>C<sup>W</sup>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-pink-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Heterozygous Pink
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-pink-950">Pink Flower Plants</span>
                        <span className="text-[11px] text-pink-700 font-mono">1 C<sup>R</sup> + 1 C<sup>W</sup></span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-pink-800 font-semibold block">Enter count:</label>
                        <input 
                          type="number" 
                          min="0" 
                          value={pinkFlowers} 
                          onChange={(e) => setPinkFlowers(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full text-center font-mono font-extrabold text-xl p-2 bg-pink-50/50 rounded-lg border-2 border-pink-300 text-pink-950 focus:border-pink-600 focus:outline-hidden" 
                          placeholder="e.g. 160"
                        />
                        
                        {/* Steppers */}
                        <div className="flex items-center justify-center gap-1 pt-1">
                          <button
                            onClick={() => setPinkFlowers(Math.max(0, pinkFlowers - 20))}
                            className="px-2 py-0.5 text-xs bg-pink-100 hover:bg-pink-200 text-pink-900 rounded font-bold"
                          >
                            -20
                          </button>
                          <button
                            onClick={() => setPinkFlowers(Math.max(0, pinkFlowers - 1))}
                            className="p-1 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setPinkFlowers(pinkFlowers + 1)}
                            className="p-1 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setPinkFlowers(pinkFlowers + 20)}
                            className="px-2 py-0.5 text-xs bg-pink-100 hover:bg-pink-200 text-pink-900 rounded font-bold"
                          >
                            +20
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-pink-50 border-t border-pink-100 text-[11px] text-pink-950">
                    Contributes: <strong className="font-mono text-rose-700">{pinkFlowers}</strong> C<sup>R</sup> + <strong className="font-mono text-purple-700">{pinkFlowers}</strong> C<sup>W</sup> alleles
                  </div>
                </div>

                {/* White Flower Card */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-2xs hover:border-purple-400 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="relative h-36 overflow-hidden bg-slate-50">
                      <img 
                        src={whiteFlowerImg} 
                        alt="White flower phenotype" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">
                        C<sup>W</sup>C<sup>W</sup>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Homozygous White
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">White Flower Plants</span>
                        <span className="text-[11px] text-slate-600 font-mono">2 × C<sup>W</sup> alleles</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-700 font-semibold block">Enter count:</label>
                        <input 
                          type="number" 
                          min="0" 
                          value={whiteFlowers} 
                          onChange={(e) => setWhiteFlowers(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full text-center font-mono font-extrabold text-xl p-2 bg-slate-50 rounded-lg border-2 border-slate-300 text-slate-950 focus:border-purple-600 focus:outline-hidden" 
                          placeholder="e.g. 20"
                        />
                        
                        {/* Steppers */}
                        <div className="flex items-center justify-center gap-1 pt-1">
                          <button
                            onClick={() => setWhiteFlowers(Math.max(0, whiteFlowers - 10))}
                            className="px-2 py-0.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-900 rounded font-bold"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => setWhiteFlowers(Math.max(0, whiteFlowers - 1))}
                            className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setWhiteFlowers(whiteFlowers + 1)}
                            className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setWhiteFlowers(whiteFlowers + 10)}
                            className="px-2 py-0.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-900 rounded font-bold"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-900">
                    Contributes: {whiteFlowers} × 2 = <strong className="font-mono text-purple-800">{whiteFlowers * 2}</strong> C<sup>W</sup> alleles
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Results Box */}
            <div className="p-5 bg-purple-950 text-white rounded-2xl space-y-3 text-xs sm:text-sm border border-purple-800 shadow-md">
              <div className="flex items-center justify-between border-b border-purple-800 pb-2">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Step-by-Step Flower Gene Pool Calculation:</span>
                </div>
                <span className="text-[11px] font-mono text-purple-300">
                  Diploid Organisms (2 alleles per plant)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-purple-100 pt-1">
                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 1: Total Plants (N)
                  </div>
                  <div className="font-mono text-sm">
                    {redFlowers} + {pinkFlowers} + {whiteFlowers} = <strong className="text-amber-300 font-bold">{totalFlowers} plants</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">Sum of red, pink, and white plants.</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 2: Gene Pool Size (Total Alleles)
                  </div>
                  <div className="font-mono text-sm">
                    2 × {totalFlowers} = <strong className="text-amber-300 font-bold">{flowerGenePool} alleles</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">Total number of alleles in the flower population.</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 3: Total C<sup>R</sup> Alleles
                  </div>
                  <div className="font-mono text-sm">
                    (2 × {redFlowers}) + {pinkFlowers} = <strong className="text-rose-300 font-bold">{crAlleles} C<sup>R</sup> alleles</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">2 from each red plant + 1 from each pink plant.</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 4: Total C<sup>W</sup> Alleles
                  </div>
                  <div className="font-mono text-sm">
                    (2 × {whiteFlowers}) + {pinkFlowers} = <strong className="text-purple-300 font-bold">{cwAlleles} C<sup>W</sup> alleles</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">2 from each white plant + 1 from each pink plant.</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 5: Frequency of C<sup>R</sup> Allele
                  </div>
                  <div className="font-mono text-sm">
                    {crAlleles} ÷ {flowerGenePool || 1} = <strong className="text-amber-300 font-bold">{freqCR}</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">Proportion of red alleles in the gene pool.</div>
                </div>

                <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-800/80 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> Step 6: Frequency of C<sup>W</sup> Allele
                  </div>
                  <div className="font-mono text-sm">
                    {cwAlleles} ÷ {flowerGenePool || 1} = <strong className="text-amber-300 font-bold">{freqCW}</strong>
                  </div>
                  <div className="text-[11px] text-purple-300">Check: {freqCR} + {freqCW} = {(parseFloat(freqCR) + parseFloat(freqCW)).toFixed(3)} ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5.2: HARDY-WEINBERG LAW */}
      {activeSubtopic === '5.2' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-900 font-extrabold text-xs rounded-full">
              Topic 5.2 — Law & 5 Conditions
            </div>
            <h2 className="text-2xl font-black text-purple-950">
              Hardy-Weinberg Law & Genetic Equilibrium
            </h2>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-sm sm:text-base text-purple-950 leading-relaxed">
              <strong>Hardy-Weinberg Law States:</strong> The allele frequencies of genotypes in a population remain <strong>constant from generation to generation</strong> under certain conditions.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                <div className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Genetic Equilibrium (No Evolution)</span>
                </div>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  If a population is NOT evolving, it is in genetic equilibrium: allele frequencies do not change from generation to generation.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-1.5">
                <div className="font-bold text-sm text-red-950 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Evolution (Formation of New Species)</span>
                </div>
                <p className="text-xs text-red-900/90 leading-relaxed">
                  Evolution is the <strong>change in allele frequency</strong> in a population over time when any of the 5 conditions are violated!
                </p>
              </div>
            </div>
          </div>

          {/* HARDY-WEINBERG BIOLOGICAL CONDITION LAB */}
          <BiologicalConditionLab />

          {/* Educational Animation: From Alleles to Hardy-Weinberg Equation */}
          <HardyWeinbergAnimation />

          {/* Animated 5 Conditions Laboratory */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>Animated Biological Conditions Laboratory</span>
              </div>
              <h3 className="text-xl font-black text-purple-950">
                The 5 Fundamental Conditions of Hardy-Weinberg Equilibrium
              </h3>
              <p className="text-xs sm:text-sm text-purple-800 leading-relaxed">
                Explore animated biological photos illustrating each condition in living populations. You can toggle between <strong>Equilibrium</strong> and <strong>Violation</strong> to observe how evolutionary mechanisms operate when assumptions are broken.
              </p>
            </div>

            <ConditionAnimatedVisual
              condition={selectedCondition}
              allConditions={HARDY_WEINBERG_CONDITIONS}
              onSelectCondition={(cond) => setSelectedCondition(cond)}
            />
          </div>
        </div>
      )}

      {/* SECTION: FORMULA & SYMBOLS */}
      {activeSubtopic === 'symbols' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-5">
            <div>
              <div className="inline-block px-3 py-1 bg-purple-100 text-purple-900 font-extrabold text-xs rounded-full mb-2">
                Core Equations
              </div>
              <h2 className="text-2xl font-black text-purple-950">
                The Hardy-Weinberg Formula System
              </h2>
            </div>

            {/* Twin Big Formula Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-purple-900 to-purple-800 text-white rounded-2xl shadow-sm space-y-1">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">Allele Frequency Equation</div>
                <div className="text-3xl font-black font-mono tracking-wide text-amber-300">
                  p + q = 1
                </div>
                <div className="text-xs text-purple-200">
                  *The sum of all allele frequencies must equal 1*
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-950 to-purple-900 text-white rounded-2xl shadow-sm space-y-1">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">Genotype Frequency Equation</div>
                <div className="text-3xl font-black font-mono tracking-wide text-emerald-300">
                  p² + 2pq + q² = 1
                </div>
                <div className="text-xs text-purple-200">
                  *The sum of all genotype frequencies must equal 1*
                </div>
              </div>
            </div>

            {/* Clickable Symbol Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-purple-950 uppercase tracking-wider">
                Click a symbol to view exact meaning, when to use it, and examples:
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {POPGEN_SYMBOLS.map((sym) => (
                  <button
                    key={sym.symbol}
                    onClick={() => setSelectedSymbol(sym)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedSymbol.symbol === sym.symbol
                        ? 'bg-purple-800 text-white border-purple-900 shadow-md scale-102'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-950 border-purple-200'
                    }`}
                  >
                    <div className="text-2xl font-black font-mono">{sym.symbol}</div>
                    <div className="text-[11px] font-medium truncate mt-1">{sym.name}</div>
                  </button>
                ))}
              </div>

              {/* Symbol Detail Showcase */}
              <div className="p-5 rounded-2xl bg-purple-50/90 border-2 border-purple-300 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black font-mono text-purple-900 bg-white px-3 py-1 rounded-xl border border-purple-200 shadow-2xs">
                      {selectedSymbol.symbol}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-base text-purple-950">{selectedSymbol.name}</h4>
                      <code className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        {selectedSymbol.equation}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-purple-950 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-purple-200 space-y-1">
                    <strong className="text-purple-900">WHAT IT MEANS:</strong>
                    <p className="text-purple-800 leading-relaxed">{selectedSymbol.meaning}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-purple-200 space-y-1">
                    <strong className="text-purple-900">WHEN TO USE IT:</strong>
                    <p className="text-purple-800 leading-relaxed">{selectedSymbol.whenToUse}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-purple-200 space-y-1">
                    <strong className="text-purple-900">EXAMPLE:</strong>
                    <p className="text-purple-800 leading-relaxed">{selectedSymbol.example}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Memory Drills Feature */}
            <div className="p-5 bg-purple-100/60 rounded-2xl border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-purple-950">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span>Interactive Formula Memory Drill #{drillIndex + 1}</span>
                </div>
                <div className="text-xs text-purple-700 font-semibold">
                  {drillIndex + 1} of {FORMULA_MEMORY_DRILLS.length}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-purple-900 font-medium">
                {currentDrill.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentDrill.choices.map((choice, i) => {
                  const isPicked = selectedChoice === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedChoice(i)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-colors ${
                        isPicked
                          ? choice.isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                            : 'bg-red-100 border-red-400 text-red-950'
                          : 'bg-white hover:bg-purple-50 text-purple-950 border-purple-200'
                      }`}
                    >
                      <div className="font-mono text-sm">{choice.label}</div>
                    </button>
                  );
                })}
              </div>

              {selectedChoice !== null && (
                <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                  currentDrill.choices[selectedChoice].isCorrect
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border border-red-300 text-red-900'
                }`}>
                  <strong>{currentDrill.choices[selectedChoice].isCorrect ? '✓ Correct! ' : '✗ Check this: '}</strong>
                  {currentDrill.choices[selectedChoice].explanation}
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setSelectedChoice(null);
                    setDrillIndex((drillIndex + 1) % FORMULA_MEMORY_DRILLS.length);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs"
                >
                  Next Drill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: THE POPGEN TABLE MATRIX */}
      {activeSubtopic === 'table' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Standard Examination Matrix</span>
              <h2 className="text-2xl font-black text-purple-950">
                The POPGEN Table Method
              </h2>
              <p className="text-xs sm:text-sm text-purple-800 mt-1">
                The POPGEN Table is the official 4-step framework used to calculate allele and genotype frequencies under Hardy-Weinberg conditions.
              </p>
            </div>

            {/* The POPGEN Table Structure */}
            <div className="overflow-x-auto rounded-xl border-2 border-purple-300 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-purple-900 text-white">
                    <th className="p-3 border border-purple-700 font-bold">Phenotypes</th>
                    <th className="p-3 border border-purple-700 font-bold">
                      <div>Number of individuals</div>
                      <div className="text-[10px] text-purple-200 font-normal">Total individuals</div>
                    </th>
                    <th className="p-3 border border-purple-700 font-bold">
                      <div>Frequency of genotype</div>
                      <div className="text-[10px] font-mono text-amber-300">p² + 2pq + q² = 1</div>
                    </th>
                    <th className="p-3 border border-purple-700 font-bold">
                      <div>Frequency of allele</div>
                      <div className="text-[10px] font-mono text-emerald-300">p + q = 1</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Recessive Phenotype Row */}
                  <tr className="bg-purple-50/80 hover:bg-purple-100/60 transition-colors">
                    <td className="p-3.5 border border-purple-200 font-bold text-purple-950">
                      Recessive phenotype
                    </td>
                    <td className="p-3.5 border border-purple-200 font-mono text-purple-900">
                      e.g. 20 / 500
                    </td>
                    <td className="p-3.5 border border-purple-200 bg-amber-50/70">
                      <div className="font-bold text-amber-950 flex items-center gap-1">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 inline-flex items-center justify-center font-bold text-xs">1</span>
                        <span>Frequency of homozygous recessive genotype:</span>
                      </div>
                      <div className="font-mono text-sm font-extrabold text-purple-900 mt-1 pl-6">
                        q² = (Recessive) / (Total)
                      </div>
                    </td>
                    <td className="p-3.5 border border-purple-200 bg-emerald-50/70">
                      <div className="font-bold text-emerald-950 flex items-center gap-1">
                        <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 inline-flex items-center justify-center font-bold text-xs">2</span>
                        <span>Frequency of recessive allele:</span>
                      </div>
                      <div className="font-mono text-sm font-extrabold text-emerald-900 mt-1 pl-6">
                        q = √q²
                      </div>
                    </td>
                  </tr>

                  {/* Dominant Phenotype Row */}
                  <tr className="bg-white hover:bg-purple-50/50 transition-colors">
                    <td className="p-3.5 border border-purple-200 font-bold text-purple-950">
                      Dominant phenotype
                    </td>
                    <td className="p-3.5 border border-purple-200 font-mono text-purple-900">
                      e.g. 480 / 500
                    </td>
                    <td className="p-3.5 border border-purple-200">
                      <div className="space-y-3">
                        <div>
                          <div className="font-bold text-purple-950 flex items-center gap-1">
                            <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 inline-flex items-center justify-center font-bold text-xs">4a</span>
                            <span>Frequency of heterozygous genotype:</span>
                          </div>
                          <div className="font-mono text-xs font-bold text-purple-900 mt-0.5 pl-6">
                            2pq = 2 × p × q
                          </div>
                        </div>

                        <div className="pt-2 border-t border-purple-100">
                          <div className="font-bold text-purple-950 flex items-center gap-1">
                            <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 inline-flex items-center justify-center font-bold text-xs">4b</span>
                            <span>Frequency of homozygous dominant genotype:</span>
                          </div>
                          <div className="font-mono text-xs font-bold text-purple-900 mt-0.5 pl-6">
                            p² = (p)²
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 border border-purple-200 bg-emerald-50/70 align-bottom">
                      <div className="font-bold text-emerald-950 flex items-center gap-1">
                        <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 inline-flex items-center justify-center font-bold text-xs">3</span>
                        <span>Frequency of dominant allele:</span>
                      </div>
                      <div className="font-mono text-sm font-extrabold text-emerald-900 mt-1 pl-6">
                        p = 1 − q
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* POPGEN Flow Explanation Banner */}
            <div className="p-4 bg-purple-900 text-white rounded-xl space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-amber-300">The 4-Step POPGEN Table Rule Sequence:</div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm pt-1">
                <span className="px-2 py-1 bg-purple-800 rounded border border-purple-600">1. Calculate q²</span>
                <span>➔</span>
                <span className="px-2 py-1 bg-purple-800 rounded border border-purple-600">2. Take q = √q²</span>
                <span>➔</span>
                <span className="px-2 py-1 bg-purple-800 rounded border border-purple-600">3. Find p = 1 − q</span>
                <span>➔</span>
                <span className="px-2 py-1 bg-purple-800 rounded border border-purple-600">4. Calculate 2pq & p²</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: CALCULATION RULES & DECIMAL STANDARDS */}
      {activeSubtopic === 'rules' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-5">
            <div>
              <div className="inline-block px-3 py-1 bg-purple-100 text-purple-900 font-extrabold text-xs rounded-full mb-2">
                Exam Scoring Protocol
              </div>
              <h2 className="text-2xl font-black text-purple-950">
                Official Population Genetics Calculation Rules
              </h2>
            </div>

            {/* Rule 1: Non-HW Symbol prohibition */}
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-red-950 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>CRITICAL RULE: DO NOT USE SYMBOLS if the population is NOT in Hardy-Weinberg equilibrium!</span>
              </div>
              <p className="text-red-900 leading-relaxed">
                If the population does not follow Hardy-Weinberg conditions (or is being calculated via the gene pool allele-counting method), <strong>do not use p, q, p², 2pq, or q²</strong>. Write out the full verbal terms:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs text-red-950">
                <div className="p-2 bg-white rounded border border-red-200">• Frequency of dominant allele</div>
                <div className="p-2 bg-white rounded border border-red-200">• Frequency of recessive allele</div>
                <div className="p-2 bg-white rounded border border-red-200">• Frequency of homozygous dominant genotype</div>
                <div className="p-2 bg-white rounded border border-red-200">• Frequency of heterozygous genotype</div>
              </div>
            </div>

            {/* Rule 2: Decimal Places Guideline Table */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-purple-950">
                Official Decimal Places Guide (When not explicitly stated in the question):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DECIMAL_RULES.map((r, idx) => (
                  <div key={idx} className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
                    <div className="text-xs text-purple-600 uppercase font-bold">Population Size</div>
                    <div className="text-base font-black text-purple-950">{r.range}</div>
                    <div className="text-xs font-semibold text-purple-800 bg-white px-2 py-1 rounded border border-purple-200 inline-block">
                      {r.rule}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recessive-First Golden Rule */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-xs sm:text-sm text-purple-950">
              <div className="font-bold text-purple-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-700" />
                <span>The Recessive-First Protocol:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-purple-900/90 leading-relaxed">
                <li>Identify any information about recessive traits; <strong>always begin by calculating q²</strong>.</li>
                <li><strong>NEVER START</strong> with dominant trait information, because the dominant phenotype is comprised of two distinct genotypes: <span className="font-mono font-bold">p² + 2pq</span>.</li>
                <li>Number of heterozygous individuals / carriers = <span className="font-mono font-bold">2pq × N</span>.</li>
                <li>Percentage of carriers = <span className="font-mono font-bold">2pq × 100%</span>.</li>
                <li>Number of individuals with dominant trait = <span className="font-mono font-bold">(p² + 2pq) × N</span>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
