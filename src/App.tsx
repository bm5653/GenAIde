/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, UserProgress } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { LearnView } from './components/LearnView';
import { PopGenToolboxView } from './components/PopGenToolboxView';
import { PracticeView } from './components/PracticeView';
import { PastYearView } from './components/PastYearView';
import { NewPopulationView } from './components/NewPopulationView';
import { PitfallsView } from './components/PitfallsView';
import { ExitTicketView } from './components/ExitTicketView';
import { AiHelpView } from './components/AiHelpView';
import { NotesView } from './components/NotesView';
import { ProgressView } from './components/ProgressView';
import { Heart, Sparkles, BookOpen, ShieldCheck, Download, Globe } from 'lucide-react';

const STORAGE_KEY = 'genaide_user_progress_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [solverTargetQuestionId, setSolverTargetQuestionId] = useState<string | undefined>(undefined);

  // Persistent User Progress
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      completedQuestions: [],
      totalScore: 0,
      attemptsByQuestion: {},
      masteredPitfalls: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch (e) {
      console.warn('Failed to persist progress', e);
    }
  }, [userProgress]);

  // Handler to update user question progress
  const handleUpdateProgress = (questionId: string, marksEarned: number, isComplete: boolean) => {
    setUserProgress(prev => {
      const isAlreadyCompleted = prev.completedQuestions.includes(questionId);
      const newCompleted = isAlreadyCompleted 
        ? prev.completedQuestions 
        : [...prev.completedQuestions, questionId];
      const newScore = isAlreadyCompleted ? prev.totalScore : prev.totalScore + marksEarned;
      const curAttempts = (prev.attemptsByQuestion[questionId] || 0) + 1;

      return {
        ...prev,
        completedQuestions: newCompleted,
        totalScore: newScore,
        attemptsByQuestion: {
          ...prev.attemptsByQuestion,
          [questionId]: curAttempts
        }
      };
    });
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all your completed questions and score?")) {
      setUserProgress({
        completedQuestions: [],
        totalScore: 0,
        attemptsByQuestion: {},
        masteredPitfalls: []
      });
    }
  };

  const handleNavigateToQuestion = (questionId: string) => {
    setSolverTargetQuestionId(questionId);
    setActiveTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1E1B4B] flex flex-col font-sans selection:bg-purple-200 selection:text-purple-950">
      {/* Official GenAIde Header */}
      <Header onNavigateHome={() => handleTabChange('home')} />

      {/* Primary Sticky Navigation Bar */}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {activeTab === 'home' && (
          <HomeView onNavigate={handleTabChange} />
        )}

        {activeTab === 'learn' && (
          <LearnView />
        )}

        {activeTab === 'toolbox' && (
          <PopGenToolboxView />
        )}

        {activeTab === 'practice' && (
          <PracticeView
            initialQuestionId={solverTargetQuestionId}
            userProgress={userProgress}
            onUpdateProgress={handleUpdateProgress}
          />
        )}

        {activeTab === 'past-year' && (
          <PastYearView onLoadQuestionIntoSolver={handleNavigateToQuestion} />
        )}

        {activeTab === 'new-population' && (
          <NewPopulationView />
        )}

        {activeTab === 'pitfalls' && (
          <PitfallsView />
        )}

        {activeTab === 'exit-ticket' && (
          <ExitTicketView />
        )}

        {activeTab === 'ai-help' && (
          <AiHelpView />
        )}

        {activeTab === 'notes' && (
          <NotesView />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            userProgress={userProgress}
            onResetProgress={handleResetProgress}
            onNavigateToQuestion={handleNavigateToQuestion}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#2E1065] text-purple-200 border-t border-purple-900 mt-auto py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-purple-800/80 pb-6 text-center md:text-left">
            <div className="space-y-1">
              <div className="text-base font-extrabold text-white tracking-wide flex items-center justify-center md:justify-start gap-2">
                <span>GenAIde: Your AI-Aided PopGen Tutor</span>
                <span className="text-[10px] font-bold uppercase bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full border border-purple-700">
                  Chapter 5
                </span>
              </div>
              <p className="text-purple-300 text-xs">
                Empowering Matriculation Biology Students with Conceptual Clarity & Exam Precision.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-purple-200">
              <button onClick={() => handleTabChange('learn')} className="hover:text-white transition-colors">Curriculum</button>
              <button onClick={() => handleTabChange('toolbox')} className="hover:text-white transition-colors">Toolbox</button>
              <button onClick={() => handleTabChange('practice')} className="hover:text-white transition-colors">Solver</button>
              <button onClick={() => handleTabChange('pitfalls')} className="hover:text-white transition-colors">Pitfalls</button>
              <button onClick={() => handleTabChange('ai-help')} className="hover:text-white transition-colors">AI Help</button>
              <a
                href="./genaide-tiiny-site.zip"
                download="genaide-tiiny-site.zip"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs shadow-xs transition-transform active:scale-95"
                title="Download ready-to-upload ZIP package for tiiny.site"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tiiny.site ZIP Package</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-purple-400 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} GenAIde. Developed strictly from official Malaysian Matriculation Biology curriculum & past-year materials.
            </div>
            <div className="flex items-center gap-1">
              <span>"Think First. Calculate Second. Use AI Wisely."</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
