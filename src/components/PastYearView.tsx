import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';

interface PastYearViewProps {
  onLoadQuestionIntoSolver: (questionId: string) => void;
}

export const PastYearView: React.FC<PastYearViewProps> = ({ onLoadQuestionIntoSolver }) => {
  const allQuestions: QuestionData[] = [...ALL_QUESTIONS, ...ADDITIONAL_QUESTIONS];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedMarkSchemes, setExpandedMarkSchemes] = useState<Record<string, boolean>>({});

  const toggleMarkScheme = (qId: string) => {
    setExpandedMarkSchemes(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const filtered = allQuestions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-purple-700" />
          <span>Matriculation Exam Preparation Bank</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
          Past Year Exam Questions & Authoritative Mark Schemes
        </h2>
        <p className="text-xs sm:text-sm text-purple-800">
          Official past semester examination questions directly extracted from the Biology Chapter 5 Question Bank. Every question features official marking schemes and direct step solver integration.
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
              <option value="all">All Categories ({allQuestions.length})</option>
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
          const isExpanded = !!expandedMarkSchemes[q.id];

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-300 shadow-xs p-5 sm:p-6 space-y-4 transition-all"
            >
              {/* Question Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
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
                    <span>Solve in Engine</span>
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

              {/* Mark Scheme Toggle Button */}
              <div className="pt-1">
                <button
                  onClick={() => toggleMarkScheme(q.id)}
                  className="w-full py-2 px-3 rounded-xl bg-purple-100/70 hover:bg-purple-200/70 text-purple-950 font-bold text-xs flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-purple-700" />
                    {isExpanded ? 'Hide Official Answer Scheme' : 'View Official Mark Scheme & Allocation'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Collapsible Mark Scheme */}
                {isExpanded && (
                  <div className="mt-2 p-4 rounded-xl bg-purple-950 text-white text-xs font-mono space-y-2 animate-in slide-in-from-top-2 duration-150">
                    <div className="font-bold text-amber-300 border-b border-purple-800 pb-1 flex justify-between">
                      <span>Official Marking Points</span>
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
