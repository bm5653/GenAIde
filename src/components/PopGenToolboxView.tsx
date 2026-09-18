import React, { useState } from 'react';
import { 
  Calculator, 
  TableProperties, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const PopGenToolboxView: React.FC = () => {
  // Calculator inputs
  const [totalPop, setTotalPop] = useState<number>(1000);
  const [recessiveCount, setRecessiveCount] = useState<number>(160);
  const [decimalMode, setDecimalMode] = useState<'auto' | '2' | '3'>('auto');

  // H-W Condition Checker
  const [conditions, setConditions] = useState({
    largePop: true,
    randomMating: true,
    noMutation: true,
    noMigration: true,
    noSelection: true,
  });

  // Formula finder selector
  const [finderIHave, setFinderIHave] = useState<'recessive_count' | 'recessive_freq' | 'allele_p' | 'allele_q' | 'heterozygous_freq'>('recessive_count');
  const [finderIWant, setFinderIWant] = useState<'carrier_count' | 'dominant_allele' | 'recessive_allele' | 'homo_dominant_count'>('carrier_count');

  // Decimal precision calculator
  const getPrecision = (n: number) => {
    if (decimalMode === '2') return 2;
    if (decimalMode === '3') return 3;
    // Auto mode based on syllabus rules
    if (n < 100) return 1;
    if (n < 1000) return 2;
    return 3;
  };

  const precision = getPrecision(totalPop);

  // Core Math Calculation
  const valid = totalPop > 0 && recessiveCount >= 0 && recessiveCount <= totalPop;
  const q2Raw = valid ? recessiveCount / totalPop : 0;
  const qRaw = Math.sqrt(q2Raw);
  const pRaw = Math.max(0, 1 - qRaw);
  const p2Raw = pRaw * pRaw;
  const twoPqRaw = 2 * pRaw * qRaw;
  const dominantPhenoFreqRaw = p2Raw + twoPqRaw;

  const countHomoDom = Math.round(p2Raw * totalPop);
  const countHetero = Math.round(twoPqRaw * totalPop);
  const countDominantTotal = Math.round(dominantPhenoFreqRaw * totalPop);

  const allConditionsMet = Object.values(conditions).every(Boolean);

  // Formula Finder logic lookup
  const getFormulaSolution = () => {
    if (finderIHave === 'recessive_count' && finderIWant === 'carrier_count') {
      return {
        sequence: ["1. Calculate q² = (Recessive Count) / (Total Population)", "2. Calculate q = √q²", "3. Calculate p = 1 - q", "4. Calculate 2pq = 2 × p × q", "5. Number of carriers = 2pq × Total Population"],
        formula: "Number of Carriers = 2(1 - √(recessive/N)) × (√(recessive/N)) × N",
        note: "Never multiply before finding the square root of q²!"
      };
    }
    if (finderIHave === 'recessive_count' && finderIWant === 'dominant_allele') {
      return {
        sequence: ["1. Calculate q² = (Recessive Count) / (Total Population)", "2. Calculate q = √q²", "3. Calculate dominant allele frequency p = 1 - q"],
        formula: "p = 1 - √(q²)",
        note: "Always remember p + q = 1"
      };
    }
    if (finderIHave === 'recessive_freq' && finderIWant === 'recessive_allele') {
      return {
        sequence: ["1. Recessive genotype frequency is q²", "2. Calculate recessive allele frequency q = √q²"],
        formula: "q = √q²",
        note: "Taking square root converts genotype frequency into single-allele frequency."
      };
    }
    return {
      sequence: ["1. Determine q² from recessive trait", "2. Find q = √q²", "3. Find p = 1 - q", "4. Calculate the desired genotype or count"],
      formula: "Follow the standard 4-step POPGEN Table Sequence",
      note: "All calculations branch cleanly from homozygous recessive q²."
    };
  };

  const solution = getFormulaSolution();

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
          <TableProperties className="w-3.5 h-3.5 text-purple-700" />
          <span>Interactive Calculator & Diagnostic Utilities</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
          The POPGEN Interactive Matrix & Diagnostic Toolbox
        </h2>
        <p className="text-xs sm:text-sm text-purple-800">
          Enter any population scenario to view the live, step-by-step POPGEN table, test Hardy-Weinberg condition equilibrium, and look up exam formulas.
        </p>
      </div>

      {/* 1. INTERACTIVE POPGEN MATRIX CALCULATOR */}
      <section className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <h3 className="text-lg font-bold text-purple-950 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-700" />
            <span>Interactive POPGEN Table Generator</span>
          </h3>

          {/* Decimal Mode Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-purple-50 p-1 rounded-lg border border-purple-200">
            <span className="text-purple-700 font-semibold px-1">Decimals:</span>
            {(['auto', '2', '3'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDecimalMode(mode)}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                  decimalMode === mode
                    ? 'bg-purple-800 text-white shadow-2xs'
                    : 'text-purple-800 hover:bg-purple-200'
                }`}
              >
                {mode === 'auto' ? `Auto (${precision} d.p.)` : `${mode} d.p.`}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-900">
              Total Population Size (N):
            </label>
            <input
              type="number"
              min="1"
              max="1000000"
              value={totalPop}
              onChange={(e) => setTotalPop(Math.max(1, Number(e.target.value)))}
              className="w-full p-2.5 rounded-xl border border-purple-300 font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              placeholder="e.g. 1000"
            />
            <div className="text-[11px] text-purple-700">
              Total diploid gene pool = <strong className="font-mono">{totalPop * 2} alleles</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-900">
              Number of Recessive Individuals (Homozygous Recessive):
            </label>
            <input
              type="number"
              min="0"
              max={totalPop}
              value={recessiveCount}
              onChange={(e) => setRecessiveCount(Math.max(0, Math.min(totalPop, Number(e.target.value))))}
              className="w-full p-2.5 rounded-xl border border-purple-300 font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              placeholder="e.g. 160"
            />
            <div className="text-[11px] text-purple-700">
              Dominant individuals = <strong className="font-mono">{totalPop - recessiveCount}</strong> ({((totalPop - recessiveCount) / totalPop * 100).toFixed(1)}%)
            </div>
          </div>
        </div>

        {/* The Live POPGEN Matrix Table */}
        {valid ? (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border-2 border-purple-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-purple-900 text-white">
                    <th className="p-3 border border-purple-700 font-bold">Phenotype</th>
                    <th className="p-3 border border-purple-700 font-bold">Count / Total</th>
                    <th className="p-3 border border-purple-700 font-bold">Genotype Frequency (p² + 2pq + q² = 1)</th>
                    <th className="p-3 border border-purple-700 font-bold">Allele Frequency (p + q = 1)</th>
                    <th className="p-3 border border-purple-700 font-bold">Total Individuals</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Recessive */}
                  <tr className="bg-purple-50/70 border-b border-purple-200">
                    <td className="p-3 font-bold text-purple-950">
                      Recessive Phenotype
                    </td>
                    <td className="p-3 font-mono text-purple-900">
                      {recessiveCount} / {totalPop}
                    </td>
                    <td className="p-3 bg-amber-50/70">
                      <div className="text-[11px] text-amber-900 font-bold">Step 1: Homozygous Recessive</div>
                      <div className="font-mono font-extrabold text-sm text-purple-950">
                        q² = {q2Raw.toFixed(precision)}
                      </div>
                    </td>
                    <td className="p-3 bg-emerald-50/70">
                      <div className="text-[11px] text-emerald-900 font-bold">Step 2: Recessive Allele</div>
                      <div className="font-mono font-extrabold text-sm text-emerald-900">
                        q = √({q2Raw.toFixed(precision)}) = {qRaw.toFixed(precision)}
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-purple-900">
                      {recessiveCount} individuals
                    </td>
                  </tr>

                  {/* Dominant */}
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-purple-950">
                      Dominant Phenotype
                    </td>
                    <td className="p-3 font-mono text-purple-900">
                      {totalPop - recessiveCount} / {totalPop}
                    </td>
                    <td className="p-3 space-y-2">
                      <div>
                        <div className="text-[11px] text-purple-800 font-bold">Step 4a: Heterozygous Genotype</div>
                        <div className="font-mono font-extrabold text-purple-950">
                          2pq = 2 × {pRaw.toFixed(precision)} × {qRaw.toFixed(precision)} = {twoPqRaw.toFixed(precision)}
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-purple-100">
                        <div className="text-[11px] text-purple-800 font-bold">Step 4b: Homozygous Dominant Genotype</div>
                        <div className="font-mono font-extrabold text-purple-950">
                          p² = ({pRaw.toFixed(precision)})² = {p2Raw.toFixed(precision)}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 bg-emerald-50/70 align-top">
                      <div className="text-[11px] text-emerald-900 font-bold">Step 3: Dominant Allele</div>
                      <div className="font-mono font-extrabold text-sm text-emerald-900">
                        p = 1 − {qRaw.toFixed(precision)} = {pRaw.toFixed(precision)}
                      </div>
                    </td>
                    <td className="p-3 space-y-1 font-mono text-xs">
                      <div>Homozygous (p²): <strong>{countHomoDom}</strong></div>
                      <div>Heterozygous (2pq): <strong>{countHetero}</strong></div>
                      <div className="pt-1 border-t border-purple-200 font-bold text-purple-950">Total: {countDominantTotal}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-[11px] text-purple-700 font-semibold">Recessive Allele (q)</div>
                <div className="text-lg font-black font-mono text-purple-950">{qRaw.toFixed(precision)}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-[11px] text-purple-700 font-semibold">Dominant Allele (p)</div>
                <div className="text-lg font-black font-mono text-purple-950">{pRaw.toFixed(precision)}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-[11px] text-purple-700 font-semibold">Carriers (2pq)</div>
                <div className="text-lg font-black font-mono text-purple-950">{(twoPqRaw * 100).toFixed(1)}%</div>
                <div className="text-[10px] text-purple-600">{countHetero} individuals</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-[11px] text-purple-700 font-semibold">Homozygous Dominant (p²)</div>
                <div className="text-lg font-black font-mono text-purple-950">{(p2Raw * 100).toFixed(1)}%</div>
                <div className="text-[10px] text-purple-600">{countHomoDom} individuals</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 text-red-900 rounded-xl border border-red-200 text-xs">
            Please enter a valid total population greater than 0 and recessive count less than or equal to total population.
          </div>
        )}
      </section>

      {/* 2. HARDY-WEINBERG CONDITION CHECKER */}
      <section className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-purple-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-700" />
            <span>Hardy-Weinberg Equilibrium Condition Checker</span>
          </h3>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
            allConditionsMet ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800 animate-pulse'
          }`}>
            {allConditionsMet ? '✓ Genetic Equilibrium Maintained' : '⚠ Equilibrium Broken!'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-purple-800">
          Uncheck any condition to simulate what causes allele frequencies to shift and evolutionary change to occur:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-purple-200 hover:bg-purple-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={conditions.largePop}
              onChange={(e) => setConditions({...conditions, largePop: e.target.checked})}
              className="mt-0.5 accent-purple-700 w-4 h-4 rounded"
            />
            <div>
              <div className="font-bold text-purple-950">1. Large Population Size</div>
              <div className="text-purple-700 text-[11px]">Prevents genetic drift and chance fluctuations</div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-purple-200 hover:bg-purple-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={conditions.randomMating}
              onChange={(e) => setConditions({...conditions, randomMating: e.target.checked})}
              className="mt-0.5 accent-purple-700 w-4 h-4 rounded"
            />
            <div>
              <div className="font-bold text-purple-950">2. Random Mating</div>
              <div className="text-purple-700 text-[11px]">Fertilization occurs completely by chance</div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-purple-200 hover:bg-purple-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={conditions.noMutation}
              onChange={(e) => setConditions({...conditions, noMutation: e.target.checked})}
              className="mt-0.5 accent-purple-700 w-4 h-4 rounded"
            />
            <div>
              <div className="font-bold text-purple-950">3. No Mutation</div>
              <div className="text-purple-700 text-[11px]">No new alleles introduced into gene pool</div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-purple-200 hover:bg-purple-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={conditions.noMigration}
              onChange={(e) => setConditions({...conditions, noMigration: e.target.checked})}
              className="mt-0.5 accent-purple-700 w-4 h-4 rounded"
            />
            <div>
              <div className="font-bold text-purple-950">4. No Migration (No Gene Flow)</div>
              <div className="text-purple-700 text-[11px]">No individuals enter or leave the population</div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-purple-200 hover:bg-purple-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={conditions.noSelection}
              onChange={(e) => setConditions({...conditions, noSelection: e.target.checked})}
              className="mt-0.5 accent-purple-700 w-4 h-4 rounded"
            />
            <div>
              <div className="font-bold text-purple-950">5. No Natural Selection</div>
              <div className="text-purple-700 text-[11px]">Equal reproductive success and survival</div>
            </div>
          </label>
        </div>

        {/* Condition Diagnostic Feedback */}
        {!allConditionsMet ? (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl space-y-2 text-xs sm:text-sm text-red-950">
            <div className="font-bold flex items-center gap-1.5 text-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>EVOLUTION TRIGGERED: Allele Frequencies Will Change!</span>
            </div>
            <p>
              Because one or more conditions are violated, this population is <strong>no longer in Hardy-Weinberg equilibrium</strong>.
              Allele frequencies <span className="font-mono font-bold">p</span> and <span className="font-mono font-bold">q</span> will change across generations.
              In an exam question, you must switch to the <strong>Gene Pool Allele-Counting Method</strong>!
            </p>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All 5 conditions satisfied. Allele and genotype frequencies remain constant generation after generation.</span>
          </div>
        )}
      </section>

      {/* 3. FORMULA FINDER HELPER */}
      <section className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-purple-950 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-700" />
          <span>"I Have... I Want..." Exam Formula Finder</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-900">I have information about:</label>
            <select
              value={finderIHave}
              onChange={(e) => setFinderIHave(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-purple-300 font-semibold text-xs text-purple-950 bg-white"
            >
              <option value="recessive_count">Number of recessive individuals & Total population</option>
              <option value="recessive_freq">Frequency of recessive phenotype (q²)</option>
              <option value="allele_p">Dominant allele frequency (p)</option>
              <option value="allele_q">Recessive allele frequency (q)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-900">I want to find:</label>
            <select
              value={finderIWant}
              onChange={(e) => setFinderIWant(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-purple-300 font-semibold text-xs text-purple-950 bg-white"
            >
              <option value="carrier_count">Number of carriers / heterozygous individuals</option>
              <option value="dominant_allele">Dominant allele frequency (p)</option>
              <option value="recessive_allele">Recessive allele frequency (q)</option>
              <option value="homo_dominant_count">Number of homozygous dominant individuals</option>
            </select>
          </div>
        </div>

        {/* Dynamic Solution Step Card */}
        <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 space-y-3">
          <div className="font-bold text-xs uppercase text-purple-700 tracking-wider">
            Step-by-Step Execution Sequence:
          </div>
          <div className="space-y-1.5 text-xs text-purple-950">
            {solution.sequence.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-purple-100 font-medium">
                <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-purple-900 text-white rounded-lg text-xs font-mono">
            <strong>Formula:</strong> {solution.formula}
          </div>
          <div className="text-[11px] text-purple-700 italic">
            💡 <strong>Examiner Note:</strong> {solution.note}
          </div>
        </div>
      </section>
    </div>
  );
};
