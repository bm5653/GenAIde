import React from 'react';
import { TabType } from '../types';
import { CuteRobotIcon } from './CuteRobotIcon';

interface FloatingWidgetProps {
  currentTab: TabType;
  onNavigateToFullTutor?: () => void;
}

export const GenaideTutorFloatingWidget: React.FC<FloatingWidgetProps> = ({ currentTab, onNavigateToFullTutor }) => {
  // Hide if already on the AI Study Prompt Generator tab
  if (currentTab === 'genaide-tutor') {
    return null;
  }

  const handleClick = () => {
    if (onNavigateToFullTutor) {
      onNavigateToFullTutor();
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-40 print:hidden flex items-center gap-2.5 group"
    >
      {/* Floating Tooltip Label on Hover (Desktop) */}
      <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out translate-x-2 group-hover:translate-x-0 bg-purple-950/95 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg border border-purple-400/50 backdrop-blur-xs whitespace-nowrap pointer-events-none">
        GenAIde Study Prompt
      </div>

      <button
        id="floating-ai-study-prompt-btn"
        onClick={handleClick}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 text-white shadow-xl hover:shadow-2xl border-2 border-purple-400/80 hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 cursor-pointer flex flex-col items-center justify-center p-2"
        title="GenAIde Study Prompt"
        aria-label="Open GenAIde Study Prompt"
      >
        {/* Glow Ring Effect */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-amber-400 opacity-0 group-hover:opacity-60 blur-xs transition-opacity duration-300" />
        
        {/* Inner Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <CuteRobotIcon className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md transform group-hover:scale-110 transition-transform" />
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-tight text-amber-200 leading-none mt-0.5 whitespace-nowrap">
            Prompt
          </span>
        </div>

        {/* Pulse Dot Indicator */}
        <span className="absolute top-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-purple-950" />
        </span>
      </button>
    </div>
  );
};
