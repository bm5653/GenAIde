import React, { useState, useRef, useEffect } from 'react';
import { useGenaideChat } from '../context/ChatContext';
import { MathRenderer } from './MathRenderer';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Paperclip, 
  Camera, 
  X, 
  HelpCircle, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen, 
  Calculator, 
  Table, 
  Copy, 
  Check, 
  CornerDownLeft,
  ChevronRight,
  Info
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Guide me step-by-step', icon: '🧬', prompt: 'Guide me step-by-step to solve this question, but don’t give me the answer immediately: ' },
  { label: 'Check my working', icon: '🔎', prompt: 'Here is my working for this question. Where did I go wrong and what is the next step?' },
  { label: 'Give me a hint', icon: '💡', prompt: 'Give me a conceptual hint for finding q² from the recessive phenotype count.' },
  { label: 'Explain in BM', icon: '🇲🇾', prompt: 'Boleh terangkan konsep pengiraan Hardy-Weinberg (p², 2pq, q²) dalam Bahasa Melayu?' },
  { label: 'Explain a concept', icon: '📖', prompt: 'What is the difference between allele frequency (p, q) and genotype frequency (p², 2pq, q²)?' },
  { label: 'Full solution', icon: '📝', prompt: 'Show me the complete worked solution and explanation for this question: ' },
  { label: 'Quiz me', icon: '🎯', prompt: 'Test me with an SB015 Chapter 5 Population Genetics exam question. Wait for my answer before revealing the solution.' }
];

export const GenaideTutorView: React.FC = () => {
  const { messages, isSending, stagedImage, setStagedImage, sendMessage, clearChat } = useGenaideChat();
  const [inputVal, setInputVal] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : inputVal;
    if (!text.trim() && !stagedImage) return;
    sendMessage(text, stagedImage);
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

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            setStagedImage(reader.result as string);
          };
          reader.readAsDataURL(blob);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12" onPaste={handlePaste}>
      {/* 1. Header Section */}
      <div className="bg-gradient-to-r from-[#2E1065] via-purple-900 to-[#1E1B4B] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-purple-800 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/80 border border-purple-600/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dedicated AI Learning Interface</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>🧬 GenAIde Tutor</span>
            </h1>
            <p className="text-base font-semibold text-purple-200 mt-1">
              Your SB015 Population Genetics study buddy
            </p>
            <p className="text-xs sm:text-sm text-purple-300/90 mt-2 max-w-2xl leading-relaxed">
              Need help with Population Genetics? Ask GenAIde Tutor to explain concepts, guide you through calculations, check your working, or give you hints.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => setShowFormulaSheet(!showFormulaSheet)}
              className="px-3.5 py-2 rounded-xl bg-purple-800/70 hover:bg-purple-700/80 text-purple-100 text-xs font-bold border border-purple-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Table className="w-4 h-4 text-purple-300" />
              <span>{showFormulaSheet ? 'Hide Cheat Sheet' : 'PopGen Cheat Sheet'}</span>
            </button>
            <button
              onClick={clearChat}
              className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 text-xs font-bold border border-purple-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>Clear Chat</span>
            </button>
          </div>
        </div>

        {/* Collapsible PopGen Quick Cheat Sheet */}
        {showFormulaSheet && (
          <div className="mt-6 pt-5 border-t border-purple-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-purple-950/60 p-3.5 rounded-xl border border-purple-800">
              <h4 className="font-bold text-amber-300 mb-1 flex items-center justify-between">
                <span>Allele Frequencies</span>
                <span className="text-[10px] text-amber-400 font-mono">p + q = 1</span>
              </h4>
              <p className="font-mono text-purple-200 font-bold text-sm"><i>p</i> + <i>q</i> = 1</p>
              <div className="text-purple-300 text-[11px] mt-1 space-y-0.5">
                <p>• <strong><i>p</i></strong> = frequency of dominant allele (A)</p>
                <p>• <strong><i>q</i></strong> = frequency of recessive allele (a)</p>
              </div>
            </div>
            <div className="bg-purple-950/60 p-3.5 rounded-xl border border-purple-800">
              <h4 className="font-bold text-emerald-300 mb-1 flex items-center justify-between">
                <span>Genotype Frequencies</span>
                <span className="text-[10px] text-emerald-400 font-mono">p² + 2pq + q² = 1</span>
              </h4>
              <p className="font-mono text-purple-200 font-bold text-sm"><i>p</i><sup>2</sup> + 2<i>pq</i> + <i>q</i><sup>2</sup> = 1</p>
              <div className="text-purple-300 text-[11px] mt-1 space-y-0.5">
                <p>• <strong><i>p</i><sup>2</sup></strong> = homozygous dominant (AA)</p>
                <p>• <strong>2<i>pq</i></strong> = heterozygous / carrier (Aa)</p>
                <p>• <strong><i>q</i><sup>2</sup></strong> = homozygous recessive (aa)</p>
              </div>
            </div>
            <div className="bg-purple-950/60 p-3.5 rounded-xl border border-purple-800">
              <h4 className="font-bold text-cyan-300 mb-1 flex items-center justify-between">
                <span>5-Step Standard Workflow</span>
                <span className="text-[10px] text-cyan-400 font-bold">Rule</span>
              </h4>
              <p className="text-purple-200 font-semibold text-xs">
                1. <i>q</i><sup>2</sup> &rarr; 2. <i>q</i> &rarr; 3. <i>p</i> &rarr; 4. 2<i>pq</i> / <i>p</i><sup>2</sup> &rarr; 5. Counts
              </p>
              <p className="text-purple-300 text-[11px] mt-1">
                Always determine homozygous recessive phenotype (<i>q</i><sup>2</sup>) first, then take square root to obtain <i>q</i>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Quick-Action Prompts */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-purple-100">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-900/70 mb-3 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Quick Actions &mdash; Start with one click</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action.prompt)}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs sm:text-sm font-semibold border border-purple-200 hover:border-purple-300 transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Full-Screen Tutor Chat Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-purple-200 flex flex-col h-[650px] overflow-hidden">
        {/* Chat Thread Header */}
        <div className="bg-purple-50/80 px-4 py-3 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-purple-950">GenAIde Tutor Socratic Engine Active</span>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-200/70 px-2 py-0.5 rounded-md">SB015 Chapter 5</span>
          </div>
          <span className="text-[11px] text-purple-700 font-medium hidden sm:inline">
            Step-by-step guidance &bull; Working check &bull; Progressive hints
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF9F6]">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-xs ${
                    isBot 
                      ? 'bg-purple-900 text-emerald-300 ring-2 ring-purple-300' 
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isBot ? '🧬' : '🎓'}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col space-y-1 max-w-[85%]">
                  <div
                    className={`rounded-2xl px-4 py-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isBot
                        ? 'bg-white border border-purple-200/90 text-purple-950'
                        : 'bg-[#2E1065] text-white border border-purple-900'
                    }`}
                  >
                    {/* Render Image if user uploaded one */}
                    {msg.imageUrl && (
                      <div className="mb-2.5 rounded-lg overflow-hidden border border-purple-200 max-h-60 bg-purple-50 flex items-center justify-center">
                        <img 
                          src={msg.imageUrl} 
                          alt="Uploaded problem" 
                          className="max-h-60 object-contain"
                        />
                      </div>
                    )}

                    {/* Formatted Text Content using MathRenderer */}
                    <MathRenderer content={msg.text} />
                  </div>

                  {/* Message Actions / Meta */}
                  <div className={`flex items-center gap-2 text-[10px] text-purple-600/80 px-1 ${isBot ? 'justify-start' : 'justify-end'}`}>
                    <span>{msg.time}</span>
                    {isBot && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="hover:text-purple-900 transition-colors inline-flex items-center gap-0.5 cursor-pointer ml-1"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing / Loading Indicator */}
          {isSending && (
            <div className="flex gap-3 max-w-3xl mr-auto">
              <div className="w-8 h-8 rounded-full bg-purple-900 text-emerald-300 ring-2 ring-purple-300 flex items-center justify-center shrink-0 text-xs">
                🧬
              </div>
              <div className="bg-white border border-purple-200 rounded-2xl px-4 py-3 shadow-2xs flex items-center gap-2">
                <span className="text-xs font-semibold text-purple-900">GenAIde Tutor is thinking</span>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Staged Image Preview Area */}
        {stagedImage && (
          <div className="px-4 py-2 bg-purple-100 border-t border-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={stagedImage} alt="Staged" className="w-10 h-10 object-cover rounded-lg border border-purple-300" />
              <div className="text-xs">
                <p className="font-bold text-purple-950">Image attached</p>
                <p className="text-[11px] text-purple-700">Ready to send with your question</p>
              </div>
            </div>
            <button
              onClick={() => setStagedImage(null)}
              className="p-1.5 rounded-lg bg-purple-200 hover:bg-purple-300 text-purple-900 cursor-pointer transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-purple-200">
          {/* Quick PopGen Symbol Inserter */}
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-[11px] font-bold text-purple-900/70 shrink-0 mr-1">Insert Symbol:</span>
            {[
              { label: 'q²', value: 'q²' },
              { label: 'p²', value: 'p²' },
              { label: '2pq', value: '2pq' },
              { label: 'p', value: 'p' },
              { label: 'q', value: 'q' },
              { label: '√q²', value: '√q²' },
              { label: 'p + q = 1', value: 'p + q = 1' },
              { label: 'p² + 2pq + q² = 1', value: 'p² + 2pq + q² = 1' }
            ].map((sym, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputVal(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + sym.value + ' ');
                  inputRef.current?.focus();
                }}
                className="px-2 py-1 rounded-lg bg-purple-100/80 hover:bg-purple-200 text-purple-950 font-mono font-bold text-xs border border-purple-200 transition-colors shrink-0 cursor-pointer shadow-2xs"
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
            className="flex items-center gap-2"
          >
            {/* Hidden file inputs */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
            <input 
              type="file" 
              ref={cameraInputRef} 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={handleImageUpload} 
            />

            {/* Media Upload Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 sm:p-2.5 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-100 transition-colors cursor-pointer"
                title="Upload problem image (JPG, PNG)"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-2 sm:p-2.5 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-100 transition-colors cursor-pointer hidden sm:flex"
                title="Take photo of handwritten working"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Free-form text input */}
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask GenAIde Tutor anything about Population Genetics (or paste image Ctrl+V)..."
              disabled={isSending}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl border border-purple-300 text-xs sm:text-sm text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-purple-600 bg-[#FAF9F6] placeholder:text-purple-400 font-sans"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending || (!inputVal.trim() && !stagedImage)}
              className="px-4 py-2.5 sm:py-3 rounded-xl bg-[#2E1065] hover:bg-purple-900 disabled:bg-purple-300 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Input helper footer */}
          <div className="flex items-center justify-between text-[11px] text-purple-700/80 mt-2 px-1">
            <span>💡 Tip: You can paste screenshots with <strong>Ctrl+V</strong> or upload photos of handwritten notes</span>
            <span className="hidden md:inline">Language: English &bull; Bahasa Melayu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
