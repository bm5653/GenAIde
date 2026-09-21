import React, { useState } from 'react';
import { CuteRobotIcon } from './CuteRobotIcon';
import { ScanQuestionModal } from './ScanQuestionModal';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  ExternalLink, 
  HelpCircle, 
  BookOpen, 
  Calculator, 
  CheckCircle2, 
  Compass, 
  MessageSquare, 
  Lightbulb, 
  Search, 
  AlertCircle,
  FileText,
  Layers,
  ArrowRight,
  Camera
} from 'lucide-react';

export type AIPlatform = 'chatgpt' | 'gemini' | 'other';

interface QuickStartPreset {
  id: string;
  icon: string;
  title: string;
  desc: string;
  tasks: string[];
  preference: string;
  level: string;
}

const QUICK_START_PRESETS: QuickStartPreset[] = [
  {
    id: 'calc',
    icon: '🧮',
    title: 'Solve a Calculation',
    desc: 'Help me understand and solve this Population Genetics calculation step by step.',
    tasks: ['Help me solve the calculation', 'Guide me step by step'],
    preference: 'Guide me first',
    level: 'SB015 Matriculation level'
  },
  {
    id: 'check',
    icon: '🔍',
    title: 'Check My Answer',
    desc: 'Check my working and identify where I made a mistake.',
    tasks: ['Check my answer', 'Find my mistake'],
    preference: 'Check my answer first',
    level: 'SB015 Matriculation level'
  },
  {
    id: 'hints',
    icon: '💡',
    title: 'Give Me Hints',
    desc: 'Guide me step by step without revealing the final answer immediately.',
    tasks: ['Give me hints', 'Guide me step by step'],
    preference: "Don't give me the answer immediately",
    level: 'SB015 Matriculation level'
  },
  {
    id: 'concept',
    icon: '📚',
    title: 'Explain the Concept',
    desc: 'Explain the Biology concept behind this question at SB015 level.',
    tasks: ['Explain the concept'],
    preference: 'Guide me first',
    level: 'SB015 Matriculation level'
  },
  {
    id: 'exam',
    icon: '📝',
    title: 'Exam Practice',
    desc: 'Help me analyse this question like an SB015 examination question.',
    tasks: ['Help me prepare for an exam', 'Find my mistake'],
    preference: 'Guide me first',
    level: 'Exam-focused'
  }
];

const TASK_OPTIONS = [
  { id: 'guide', label: '🧭 Guide me step by step', desc: 'Break down the problem without giving away the answer' },
  { id: 'hints', label: '💡 Give me hints', desc: 'Provide progressive clues when I get stuck' },
  { id: 'check', label: '🔍 Check my answer', desc: 'Verify my calculations and biological reasoning' },
  { id: 'mistake', label: '❌ Find my mistake', desc: 'Pinpoint the exact step where my working went wrong' },
  { id: 'concept', label: '📚 Explain the concept', desc: 'Clarify the theory, definitions, or principles' },
  { id: 'calc', label: '🧮 Help me solve the calculation', desc: 'Guide through formula selection and math steps' },
  { id: 'full', label: '📝 Give me a full solution', desc: 'Provide complete worked step-by-step solution' },
  { id: 'exam', label: '🎯 Help me prepare for an exam', desc: 'Highlight marking points, keywords & exam traps' },
  { id: 'other', label: '✏️ Other', desc: 'Specify your own custom study request' }
];

export const AiStudyPromptGeneratorView: React.FC = () => {
  // Platform Selection
  const [platform, setPlatform] = useState<AIPlatform>('chatgpt');
  const [otherPlatformName, setOtherPlatformName] = useState('');

  // Form Fields
  const [question, setQuestion] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([
    'Guide me step by step',
    'Find my mistake'
  ]);
  const [customTask, setCustomTask] = useState('');
  const [studentWorking, setStudentWorking] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Bahasa Melayu' | 'English + Bahasa Melayu'>('English');
  const [explanationLevel, setExplanationLevel] = useState<'Simple' | 'SB015 Matriculation level' | 'Detailed' | 'Exam-focused'>('SB015 Matriculation level');
  const [answeringPreference, setAnsweringPreference] = useState<
    "Don't give me the answer immediately" | 'Guide me first' | 'Check my answer first' | 'Give me the complete solution'
  >("Don't give me the answer immediately");

  // Output & UI State
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCameraScanOpen, setIsCameraScanOpen] = useState(false);

  // Handle OCR camera scan extraction result
  const handleExtractedQuestionText = (scannedText: string, mode: 'replace' | 'append') => {
    if (mode === 'append' && question.trim().length > 0) {
      setQuestion(prev => prev.trim() + '\n\n' + scannedText);
    } else {
      setQuestion(scannedText);
    }
    if (validationError) setValidationError(null);
  };

  // Toggle Task Selection
  const handleToggleTask = (taskLabel: string) => {
    // strip icon for clean check
    const cleanLabel = taskLabel.replace(/^[\s\S]*?\s/, '');
    setSelectedTasks(prev => {
      const exists = prev.some(t => t.includes(cleanLabel) || cleanLabel.includes(t));
      if (exists) {
        return prev.filter(t => !t.includes(cleanLabel) && !cleanLabel.includes(t));
      } else {
        return [...prev, cleanLabel];
      }
    });
  };

  const isTaskSelected = (taskLabel: string) => {
    const cleanLabel = taskLabel.replace(/^[\s\S]*?\s/, '');
    return selectedTasks.some(t => t.includes(cleanLabel) || cleanLabel.includes(t));
  };

  // Apply Quick Preset
  const handleApplyPreset = (preset: QuickStartPreset) => {
    setSelectedTasks(preset.tasks);
    setAnsweringPreference(preset.preference as any);
    setExplanationLevel(preset.level as any);
    setValidationError(null);
  };

  // Sample Question Loader for convenience
  const handleLoadSampleQuestion = () => {
    setQuestion(
      'In a population of 200 individuals, 72 are homozygous recessive for the character fragmented fins. However, 50 individuals from this population died due to a fatal disease; 30 of the survivors are homozygous recessive. How many individuals are homozygous dominant in the next generation if the population size increases to 1000? Calculate up to 4 decimal places.'
    );
    setStudentWorking(
      'Survivors = 200 - 50 = 150 individuals\nq² = 30 / 150 = 0.20\nq = √0.20 = 0.4472\np = 1 - 0.4472 = 0.5528\np² = (0.5528)² = 0.3056\nDominant count in next gen = 0.3056 × 1000 = 305.6 ≈ 306 individuals'
    );
    setValidationError(null);
  };

  // Reset / Start Over
  const handleStartOver = () => {
    if (question.trim().length > 50) {
      if (!window.confirm('Are you sure you want to reset your inputs and start over?')) {
        return;
      }
    }
    setQuestion('');
    setStudentWorking('');
    setSelectedTasks(['Guide me step by step', 'Find my mistake']);
    setCustomTask('');
    setPreferredLanguage('English');
    setExplanationLevel('SB015 Matriculation level');
    setAnsweringPreference("Don't give me the answer immediately");
    setGeneratedPrompt('');
    setValidationError(null);
    setIsCopied(false);
  };

  // Prompt Generator Logic
  const handleGeneratePrompt = () => {
    setValidationError(null);

    // Platform Target Name
    let targetPlatformText = 'ChatGPT';
    if (platform === 'gemini') targetPlatformText = 'Gemini';
    else if (platform === 'other') targetPlatformText = otherPlatformName.trim() || 'AI study assistant';

    // Build specific prompt sections
    const lines: string[] = [];

    lines.push(`You are my Biology study assistant using ${targetPlatformText}. I am a student in the Malaysian Matriculation College Biology Programme (SB015), studying Chapter 5: Population Genetics.`);
    lines.push('');

    if (question.trim()) {
      lines.push('Help me analyse and work through the following Biology question:');
      lines.push('');
      lines.push('----------------------------------------');
      lines.push('### QUESTION:');
      lines.push(question.trim());
      lines.push('----------------------------------------');
    } else {
      lines.push('Help me study and master SB015 Chapter 5: Population Genetics concepts, problem-solving calculations, and exam questions.');
      lines.push('');
      lines.push('----------------------------------------');
      lines.push('### STUDY TOPIC / QUESTION:');
      lines.push('[I will provide my question or specific study topic in our conversation. Please prepare to assist me according to the guidelines below.]');
      lines.push('----------------------------------------');
    }

    if (studentWorking.trim()) {
      lines.push('');
      lines.push('### MY WORKING / PROPOSED ANSWER:');
      lines.push(studentWorking.trim());
      lines.push('----------------------------------------');
    }

    lines.push('');
    lines.push('### WHAT I WANT YOU TO DO:');
    
    // Compile active tasks
    const activeTasksList = [...selectedTasks];
    if (selectedTasks.includes('Other') && customTask.trim()) {
      activeTasksList.push(customTask.trim());
    }

    if (activeTasksList.length > 0) {
      activeTasksList.forEach(task => {
        lines.push(`• ${task}`);
      });
    } else {
      lines.push('• Guide me step-by-step through solving this question.');
    }

    lines.push('');
    lines.push('### PEDAGOGICAL & BIOLOGICAL GUIDELINES:');
    lines.push('1. First determine what the question is asking and what biological concept is required.');
    lines.push('2. Do not automatically assume every question follows a single rigid formula sequence.');
    lines.push('3. If the question involves Hardy-Weinberg equilibrium, use appropriate equations (p + q = 1 and p² + 2pq + q² = 1) and clearly explain why they apply.');
    lines.push('4. If the question contains changes in population size, deaths, survivors, migration, or generations, carefully identify which population and denominator are relevant before calculating allele or genotype frequencies.');
    
    if (studentWorking.trim()) {
      lines.push('5. Check my working carefully step by step. If my calculation or reasoning is incorrect, pinpoint the first meaningful mistake, explain why it is wrong, and guide me on how to fix it.');
      lines.push('6. If my answer is correct, confirm it and highlight why the working is mathematically and biologically sound.');
    } else {
      lines.push('5. Help me verify which information corresponds to alleles (p, q), genotypes (p², 2pq, q²), or total counts.');
    }

    // Answering preference
    if (answeringPreference === "Don't give me the answer immediately") {
      lines.push("7. Critical: Do not reveal the final answer immediately. Ask guiding questions or give me the first step so I can think and calculate myself.");
    } else if (answeringPreference === 'Guide me first') {
      lines.push("7. Guide me through one step at a time. Wait for my response before moving on to the next step.");
    } else if (answeringPreference === 'Check my answer first') {
      lines.push("7. Focus primarily on checking my working and diagnosing any calculation errors before giving further steps.");
    } else if (answeringPreference === 'Give me the complete solution') {
      lines.push("7. Provide a complete, structured worked solution: Given → Formula → Step-by-step Substitution → Final Calculation with Units/Labels.");
    }

    lines.push('8. Maintain sufficient decimal precision (at least 4 decimal places during intermediate steps) and round according to the question requirements.');
    
    // Level & Language
    lines.push(`9. Explanation Level: Explain at **${explanationLevel}**.`);
    if (preferredLanguage === 'Bahasa Melayu') {
      lines.push('10. Language: Please explain in **Bahasa Melayu** while keeping standard scientific terms (Hardy-Weinberg, allele frequency, genotype frequency, p, q, etc.) recognizable.');
    } else if (preferredLanguage === 'English + Bahasa Melayu') {
      lines.push('10. Language: Respond in **Bilingual (English + Bahasa Melayu)** for clarity where needed.');
    } else {
      lines.push('10. Language: Respond in **English** unless I specifically ask in Bahasa Melayu in a follow-up.');
    }

    const fullPromptText = lines.join('\n');
    setGeneratedPrompt(fullPromptText);
    setIsCopied(false);

    // Scroll smoothly to output
    setTimeout(() => {
      const outputElem = document.getElementById('generated-prompt-output-section');
      if (outputElem) {
        outputElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Copy Prompt
  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* ========================================================= */}
      {/* 1. HERO HEADER SECTION                                    */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-r from-[#2E1065] via-purple-900 to-[#1E1B4B] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-purple-800 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/80 border border-purple-600/50 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <CuteRobotIcon className="w-4 h-4" />
            <span>GenAIde Study Prompt</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CuteRobotIcon className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 drop-shadow-md" />
            <span>GenAIde Study Prompt</span>
          </h1>

          <p className="text-sm sm:text-base text-purple-200/95 max-w-3xl leading-relaxed">
            Turn your Biology question into a powerful AI study prompt tailored for <strong>ChatGPT</strong>, <strong>Gemini</strong>, <strong>Claude</strong>, or any AI platform. Learn actively by turning AI into your personalized <strong>SB015 Population Genetics</strong> study partner.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-purple-300">
            <span className="font-semibold text-white">How it works:</span>
            <span>Paste Question &rarr; Choose AI &rarr; Select Preferences &rarr; Generate &rarr; Copy & Paste into AI</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CHOOSE YOUR AI PLATFORM TABS                           */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-purple-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-100">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-purple-950 uppercase tracking-wide flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-700" />
              <span>Step 1: Choose Your AI Platform</span>
            </h2>
            <p className="text-xs text-purple-700/90 mt-0.5">
              Select your preferred platform to optimize the prompt style
            </p>
          </div>
          <span className="text-[11px] font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
            Platform-Neutral & Flexible
          </span>
        </div>

        {/* 3 Main Platform Tabs */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {/* Tab 1: ChatGPT */}
          <button
            type="button"
            id="platform-tab-chatgpt"
            onClick={() => setPlatform('chatgpt')}
            className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
              platform === 'chatgpt'
                ? 'bg-purple-900 text-white border-purple-950 shadow-md ring-2 ring-purple-300'
                : 'bg-purple-50/50 hover:bg-purple-100/70 text-purple-900 border-purple-200 hover:border-purple-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              platform === 'chatgpt' ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
            }`}>
              💬
            </div>
            <span className="font-extrabold text-xs sm:text-sm">ChatGPT</span>
            <span className={`text-[10px] hidden sm:inline ${platform === 'chatgpt' ? 'text-purple-200' : 'text-purple-600'}`}>
              OpenAI Assistant
            </span>
          </button>

          {/* Tab 2: Gemini */}
          <button
            type="button"
            id="platform-tab-gemini"
            onClick={() => setPlatform('gemini')}
            className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
              platform === 'gemini'
                ? 'bg-purple-900 text-white border-purple-950 shadow-md ring-2 ring-purple-300'
                : 'bg-purple-50/50 hover:bg-purple-100/70 text-purple-900 border-purple-200 hover:border-purple-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              platform === 'gemini' ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
            }`}>
              ✨
            </div>
            <span className="font-extrabold text-xs sm:text-sm">Gemini</span>
            <span className={`text-[10px] hidden sm:inline ${platform === 'gemini' ? 'text-purple-200' : 'text-purple-600'}`}>
              Google AI Assistant
            </span>
          </button>

          {/* Tab 3: Other AI */}
          <button
            type="button"
            id="platform-tab-other"
            onClick={() => setPlatform('other')}
            className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
              platform === 'other'
                ? 'bg-purple-900 text-white border-purple-950 shadow-md ring-2 ring-purple-300'
                : 'bg-purple-50/50 hover:bg-purple-100/70 text-purple-900 border-purple-200 hover:border-purple-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              platform === 'other' ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
            }`}>
              🤖
            </div>
            <span className="font-extrabold text-xs sm:text-sm">Other AI</span>
            <span className={`text-[10px] hidden sm:inline ${platform === 'other' ? 'text-purple-200' : 'text-purple-600'}`}>
              Claude / Copilot / etc.
            </span>
          </button>
        </div>

        {/* Dynamic Platform Sub-header Banner */}
        <div className="p-4 rounded-xl bg-purple-50/90 border border-purple-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-purple-950">
              {platform === 'chatgpt' && 'Create a Study Prompt for ChatGPT'}
              {platform === 'gemini' && 'Create a Study Prompt for Gemini'}
              {platform === 'other' && 'Create a Study Prompt for Other AI'}
            </h3>
            <p className="text-xs text-purple-800 mt-0.5">
              {platform === 'chatgpt' && 'Create a ready-to-copy prompt and use ChatGPT as your personal Biology study assistant.'}
              {platform === 'gemini' && 'Create a ready-to-copy prompt and use Gemini as your personal Biology study assistant.'}
              {platform === 'other' && 'Generate a flexible study prompt that can be used with another AI platform.'}
            </p>
          </div>

          {platform === 'other' && (
            <div className="w-full sm:w-64 shrink-0">
              <label className="block text-[11px] font-bold text-purple-900 mb-1">
                AI platform name (optional):
              </label>
              <input
                type="text"
                value={otherPlatformName}
                onChange={(e) => setOtherPlatformName(e.target.value)}
                placeholder="e.g., Claude, Microsoft Copilot"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-purple-300 bg-white text-purple-950 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. QUICK START PRESET CARDS (Section 13)                  */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-purple-200 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Quick Start Presets — Click to auto-configure</span>
          </p>
          <button
            type="button"
            onClick={handleLoadSampleQuestion}
            className="text-xs text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
          >
            Load Example Question
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {QUICK_START_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3 rounded-xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200 hover:border-purple-300 text-left transition-all flex flex-col justify-between space-y-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">{preset.icon}</span>
                <span className="font-extrabold text-xs text-purple-950">{preset.title}</span>
              </div>
              <p className="text-[11px] text-purple-800 leading-snug line-clamp-2">
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. MAIN PROMPT CONFIGURATION FORM                         */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-purple-200 space-y-7">
        
        {/* A. Question Input (Optional) */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label 
              htmlFor="prompt-question-input"
              className="text-sm font-extrabold text-purple-950 flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-purple-900 text-white text-xs flex items-center justify-center font-bold">
                A
              </span>
              <span>Paste, Type or Scan Your Biology Question <span className="text-xs font-normal text-purple-600">(Optional)</span></span>
            </label>

            {/* Camera Scan Button */}
            <button
              type="button"
              id="scan-question-camera-btn"
              onClick={() => setIsCameraScanOpen(true)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold text-xs shadow-xs hover:shadow-md border border-purple-400/50 transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
              title="Use your phone camera or webcam to scan and extract question text (optional)"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>📷 Scan Question with Camera (Optional)</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              id="prompt-question-input"
              rows={4}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Type, paste, or scan your question here (optional — you can also generate a general study prompt without entering a question)..."
              className="w-full p-4 rounded-xl border border-purple-200 text-sm font-normal text-purple-950 placeholder-purple-400 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
          </div>

          {/* Question Box Quick Utilities Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-purple-700 pt-0.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCameraScanOpen(true)}
                className="inline-flex items-center gap-1 text-purple-800 hover:text-purple-950 font-bold bg-purple-100/70 hover:bg-purple-200/80 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-purple-700" />
                <span>Camera Scanner (OCR)</span>
              </button>
              {question.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuestion('')}
                  className="text-purple-600 hover:text-rose-600 underline font-medium transition-colors cursor-pointer"
                >
                  Clear question
                </button>
              )}
            </div>

            <div className="text-[11px] text-purple-600 flex items-center gap-2">
              <span>{question.length} characters</span>
              <span>•</span>
              <span>SB015 Chapter 5 or any Biology topic</span>
            </div>
          </div>
        </div>

        {/* B. What do you want the AI to do? */}
        <div className="space-y-2.5">
          <label className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-900 text-white text-xs flex items-center justify-center font-bold">
              B
            </span>
            <span>What do you want the AI to do? (Select one or multiple)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {TASK_OPTIONS.map((task) => {
              const selected = isTaskSelected(task.label);
              return (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.label)}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-2.5 ${
                    selected
                      ? 'bg-purple-50 border-purple-700 shadow-2xs'
                      : 'bg-white hover:bg-purple-50/40 border-purple-200 hover:border-purple-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                    selected ? 'bg-purple-800 border-purple-900 text-white' : 'border-purple-300 bg-white'
                  }`}>
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-xs text-purple-950">
                      {task.label}
                    </div>
                    <div className="text-[11px] text-purple-700 leading-tight mt-0.5">
                      {task.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Task Input if 'Other' selected */}
          {isTaskSelected('Other') && (
            <div className="pt-1">
              <input
                type="text"
                value={customTask}
                onChange={(e) => setCustomTask(e.target.value)}
                placeholder="Type your custom request for the AI (e.g. Create a 3-question follow-up quiz)..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-purple-300 bg-white text-purple-950 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          )}
        </div>

        {/* C. Student's Working / Answer (Optional) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="prompt-working-input"
              className="text-sm font-extrabold text-purple-950 flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-purple-900 text-white text-xs flex items-center justify-center font-bold">
                C
              </span>
              <span>My Working / Answer <span className="text-xs font-normal text-purple-600">(Optional &mdash; recommended for error diagnosis)</span></span>
            </label>
          </div>

          <textarea
            id="prompt-working-input"
            rows={3}
            value={studentWorking}
            onChange={(e) => setStudentWorking(e.target.value)}
            placeholder="Example: I calculated q² = 30 / 150 = 0.20, then q = √0.20 = 0.4472 and p = 1 - 0.4472 = 0.5528..."
            className="w-full p-3.5 rounded-xl border border-purple-200 text-sm font-normal text-purple-950 placeholder-purple-400 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-mono"
          />
        </div>

        {/* D, E, F Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          
          {/* D. Preferred Language */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
              <span>D. Preferred Language</span>
            </label>
            <div className="space-y-1.5">
              {(['English', 'Bahasa Melayu', 'English + Bahasa Melayu'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setPreferredLanguage(lang)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                    preferredLanguage === lang
                      ? 'bg-purple-900 text-white border-purple-950 shadow-2xs'
                      : 'bg-purple-50/60 hover:bg-purple-100/70 text-purple-950 border-purple-200'
                  }`}
                >
                  <span>{lang}</span>
                  {preferredLanguage === lang && <Check className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* E. Explanation Level */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
              <span>E. Explanation Level</span>
            </label>
            <div className="space-y-1.5">
              {(['Simple', 'SB015 Matriculation level', 'Detailed', 'Exam-focused'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExplanationLevel(lvl)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                    explanationLevel === lvl
                      ? 'bg-purple-900 text-white border-purple-950 shadow-2xs'
                      : 'bg-purple-50/60 hover:bg-purple-100/70 text-purple-950 border-purple-200'
                  }`}
                >
                  <span>{lvl}</span>
                  {explanationLevel === lvl && <Check className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* F. Answering Preference */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
              <span>F. Answering Preference</span>
            </label>
            <div className="space-y-1.5">
              {([
                "Don't give me the answer immediately",
                'Guide me first',
                'Check my answer first',
                'Give me the complete solution'
              ] as const).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setAnsweringPreference(pref)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                    answeringPreference === pref
                      ? 'bg-purple-900 text-white border-purple-950 shadow-2xs'
                      : 'bg-purple-50/60 hover:bg-purple-100/70 text-purple-950 border-purple-200'
                  }`}
                >
                  <span className="line-clamp-1">{pref}</span>
                  {answeringPreference === pref && <Check className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleStartOver}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs sm:text-sm border border-purple-300 transition-colors flex items-center justify-center gap-2 cursor-pointer order-2 sm:order-1"
          >
            <RotateCcw className="w-4 h-4 text-purple-600" />
            <span>Start Over</span>
          </button>

          <button
            type="button"
            id="generate-prompt-btn"
            onClick={handleGeneratePrompt}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 order-1 sm:order-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Generate My Study Prompt</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. GENERATED PROMPT OUTPUT BOX                            */}
      {/* ========================================================= */}
      {generatedPrompt && (
        <section 
          id="generated-prompt-output-section"
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-purple-600 space-y-5 animate-in fade-in duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ready to Copy & Paste</span>
              </div>
              <h2 className="text-xl font-extrabold text-purple-950">
                Your Custom AI Study Prompt
              </h2>
              <p className="text-xs text-purple-700 mt-0.5">
                Optimized for {platform === 'chatgpt' ? 'ChatGPT' : platform === 'gemini' ? 'Gemini' : otherPlatformName || 'AI Platform'} • SB015 Matriculation Biology
              </p>
            </div>

            {/* Prominent Copy Button */}
            <button
              type="button"
              id="copy-generated-prompt-btn"
              onClick={handleCopyPrompt}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                isCopied
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300'
                  : 'bg-purple-900 hover:bg-purple-800 text-white'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
                  <span>✓ Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-200" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Prompt Content Preview Box */}
          <div className="relative">
            <pre className="w-full p-4 sm:p-5 rounded-xl bg-purple-950 text-purple-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap border border-purple-800 selection:bg-purple-600 selection:text-white max-h-[420px] overflow-y-auto">
              {generatedPrompt}
            </pre>
          </div>

          {/* Copy Confirmation & Helper Notice */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-900 font-semibold">
              <span className="text-base">🚀</span>
              <span>Next Step: Paste this prompt into {platform === 'chatgpt' ? 'ChatGPT' : platform === 'gemini' ? 'Gemini' : 'your AI platform'} and start studying!</span>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-950 font-bold border border-purple-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-purple-700" />
                <span>{isCopied ? 'Copied again!' : 'Copy Again'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Camera OCR Scan Modal */}
      <ScanQuestionModal
        isOpen={isCameraScanOpen}
        onClose={() => setIsCameraScanOpen(false)}
        onTextExtracted={handleExtractedQuestionText}
        existingText={question}
      />

    </div>
  );
};
