import React, { useState } from 'react';
import { Bot, Sparkles, X, MessageSquare, ArrowRight, Camera, Lightbulb, HelpCircle } from 'lucide-react';
import { TabType } from '../types';

interface AiHelpDeskPopupProps {
  onNavigate: (tab: TabType) => void;
}

export const AiHelpDeskPopup: React.FC<AiHelpDeskPopupProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleOpenHelpDesk = () => {
    onNavigate('ai-help');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-none select-none">
      <div className="pointer-events-auto">
        {/* Floating Mini Popup Panel */}
        {isOpen && (
          <div 
            id="ai-helpdesk-popup-card"
            className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border-2 border-purple-300 overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-purple-950 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-800/80 border border-purple-500/50 flex items-center justify-center text-sm shadow-inner">
                  🧬
                </div>
                <div>
                  <div className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                    <span>POPGEN AI HELP DESK</span>
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-emerald-400 text-emerald-950">
                      Live
                    </span>
                  </div>
                  <div className="text-[10px] text-purple-200">
                    Chapter 5 Assistive Tutor
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-purple-800 text-purple-300 hover:text-white transition-colors cursor-pointer"
                title="Close shortcut popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-3.5 space-y-3 bg-purple-50/40 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-purple-200 shadow-2xs space-y-1.5">
                <div className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Stuck on a calculation or question?</span>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  Take a photo of your handwritten working, upload a question screenshot, or ask why a formula works!
                </p>
              </div>

              {/* Quick Action Badges */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-purple-900 uppercase tracking-wider">
                  Quick Assist Modes:
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    onClick={handleOpenHelpDesk}
                    className="p-2 bg-white hover:bg-purple-100/80 rounded-xl border border-purple-200 font-bold text-purple-900 flex items-center gap-1.5 transition-colors text-left cursor-pointer shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                    <span className="truncate">Photo &amp; Steps</span>
                  </button>

                  <button
                    onClick={handleOpenHelpDesk}
                    className="p-2 bg-white hover:bg-purple-100/80 rounded-xl border border-purple-200 font-bold text-purple-900 flex items-center gap-1.5 transition-colors text-left cursor-pointer shadow-2xs"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">4-Stage Hints</span>
                  </button>

                  <button
                    onClick={handleOpenHelpDesk}
                    className="p-2 bg-white hover:bg-purple-100/80 rounded-xl border border-purple-200 font-bold text-purple-900 flex items-center gap-1.5 transition-colors text-left cursor-pointer shadow-2xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">Ask "WHY?"</span>
                  </button>

                  <button
                    onClick={handleOpenHelpDesk}
                    className="p-2 bg-white hover:bg-purple-100/80 rounded-xl border border-purple-200 font-bold text-purple-900 flex items-center gap-1.5 transition-colors text-left cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Check Answer</span>
                  </button>
                </div>
              </div>

              {/* Motto quote */}
              <div className="text-[10px] text-center text-purple-700 italic font-medium pt-0.5">
                "Think First. Calculate Second. Use AI Wisely."
              </div>

              {/* Primary Full Screen Button */}
              <button
                onClick={handleOpenHelpDesk}
                id="popup-btn-open-full-helpdesk"
                className="w-full py-2.5 px-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>Launch Full AI Help Desk</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-300" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Trigger Button with Tooltip / Pulse Badge */}
        <div className="relative flex items-center gap-2">
          {/* Subtle Teaser Pill when closed and not dismissed */}
          {!isOpen && !isDismissed && (
            <div 
              onClick={() => setIsOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-purple-950 text-white text-xs font-bold py-2 px-3.5 rounded-full shadow-xl border border-purple-400/40 cursor-pointer hover:bg-purple-900 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Need help? PopGen AI Tutor</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDismissed(true);
                }}
                className="ml-1 text-purple-400 hover:text-white p-0.5"
                title="Dismiss pill"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Main Floating Action Button */}
          <button
            onClick={() => setIsOpen(prev => !prev)}
            id="home-ai-helpdesk-floating-shortcut"
            className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-700 text-white shadow-xl hover:shadow-2xl border-2 border-purple-300 hover:border-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="AI Help Desk Shortcut"
            aria-label="Open AI Help Desk"
          >
            {/* Glow effect */}
            <span className="absolute -inset-1 rounded-full bg-purple-500/30 blur-xs group-hover:bg-amber-400/30 transition-colors pointer-events-none"></span>

            {/* Unread / Attention Indicator */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
            </span>

            {isOpen ? (
              <X className="w-6 h-6 text-white relative z-10 transition-transform rotate-0" />
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center">
                <Bot className="w-6 h-6 text-purple-100 group-hover:text-amber-200 transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-amber-300 -mt-0.5 leading-none">
                  AI HELP
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
