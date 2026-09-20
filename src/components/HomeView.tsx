import React from 'react';
import { TabType } from '../types';
import { AiHelpDeskPopup } from './AiHelpDeskPopup';
import { 
  BookOpen, 
  PenTool, 
  GraduationCap, 
  Target, 
  Search, 
  CheckCircle2, 
  Calculator, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Lightbulb,
  Bot,
  FileText,
  BarChart3
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const steps = [
    { title: "1. READ", desc: "Scan context & traits" },
    { title: "2. UNDERSTAND", desc: "Allele vs Genotype vs Count" },
    { title: "3. IDENTIFY", desc: "H-W or Gene Pool Count?" },
    { title: "4. CALCULATE", desc: "Recessive q² first always" },
    { title: "5. CHECK", desc: "Decimals, units & labels" },
    { title: "6. MASTER", desc: "Exam-ready confidence" }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-br from-[#3B0764] via-[#4C1D95] to-[#2E1065] text-white rounded-2xl p-6 sm:p-10 shadow-lg border border-purple-800 relative overflow-hidden">
        {/* Subtle background circuit elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 top-0 w-48 h-48 bg-lavender-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/80 border border-purple-400/30 text-purple-200 text-xs sm:text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Official PopGen Interactive Tutor</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Master Chapter 5: <br className="hidden sm:inline" />
            <span className="text-purple-200">Population Genetics</span>
          </h1>

          <p className="text-lg sm:text-xl font-semibold text-purple-200/90 italic">
            "Think First. Calculate Second. Use AI Wisely."
          </p>

          <p className="text-sm sm:text-base text-purple-100/80 leading-relaxed">
            Learn how to understand Population Genetics questions, choose the correct formula, calculate step-by-step, and pinpoint exactly where and why any calculation error occurred.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('learn')}
              id="home-btn-start-learning"
              className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              START LEARNING
            </button>
            <button
              onClick={() => onNavigate('practice')}
              id="home-btn-practise-questions"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <PenTool className="w-4 h-4 text-purple-700" />
              PRACTISE QUESTIONS
            </button>
            <button
              onClick={() => onNavigate('past-year')}
              id="home-btn-past-year"
              className="px-5 py-2.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 text-purple-100 font-semibold text-sm border border-purple-600 transition-all flex items-center gap-2 active:scale-95"
            >
              <GraduationCap className="w-4 h-4 text-purple-300" />
              TUTORIAL & PAST YEAR PSPM
            </button>
            <button
              onClick={() => onNavigate('exit-ticket')}
              id="home-btn-exit-ticket"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-purple-950 font-extrabold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Target className="w-4 h-4" />
              EXIT TICKET GAME
            </button>
          </div>
        </div>
      </section>

      {/* Visual Learning Pathway */}
      <section className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-purple-950 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-600" />
            <span>The GenAIde Systematic Learning Cycle</span>
          </h2>
          <span className="text-xs text-purple-600 font-medium">6 Proven Exam Steps</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {steps.map((st, i) => (
            <div 
              key={i} 
              className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex flex-col justify-between hover:border-purple-300 transition-colors"
            >
              <div className="font-extrabold text-xs text-purple-900 mb-1">
                {st.title}
              </div>
              <div className="text-[11px] text-purple-700 leading-snug">
                {st.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Three Pillars Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Understand */}
        <div 
          onClick={() => onNavigate('practice')}
          className="group cursor-pointer bg-white rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-purple-950 group-hover:text-purple-800 transition-colors">
              1. UNDERSTAND
            </h3>
            <p className="text-sm text-purple-900/80 leading-relaxed">
              Never get tricked by wording again. Our <strong>Question Detector</strong> trains you to distinguish between alleles (<span className="font-mono text-purple-800">p, q</span>), genotypes (<span className="font-mono text-purple-800">p², 2pq, q²</span>), and total individual counts.
            </p>
          </div>
          <div className="text-xs font-semibold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Try Question Detector</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Calculate */}
        <div 
          onClick={() => onNavigate('practice')}
          className="group cursor-pointer bg-white rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-purple-950 group-hover:text-purple-800 transition-colors">
              2. CALCULATE
            </h3>
            <p className="text-sm text-purple-900/80 leading-relaxed">
              Work through every step actively. Use the <strong>POPGEN Math Toolbox</strong> to insert symbols and surds (<span className="font-mono text-purple-800">√, p², q²</span>) smoothly, with 3-tier progressive hints if you get stuck.
            </p>
          </div>
          <div className="text-xs font-semibold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Open Step-by-Step Solver</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Check */}
        <div 
          onClick={() => onNavigate('pitfalls')}
          className="group cursor-pointer bg-white rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-purple-950 group-hover:text-purple-800 transition-colors">
              3. CHECK & DIAGNOSE
            </h3>
            <p className="text-sm text-purple-900/80 leading-relaxed">
              Find <em>exactly</em> where your calculation went wrong. Instant error diagnostics identify if you forgot <span className="font-mono text-purple-800">√</span>, missed the factor of 2 in <span className="font-mono text-purple-800">2pq</span>, or rounded too early.
            </p>
          </div>
          <div className="text-xs font-semibold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Explore Common Pitfalls</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>

      {/* Special Module Spotlight: New Population Masterclass */}
      <section className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Highest Student Confusion Area</span>
          </div>
          <h3 className="text-xl font-bold text-purple-950">
            The "New Population" Masterclass
          </h3>
          <p className="text-sm text-purple-900/80 leading-relaxed">
            What happens when 50 hamsters die, 1000 goats migrate in, or all fair insects are eliminated? Hardy-Weinberg equilibrium breaks! Master the <strong>Gene Pool Allele-Counting Method</strong> with interactive visualizer.
          </p>
        </div>

        <button
          onClick={() => onNavigate('new-population')}
          className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-sm transition-all whitespace-nowrap active:scale-95 flex items-center gap-2"
        >
          <span>Open Masterclass</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Revision, AI & Student Progress Hub */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-purple-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Mastery, AI & Quick Review Tools</span>
          </h2>
          <span className="text-xs text-purple-600 font-medium">Accessible on all devices</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Exit Ticket */}
          <div 
            onClick={() => onNavigate('exit-ticket')}
            className="group cursor-pointer bg-white rounded-xl p-5 border-2 border-amber-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-black group-hover:bg-amber-500 group-hover:text-purple-950 transition-colors">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-purple-950 text-base">Exit Ticket</h3>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-purple-950">Game</span>
              </div>
              <p className="text-xs text-purple-900/80 leading-relaxed">
                Test yourself with rapid-fire gamified exam scenarios. Instant scoring and feedback.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Play Exit Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: AI Help Desk */}
          <div 
            onClick={() => onNavigate('ai-help')}
            className="group cursor-pointer bg-white rounded-xl p-5 border-2 border-emerald-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-purple-950 text-base">AI Help Desk</h3>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-emerald-400 text-emerald-950">AI</span>
              </div>
              <p className="text-xs text-purple-900/80 leading-relaxed">
                Stuck on a tricky tutorial question? Upload photo or type working for instant error checking.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Ask AI Tutor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Notes & Flashcards */}
          <div 
            onClick={() => onNavigate('notes')}
            className="group cursor-pointer bg-white rounded-xl p-5 border-2 border-cyan-200 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-black group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-purple-950 text-base">Notes & Flashcards</h3>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-cyan-300 text-cyan-950">Review</span>
              </div>
              <p className="text-xs text-purple-900/80 leading-relaxed">
                Flip through interactive Leitner flashcards and structured revision summaries of Chapter 5.
              </p>
            </div>
            <div className="text-xs font-bold text-cyan-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Review Flashcards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: My Progress */}
          <div 
            onClick={() => onNavigate('progress')}
            className="group cursor-pointer bg-white rounded-xl p-5 border-2 border-rose-200 hover:border-rose-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-black group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-purple-950 text-base">My Progress</h3>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-rose-300 text-rose-950">Stats</span>
              </div>
              <p className="text-xs text-purple-900/80 leading-relaxed">
                Track your PSPM readiness percentage, completed practice questions, and earned score marks.
              </p>
            </div>
            <div className="text-xs font-bold text-rose-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Progress</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* AI Help Desk Popup Shortcut at Bottom-Right Corner */}
      <AiHelpDeskPopup onNavigate={onNavigate} />
    </div>
  );
};
