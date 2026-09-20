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
import { PitfallsView } from './components/PitfallsView';
import { ExitTicketView } from './components/ExitTicketView';
import { NotesView } from './components/NotesView';
import { ProgressView } from './components/ProgressView';
import { GenaideTutorView } from './components/GenaideTutorView';
import { GenaideTutorFloatingWidget } from './components/GenaideTutorFloatingWidget';
import { ChatProvider } from './context/ChatContext';
import { Heart, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

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
    <ChatProvider currentTab={activeTab}>
      <div className="min-h-screen bg-[#FAF9F6] text-[#1E1B4B] flex flex-col font-sans selection:bg-purple-200 selection:text-purple-950">
        {/* Official GenAIde Header */}
        <Header onNavigateHome={() => handleTabChange('home')} />

        {/* Primary Sticky Navigation Bar */}
        <Navigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8">
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
            <PastYearView
              onLoadQuestionIntoSolver={handleNavigateToQuestion}
              completedQuestions={userProgress.completedQuestions}
            />
          )}

          {activeTab === 'pitfalls' && (
            <PitfallsView />
          )}

          {activeTab === 'exit-ticket' && (
            <ExitTicketView />
          )}

          {activeTab === 'genaide-tutor' && (
            <GenaideTutorView />
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

        {/* Floating GenAIde Tutor Shortcut available on all major pages */}
        <GenaideTutorFloatingWidget 
          currentTab={activeTab} 
          onNavigateToFullTutor={() => handleTabChange('genaide-tutor')} 
        />

        {/* Simple, Centered Footer parallel to the Header GenAIde */}
        <footer className="bg-[#2E1065] text-purple-200 border-t border-purple-900 mt-auto py-8 text-xs">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center space-y-6">
            {/* Main Brand Section - Centered & Parallel with Header */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <button
                onClick={() => handleTabChange('home')}
                className="text-base sm:text-lg font-extrabold text-white tracking-wide inline-flex items-center justify-center gap-2 hover:text-purple-200 transition-colors group cursor-pointer"
                title="Return to Home"
              >
                <span>GenAIde: Your AI-Aided PopGen Tutor</span>
                <span className="text-[10px] font-bold uppercase bg-purple-800 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-700 group-hover:border-purple-500 transition-colors">
                  Chapter 5
                </span>
              </button>
              <p className="text-purple-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                Empowering Matriculation Biology Students with Conceptual Clarity &amp; Exam Precision.
              </p>
            </div>

            {/* Centered Navigation Links Row */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs font-medium text-purple-200 max-w-4xl mx-auto pt-1 pb-1">
              <button onClick={() => handleTabChange('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
              <span className="text-purple-700 hidden sm:inline">•</span>
              <button onClick={() => handleTabChange('learn')} className="hover:text-white transition-colors cursor-pointer">Curriculum</button>
              <span className="text-purple-700 hidden sm:inline">•</span>
              <button onClick={() => handleTabChange('toolbox')} className="hover:text-white transition-colors cursor-pointer">Toolbox</button>
              <span className="text-purple-700 hidden sm:inline">•</span>
              <button onClick={() => handleTabChange('practice')} className="hover:text-white transition-colors cursor-pointer">Solver</button>
              <span className="text-purple-700 hidden sm:inline">•</span>
              <button onClick={() => handleTabChange('past-year')} className="hover:text-white transition-colors cursor-pointer">Past Year</button>
              <span className="text-purple-700 hidden sm:inline">•</span>
              <button onClick={() => handleTabChange('pitfalls')} className="hover:text-white transition-colors cursor-pointer">Pitfalls</button>
              <span className="text-purple-700 hidden sm:inline">•</span>
              <button onClick={() => handleTabChange('exit-ticket')} className="hover:text-white transition-colors cursor-pointer">Exit Ticket</button>
              <span className="text-purple-700 hidden sm:inline">•</span>
              <button onClick={() => handleTabChange('genaide-tutor')} className="hover:text-white transition-colors cursor-pointer">GenAIde Tutor</button>
              <span className="text-purple-700 hidden sm:inline">•</span>
              <button onClick={() => handleTabChange('notes')} className="hover:text-white transition-colors cursor-pointer">Notes &amp; Cards</button>
              <span className="text-purple-700 hidden sm:inline">•</span>
              <button onClick={() => handleTabChange('progress')} className="hover:text-white transition-colors cursor-pointer">Progress</button>
            </div>

            {/* Centered Sub-footer Divider & Metadata */}
            <div className="w-full max-w-3xl pt-5 border-t border-purple-800/80 flex flex-col items-center justify-center gap-1.5 text-purple-300 text-[11px] sm:text-xs text-center">
              <div>
                &copy; {new Date().getFullYear()} GenAIde. Developed strictly from official Malaysian Matriculation Biology curriculum &amp; past-year materials.
              </div>
              <div className="italic text-purple-300/85">
                "Think First. Calculate Second. Use AI Wisely."
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ChatProvider>
  );
}
