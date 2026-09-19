import React, { useState, useRef, useEffect } from 'react';
import { MathToolbox } from './MathToolbox';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  Brain, 
  CheckCircle2, 
  Check,
  RotateCcw,
  MessageSquare,
  Image as ImageIcon,
  Camera,
  Upload,
  X,
  Eye,
  AlertTriangle,
  FileText,
  ChevronRight,
  HelpCircle,
  Award,
  BookOpen,
  HelpCircle as QuestionIcon,
  Layers,
  ArrowRight,
  ShieldCheck,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import { 
  analyzeUploadedWorkingImage, 
  SAMPLE_WORKING_IMAGES, 
  StepEvaluationResult,
  SampleWorking
} from '../utils/popgenImageAnalyzer';
import { 
  TutorMode, 
  ExplanationStyle, 
  TutoringContext, 
  StructuredSocraticResponse,
  isQueryOutOfScope,
  getScopeRedirectionMessage,
  WHY_EXPLANATIONS,
  getDifferentExplanation,
  checkStudentAnswer,
  getProgressiveHint,
  getCompleteSolutionResponse,
  generateQuestionFirstGuidance
} from '../utils/popgenTutorEngine';
import { CameraCaptureModal } from './CameraCaptureModal';
import { QUESTIONS_DATA } from '../data/questionsData';
import { ADDITIONAL_QUESTIONS } from '../data/pastYearAdditionalQuestions';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  imageUrl?: string;
  imageName?: string;
  structuredResponse?: StructuredSocraticResponse;
  stepEvaluation?: StepEvaluationResult;
}

const PRESET_QUERIES = [
  "Given that 16% of a population shows recessive phenotype, calculate dominant allele frequency.",
  "Why can't I start calculation with the dominant trait?",
  "How do I calculate new allele frequencies when hamsters are removed?",
  "Why is the heterozygous frequency 2pq?",
  "What are the 5 conditions for Hardy-Weinberg equilibrium?",
  "Does genetic drift always change allele frequency in small populations?"
];

export const AiHelpView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `👋 **POPGEN AI HELP DESK**
**Your Population Genetics Study Companion**

> Stuck on a question?
> Take a photo, upload your work, or type your question.
> I will guide you step-by-step — not just give you the answer!

🧬 **Chapter 5 Focus:** Allele Frequencies ($p, q$), Genotype Frequencies ($p^2, 2pq, q^2$), Hardy-Weinberg Equilibrium, and Gene Pool Allele Counting ($2 \\times N$).

Remember our core motto: **"Think First. Calculate Second. Use AI Wisely."**`,
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState<TutorMode>('homework');
  const [stagedImage, setStagedImage] = useState<{ dataUrl: string; name: string; size: string } | null>(null);
  const [selectedQuestionTag, setSelectedQuestionTag] = useState<string>('Auto-detect');
  const [showSampleSelector, setShowSampleSelector] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<{ url: string; title: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeWhyKey, setActiveWhyKey] = useState<string>('two-pq');
  
  // Tutoring Session Memory
  const [tutorContext, setTutorContext] = useState<TutoringContext>({
    currentHintLevel: 0,
    studentAttempts: []
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const allQuestions = [...QUESTIONS_DATA, ...ADDITIONAL_QUESTIONS];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, stagedImage]);

  // Handle Clipboard Paste of Images (Ctrl+V / Cmd+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processImageFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, HEIC, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeKb = Math.round(file.size / 1024);
      setStagedImage({
        dataUrl,
        name: file.name || 'question_working.jpg',
        size: `${sizeKb} KB`
      });
      setShowSampleSelector(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSelectSample = (sample: SampleWorking) => {
    setStagedImage({
      dataUrl: sample.dataUrl,
      name: `${sample.label}.png`,
      size: '24 KB'
    });
    setSelectedQuestionTag(sample.questionNumber);
    setShowSampleSelector(false);
  };

  const handleCameraCapture = (dataUrl: string, fileName: string) => {
    setStagedImage({
      dataUrl,
      name: fileName,
      size: '120 KB'
    });
  };

  // Main Socratic Response Dispatcher
  const handleSend = (textToSend?: string, overrideMode?: TutorMode) => {
    const msgText = (textToSend !== undefined ? textToSend : inputVal).trim();
    if (!msgText && !stagedImage) return;

    const currentMode = overrideMode || activeMode;
    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: msgText || (stagedImage ? `Please analyze my uploaded question or handwritten working.` : ''),
      time: 'Just now',
      imageUrl: stagedImage?.dataUrl,
      imageName: stagedImage?.name
    };

    setMessages(prev => [...prev, userMsg]);
    const imageToAnalyze = stagedImage;
    setStagedImage(null);
    if (textToSend === undefined) setInputVal('');
    setIsTyping(true);

    // Record student attempt in context
    if (msgText) {
      setTutorContext(prev => ({
        ...prev,
        studentAttempts: [...prev.studentAttempts, msgText]
      }));
    }

    setTimeout(() => {
      // 1. Strict Scope Check
      if (msgText && isQueryOutOfScope(msgText)) {
        const redirectRes = getScopeRedirectionMessage(msgText);
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: redirectRes.text,
            structuredResponse: redirectRes,
            time: 'Just now'
          }
        ]);
        setIsTyping(false);
        return;
      }

      // 2. If student uploaded an image
      if (imageToAnalyze) {
        const isAnswerChecking = currentMode === 'check-answer' || 
          msgText.toLowerCase().includes('check') || 
          msgText.toLowerCase().includes('working') ||
          msgText.toLowerCase().includes('steps');

        if (isAnswerChecking) {
          // Analyze steps and allocate marks
          const evaluation = analyzeUploadedWorkingImage(
            imageToAnalyze.name,
            msgText,
            selectedQuestionTag !== 'Auto-detect' ? selectedQuestionTag : undefined
          );

          setTutorContext(prev => ({
            ...prev,
            activeQuestionNumber: evaluation.questionNumber,
            currentHintLevel: 1
          }));

          const botReply: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `I have thoroughly inspected your handwritten working steps for **${evaluation.questionNumber}** (${evaluation.questionTitle}).\n\nHere is your **Step-by-Step Diagnostic Evaluation**: Each correct mathematical step receives a tick mark (✓) with allocated marks. Let's see what you did well and where we can refine!`,
            time: 'Just now',
            stepEvaluation: evaluation
          };

          setMessages(prev => [...prev, botReply]);
        } else {
          // It's a homework/exam question photo
          const socraticRes = generateQuestionFirstGuidance(
            msgText || imageToAnalyze.name,
            selectedQuestionTag !== 'Auto-detect' ? selectedQuestionTag : undefined
          );

          setTutorContext(prev => ({
            ...prev,
            currentHintLevel: 1
          }));

          const botReply: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: socraticRes.text,
            structuredResponse: socraticRes,
            time: 'Just now'
          };

          setMessages(prev => [...prev, botReply]);
        }
        setIsTyping(false);
        return;
      }

      // 3. Text queries in "Check My Answer" mode
      if (currentMode === 'check-answer' || msgText.toLowerCase().startsWith('check') || msgText.toLowerCase().includes('my answer')) {
        const checkRes = checkStudentAnswer(msgText, tutorContext);
        setTutorContext(prev => ({
          ...prev,
          lastEvaluationVerdict: checkRes.evaluationVerdict
        }));

        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: checkRes.text,
            structuredResponse: checkRes,
            time: 'Just now'
          }
        ]);
        setIsTyping(false);
        return;
      }

      // 4. Socratic Question-First Guidance for homework/exam questions
      const socraticRes = generateQuestionFirstGuidance(msgText);
      setTutorContext(prev => ({
        ...prev,
        currentHintLevel: 1
      }));

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: socraticRes.text,
          structuredResponse: socraticRes,
          time: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  // Progressive Hint Handler
  const handleRequestNextHint = (explicitLevel?: number) => {
    const nextLevel = explicitLevel !== undefined 
      ? explicitLevel 
      : (tutorContext.currentHintLevel >= 4 ? 5 : tutorContext.currentHintLevel + 1);

    setTutorContext(prev => ({ ...prev, currentHintLevel: nextLevel }));
    setIsTyping(true);

    setTimeout(() => {
      const hintRes = getProgressiveHint(nextLevel, tutorContext);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-hint-${Date.now()}`,
          sender: 'bot',
          text: hintRes.text,
          structuredResponse: hintRes,
          time: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 500);
  };

  // "Explain it Differently" Style Switcher
  const handleRequestDifferentStyle = (style: ExplanationStyle) => {
    setIsTyping(true);
    setTimeout(() => {
      const styleContent = getDifferentExplanation(tutorContext.activeQuestionNumber || 'two-pq', style);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-style-${Date.now()}`,
          sender: 'bot',
          text: styleContent,
          time: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 400);
  };

  // Show "WHY?" Explanation
  const handleShowWhy = (whyKey: string) => {
    const whyObj = WHY_EXPLANATIONS[whyKey];
    if (!whyObj) return;

    setShowWhyModal(false);
    setIsTyping(true);

    setTimeout(() => {
      const whyText = `❓ **${whyObj.question}**

### 🧬 The Biological Reason
${whyObj.coreReason}

${whyObj.biologicalExplanation}

---
⚠️ **Common Student Misconception:**
${whyObj.commonMisconception}`;

      setMessages(prev => [
        ...prev,
        {
          id: `bot-why-${Date.now()}`,
          sender: 'bot',
          text: whyText,
          time: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div 
      className="space-y-6 pb-12"
      onPaste={handlePaste}
    >
      {/* Primary Header & Welcome Hero */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-900 text-xs font-extrabold">
            <Bot className="w-4 h-4 text-purple-700" />
            <span>Chapter 5: Population Genetics Assistive Tutor</span>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWhyModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-purple-700" />
              <span>Ask "WHY?"</span>
            </button>
            <button
              onClick={() => setShowSampleSelector(!showSampleSelector)}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-purple-700" />
              <span>Sample Student Scans</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950 flex items-center gap-2">
            <span>👋 POPGEN AI HELP DESK</span>
          </h2>
          <p className="text-sm font-semibold text-purple-800 mt-1">
            Your Dedicated Population Genetics Study Companion
          </p>
        </div>

        {/* Guided Tutoring Motto Banner */}
        <div className="p-3.5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-purple-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-inner">
          <div className="space-y-0.5">
            <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Core Assistive Principle: "DON'T JUST GIVE THE ANSWER. LEARN HOW TO FIND IT."</span>
            </div>
            <p className="text-purple-200 text-[11px] leading-relaxed">
              I guide you with Socratic questions, progressive hints, and step-by-step diagnostic checks.
            </p>
          </div>
          <div className="shrink-0 font-mono text-[11px] bg-purple-800/80 px-2.5 py-1 rounded-lg border border-purple-600 text-white">
            READ → IDENTIFY → THINK → CALCULATE → INTERPRET
          </div>
        </div>

        {/* Tutoring Mode Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-purple-100 text-xs">
          <span className="font-bold text-purple-900 mr-1">Tutoring Mode:</span>
          
          <button
            onClick={() => setActiveMode('homework')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'homework'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Homework Help</span>
          </button>

          <button
            onClick={() => setActiveMode('exam')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'exam'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Exam Question Mode</span>
          </button>

          <button
            onClick={() => setActiveMode('check-answer')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'check-answer'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Check My Answer</span>
          </button>

          <button
            onClick={() => setActiveMode('concept')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'concept'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Concept Dialogue</span>
          </button>
        </div>
      </div>

      {/* Sample Handwritten Working Selector Drawer */}
      {showSampleSelector && (
        <div className="bg-purple-900 text-white p-5 rounded-2xl shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-purple-700/60 pb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-300" />
              <h3 className="font-bold text-sm text-purple-100">
                Sample Student Calculation Scans
              </h3>
            </div>
            <button
              onClick={() => setShowSampleSelector(false)}
              className="p-1 rounded-lg hover:bg-purple-800 text-purple-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-purple-200">
            Select one of these handwritten calculation scans to test how AI checks your steps and awards tick marks:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_WORKING_IMAGES.map((sample) => (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="p-3 bg-purple-800/80 hover:bg-purple-700/90 rounded-xl border border-purple-600/50 cursor-pointer transition-all space-y-2 group hover:scale-[1.02]"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden border border-purple-500/40 bg-white">
                  <img 
                    src={sample.dataUrl} 
                    alt={sample.label}
                    className="w-full h-full object-cover group-hover:opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-purple-950/80 text-white text-[10px] font-bold">
                    {sample.questionNumber}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-xs text-purple-100 group-hover:text-white">
                    {sample.label}
                  </div>
                  <p className="text-[11px] text-purple-300 line-clamp-2 leading-tight">
                    {sample.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full py-1 text-center bg-purple-950/60 hover:bg-purple-950 text-purple-200 text-xs font-bold rounded-lg"
                >
                  Load this Sample →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Layout: Left 2 Columns Chat, Right 1 Column Toolbox & Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-purple-200 shadow-xs flex flex-col h-[740px] overflow-hidden">
          
          {/* Top Chat Bar: Primary Input Option Buttons (Photo, Upload, Type, Check, Hint, Why) */}
          <div className="p-3 bg-purple-50/90 border-b border-purple-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>Input Options:</span>
              </span>

              {/* 📷 Take Photo */}
              <button
                onClick={() => setShowCameraModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 font-bold border border-purple-300 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Take photo of homework question or written working"
              >
                <Camera className="w-3.5 h-3.5 text-purple-700" />
                <span>Take Photo</span>
              </button>

              {/* 🖼 Upload Image */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 font-bold border border-purple-300 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Upload screenshot or worksheet image"
              >
                <Upload className="w-3.5 h-3.5 text-purple-700" />
                <span>Upload Image</span>
              </button>

              {/* ✅ Check My Answer */}
              <button
                onClick={() => {
                  setActiveMode('check-answer');
                  inputRef.current?.focus();
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold border flex items-center gap-1 shadow-2xs transition-colors cursor-pointer ${
                  activeMode === 'check-answer'
                    ? 'bg-purple-800 text-white border-purple-900'
                    : 'bg-white hover:bg-purple-100 text-purple-900 border-purple-300'
                }`}
                title="Evaluate your working or answer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Check My Answer</span>
              </button>
            </div>

            {/* Hint & Why quick triggers */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleRequestNextHint()}
                className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold border border-amber-300 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Reveal progressive hint"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>I Need a Hint</span>
              </button>

              <button
                onClick={() => setShowWhyModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-extrabold border border-indigo-300 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Why is this formula or rule true?"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>WHY?</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div 
            className={`flex-1 p-4 overflow-y-auto space-y-5 scrollbar-thin bg-purple-50/30 transition-colors ${
              isDragging ? 'bg-purple-100/60 border-2 border-dashed border-purple-400' : ''
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-purple-900 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs mt-1">
                    🧬
                  </div>
                )}

                <div
                  className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs space-y-3 ${
                    m.sender === 'user'
                      ? 'bg-purple-700 text-white rounded-tr-none font-medium'
                      : 'bg-white text-purple-950 border border-purple-200 rounded-tl-none font-normal'
                  }`}
                >
                  {/* User Uploaded Image Preview in Chat Bubble */}
                  {m.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/20 bg-purple-950/20 p-1 space-y-1">
                      <div 
                        className="relative group cursor-pointer" 
                        onClick={() => setPreviewModalImage({ url: m.imageUrl!, title: m.imageName || 'Uploaded Working' })}
                      >
                        <img 
                          src={m.imageUrl} 
                          alt="Uploaded question or steps" 
                          className="w-full max-h-56 object-contain rounded-lg bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg text-white font-bold text-xs gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>Click to Enlarge</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-purple-100 px-1 font-mono">
                        <span>📷 {m.imageName || 'question.jpg'}</span>
                        <span className="text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded">PopGen Image Input</span>
                      </div>
                    </div>
                  )}

                  {/* Message Text with Structured Styling */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {m.text}
                  </div>

                  {/* Suggested Action Chips (if provided) */}
                  {m.structuredResponse?.suggestedActions && m.structuredResponse.suggestedActions.length > 0 && (
                    <div className="pt-2 border-t border-purple-100 flex flex-wrap gap-1.5">
                      {m.structuredResponse.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(act.actionText)}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-[11px] border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3 text-purple-600" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* "Explain It Differently" Interactive Selector */}
                  {m.sender === 'bot' && !m.stepEvaluation && (
                    <div className="pt-2 border-t border-purple-100 flex flex-wrap items-center gap-1.5 text-[11px] text-purple-800">
                      <span className="font-bold text-purple-950 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-purple-700" />
                        <span>Explain differently:</span>
                      </span>
                      <button
                        onClick={() => handleRequestDifferentStyle('simple')}
                        className="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-semibold cursor-pointer"
                      >
                        🧒 Simple
                      </button>
                      <button
                        onClick={() => handleRequestDifferentStyle('analogy')}
                        className="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-semibold cursor-pointer"
                      >
                        🧠 Analogy
                      </button>
                      <button
                        onClick={() => handleRequestDifferentStyle('visual')}
                        className="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-semibold cursor-pointer"
                      >
                        📊 Visual
                      </button>
                      <button
                        onClick={() => handleRequestDifferentStyle('step-by-step')}
                        className="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-semibold cursor-pointer"
                      >
                        🔢 Steps
                      </button>
                      <button
                        onClick={() => handleRequestDifferentStyle('exam')}
                        className="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-semibold cursor-pointer"
                      >
                        📝 Exam Rubric
                      </button>
                      <button
                        onClick={() => handleRequestDifferentStyle('biological')}
                        className="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-semibold cursor-pointer"
                      >
                        🔬 Biology
                      </button>
                    </div>
                  )}

                  {/* Rich Step-by-Step Diagnostic Review Card (for Check My Steps) */}
                  {m.stepEvaluation && (
                    <div className="mt-3 p-4 bg-purple-50/80 rounded-xl border-2 border-purple-300 space-y-4 text-purple-950 not-prose">
                      
                      {/* Evaluation Header Banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200 pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-900 text-white font-extrabold text-xs">
                              {m.stepEvaluation.questionNumber}
                            </span>
                            <span className="font-extrabold text-xs sm:text-sm text-purple-950">
                              {m.stepEvaluation.questionTitle}
                            </span>
                          </div>
                          <div className="text-[11px] text-purple-700 font-semibold">
                            Category: <span className="uppercase">{m.stepEvaluation.scenarioType.replace('-', ' ')}</span>
                          </div>
                        </div>

                        {/* Score Badge */}
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-2xs ${
                            m.stepEvaluation.verdict === 'all-correct'
                              ? 'bg-emerald-600 text-white'
                              : m.stepEvaluation.verdict === 'minor-error'
                              ? 'bg-amber-600 text-white'
                              : 'bg-rose-700 text-white'
                          }`}>
                            <Award className="w-4 h-4" />
                            <span>
                              {m.stepEvaluation.overallScore.obtained} / {m.stepEvaluation.overallScore.total} Marks Awarded
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Summary Diagnostic Comment */}
                      <div className={`p-3 rounded-xl text-xs leading-relaxed font-medium border ${
                        m.stepEvaluation.verdict === 'all-correct'
                          ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                          : m.stepEvaluation.verdict === 'minor-error'
                          ? 'bg-amber-100/80 border-amber-300 text-amber-950'
                          : 'bg-rose-100/80 border-rose-300 text-rose-950'
                      }`}>
                        {m.stepEvaluation.summaryComment}
                      </div>

                      {/* Step-by-Step Ticks & Detailed Evaluation */}
                      <div className="space-y-3">
                        <div className="font-bold text-xs text-purple-900 flex items-center justify-between">
                          <span>Verified Calculation Steps:</span>
                          <span className="text-[11px] text-purple-700 font-normal">
                            (Ticks ✓ awarded for correct mathematical steps)
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {m.stepEvaluation.steps.map((st) => (
                            <div
                              key={st.stepNumber}
                              className={`p-3 rounded-xl border-2 transition-all space-y-2 ${
                                st.isCorrect
                                  ? 'bg-emerald-50/70 border-emerald-400'
                                  : 'bg-rose-50/70 border-rose-300'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <div className="flex items-center gap-2 font-bold text-xs">
                                  {st.tickAwarded ? (
                                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                                      ✓
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                                      ✗
                                    </div>
                                  )}
                                  <span className="text-purple-950">
                                    Step {st.stepNumber}: {st.title}
                                  </span>
                                </div>
                                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                                  st.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                                }`}>
                                  {st.tickAwarded ? '✓ Correct Step' : '✗ Needs Revision'} [{st.marksAwarded}/{st.maxMarks} mark]
                                </span>
                              </div>

                              {/* Student vs Expected Working */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                                <div className="p-2 bg-white rounded-lg border border-purple-100 space-y-0.5">
                                  <div className="text-[10px] text-purple-700 font-bold uppercase tracking-wider font-sans">
                                    Your Working in Image:
                                  </div>
                                  <div className="text-purple-950 font-bold break-words">
                                    {st.studentWorking}
                                  </div>
                                </div>
                                <div className="p-2 bg-white rounded-lg border border-purple-100 space-y-0.5">
                                  <div className="text-[10px] text-purple-700 font-bold uppercase tracking-wider font-sans">
                                    Official Matriculation Rubric:
                                  </div>
                                  <div className="text-purple-900 break-words font-medium">
                                    {st.expectedWorking}
                                  </div>
                                </div>
                              </div>

                              {/* Diagnostic Remark */}
                              <div className="text-xs text-purple-900 font-medium pl-1">
                                {st.diagnosticRemark}
                              </div>

                              {st.examTip && (
                                <div className="text-[11px] text-amber-900 bg-amber-100/70 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5 font-medium">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                                  <span>{st.examTip}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Socratic Follow-up Prompt */}
                      <div className="p-3 bg-purple-900 text-white rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-purple-200 text-xs font-bold">
                          <Brain className="w-4 h-4 text-purple-300" />
                          <span>AI Tutor's Socratic Follow-up:</span>
                        </div>
                        <p className="text-xs leading-relaxed text-purple-100">
                          {m.stepEvaluation.socraticFollowUpQuestion}
                        </p>
                        
                        {/* Quick Action Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <button
                            onClick={() => handleSend("Explain Step 3 in detail.")}
                            className="px-2.5 py-1 rounded-md bg-purple-800 hover:bg-purple-700 text-purple-100 text-xs font-semibold border border-purple-600 transition-colors cursor-pointer"
                          >
                            Explain Step 3 in detail →
                          </button>
                          <button
                            onClick={() => handleSend("Show me the correct formula for this step.")}
                            className="px-2.5 py-1 rounded-md bg-purple-800 hover:bg-purple-700 text-purple-100 text-xs font-semibold border border-purple-600 transition-colors cursor-pointer"
                          >
                            Show formula template →
                          </button>
                          <button
                            onClick={() => handleSend("How should I round my final answer for this population size?")}
                            className="px-2.5 py-1 rounded-md bg-purple-800 hover:bg-purple-700 text-purple-100 text-xs font-semibold border border-purple-600 transition-colors cursor-pointer"
                          >
                            Decimal place rules →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-purple-600 italic">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]"></span>
                <span>GenAIde PopGen Tutor is analyzing the question and formulating Socratic guidance...</span>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Staged Image Confirmation Banner */}
          {stagedImage && (
            <div className="p-3 bg-purple-100 border-t-2 border-purple-300 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div 
                  className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-purple-400 bg-white shrink-0 cursor-pointer group"
                  onClick={() => setPreviewModalImage({ url: stagedImage.dataUrl, title: stagedImage.name })}
                >
                  <img 
                    src={stagedImage.dataUrl} 
                    alt="Staged" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-0.5 text-xs text-purple-950 flex-1">
                  <div className="font-extrabold truncate max-w-xs">{stagedImage.name}</div>
                  <div className="text-[11px] text-purple-700">{stagedImage.size} • Ready for AI Socratic Analysis</div>
                  {/* Target Question Tag Selector */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold text-purple-900">Target Question:</span>
                    <select
                      value={selectedQuestionTag}
                      onChange={(e) => setSelectedQuestionTag(e.target.value)}
                      className="px-2 py-0.5 rounded bg-white border border-purple-300 text-[11px] font-bold text-purple-950 focus:outline-hidden cursor-pointer"
                    >
                      <option value="Auto-detect">✨ Auto-detect Question</option>
                      {allQuestions.map(q => (
                        <option key={q.id} value={q.number}>
                          {q.number}: {q.title.slice(0, 30)}...
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setStagedImage(null)}
                  className="p-1.5 rounded-lg hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                  <span>Remove</span>
                </button>
                <button
                  onClick={() => setShowCameraModal(true)}
                  className="p-1.5 rounded-lg hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Retake photo"
                >
                  <Camera className="w-4 h-4" />
                  <span>Retake</span>
                </button>
                <button
                  onClick={() => handleSend()}
                  className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Ask AI Tutor</span>
                </button>
              </div>
            </div>
          )}

          {/* Preset Prompts Row */}
          <div className="p-2.5 bg-purple-50 border-t border-purple-200 flex gap-1.5 overflow-x-auto scrollbar-none">
            {PRESET_QUERIES.map((query, i) => (
              <button
                key={i}
                onClick={() => handleSend(query)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-purple-200 text-purple-900 text-[11px] font-semibold border border-purple-200 shadow-2xs transition-colors cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-purple-200 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              className="hidden"
            />
            
            {/* Quick Camera Snapshot Button */}
            <button
              onClick={() => setShowCameraModal(true)}
              className="p-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              title="Snap photo with camera"
            >
              <Camera className="w-4 h-4 text-purple-700" />
            </button>

            {/* Quick Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              title="Upload question screenshot or photo (Ctrl+V supported)"
            >
              <Upload className="w-4 h-4 text-purple-700" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={
                activeMode === 'check-answer'
                  ? "Type your calculated answer (e.g. q²=0.16, q=0.4, 2pq=0.48)..."
                  : activeMode === 'exam'
                  ? "Enter an exam question (e.g. Calculate carrier frequency in 5000 individuals)..."
                  : stagedImage
                  ? "Add an optional question about your photo (or press Send)..."
                  : "Type your PopGen question or paste image (Ctrl+V)..."
              }
              className="flex-1 px-3 py-2 rounded-xl border border-purple-300 font-mono text-xs sm:text-sm text-purple-950 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
            
            <button
              onClick={() => handleSend()}
              className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Tutor</span>
            </button>
          </div>
        </div>

        {/* Right 1 Column: Progressive Hint Ladder + MathToolbox + PopGen Scope Guard */}
        <div className="space-y-4">
          
          {/* Progressive Hint Progression Stepper */}
          <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <div className="font-extrabold text-sm text-purple-950 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Progressive Hint Ladder</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                Level {tutorContext.currentHintLevel} / 4
              </span>
            </div>

            <p className="text-xs text-purple-800 leading-relaxed">
              Never get stuck! Unlock hints one level at a time so you learn the mathematical reasoning:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleRequestNextHint(1)}
                className="w-full text-left p-2.5 rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-purple-950 group-hover:text-purple-700">
                    Hint 1 — THINK
                  </div>
                  <div className="text-[11px] text-purple-700">Guiding conceptual prompt</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-700" />
              </button>

              <button
                onClick={() => handleRequestNextHint(2)}
                className="w-full text-left p-2.5 rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-purple-950 group-hover:text-purple-700">
                    Hint 2 — REMEMBER
                  </div>
                  <div className="text-[11px] text-purple-700">Formula &amp; concept reminder</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-700" />
              </button>

              <button
                onClick={() => handleRequestNextHint(3)}
                className="w-full text-left p-2.5 rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-purple-950 group-hover:text-purple-700">
                    Hint 3 — NEXT STEP
                  </div>
                  <div className="text-[11px] text-purple-700">Specific calculation operation</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-700" />
              </button>

              <button
                onClick={() => handleRequestNextHint(4)}
                className="w-full text-left p-2.5 rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-purple-950 group-hover:text-purple-700">
                    Hint 4 — SHOW REASONING
                  </div>
                  <div className="text-[11px] text-purple-700">Complete step-by-step logic</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-700" />
              </button>
            </div>

            {/* Complete Solution Reveal Button */}
            <button
              onClick={() => handleRequestNextHint(5)}
              className="w-full py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Reveal Complete Solution</span>
            </button>
          </div>

          {/* MathToolbox for PopGen Symbol Insertion */}
          <MathToolbox lastActiveInputRef={inputRef} />

          {/* Chapter 5 Topic Scope & Matriculation Checklist */}
          <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs space-y-2.5 text-xs text-purple-950">
            <div className="font-extrabold text-purple-900 border-b border-purple-100 pb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Chapter 5 Syllabus Scope</span>
              </span>
              <span className="text-[10px] font-bold text-purple-600 uppercase">Matriculation</span>
            </div>

            <p className="text-[11px] text-purple-800 leading-relaxed">
              This AI tutor specializes strictly in Malaysian Matriculation Chapter 5:
            </p>

            <ul className="space-y-1.5 text-[11px] text-purple-900">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Allele vs Genotype:</strong> $p, q$ vs $p^2, 2pq, q^2$</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Hardy-Weinberg:</strong> $p+q=1$ &amp; $p^2+2pq+q^2=1$</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>5 Equilibrium Conditions:</strong> Large pop, Random mating, No mutation, No migration, No selection</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Forces Changing Frequencies:</strong> Drift, Selection, Gene Flow</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Gene Pool Allele Counting:</strong> $2 \\times N$ when H-W broken</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive "WHY?" Modal Drawer */}
      {showWhyModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowWhyModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-xl w-full p-5 space-y-4 overflow-hidden shadow-2xl border-2 border-purple-300 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-purple-200 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-700" />
                <h3 className="font-black text-base text-purple-950">
                  Ask "WHY?": Foundational PopGen Logic
                </h3>
              </div>
              <button
                onClick={() => setShowWhyModal(false)}
                className="p-1 rounded-lg hover:bg-purple-100 text-purple-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-purple-800">
              Select a core principle below to inspect why the mathematics and biology work this way:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-60 pr-1">
              {Object.entries(WHY_EXPLANATIONS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => handleShowWhy(key)}
                  className="p-3 text-left rounded-xl border border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-xs space-y-1 group cursor-pointer"
                >
                  <div className="font-bold text-purple-950 group-hover:text-purple-800">
                    {item.question}
                  </div>
                  <p className="text-[11px] text-purple-600 line-clamp-2">
                    {item.coreReason}
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-purple-200 flex justify-end">
              <button
                onClick={() => setShowWhyModal(false)}
                className="px-4 py-1.5 rounded-xl bg-purple-900 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
      />

      {/* Image Preview Modal */}
      {previewModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPreviewModalImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-extrabold text-sm text-purple-950 truncate">
                {previewModalImage.title}
              </h4>
              <button 
                onClick={() => setPreviewModalImage(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl bg-gray-50 p-2 flex items-center justify-center">
              <img 
                src={previewModalImage.url} 
                alt="Full preview" 
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-right">
              <button
                onClick={() => setPreviewModalImage(null)}
                className="px-4 py-1.5 rounded-lg bg-purple-900 text-white font-bold text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
