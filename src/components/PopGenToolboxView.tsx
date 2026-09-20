import React, { useState, useRef } from 'react';
import { 
  Calculator, 
  TableProperties, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Layers,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  XCircle,
  Lightbulb,
  Zap
} from 'lucide-react';
import { TOOLBOX_PRACTICE_QUESTIONS, ToolboxQuestion } from '../data/toolboxQuestionsData';

export const PopGenToolboxView: React.FC = () => {
  // Calculator inputs
  const [totalPop, setTotalPop] = useState<number>(1000);
  const [recessiveCount, setRecessiveCount] = useState<number>(160);
  const [recessivePhenotype, setRecessivePhenotype] = useState<string>('Red coat (recessive)');
  const [dominantPhenotype, setDominantPhenotype] = useState<string>('Black coat (dominant)');
  const [decimalMode, setDecimalMode] = useState<'auto' | '2' | '3'>('auto');
  const [loadedQuestionId, setLoadedQuestionId] = useState<number | null>(1);

  // Table Generator ref for smooth scrolling when loading question
  const tableGeneratorRef = useRef<HTMLDivElement>(null);
  const questionsSectionRef = useRef<HTMLDivElement>(null);

  // 5 Practice Questions state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});
  const [taskChecked, setTaskChecked] = useState<Record<string, { checked: boolean; isCorrect: boolean }>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [showSolutionBreakdown, setShowSolutionBreakdown] = useState<Record<number, boolean>>({});

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

  // Active practice question
  const currentQuestion: ToolboxQuestion = TOOLBOX_PRACTICE_QUESTIONS[activeQuestionIdx];

  // Helper to load question parameters into the table generator
  const handleLoadQuestionIntoGenerator = (q: ToolboxQuestion) => {
    setTotalPop(q.populationN);
    setRecessiveCount(q.recessiveCount);
    setRecessivePhenotype(q.recessiveTrait);
    setDominantPhenotype(q.dominantTrait);
    setLoadedQuestionId(q.id);
    if (tableGeneratorRef.current) {
      tableGeneratorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper to validate a specific task answer
  const handleCheckTask = (qId: number, taskId: string) => {
    const key = `${qId}_${taskId}`;
    const rawVal = (taskInputs[key] || '').trim().replace(/,/g, '');
    const task = currentQuestion.tasks.find(t => t.id === taskId);
    if (!task) return;

    const valNum = parseFloat(rawVal);
    const expectedNum = parseFloat(task.expectedAnswer);
    
    // Check against acceptable strings or float tolerance
    const matchesString = task.acceptableAnswers.some(a => 
      a.toLowerCase().trim() === rawVal.toLowerCase() ||
      a.toLowerCase().trim() === rawVal.toLowerCase().replace(/[^0-9.]/g, '')
    );

    let isCorrect = matchesString;
    if (!isCorrect && !isNaN(valNum) && !isNaN(expectedNum)) {
      // Allow minor rounding difference (± 0.005 or ± 1 count)
      const tolerance = expectedNum < 1 ? 0.005 : 2;
      if (Math.abs(valNum - expectedNum) <= tolerance) {
        isCorrect = true;
      }
    }

    setTaskChecked(prev => ({
      ...prev,
      [key]: { checked: true, isCorrect }
    }));
  };

  // Helper to check all tasks for current question
  const handleCheckAllTasks = () => {
    currentQuestion.tasks.forEach(task => {
      handleCheckTask(currentQuestion.id, task.id);
    });
  };

  // Helper to toggle task hint
  const toggleTaskHint = (key: string) => {
    setRevealedHints(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if a question is fully correct
  const isQuestionFullyCorrect = (q: ToolboxQuestion) => {
    return q.tasks.every(t => {
      const key = `${q.id}_${t.id}`;
      return taskChecked[key]?.checked && taskChecked[key]?.isCorrect;
    });
  };

  const completedQuestionsCount = TOOLBOX_PRACTICE_QUESTIONS.filter(q => isQuestionFullyCorrect(q)).length;

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
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
            <TableProperties className="w-3.5 h-3.5 text-purple-700" />
            <span>Interactive Calculator & Practice Suite</span>
          </div>

          {/* Quick Jump Anchors */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => tableGeneratorRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-colors flex items-center gap-1 shrink-0"
            >
              <Calculator className="w-3.5 h-3.5 text-purple-700" />
              <span>Table Generator</span>
            </button>

            <button
              onClick={() => questionsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded-lg bg-purple-900 text-white font-bold transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>5 Practice Questions</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-purple-950 rounded-full text-[10px] font-black">
                {completedQuestionsCount}/5
              </span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
            The POPGEN Interactive Matrix & Diagnostic Toolbox
          </h2>
          <p className="text-xs sm:text-sm text-purple-800 mt-1">
            Generate full Hardy-Weinberg calculation matrices in real time, solve the 5 dedicated practice challenge questions below using the table generator, and explore diagnostic condition rules.
          </p>
        </div>
      </div>

      {/* 1. INTERACTIVE POPGEN MATRIX CALCULATOR */}
      <section 
        ref={tableGeneratorRef}
        id="table-generator"
        className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-6 scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-purple-950 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-700" />
              <span>Interactive POPGEN Table Generator</span>
            </h3>
            {loadedQuestionId && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[11px] font-semibold border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Scenario: Practice Question {loadedQuestionId} ({TOOLBOX_PRACTICE_QUESTIONS.find(q => q.id === loadedQuestionId)?.title})</span>
              </div>
            )}
          </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-900 flex items-center justify-between">
              <span>Total Population (N):</span>
              <span className="text-[11px] text-purple-600 font-normal">Diploid = {totalPop * 2} alleles</span>
            </label>
            <input
              type="number"
              min="1"
              max="1000000"
              value={totalPop}
              onChange={(e) => {
                setTotalPop(Math.max(1, Number(e.target.value)));
                setLoadedQuestionId(null);
              }}
              className="w-full p-2.5 rounded-xl border border-purple-300 font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              placeholder="e.g. 1000"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-900 flex items-center justify-between">
              <span>Recessive Count (q²):</span>
              <span className="text-[11px] text-purple-600 font-normal">
                Dominant = {Math.max(0, totalPop - recessiveCount)} ({((Math.max(0, totalPop - recessiveCount)) / totalPop * 100).toFixed(1)}%)
              </span>
            </label>
            <input
              type="number"
              min="0"
              max={totalPop}
              value={recessiveCount}
              onChange={(e) => {
                setRecessiveCount(Math.max(0, Math.min(totalPop, Number(e.target.value))));
                setLoadedQuestionId(null);
              }}
              className="w-full p-2.5 rounded-xl border border-purple-300 font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              placeholder="e.g. 160"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-900">
                Recessive Phenotype:
              </label>
              <span className="text-[10px] text-amber-700 font-semibold uppercase">Step 1 & 2 (q)</span>
            </div>
            <input
              type="text"
              value={recessivePhenotype}
              onChange={(e) => setRecessivePhenotype(e.target.value)}
              placeholder="Type recessive phenotype (e.g. Red coat, Dwarf stem)..."
              className="w-full p-2.5 rounded-xl border border-purple-300 font-semibold text-xs text-purple-950 placeholder:text-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-900">
                Dominant Phenotype:
              </label>
              <span className="text-[10px] text-purple-700 font-semibold uppercase">Step 3 & 4 (p)</span>
            </div>
            <input
              type="text"
              value={dominantPhenotype}
              onChange={(e) => setDominantPhenotype(e.target.value)}
              placeholder="Type dominant phenotype (e.g. Black coat, Tall stem)..."
              className="w-full p-2.5 rounded-xl border border-purple-300 font-semibold text-xs text-purple-950 placeholder:text-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* The Live POPGEN Matrix Table */}
        {valid ? (
          <div className="space-y-4">
            {/* Desktop / Tablet Table View */}
            <div className="hidden md:block overflow-x-auto rounded-xl border-2 border-purple-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-purple-900 text-white">
                    <th className="p-3 border border-purple-700 font-bold w-1/4">Phenotype (Trait Description)</th>
                    <th className="p-3 border border-purple-700 font-bold">Count / Total</th>
                    <th className="p-3 border border-purple-700 font-bold">Genotype Frequency (p² + 2pq + q² = 1)</th>
                    <th className="p-3 border border-purple-700 font-bold">Allele Frequency (p + q = 1)</th>
                    <th className="p-3 border border-purple-700 font-bold">Total Individuals</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Recessive */}
                  <tr className="bg-purple-50/70 border-b border-purple-200">
                    <td className="p-3 font-bold text-purple-950 space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs text-purple-950 font-extrabold uppercase tracking-wide">
                          Recessive Phenotype
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-200">
                          q² &amp; q
                        </span>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-purple-700 font-semibold block">
                          Type phenotype from question:
                        </label>
                        <input
                          type="text"
                          value={recessivePhenotype}
                          onChange={(e) => setRecessivePhenotype(e.target.value)}
                          placeholder="e.g. Red coat, Dwarf stem, Albinism"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 bg-white font-semibold text-xs text-purple-950 placeholder:text-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden shadow-2xs"
                        />
                      </div>
                      {recessivePhenotype.trim() && (
                        <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate">
                          Trait: <strong>{recessivePhenotype}</strong>
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-mono text-purple-900">
                      {recessiveCount} / {totalPop}
                    </td>
                    <td className="p-3 bg-amber-50/70">
                      <div className="text-[11px] text-amber-900 font-bold">
                        Step 1: Homozygous Recessive {recessivePhenotype.trim() ? `(${recessivePhenotype})` : ''}
                      </div>
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
                    <td className="p-3 font-bold text-purple-950 space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs text-purple-950 font-extrabold uppercase tracking-wide">
                          Dominant Phenotype
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-bold border border-purple-200">
                          p² &amp; 2pq
                        </span>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-purple-700 font-semibold block">
                          Type phenotype from question:
                        </label>
                        <input
                          type="text"
                          value={dominantPhenotype}
                          onChange={(e) => setDominantPhenotype(e.target.value)}
                          placeholder="e.g. Black coat, Tall stem, Normal"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 bg-white font-semibold text-xs text-purple-950 placeholder:text-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden shadow-2xs"
                        />
                      </div>
                      {dominantPhenotype.trim() && (
                        <div className="text-[11px] font-medium text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 truncate">
                          Trait: <strong>{dominantPhenotype}</strong>
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-mono text-purple-900">
                      {totalPop - recessiveCount} / {totalPop}
                    </td>
                    <td className="p-3 space-y-2">
                      <div>
                        <div className="text-[11px] text-purple-800 font-bold">Step 4a: Heterozygous Genotype (Carriers)</div>
                        <div className="font-mono font-extrabold text-purple-950">
                          2pq = 2 × {pRaw.toFixed(precision)} × {qRaw.toFixed(precision)} = {twoPqRaw.toFixed(precision)}
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-purple-100">
                        <div className="text-[11px] text-purple-800 font-bold">
                          Step 4b: Homozygous Dominant {dominantPhenotype.trim() ? `(${dominantPhenotype})` : ''}
                        </div>
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
                      <div>Homozygous Dominant (p²): <strong>{countHomoDom}</strong></div>
                      <div>Heterozygous Carriers (2pq): <strong>{countHetero}</strong></div>
                      <div className="pt-1 border-t border-purple-200 font-bold text-purple-950">
                        Total {dominantPhenotype.trim() ? dominantPhenotype : 'Dominant'}: {countDominantTotal}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile-Optimized Step Breakdown Card View (< md) */}
            <div className="md:hidden space-y-4">
              {/* Recessive Group Card */}
              <div className="bg-white rounded-2xl border-2 border-purple-300 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <div className="font-black text-sm text-purple-950">
                    Recessive Phenotype {recessivePhenotype.trim() ? `(${recessivePhenotype})` : ''}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                    q² &amp; q
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-50">
                    <span className="text-[11px] text-purple-600 block">Count / Population</span>
                    <span className="font-mono font-bold text-purple-950 text-sm">{recessiveCount} / {totalPop}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[11px] text-amber-800 font-bold block">Step 1: Frequency q²</span>
                    <span className="font-mono font-extrabold text-purple-950 text-sm">q² = {q2Raw.toFixed(precision)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="text-[11px] text-emerald-800 font-bold block">Step 2: Recessive Allele (q)</span>
                  <span className="font-mono font-extrabold text-emerald-950 text-sm">
                    q = √({q2Raw.toFixed(precision)}) = {qRaw.toFixed(precision)}
                  </span>
                </div>
              </div>

              {/* Dominant Group Card */}
              <div className="bg-white rounded-2xl border-2 border-purple-300 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <div className="font-black text-sm text-purple-950">
                    Dominant Phenotype {dominantPhenotype.trim() ? `(${dominantPhenotype})` : ''}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 text-xs font-bold border border-purple-300">
                    p² &amp; 2pq
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="text-[11px] text-emerald-800 font-bold block">Step 3: Dominant Allele (p)</span>
                  <span className="font-mono font-extrabold text-emerald-950 text-sm">
                    p = 1 − {qRaw.toFixed(precision)} = {pRaw.toFixed(precision)}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-50">
                    <span className="text-[11px] text-purple-700 font-bold block">Step 4a: Heterozygous Carriers (2pq)</span>
                    <span className="font-mono font-extrabold text-purple-950 text-sm">
                      2pq = {twoPqRaw.toFixed(precision)} ({countHetero} individuals)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50">
                    <span className="text-[11px] text-purple-700 font-bold block">Step 4b: Homozygous Dominant (p²)</span>
                    <span className="font-mono font-extrabold text-purple-950 text-sm">
                      p² = {p2Raw.toFixed(precision)} ({countHomoDom} individuals)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-[11px] text-purple-700 font-semibold truncate">
                  Recessive Allele (q) {recessivePhenotype.trim() ? `• ${recessivePhenotype}` : ''}
                </div>
                <div className="text-lg font-black font-mono text-purple-950">{qRaw.toFixed(precision)}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-[11px] text-purple-700 font-semibold truncate">
                  Dominant Allele (p) {dominantPhenotype.trim() ? `• ${dominantPhenotype}` : ''}
                </div>
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

      {/* 2. FIVE TABLE GENERATOR PRACTICE QUESTIONS */}
      <section
        ref={questionsSectionRef}
        id="table-practice-questions"
        className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-6 scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-purple-700" />
              <span>Interactive Table Practice Lab</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950">
              5 Practice Questions: Table Generator Lab
            </h3>
            <p className="text-xs sm:text-sm text-purple-800">
              Read each scenario, load or input the numbers into the Table Generator above, and verify your answers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-right">
              <div className="text-[10px] text-purple-700 font-semibold uppercase">Progress</div>
              <div className="text-sm font-extrabold text-purple-950">
                <span className="text-emerald-600">{completedQuestionsCount}</span> / {TOOLBOX_PRACTICE_QUESTIONS.length} Solved
              </div>
            </div>
          </div>
        </div>

        {/* 5 Question Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {TOOLBOX_PRACTICE_QUESTIONS.map((q, idx) => {
            const isSel = idx === activeQuestionIdx;
            const isDone = isQuestionFullyCorrect(q);

            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIdx(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isSel
                    ? 'bg-purple-900 text-white shadow-2xs'
                    : isDone
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-300'
                      : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <span>Question {q.id}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSel ? 'bg-purple-800 text-purple-200' : 'bg-purple-200 text-purple-800'}`}>
                    N={q.populationN >= 1000 ? `${q.populationN / 1000}k` : q.populationN}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Question Box */}
        <div className="p-5 bg-purple-50/60 rounded-2xl border-2 border-purple-200 space-y-5">
          {/* Question Title & Load CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-800 text-white text-[11px] font-bold">
                  Question {currentQuestion.id} of 5
                </span>
                <span className="text-xs font-semibold text-purple-700 italic">
                  {currentQuestion.species}
                </span>
              </div>
              <h4 className="text-lg font-black text-purple-950 mt-1">
                {currentQuestion.title}
              </h4>
            </div>

            {/* Quick Load Button */}
            <button
              onClick={() => handleLoadQuestionIntoGenerator(currentQuestion)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
              title="Automatically sets N and Recessive into Table Generator inputs"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>⚡ Load into Table Generator</span>
            </button>
          </div>

          {/* Scenario Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="md:col-span-2 p-3.5 bg-white rounded-xl border border-purple-200 space-y-2">
              <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                Scenario Statement:
              </div>
              <p className="text-purple-950 leading-relaxed font-medium">
                {currentQuestion.scenario}
              </p>

              {/* Question Phenotypes Highlight */}
              <div className="pt-2 border-t border-purple-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-purple-900 text-[11px]">Phenotypes in Question:</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-950 font-semibold border border-purple-200">
                  Dominant: <strong>{currentQuestion.dominantTrait}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-semibold border border-amber-200">
                  Recessive: <strong>{currentQuestion.recessiveTrait}</strong>
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-2">
              <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                Table Input Parameters:
              </div>
              <div className="font-mono text-xs space-y-1">
                <div>Total Population <strong className="text-purple-950 font-black">N = {currentQuestion.populationN.toLocaleString()}</strong></div>
                <div>Recessive Count = <strong className="text-purple-950 font-black">{currentQuestion.recessiveCount.toLocaleString()}</strong></div>
                <div className="text-[11px] text-purple-700 font-sans pt-1 border-t border-purple-100">
                  Recessive: <strong>{currentQuestion.recessiveTrait}</strong>
                </div>
                <div className="text-[11px] text-purple-700 font-sans">
                  Dominant: <strong>{currentQuestion.dominantTrait}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Question Sub-Tasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-purple-900 uppercase tracking-wider">
              <span>Enter Calculated Values from the Table Generator:</span>
              <button
                onClick={handleCheckAllTasks}
                className="text-[11px] text-purple-700 hover:text-purple-950 underline font-semibold"
              >
                Check All Tasks
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQuestion.tasks.map((task) => {
                const key = `${currentQuestion.id}_${task.id}`;
                const checkInfo = taskChecked[key];
                const isHintOpen = revealedHints[key];

                return (
                  <div 
                    key={task.id}
                    className={`p-3.5 bg-white rounded-xl border-2 transition-all space-y-2.5 ${
                      checkInfo?.checked
                        ? checkInfo.isCorrect
                          ? 'border-emerald-400 bg-emerald-50/30'
                          : 'border-red-300 bg-red-50/30'
                        : 'border-purple-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-purple-950">
                          {task.label}
                        </div>
                        <div className="font-mono text-[11px] text-purple-600">
                          Symbol: <strong>{task.symbol}</strong>
                        </div>
                      </div>

                      {checkInfo?.checked && (
                        checkInfo.isCorrect ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Correct</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-100 text-red-900 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span>Retry</span>
                          </span>
                        )
                      )}
                    </div>

                    {/* Input Field & Check Button */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={taskInputs[key] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTaskInputs(prev => ({ ...prev, [key]: val }));
                            if (checkInfo?.checked) {
                              setTaskChecked(prev => ({ ...prev, [key]: { checked: false, isCorrect: false } }));
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCheckTask(currentQuestion.id, task.id);
                          }}
                          placeholder={`Enter ${task.symbol}`}
                          className="w-full px-3 py-1.5 rounded-lg border border-purple-300 font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                        />
                        {task.unit && (
                          <span className="absolute right-2.5 top-1.5 text-[11px] text-purple-400 font-mono pointer-events-none">
                            {task.unit}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCheckTask(currentQuestion.id, task.id)}
                        className="px-3 py-1.5 bg-purple-800 hover:bg-purple-900 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                      >
                        Check
                      </button>
                    </div>

                    {/* Table Reference Hint */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <button
                        onClick={() => toggleTaskHint(key)}
                        className="text-purple-700 hover:text-purple-950 font-semibold flex items-center gap-1"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>{isHintOpen ? 'Hide Table Guide' : 'Show Table Location'}</span>
                      </button>
                    </div>

                    {isHintOpen && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-950 space-y-0.5 animate-in fade-in duration-150">
                        <div className="font-bold text-amber-900">📍 {task.tableCellReference}</div>
                        <div>{task.hint}</div>
                      </div>
                    )}

                    {checkInfo?.checked && (
                      <div className={`p-2 rounded-lg text-[11px] leading-relaxed ${
                        checkInfo.isCorrect ? 'bg-emerald-100/70 text-emerald-950 font-medium' : 'bg-red-100/70 text-red-950'
                      }`}>
                        {checkInfo.isCorrect ? `✓ ${task.explanation}` : `Keep trying! Hint: Check ${task.tableCellReference} in the Table Generator above.`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Fully Solved Celebration Banner */}
          {isQuestionFullyCorrect(currentQuestion) && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-xl text-xs text-emerald-950 space-y-1.5 animate-in zoom-in-95 duration-200">
              <div className="font-black text-sm flex items-center gap-2 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>EXCELLENT! ALL TASKS FOR QUESTION {currentQuestion.id} COMPLETED ACCURATELY!</span>
              </div>
              <p className="font-medium">
                {currentQuestion.tableHighlightNote}
              </p>
              <div className="text-[11px] text-emerald-800 italic pt-1 border-t border-emerald-200">
                💡 <strong>Examiner Tip:</strong> {currentQuestion.examinerTip}
              </div>
            </div>
          )}

          {/* Model Solution & Step Breakdown Expandable */}
          <div className="pt-2">
            <button
              onClick={() => setShowSolutionBreakdown(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
              className="w-full p-2.5 bg-white hover:bg-purple-100/50 rounded-xl border border-purple-200 text-xs font-bold text-purple-900 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-700" />
                <span>
                  {showSolutionBreakdown[currentQuestion.id]
                    ? 'Hide Complete Table Verification Breakdown'
                    : 'Show Complete Table Verification Breakdown'}
                </span>
              </div>
              {showSolutionBreakdown[currentQuestion.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSolutionBreakdown[currentQuestion.id] && (
              <div className="mt-2 p-4 bg-white rounded-xl border-2 border-purple-200 text-xs space-y-2 animate-in fade-in duration-150">
                <div className="font-bold text-purple-900 uppercase tracking-wider text-[11px]">
                  Step-by-Step Table Generator Verification:
                </div>
                <div className="space-y-1.5 font-mono text-purple-950">
                  {currentQuestion.tasks.map((t, idx) => (
                    <div key={idx} className="p-2 bg-purple-50 rounded-lg border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span><strong>{t.symbol}</strong> ({t.label}):</span>
                      <span className="font-bold text-purple-900">{t.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Question Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-purple-200">
            <button
              disabled={activeQuestionIdx === 0}
              onClick={() => setActiveQuestionIdx(prev => Math.max(0, prev - 1))}
              className="px-3.5 py-1.5 rounded-xl border border-purple-200 text-xs font-bold text-purple-900 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous Scenario
            </button>

            <span className="text-xs text-purple-700 font-semibold">
              Scenario {activeQuestionIdx + 1} of {TOOLBOX_PRACTICE_QUESTIONS.length}
            </span>

            <button
              disabled={activeQuestionIdx === TOOLBOX_PRACTICE_QUESTIONS.length - 1}
              onClick={() => setActiveQuestionIdx(prev => Math.min(TOOLBOX_PRACTICE_QUESTIONS.length - 1, prev + 1))}
              className="px-3.5 py-1.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
            >
              Next Scenario →
            </button>
          </div>
        </div>
      </section>

      {/* 3. HARDY-WEINBERG CONDITION CHECKER */}
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

      {/* 4. FORMULA FINDER HELPER */}
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
