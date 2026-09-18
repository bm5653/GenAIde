import React from 'react';
import { UserProgress } from '../types';
import { ALL_QUESTIONS } from '../data/questionsData';
import { ADDITIONAL_QUESTIONS } from '../data/pastYearAdditionalQuestions';
import { 
  BarChart3, 
  Award, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

interface ProgressViewProps {
  userProgress: UserProgress;
  onResetProgress: () => void;
  onNavigateToQuestion: (questionId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  userProgress,
  onResetProgress,
  onNavigateToQuestion
}) => {
  const allQuestions = [...ALL_QUESTIONS, ...ADDITIONAL_QUESTIONS];
  const totalQuestions = allQuestions.length;
  const completedCount = userProgress.completedQuestions.length;
  const percentage = Math.round((completedCount / totalQuestions) * 100);

  // Category breakdown
  const categories = [
    { id: 'gene-pool', label: 'Allele Counting / Gene Pool' },
    { id: 'hardy-weinberg', label: 'Standard Hardy-Weinberg' },
    { id: 'heterozygotes', label: 'Carriers & Heterozygotes' },
    { id: 'migration', label: 'Immigration & Migration' },
    { id: 'removal', label: 'Selective Removal & Culling' }
  ];

  const getMasteryRank = () => {
    if (completedCount === 0) return { title: "PopGen Explorer", color: "text-purple-700", badge: "Beginner" };
    if (completedCount < 5) return { title: "Gene Pool Apprentice", color: "text-blue-700", badge: "Intermediate" };
    if (completedCount < totalQuestions) return { title: "Hardy-Weinberg Scholar", color: "text-amber-700", badge: "Advanced" };
    return { title: "Population Genetics Grandmaster", color: "text-emerald-700", badge: "Mastery" };
  };

  const rank = getMasteryRank();
  const nextUnsolved = allQuestions.find(q => !userProgress.completedQuestions.includes(q.id)) || allQuestions[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
          <BarChart3 className="w-4 h-4 text-purple-700" />
          <span>Learning Analytics & Mastery Tracker</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
          My Study Progress & Examination Readiness
        </h2>
        <p className="text-xs sm:text-sm text-purple-800">
          Track your question completion, category mastery, and overall preparedness for the Chapter 5 exam.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Questions Mastered
          </div>
          <div className="text-3xl font-black font-mono text-purple-950">
            {completedCount} <span className="text-sm font-semibold text-purple-600">/ {totalQuestions}</span>
          </div>
          <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-purple-700 h-full transition-all duration-500" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Total Marks Earned
          </div>
          <div className="text-3xl font-black font-mono text-purple-950">
            {userProgress.totalScore} <span className="text-sm font-semibold text-purple-600">pts</span>
          </div>
          <div className="text-[11px] text-purple-700">
            Across verified step solver exercises
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Current Mastery Level
          </div>
          <div className={`text-xl font-black ${rank.color}`}>
            {rank.title}
          </div>
          <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
            {rank.badge}
          </span>
        </div>
      </div>

      {/* Category Mastery Progress */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-purple-950 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-700" />
          <span>Topic Mastery Breakdown</span>
        </h3>

        <div className="space-y-3">
          {categories.map((cat) => {
            const inCat = allQuestions.filter(q => q.category === cat.id);
            const doneInCat = inCat.filter(q => userProgress.completedQuestions.includes(q.id));
            const catPct = inCat.length > 0 ? Math.round((doneInCat.length / inCat.length) * 100) : 0;

            return (
              <div key={cat.id} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-purple-950">
                  <span>{cat.label}</span>
                  <span className="font-mono text-purple-700">
                    {doneInCat.length} / {inCat.length} ({catPct}%)
                  </span>
                </div>
                <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full transition-all duration-300"
                    style={{ width: `${catPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Row: Resume Next Question or Reset */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 bg-purple-50 rounded-2xl border border-purple-200">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-bold text-sm text-purple-950">
            Ready to continue solving?
          </div>
          <div className="text-xs text-purple-700">
            Next recommended question: <strong>{nextUnsolved.number} — {nextUnsolved.title}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToQuestion(nextUnsolved.id)}
            className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span>Solve Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onResetProgress}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-red-700 font-semibold text-xs border border-red-200 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
