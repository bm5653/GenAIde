import React, { useState, useRef, useEffect } from 'react';
import { useGenaideChat } from '../context/ChatContext';
import { TabType } from '../types';
import { MathRenderer } from './MathRenderer';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Paperclip, 
  X, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Lightbulb, 
  MessageSquare,
  Bot
} from 'lucide-react';

interface FloatingWidgetProps {
  currentTab: TabType;
  onNavigateToFullTutor?: () => void;
}

const TAB_NAME_MAP: Record<TabType, string> = {
  'home': 'Home Overview',
  'learn': 'Learn Chapter 5 (Curriculum Notes)',
  'toolbox': 'PopGen Interactive Toolbox',
  'practice': 'Step Solver (Interactive Practice)',
  'past-year': 'Tutorial & PSPM Questions',
  'pitfalls': 'PopGen Pitfalls & Traps',
  'exit-ticket': 'Exit Ticket Gamified Quiz',
  'genaide-tutor': 'GenAIde Tutor Full Page',
  'notes': 'Notes & Flashcards',
  'progress': 'Student Progress & Analytics'
};

const FLOATING_QUICK_ACTIONS = [
  'Help me solve this step',
  'Check my calculation',
  'Give me a hint',
  'Why do we use q² here?',
  'Terangkan dalam BM'
];

export const GenaideTutorFloatingWidget: React.FC<FloatingWidgetProps> = ({ currentTab, onNavigateToFullTutor }) => {
  const { messages, isSending, stagedImage, setStagedImage, isFloatingOpen, setIsFloatingOpen, sendMessage, clearChat } = useGenaideChat();
  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll inside floating chat
  useEffect(() => {
    if (isFloatingOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, isFloatingOpen]);

  // Don't show floating launcher if user is already on the dedicated full-screen tutor tab
  if (currentTab === 'genaide-tutor') {
    return null;
  }

  const pageContextDescription = TAB_NAME_MAP[currentTab] || currentTab;

  const handleSend = (overrideText?: string) => {
    const text = overrideText !== undefined ? overrideText : inputVal;
    if (!text.trim() && !stagedImage) return;
    sendMessage(text, stagedImage, pageContextDescription);
    setInputVal('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setStagedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end print:hidden">
      {/* 1. Open Floating Chat Window */}
      {isFloatingOpen ? (
        <div 
          className={`bg-white rounded-2xl shadow-2xl border-2 border-purple-800/90 flex flex-col overflow-hidden transition-all duration-200 ${
            isExpanded 
              ? 'w-[94vw] sm:w-[540px] h-[85vh] max-h-[700px]' 
              : 'w-[92vw] sm:w-[400px] h-[520px] max-h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2E1065] to-purple-900 text-white p-3.5 flex items-center justify-between border-b border-purple-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-800 text-emerald-300 flex items-center justify-center font-bold text-xs ring-1 ring-purple-400">
                🧬
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>GenAIde Tutor</span>
                  <span className="text-[9px] font-bold bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full uppercase">AI</span>
                </h3>
                <p className="text-[10px] text-purple-200 truncate max-w-[200px]">
                  📍 Context: {pageContextDescription}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-800/60 rounded-lg transition-colors cursor-pointer"
                title="Clear chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-800/60 rounded-lg transition-colors cursor-pointer hidden sm:flex"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsFloatingOpen(false)}
                className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-800/60 rounded-lg transition-colors cursor-pointer"
                title="Minimize panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context-Aware Action Pills */}
          <div className="px-3 py-1.5 bg-purple-50 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-purple-900/60 shrink-0">Quick:</span>
            {FLOATING_QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-purple-100 text-purple-900 font-medium border border-purple-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-[#FAF9F6] text-xs">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[92%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] ${
                      isBot ? 'bg-purple-900 text-emerald-300 ring-1 ring-purple-400' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isBot ? '🧬' : '🎓'}
                  </div>

                  <div className="flex flex-col space-y-1 max-w-[88%]">
                    <div
                      className={`rounded-xl px-3 py-2.5 leading-relaxed shadow-2xs ${
                        isBot
                          ? 'bg-white border border-purple-200 text-purple-950'
                          : 'bg-[#2E1065] text-white'
                      }`}
                    >
                      {msg.imageUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-purple-200 max-h-40 bg-purple-50 flex items-center justify-center">
                          <img src={msg.imageUrl} alt="Attached" className="max-h-40 object-contain" />
                        </div>
                      )}
                      <MathRenderer content={msg.text} />
                    </div>

                    <div className={`flex items-center gap-1.5 text-[9px] text-purple-600/80 px-1 ${isBot ? 'justify-start' : 'justify-end'}`}>
                      <span>{msg.time}</span>
                      {isBot && (
                        <button
                          onClick={() => copyMessage(msg.id, msg.text)}
                          className="hover:text-purple-950 cursor-pointer ml-1 inline-flex items-center gap-0.5"
                          title="Copy"
                        >
                          {copiedId === msg.id ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex gap-2 mr-auto max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-purple-900 text-emerald-300 flex items-center justify-center shrink-0 text-[10px]">
                  🧬
                </div>
                <div className="bg-white border border-purple-200 rounded-xl px-3 py-2 shadow-2xs flex items-center gap-1.5 text-xs text-purple-900">
                  <span>Thinking</span>
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 bg-purple-600 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Staged Image in Floating Panel */}
          {stagedImage && (
            <div className="px-3 py-1.5 bg-purple-100 border-t border-purple-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <img src={stagedImage} alt="Staged" className="w-7 h-7 object-cover rounded border border-purple-300" />
                <span className="text-[11px] font-bold text-purple-950">Image attached</span>
              </div>
              <button
                onClick={() => setStagedImage(null)}
                className="p-1 text-purple-800 hover:text-purple-950 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-2.5 bg-white border-t border-purple-200 shrink-0">
            {/* Quick symbol row */}
            <div className="flex items-center gap-1 mb-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {[
                { label: 'q²', value: 'q²' },
                { label: 'p²', value: 'p²' },
                { label: '2pq', value: '2pq' },
                { label: 'p', value: 'p' },
                { label: 'q', value: 'q' },
                { label: '√q²', value: '√q²' },
                { label: 'p+q=1', value: 'p + q = 1' }
              ].map((sym, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputVal(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + sym.value + ' ');
                    inputRef.current?.focus();
                  }}
                  className="px-1.5 py-0.5 rounded bg-purple-100/90 hover:bg-purple-200 text-purple-950 font-mono font-bold text-[10px] border border-purple-200 transition-colors shrink-0 cursor-pointer"
                  title={`Insert ${sym.label}`}
                >
                  {sym.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
                title="Attach image"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about this page or question..."
                disabled={isSending}
                className="flex-1 px-3 py-2 rounded-xl border border-purple-300 text-xs text-purple-950 focus:outline-hidden focus:ring-1 focus:ring-purple-600 bg-[#FAF9F6]"
              />

              <button
                type="submit"
                disabled={isSending || (!inputVal.trim() && !stagedImage)}
                className="p-2 rounded-xl bg-[#2E1065] hover:bg-purple-900 disabled:bg-purple-300 text-white font-bold transition-colors cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* 2. Minimized Floating Button Shortcut */
        <button
          onClick={() => setIsFloatingOpen(true)}
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#2E1065] to-purple-800 text-white font-extrabold text-xs sm:text-sm shadow-xl hover:shadow-2xl border-2 border-purple-300/80 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-purple-900/20"
          title="Open GenAIde Tutor"
        >
          <div className="relative">
            <span className="text-base sm:text-lg">💬</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#2E1065] animate-pulse" />
          </div>
          <span className="tracking-wide">GenAIde Tutor</span>
          <span className="text-[10px] uppercase font-black bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full hidden sm:inline">
            Ask AI
          </span>
        </button>
      )}
    </div>
  );
};
