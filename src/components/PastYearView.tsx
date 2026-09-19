import React, { useState, useMemo } from 'react';
import { ALL_QUESTIONS } from '../data/questionsData';
import { ADDITIONAL_QUESTIONS } from '../data/pastYearAdditionalQuestions';
import { QuestionData } from '../types';
import { 
  GraduationCap, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileCheck, 
  AlertTriangle,
  Award,
  BookOpen,
  Filter,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface PastYearViewProps {
  onLoadQuestionIntoSolver: (questionId: string) => void;
  completedQuestions?: string[];
}

export const PastYearView: React.FC<PastYearViewProps> = ({ 
  onLoadQuestionIntoSolver,
  completedQuestions = []
}) => {
  const allQuestions: QuestionData[] = [...ALL_QUESTIONS, ...ADDITIONAL_QUESTIONS];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedMarkSchemes, setExpandedMarkSchemes] = useState<Record<string, boolean>>({});

  // Compute set of solved question IDs from props + persisted storage fallback
  const solvedQuestionIds = useMemo(() => {
    const set = new Set<string>(completedQuestions);
    try {
      const saved = localStorage.getItem('genaide_user_progress_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.completedQuestions)) {
          parsed.completedQuestions.forEach((id: string) => set.add(id));
        }
      }
    } catch {}
    return set;
  }, [completedQuestions]);

  const solvedCount = allQuestions.filter(q => solvedQuestionIds.has(q.id)).length;

  const toggleMarkScheme = (qId: string) => {
    // Only permit toggling if question is solved
    if (!solvedQuestionIds.has(qId)) return;
    setExpandedMarkSchemes(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const filtered = allQuestions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.number.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === 'solved') {
      matchesCategory = solvedQuestionIds.has(q.id);
    } else if (selectedCategory === 'unsolved') {
      matchesCategory = !solvedQuestionIds.has(q.id);
    } else if (selectedCategory !== 'all') {
      matchesCategory = q.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
            <GraduationCap className="w-4 h-4 text-purple-700" />
            <span>Matriculation Exam Preparation Bank</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{solvedCount} of {allQuestions.length} Mark Schemes Unlocked</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
          Tutorial and Past Year PSPM Questions & Authoritative Mark Schemes
        </h2>
        <p className="text-xs sm:text-sm text-purple-800">
          Official tutorial and past year PSPM examination questions directly extracted from the Biology Chapter 5 Question Bank. 
          To promote active learning, <strong>official mark schemes & allocations are unlocked only after you solve the question</strong> in the Step Solver.
        </p>

        {/* Search & Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. albino, hamsters, Drosophila, migration, goats)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm text-purple-950 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-600 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded-xl border border-purple-200 text-xs font-semibold text-purple-950 bg-white"
            >
              <option value="all">All Questions ({allQuestions.length})</option>
              <option value="solved">✓ Solved & Unlocked ({solvedCount})</option>
              <option value="unsolved">🔒 Unsolved / Locked ({allQuestions.length - solvedCount})</option>
              <option value="gene-pool">Allele Counting / Gene Pool</option>
              <option value="hardy-weinberg">Standard Hardy-Weinberg</option>
              <option value="heterozygotes">Heterozygotes & Carriers</option>
              <option value="migration">Immigration / Migration</option>
              <option value="removal">Selective Removal / Culling</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.map((q) => {
          const isSolved = solvedQuestionIds.has(q.id);
          const isExpanded = isSolved && !!expandedMarkSchemes[q.id];

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-300 shadow-xs p-5 sm:p-6 space-y-4 transition-all"
            >
              {/* Question Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-900 text-white font-mono font-bold text-xs">
                      {q.number}
                    </span>
                    <span className="text-xs font-semibold text-purple-700">
                      {q.source}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      q.isHardyWeinberg 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : 'bg-amber-50 text-amber-900 border-amber-300'
                    }`}>
                      {q.isHardyWeinberg ? 'Hardy-Weinberg' : 'Gene Pool Counting'}
                    </span>
                    {isSolved ? (
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-purple-500" />
                        <span>Scheme Locked</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-purple-950">
                    {q.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                    {q.totalMarks} Marks
                  </span>
                  <button
                    onClick={() => onLoadQuestionIntoSolver(q.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isSolved ? 'Solve Again' : 'Solve in Engine'}</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-xs sm:text-sm text-purple-950 leading-relaxed whitespace-pre-line bg-purple-50/50 p-4 rounded-xl border border-purple-100 font-normal">
                {q.questionText}
              </div>

              {/* Pedagogy Note / Trap Warning */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Examiner Guidance:</strong> {q.whyHwOrNonHw}
                </div>
              </div>

              {/* Mark Scheme Toggle Button (Only enabled after students solve the question) */}
              {isSolved ? (
                <div className="pt-1 space-y-2">
                  <button
                    onClick={() => toggleMarkScheme(q.id)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-xs flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-700" />
                      <span>{isExpanded ? 'Hide Official Answer Scheme' : 'View Official Mark Scheme & Allocation'}</span>
                      <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Unlocked</span>
                      </span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-800" /> : <ChevronDown className="w-4 h-4 text-emerald-800" />}
                  </button>

                  {/* Collapsible Mark Scheme */}
                  {isExpanded && (
                    <div className="p-4 rounded-xl bg-purple-950 text-white text-xs font-mono space-y-2 animate-in slide-in-from-top-2 duration-150 border border-purple-800 shadow-md">
                      <div className="font-bold text-amber-300 border-b border-purple-800 pb-1 flex justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Official Marking Points & Allocations</span>
                        </span>
                        <span>Total: {q.totalMarks} Marks</span>
                      </div>
                      {q.officialAnswerScheme.map((item, idx) => (
                        <div key={idx} className="p-2 rounded bg-purple-900/60 border border-purple-800/80 leading-relaxed text-purple-100">
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Feature is hidden & locked under Examiner Guidance until students solve the question */
                <div className="pt-1">
                  <div className="w-full py-2.5 px-3.5 rounded-xl bg-purple-50/70 border border-dashed border-purple-300 text-purple-900 text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>
                        <strong>Official Mark Scheme & Allocation Locked:</strong> Solve this question in the Step Solver first to unlock the official answer scheme and marks allocation.
                      </span>
                    </span>
                    <button
                      onClick={() => onLoadQuestionIntoSolver(q.id)}
                      className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg shadow-2xs shrink-0 self-start sm:self-auto flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Solve to Unlock</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 bg-white rounded-2xl border-2 border-purple-200 text-center space-y-2">
            <div className="text-purple-950 font-bold text-base">No questions found</div>
            <p className="text-xs text-purple-700">Try modifying your search keywords or resetting the category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
