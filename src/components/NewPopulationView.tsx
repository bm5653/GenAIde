import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  Sparkles,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Layers,
  Info
} from 'lucide-react';

export const NewPopulationView: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'removal' | 'immigration'>('removal');

  // Scenario A: Hamsters Removal State (Default from Past Year Q14)
  const [hamsterInitialPop, setHamsterInitialPop] = useState(600);
  const [hamsterGreyCount, setHamsterGreyCount] = useState(216); // all killed
  // Calculated initial
  const q2Hamster = hamsterInitialPop > 0 ? hamsterGreyCount / hamsterInitialPop : 0.36;
  const qHamster = Math.sqrt(q2Hamster);
  const pHamster = 1 - qHamster;
  const initialBlackTotal = hamsterInitialPop - hamsterGreyCount; // 384
  const initialHomoDomCount = Math.round(pHamster * pHamster * hamsterInitialPop); // 0.16 * 600 = 96
  const initialHeteroCount = Math.round(2 * pHamster * qHamster * hamsterInitialPop); // 0.48 * 600 = 288

  // New Hamster Population after killing all grey
  const newHamsterPop = initialBlackTotal; // 384
  const newHamsterGenePool = newHamsterPop * 2; // 768 alleles
  const remainingDominantAlleles = (initialHomoDomCount * 2) + initialHeteroCount; // (96*2) + 288 = 480
  const remainingRecessiveAlleles = initialHeteroCount; // 288
  const newFreqDominantHamster = newHamsterGenePool > 0 ? (remainingDominantAlleles / newHamsterGenePool).toFixed(2) : "0.00";
  const newFreqRecessiveHamster = newHamsterGenePool > 0 ? (remainingRecessiveAlleles / newHamsterGenePool).toFixed(2) : "0.00";

  // Scenario B: Goats Immigration State (Default from Past Year Q8)
  const [goatInitialPop, setGoatInitialPop] = useState(2000);
  const [goatWhiteCount, setGoatWhiteCount] = useState(500); // recessive
  const [goatsAdded, setGoatsAdded] = useState(1000); // homozygous dominant BB added

  const q2Goat = goatInitialPop > 0 ? goatWhiteCount / goatInitialPop : 0.25;
  const qGoat = Math.sqrt(q2Goat); // 0.5
  const pGoat = 1 - qGoat; // 0.5
  const initialGoatBB = Math.round(pGoat * pGoat * goatInitialPop); // 500
  const initialGoatBb = Math.round(2 * pGoat * qGoat * goatInitialPop); // 1000
  const initialGoatbb = goatWhiteCount; // 500

  // After immigration of pure-breeding brown (BB) goats
  const newGoatPop = goatInitialPop + goatsAdded; // 3000
  const newGoatGenePool = newGoatPop * 2; // 6000 alleles
  const newGoatBB = initialGoatBB + goatsAdded; // 500 + 1000 = 1500
  const newGoatBb = initialGoatBb; // 1000
  const newGoatbb = initialGoatbb; // 500
  const newGoatDominantAlleles = (newGoatBB * 2) + newGoatBb; // (1500*2) + 1000 = 4000
  const newGoatRecessiveAlleles = (newGoatbb * 2) + newGoatBb; // (500*2) + 1000 = 2000
  const newFreqDominantGoat = newGoatGenePool > 0 ? (newGoatDominantAlleles / newGoatGenePool).toFixed(2) : "0.00";
  const newFreqRecessiveGoat = newGoatGenePool > 0 ? (newGoatRecessiveAlleles / newGoatGenePool).toFixed(2) : "0.00";

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Top Student Pain Point in Exam Reflections</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
          The "New Population" Masterclass
        </h2>
        <p className="text-xs sm:text-sm text-purple-800">
          When individuals are removed, culled, die of disease, or migrate into a herd, <strong>Hardy-Weinberg equilibrium is broken!</strong> You cannot use p + q = 1 directly. Master the authoritative <strong>Gene Pool Allele-Counting Method</strong> step-by-step.
        </p>

        {/* Scenario Switcher Tabs */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveScenario('removal')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
              activeScenario === 'removal'
                ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border-purple-200'
            }`}
          >
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span>Scenario A: Selective Removal / Culling (Hamsters / Drosophila)</span>
          </button>

          <button
            onClick={() => setActiveScenario('immigration')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
              activeScenario === 'immigration'
                ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border-purple-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Scenario B: Immigration / Adding Individuals (Goats)</span>
          </button>
        </div>
      </div>

      {/* SCENARIO A: SELECTIVE REMOVAL / CULLING */}
      {activeScenario === 'removal' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Past Year Question 14 Case Study</span>
                <h3 className="text-xl font-bold text-purple-950">
                  Selective Removal: Hamsters with Black & Grey Fur
                </h3>
              </div>
              <span className="text-xs bg-rose-100 text-rose-900 font-bold px-3 py-1 rounded-full border border-rose-300">
                All 216 Grey Hamsters Killed
              </span>
            </div>

            <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
              In a population of <strong>600 hamsters</strong>, 216 have grey fur (recessive, gg) and 384 have black fur (dominant, G_). 
              If <strong>all 216 grey hamsters are killed</strong>, what are the allele frequencies in the <em>new</em> population?
            </p>

            {/* Interactive Sliders for Custom Exploration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-purple-50/70 rounded-xl border border-purple-200">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-purple-900">
                  <span>Initial Population (N):</span>
                  <span className="font-mono">{hamsterInitialPop}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1200"
                  step="50"
                  value={hamsterInitialPop}
                  onChange={(e) => setHamsterInitialPop(Number(e.target.value))}
                  className="w-full accent-purple-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-purple-900">
                  <span>Grey Hamsters Eliminated (gg):</span>
                  <span className="font-mono">{hamsterGreyCount}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max={Math.floor(hamsterInitialPop * 0.6)}
                  step="10"
                  value={hamsterGreyCount}
                  onChange={(e) => setHamsterGreyCount(Number(e.target.value))}
                  className="w-full accent-purple-700"
                />
              </div>
            </div>

            {/* The 6-Step Authoritative Solution Flow */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-purple-950 uppercase tracking-wider">
                The 6-Step Gene Pool Protocol:
              </h4>

              <div className="space-y-2 text-xs">
                {/* Step 1 */}
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
                  <div className="font-bold text-purple-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-800 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                    <span>Calculate Initial Genotype Counts (Before Removal)</span>
                  </div>
                  <div className="pl-7 font-mono text-purple-900 space-y-0.5">
                    <div>• q² = {hamsterGreyCount} / {hamsterInitialPop} = {q2Hamster.toFixed(2)} → q = √{q2Hamster.toFixed(2)} = {qHamster.toFixed(2)}</div>
                    <div>• p = 1 − {qHamster.toFixed(2)} = {pHamster.toFixed(2)}</div>
                    <div>• Homozygous dominant (GG) = p² × {hamsterInitialPop} = ({pHamster.toFixed(2)})² × {hamsterInitialPop} = <strong>{initialHomoDomCount} hamsters</strong></div>
                    <div>• Heterozygous (Gg) = 2pq × {hamsterInitialPop} = 2({pHamster.toFixed(2)})({qHamster.toFixed(2)}) × {hamsterInitialPop} = <strong>{initialHeteroCount} hamsters</strong></div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
                  <div className="font-bold text-purple-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-800 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                    <span>Determine New Population Size (Survivors Only)</span>
                  </div>
                  <div className="pl-7 font-mono text-purple-900">
                    New Population = {hamsterInitialPop} − {hamsterGreyCount} = <strong className="text-purple-950">{newHamsterPop} hamsters</strong>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
                  <div className="font-bold text-purple-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-800 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                    <span>Calculate Total Alleles in New Gene Pool</span>
                  </div>
                  <div className="pl-7 font-mono text-purple-900">
                    Each diploid hamster has 2 alleles: Gene Pool Size = 2 × {newHamsterPop} = <strong className="text-purple-950">{newHamsterGenePool} alleles</strong>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
                  <div className="font-bold text-purple-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-800 text-white text-[11px] font-bold flex items-center justify-center">4</span>
                    <span>Count Remaining Alleles</span>
                  </div>
                  <div className="pl-7 font-mono text-purple-900 space-y-0.5">
                    <div>• Dominant alleles (G) from GG & Gg = ({initialHomoDomCount} × 2) + {initialHeteroCount} = <strong className="text-purple-950">{remainingDominantAlleles} alleles</strong></div>
                    <div>• Recessive alleles (g) from surviving Gg = {initialHeteroCount} × 1 = <strong className="text-purple-950">{remainingRecessiveAlleles} alleles</strong></div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="p-3.5 bg-purple-900 text-white rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-purple-950 text-[11px] font-bold flex items-center justify-center">5</span>
                    <span>Final New Allele Frequencies (Notice: No p or q symbols!)</span>
                  </div>
                  <div className="pl-7 font-mono text-purple-100 space-y-1 pt-1">
                    <div>• <strong>Frequency of dominant allele:</strong> {remainingDominantAlleles} / {newHamsterGenePool} = <span className="text-amber-300 font-bold text-sm">{newFreqDominantHamster}</span></div>
                    <div>• <strong>Frequency of recessive allele:</strong> {remainingRecessiveAlleles} / {newHamsterGenePool} = <span className="text-amber-300 font-bold text-sm">{newFreqRecessiveHamster}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCENARIO B: IMMIGRATION */}
      {activeScenario === 'immigration' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Past Year Question 8 Case Study</span>
                <h3 className="text-xl font-bold text-purple-950">
                  Immigration: Goat Herd with 1000 Pure-Breeding Brown Goats Added
                </h3>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full border border-emerald-300">
                +1000 Homozygous Dominant Added
              </span>
            </div>

            <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
              A population of <strong>2000 goats</strong> has 500 white goats (recessive, bb) and 1500 brown goats (dominant, B_). 
              A farmer adds <strong>1000 pure-breeding brown goats (BB)</strong> to the herd. What are the new allele frequencies?
            </p>

            {/* Interactive Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-purple-50/70 rounded-xl border border-purple-200">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-purple-900">
                  <span>Initial Goat Population:</span>
                  <span className="font-mono">{goatInitialPop} goats</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="4000"
                  step="200"
                  value={goatInitialPop}
                  onChange={(e) => setGoatInitialPop(Number(e.target.value))}
                  className="w-full accent-purple-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-purple-900">
                  <span>Pure-Breeding BB Goats Added:</span>
                  <span className="font-mono">+{goatsAdded} goats</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={goatsAdded}
                  onChange={(e) => setGoatsAdded(Number(e.target.value))}
                  className="w-full accent-purple-700"
                />
              </div>
            </div>

            {/* Before vs After Comparison Table */}
            <div className="overflow-x-auto rounded-xl border-2 border-purple-300">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-purple-900 text-white">
                    <th className="p-3 border border-purple-700">Parameter</th>
                    <th className="p-3 border border-purple-700">Original Herd (Before)</th>
                    <th className="p-3 border border-purple-700 bg-purple-800">Added Herd</th>
                    <th className="p-3 border border-purple-700 text-amber-300">Combined New Herd (After)</th>
                  </tr>
                </thead>
                <tbody className="text-purple-950">
                  <tr className="bg-purple-50/60 border-b border-purple-200">
                    <td className="p-2.5 font-bold">Total Individuals</td>
                    <td className="p-2.5">{goatInitialPop}</td>
                    <td className="p-2.5">+{goatsAdded}</td>
                    <td className="p-2.5 font-bold text-purple-900">{newGoatPop} goats</td>
                  </tr>
                  <tr className="bg-white border-b border-purple-200">
                    <td className="p-2.5 font-bold">Total Alleles in Gene Pool</td>
                    <td className="p-2.5">{goatInitialPop * 2}</td>
                    <td className="p-2.5">+{goatsAdded * 2}</td>
                    <td className="p-2.5 font-bold text-purple-900">{newGoatGenePool} alleles</td>
                  </tr>
                  <tr className="bg-purple-50/60 border-b border-purple-200">
                    <td className="p-2.5 font-bold">Homozygous Dominant (BB)</td>
                    <td className="p-2.5">{initialGoatBB}</td>
                    <td className="p-2.5">+{goatsAdded}</td>
                    <td className="p-2.5 font-bold">{newGoatBB} goats</td>
                  </tr>
                  <tr className="bg-white border-b border-purple-200">
                    <td className="p-2.5 font-bold">Heterozygous (Bb)</td>
                    <td className="p-2.5">{initialGoatBb}</td>
                    <td className="p-2.5">+0</td>
                    <td className="p-2.5 font-bold">{newGoatBb} goats</td>
                  </tr>
                  <tr className="bg-purple-50/60 border-b border-purple-200">
                    <td className="p-2.5 font-bold">Homozygous Recessive (bb)</td>
                    <td className="p-2.5">{initialGoatbb}</td>
                    <td className="p-2.5">+0</td>
                    <td className="p-2.5 font-bold">{newGoatbb} goats</td>
                  </tr>
                  <tr className="bg-purple-900 text-white font-bold">
                    <td className="p-2.5">New Allele Frequencies</td>
                    <td className="p-2.5 text-purple-200">p = 0.50, q = 0.50</td>
                    <td className="p-2.5 text-purple-200">100% B</td>
                    <td className="p-2.5 text-amber-300">
                      Dominant: {newFreqDominantGoat} | Recessive: {newFreqRecessiveGoat}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Crucial Examiner Tip */}
            <div className="p-4 bg-purple-100/70 border border-purple-300 rounded-xl space-y-1.5 text-xs text-purple-950">
              <div className="font-bold flex items-center gap-1.5 text-purple-900">
                <Info className="w-4 h-4 text-purple-700" />
                <span>Mark Scheme Guarantee:</span>
              </div>
              <p className="leading-relaxed">
                Notice that Dominant Alleles = (1500 × 2) + 1000 = 4000. Recessive Alleles = (500 × 2) + 1000 = 2000.
                Total Alleles = 6000. Frequency of dominant allele = 4000/6000 = <strong>0.67</strong>. Frequency of recessive allele = 2000/6000 = <strong>0.33</strong>. Full marks awarded!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
