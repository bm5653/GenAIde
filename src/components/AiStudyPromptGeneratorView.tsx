import React, { useState } from 'react';
import { CuteRobotIcon } from './CuteRobotIcon';
import { ScanQuestionModal, ScannedImageResult } from './ScanQuestionModal';
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
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus,
  Edit3,
  Paperclip,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export type AIPlatform = 'chatgpt' | 'gemini' | 'other';

export interface UploadedQuestionImage {
  id: string;
  dataUrl: string;
  name: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  qualityWarning?: string | null;
}

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

const IMAGE_CONTENT_TYPES = [
  { id: 'question', label: '📄 Question Paper / Exam Problem', promptDesc: 'a Population Genetics exam question' },
  { id: 'working', label: '✍️ My Handwritten Working', promptDesc: 'my handwritten calculation and working' },
  { id: 'answer', label: '📝 My Proposed Answer', promptDesc: 'my proposed answer and final calculation' },
  { id: 'diagram', label: '📊 Genetic Diagram / Punnett Square / Table', promptDesc: 'a question containing a genetic diagram, table, or graph' },
  { id: 'notes', label: '📓 Revision Notes / Summary', promptDesc: 'my Population Genetics study notes' },
  { id: 'multiple', label: '📑 Question + Working Combined', promptDesc: 'the Biology question along with my handwritten working' }
];

export const AiStudyPromptGeneratorView: React.FC = () => {
  // Platform Selection
  const [platform, setPlatform] = useState<AIPlatform>('chatgpt');
  const [otherPlatformName, setOtherPlatformName] = useState('');

  // Question Input Method: 'text' | 'image'
  const [inputMethod, setInputMethod] = useState<'text' | 'image'>('text');

  // Text Inputs
  const [question, setQuestion] = useState('');
  const [studentWorking, setStudentWorking] = useState('');

  // Image Inputs & Management
  const [uploadedImages, setUploadedImages] = useState<UploadedQuestionImage[]>([]);
  const [imageUsageMode, setImageUsageMode] = useState<'original' | 'ocr'>('original');
  const [imageContentType, setImageContentType] = useState<string>('question');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  // OCR state
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<{
    text: string;
    confidence?: 'high' | 'medium' | 'low';
    hasDiagram?: boolean;
    warningNote?: string | null;
  } | null>(null);

  // Learning Tasks & Preferences
  const [selectedTasks, setSelectedTasks] = useState<string[]>([
    'Guide me step by step',
    'Find my mistake'
  ]);
  const [customTask, setCustomTask] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Bahasa Melayu' | 'English + Bahasa Melayu'>('English');
  const [explanationLevel, setExplanationLevel] = useState<'Simple' | 'SB015 Matriculation level' | 'Detailed' | 'Exam-focused'>('SB015 Matriculation level');
  const [answeringPreference, setAnsweringPreference] = useState<
    "Don't give me the answer immediately" | 'Guide me first' | 'Check my answer first' | 'Give me the complete solution'
  >("Don't give me the answer immediately");

  // Output & UI State
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Handle new image captured or uploaded via modal
  const handleImageCapturedOrUploaded = (result: ScannedImageResult, mode: 'ocr' | 'original') => {
    const newImg: UploadedQuestionImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      dataUrl: result.dataUrl,
      name: result.name,
      sizeBytes: result.sizeBytes,
      width: result.width,
      height: result.height,
      qualityWarning: result.qualityIssue
    };

    setUploadedImages(prev => [...prev, newImg]);
    setInputMethod('image');
    setImageUsageMode(mode);

    if (mode === 'ocr') {
      performOcrOnImage(result.dataUrl);
    }
  };

  // Direct file input upload from the inline dropzone
  const handleInlineFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const width = img.naturalWidth || 800;
          const height = img.naturalHeight || 600;
          let warning: string | null = null;
          if (width < 350 || height < 350) {
            warning = 'Image resolution is low. Small text and superscripts (q², p²) might be hard to read.';
          }
          const newImg: UploadedQuestionImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            dataUrl,
            name: file.name || 'uploaded_photo.jpg',
            sizeBytes: file.size,
            width,
            height,
            qualityWarning: warning
          };
          setUploadedImages(prev => [...prev, newImg]);
          setInputMethod('image');
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });

    // Reset input value
    e.target.value = '';
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    if (uploadedImages.length <= 1) {
      setOcrResult(null);
      setOcrError(null);
    }
  };

  // Trigger OCR on an uploaded image
  const performOcrOnImage = async (dataUrl?: string) => {
    const targetImg = dataUrl || uploadedImages[0]?.dataUrl;
    if (!targetImg) return;

    setIsOcrLoading(true);
    setOcrError(null);

    try {
      const res = await fetch('/api/scan-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: targetImg })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to scan question from image');
      }

      if (!data.extractedText || data.extractedText.trim().length === 0) {
        setOcrError('No readable question text was detected. Recommend using the Original Image option directly with your AI platform.');
        setOcrResult(null);
      } else {
        setOcrResult({
          text: data.extractedText.trim(),
          confidence: data.confidence || 'high',
          hasDiagram: Boolean(data.hasDiagram),
          warningNote: data.warningNote || null
        });
        // Also populate the question text box
        setQuestion(data.extractedText.trim());
      }
    } catch (err: any) {
      console.error('Scan text error:', err);
      setOcrError(err.message || 'Error scanning image. You can use the original image directly with your AI platform.');
      setOcrResult(null);
    } finally {
      setIsOcrLoading(false);
    }
  };

  // Toggle Task Selection
  const handleToggleTask = (taskLabel: string) => {
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
  };

  // Sample Question Loader
  const handleLoadSampleQuestion = () => {
    setInputMethod('text');
    setQuestion(
      'In a population of 200 individuals, 72 are homozygous recessive for the character fragmented fins. However, 50 individuals from this population died due to a fatal disease; 30 of the survivors are homozygous recessive. How many individuals are homozygous dominant in the next generation if the population size increases to 1000? Calculate up to 4 decimal places.'
    );
    setStudentWorking(
      'Survivors = 200 - 50 = 150 individuals\nq² = 30 / 150 = 0.20\nq = √0.20 = 0.4472\np = 1 - 0.4472 = 0.5528\np² = (0.5528)² = 0.3056\nDominant count in next gen = 0.3056 × 1000 = 305.6 ≈ 306 individuals'
    );
  };

  // Reset / Start Over
  const handleStartOver = () => {
    setQuestion('');
    setStudentWorking('');
    setUploadedImages([]);
    setOcrResult(null);
    setOcrError(null);
    setInputMethod('text');
    setImageUsageMode('original');
    setSelectedTasks(['Guide me step by step', 'Find my mistake']);
    setCustomTask('');
    setPreferredLanguage('English');
    setExplanationLevel('SB015 Matriculation level');
    setAnsweringPreference("Don't give me the answer immediately");
    setGeneratedPrompt('');
    setIsCopied(false);
  };

  // Master Prompt Generator Logic
  const handleGeneratePrompt = () => {
    // Platform Target Name
    let targetPlatformText = 'ChatGPT';
    if (platform === 'gemini') targetPlatformText = 'Gemini';
    else if (platform === 'other') targetPlatformText = otherPlatformName.trim() || 'AI study assistant';

    const isUsingOriginalImage = inputMethod === 'image' && imageUsageMode === 'original' && uploadedImages.length > 0;
    const selectedContentInfo = IMAGE_CONTENT_TYPES.find(c => c.id === imageContentType);

    const lines: string[] = [];

    // System Identity Header
    lines.push(`You are my Biology study assistant using ${targetPlatformText}.`);
    lines.push('I am a student in the Malaysian Matriculation College Biology Programme (SB015), studying Chapter 5: Population Genetics.');
    lines.push('');

    // Question & Image Context
    if (isUsingOriginalImage) {
      if (uploadedImages.length === 1) {
        lines.push(`I have attached an original image containing ${selectedContentInfo?.promptDesc || 'my Biology question and/or working'}.`);
      } else {
        lines.push(`I have attached ${uploadedImages.length} original images that belong to the same Biology question (${selectedContentInfo?.promptDesc || 'question and working'}). Please analyse them together and preserve the sequence.`);
      }
      lines.push('');
      lines.push('Please analyse the original image(s) carefully.');
      lines.push('• Do not guess unclear text, numbers, symbols, superscripts (p², q², 2pq), diagrams, tables, or handwritten calculations.');
      lines.push('• If any part of the image is unclear, blurry, or unreadable, tell me exactly what cannot be read and ask me to clarify it before proceeding.');
      lines.push('• First identify what the question is asking and which biological information is relevant.');
      lines.push('');
    } else if (question.trim()) {
      lines.push('Help me analyse and work through the following Biology question:');
      lines.push('');
      lines.push('----------------------------------------');
      lines.push('### QUESTION:');
      lines.push(question.trim());
      lines.push('----------------------------------------');
      lines.push('');
    } else {
      lines.push('Help me study and master SB015 Chapter 5: Population Genetics concepts, problem-solving calculations, and exam questions.');
      lines.push('');
      lines.push('----------------------------------------');
      lines.push('### STUDY TOPIC / QUESTION:');
      lines.push('[I will provide my question or specific study topic in our conversation. Please prepare to assist me according to the guidelines below.]');
      lines.push('----------------------------------------');
      lines.push('');
    }

    // Student Working
    if (studentWorking.trim()) {
      lines.push('### MY WORKING / PROPOSED ANSWER:');
      lines.push(studentWorking.trim());
      lines.push('----------------------------------------');
      lines.push('');
    }

    // What I want the AI to do
    lines.push('### WHAT I WANT YOU TO DO:');
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

    // Pedagogical & Biological Guidelines
    lines.push('### PEDAGOGICAL & BIOLOGICAL GUIDELINES:');
    lines.push('1. First determine what the question is asking and what biological concept is required.');
    lines.push('2. Do not automatically assume every question follows a single rigid formula sequence.');
    lines.push('3. If the question involves Hardy-Weinberg equilibrium, use appropriate equations (p + q = 1 and p² + 2pq + q² = 1) and clearly explain why they apply.');
    lines.push('4. If the question contains changes in population size, deaths, survivors, migration, or generations, carefully identify which population and denominator are relevant before calculating allele or genotype frequencies.');
    
    if (studentWorking.trim() || imageContentType === 'working' || imageContentType === 'multiple') {
      lines.push('5. Check my working carefully step by step. Check:');
      lines.push('   a) Interpretation of the question');
      lines.push('   b) Relevant population or generation denominator');
      lines.push('   c) Biological concepts and formulas applied');
      lines.push('   d) Mathematical substitution and calculations');
      lines.push('   e) Decimal precision and rounding (at least 4 decimal places during intermediate steps)');
      lines.push('   f) Whether my final answer directly answers what was asked.');
      lines.push('6. If my working contains a mistake, identify the first meaningful error and explain why it is incorrect without giving away the entire remainder of the solution.');
      lines.push('7. If my answer is correct, confirm it and highlight why the steps are mathematically and biologically sound.');
    } else {
      lines.push('5. Help me verify which information corresponds to alleles (p, q), genotypes (p², 2pq, q²), or total counts.');
    }

    // Answering preference
    if (answeringPreference === "Don't give me the answer immediately") {
      lines.push("8. Critical: Do not reveal the final answer immediately. Ask guiding questions or give me the first step so I can think and calculate myself.");
    } else if (answeringPreference === 'Guide me first') {
      lines.push("8. Guide me through one step at a time. Wait for my response before moving on to the next step.");
    } else if (answeringPreference === 'Check my answer first') {
      lines.push("8. Focus primarily on checking my working and diagnosing any calculation errors before giving further steps.");
    } else if (answeringPreference === 'Give me the complete solution') {
      lines.push("8. Provide a complete, structured worked solution: Given → Formula → Step-by-step Substitution → Final Calculation with Units/Labels.");
    }

    lines.push('9. Maintain sufficient decimal precision (at least 4 decimal places during intermediate steps) and round according to the question requirements.');
    
    // Level & Language
    lines.push(`10. Explanation Level: Explain at **${explanationLevel}**.`);
    if (preferredLanguage === 'Bahasa Melayu') {
      lines.push('11. Language: Please explain in **Bahasa Melayu** while keeping standard scientific terms (Hardy-Weinberg, allele frequency, genotype frequency, p, q, etc.) recognizable.');
    } else if (preferredLanguage === 'English + Bahasa Melayu') {
      lines.push('11. Language: Respond in **Bilingual (English + Bahasa Melayu)** for clarity where needed.');
    } else {
      lines.push('11. Language: Respond in **English** unless I specifically ask in Bahasa Melayu in a follow-up.');
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

  const isUsingOriginalImage = inputMethod === 'image' && imageUsageMode === 'original' && uploadedImages.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* ========================================================= */}
      {/* 1. HEADER SECTION                                         */}
      {/* ========================================================= */}
      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-purple-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/25 border border-purple-300/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Crafting Engine for External AI Platforms</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <CuteRobotIcon className="w-8 h-8 text-amber-400 shrink-0" />
              <span>GenAIde Study Prompt</span>
            </h1>

            <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed">
              Create an expert, syllabus-aligned prompt for <span className="text-amber-300 font-bold">ChatGPT</span>, <span className="text-amber-300 font-bold">Gemini</span>, or any AI platform. Type your question, scan via camera, or attach your original image.
            </p>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. STEP 1: CHOOSE TARGET AI PLATFORM                      */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-purple-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-purple-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-900 text-white text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>Choose Your Preferred AI Platform</span>
          </h2>
          <span className="text-xs text-purple-700 font-medium">Step 1 of 4</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* ChatGPT */}
          <button
            type="button"
            onClick={() => setPlatform('chatgpt')}
            className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all text-left flex items-start justify-between cursor-pointer ${
              platform === 'chatgpt'
                ? 'bg-purple-900 text-white border-purple-950 shadow-md ring-2 ring-purple-400/40'
                : 'bg-purple-50/50 hover:bg-purple-100/60 text-purple-950 border-purple-200'
            }`}
          >
            <div className="space-y-1">
              <div className="font-black text-sm flex items-center gap-1.5">
                <span>🤖 ChatGPT</span>
              </div>
              <p className={`text-xs ${platform === 'chatgpt' ? 'text-purple-200' : 'text-purple-700'}`}>
                OpenAI ChatGPT (GPT-4o, GPT-4)
              </p>
            </div>
            {platform === 'chatgpt' && <Check className="w-4 h-4 text-amber-300 mt-0.5" />}
          </button>

          {/* Gemini */}
          <button
            type="button"
            onClick={() => setPlatform('gemini')}
            className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all text-left flex items-start justify-between cursor-pointer ${
              platform === 'gemini'
                ? 'bg-purple-900 text-white border-purple-950 shadow-md ring-2 ring-purple-400/40'
                : 'bg-purple-50/50 hover:bg-purple-100/60 text-purple-950 border-purple-200'
            }`}
          >
            <div className="space-y-1">
              <div className="font-black text-sm flex items-center gap-1.5">
                <span>✨ Google Gemini</span>
              </div>
              <p className={`text-xs ${platform === 'gemini' ? 'text-purple-200' : 'text-purple-700'}`}>
                Gemini Flash &amp; Pro
              </p>
            </div>
            {platform === 'gemini' && <Check className="w-4 h-4 text-amber-300 mt-0.5" />}
          </button>

          {/* Other AI */}
          <button
            type="button"
            onClick={() => setPlatform('other')}
            className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all text-left flex items-start justify-between cursor-pointer ${
              platform === 'other'
                ? 'bg-purple-900 text-white border-purple-950 shadow-md ring-2 ring-purple-400/40'
                : 'bg-purple-50/50 hover:bg-purple-100/60 text-purple-950 border-purple-200'
            }`}
          >
            <div className="space-y-1">
              <div className="font-black text-sm flex items-center gap-1.5">
                <span>🌐 Other AI Platform</span>
              </div>
              <p className={`text-xs ${platform === 'other' ? 'text-purple-200' : 'text-purple-700'}`}>
                Claude, Microsoft Copilot, etc.
              </p>
            </div>
            {platform === 'other' && <Check className="w-4 h-4 text-amber-300 mt-0.5" />}
          </button>
        </div>

        {platform === 'other' && (
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <label className="block text-xs font-bold text-purple-950 mb-1">
              Specify AI Platform Name (optional):
            </label>
            <input
              type="text"
              value={otherPlatformName}
              onChange={(e) => setOtherPlatformName(e.target.value)}
              placeholder="e.g. Claude 3.5 Sonnet, Copilot, Perplexity..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-purple-300 bg-white text-purple-950 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 3. STEP 2: ADD YOUR QUESTION (TEXT OR IMAGE/CAMERA)        */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-purple-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-purple-100">
          <div className="space-y-0.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-purple-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-900 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Add Your Biology Question / Working</span>
            </h2>
            <p className="text-xs text-purple-700">
              Choose how you want to provide your question: type/paste text, or upload/scan an image.
            </p>
          </div>

          {/* Quick Preset / Sample loader */}
          <button
            type="button"
            onClick={handleLoadSampleQuestion}
            className="text-xs text-purple-700 hover:text-purple-950 font-bold underline cursor-pointer self-start sm:self-auto"
          >
            Load Example Question
          </button>
        </div>

        {/* Input Method Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-purple-100/60 rounded-xl border border-purple-200">
          <button
            type="button"
            onClick={() => setInputMethod('text')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              inputMethod === 'text'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-purple-900 hover:bg-white/60'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Type or Paste Question</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMethod('image')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              inputMethod === 'image'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-purple-900 hover:bg-white/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Scan / Upload Image {uploadedImages.length > 0 && `(${uploadedImages.length})`}</span>
          </button>
        </div>

        {/* METHOD A: TEXT INPUT */}
        {inputMethod === 'text' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label 
                htmlFor="prompt-question-input"
                className="text-xs font-extrabold text-purple-950 flex items-center justify-between"
              >
                <span>Paste or type your question here:</span>
                <span className="text-[11px] font-normal text-purple-600">Optional</span>
              </label>

              <textarea
                id="prompt-question-input"
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type or paste your Population Genetics question here... (e.g. In a population of 200 individuals, 72 are homozygous recessive...)"
                className="w-full p-4 rounded-xl border border-purple-200 text-sm font-normal text-purple-950 placeholder-purple-400 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all leading-relaxed"
              />

              <div className="flex items-center justify-between text-[11px] text-purple-600 pt-0.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInputMethod('image');
                      setIsCameraModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-purple-800 hover:text-purple-950 font-bold bg-purple-100/70 hover:bg-purple-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-purple-700" />
                    <span>Have a photo? Switch to Image mode</span>
                  </button>
                  {question.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuestion('')}
                      className="text-purple-600 hover:text-rose-600 underline font-medium cursor-pointer"
                    >
                      Clear text
                    </button>
                  )}
                </div>
                <span>{question.length} characters</span>
              </div>
            </div>
          </div>
        )}

        {/* METHOD B: IMAGE UPLOAD / SCAN */}
        {inputMethod === 'image' && (
          <div className="space-y-5">
            {/* If no images uploaded yet */}
            {uploadedImages.length === 0 ? (
              <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 sm:p-8 bg-purple-50/40 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center mx-auto shadow-2xs">
                  <Camera className="w-6 h-6 text-purple-700" />
                </div>

                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="font-extrabold text-sm sm:text-base text-purple-950">
                    Upload or Scan Question Image
                  </h3>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    Upload photos of question papers, diagrams, tables, or handwritten working. Supports JPG, JPEG, PNG, and WebP.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>Open Camera Scanner</span>
                  </button>

                  {/* File Upload Button */}
                  <label className="px-5 py-2.5 rounded-xl bg-white hover:bg-purple-100 text-purple-950 font-extrabold text-xs sm:text-sm border border-purple-300 shadow-2xs flex items-center gap-2 cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-purple-700" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleInlineFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              /* Images Uploaded Management View */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-purple-950">
                      Uploaded Images ({uploadedImages.length}):
                    </span>
                    <span className="text-[11px] text-purple-600">
                      Original files preserved
                    </span>
                  </div>

                  {/* Add another image button */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-purple-800 hover:text-purple-950 font-extrabold bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add another image</span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleInlineFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="text-xs text-purple-800 hover:text-purple-950 font-extrabold bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take photo</span>
                    </button>
                  </div>
                </div>

                {/* Thumbnails Gallery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadedImages.map((img, idx) => (
                    <div 
                      key={img.id}
                      className="relative rounded-xl border border-purple-200 bg-purple-50/50 p-2.5 flex items-center gap-3 overflow-hidden shadow-2xs"
                    >
                      <div className="w-16 h-16 rounded-lg bg-black shrink-0 overflow-hidden flex items-center justify-center">
                        <img 
                          src={img.dataUrl} 
                          alt={img.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-purple-950 truncate block">
                            {img.name}
                          </span>
                        </div>
                        {img.qualityWarning ? (
                          <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low resolution</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3" />
                            <span>Original preserved</span>
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="p-1.5 rounded-lg text-purple-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Image Quality Heuristics Warning if any */}
                {uploadedImages.some(img => img.qualityWarning) && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-amber-950">Image Quality Diagnostic Notice</p>
                      <p className="text-amber-900 leading-relaxed">
                        One or more images appear low-resolution or dark. For best results, we recommend using <strong>Option 2: Use Original Image directly with ChatGPT or Gemini</strong> so that diagram details and superscripts (q², p²) are not compromised.
                      </p>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 2 FLEXIBLE OPTIONS (EQUALLY VISIBLE)                      */}
                {/* ========================================================= */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-purple-950 uppercase tracking-wide">
                      How would you like to use your image(s)?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* OPTION 1: Try to Read Image */}
                    <div
                      onClick={() => {
                        setImageUsageMode('ocr');
                        if (!ocrResult && !isOcrLoading) {
                          performOcrOnImage();
                        }
                      }}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        imageUsageMode === 'ocr'
                          ? 'bg-purple-50 border-purple-800 shadow-xs'
                          : 'bg-white hover:bg-purple-50/40 border-purple-200'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm text-purple-950">
                            <span className="text-base">🔎</span>
                            <span>Option 1: Try to Read Image</span>
                          </div>
                          {imageUsageMode === 'ocr' && <Check className="w-4 h-4 text-purple-800 stroke-[3]" />}
                        </div>
                        <p className="text-xs text-purple-700 leading-snug">
                          Let GenAIde attempt to extract the question and formulas into editable text.
                        </p>
                      </div>

                      {imageUsageMode === 'ocr' && (
                        <div className="pt-2 border-t border-purple-200/70">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              performOcrOnImage();
                            }}
                            disabled={isOcrLoading}
                            className="w-full py-1.5 px-3 rounded-lg bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {isOcrLoading ? (
                              <>
                                <CuteRobotIcon className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                                <span>Scanning question text...</span>
                              </>
                            ) : (
                              <>
                                <Search className="w-3.5 h-3.5 text-amber-300" />
                                <span>{ocrResult ? 'Re-scan Image' : 'Extract Text Now'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* OPTION 2: Use Original Image */}
                    <div
                      onClick={() => setImageUsageMode('original')}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        imageUsageMode === 'original'
                          ? 'bg-indigo-50/80 border-indigo-700 shadow-xs'
                          : 'bg-white hover:bg-indigo-50/30 border-purple-200'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm text-indigo-950">
                            <span className="text-base">📎</span>
                            <span>Option 2: Use Original Image</span>
                          </div>
                          <span className="text-[10px] bg-indigo-200 text-indigo-950 font-black px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-indigo-800 leading-snug">
                          Keep original images untouched and upload directly to ChatGPT or Gemini with a tailored prompt.
                        </p>
                      </div>

                      <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Preserves diagrams, superscripts &amp; full clarity</span>
                      </div>
                    </div>
                  </div>

                  {/* OCR Extracted Text Review Box (If Option 1 is active) */}
                  {imageUsageMode === 'ocr' && (
                    <div className="space-y-3 p-4 bg-purple-50/80 rounded-xl border border-purple-200 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-purple-700" />
                          <span>Extracted Question Text (Review &amp; Edit):</span>
                        </span>
                        {ocrResult?.confidence && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ocrResult.confidence === 'high' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            Accuracy: {ocrResult.confidence.toUpperCase()}
                          </span>
                        )}
                      </div>

                      {ocrResult?.warningNote && (
                        <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{ocrResult.warningNote}</span>
                        </div>
                      )}

                      <textarea
                        rows={4}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={isOcrLoading ? "Scanning question..." : "Extracted text will appear here. You can edit any formulas (e.g. q², p²)..."}
                        className="w-full p-3.5 rounded-xl border border-purple-300 bg-white text-sm font-mono text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-purple-700">
                        <span>✏️ You can freely fix numbers, fractions (e.g. 30/150), or allele notations before generating.</span>
                        <button
                          type="button"
                          onClick={() => setImageUsageMode('original')}
                          className="text-indigo-900 hover:text-indigo-950 font-bold underline cursor-pointer self-start sm:self-auto"
                        >
                          Rather use original image? Click here
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Image Content Type Selector (If Option 2 is active) */}
                  {imageUsageMode === 'original' && (
                    <div className="space-y-2.5 p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 animate-in fade-in duration-200">
                      <label className="block text-xs font-extrabold text-indigo-950">
                        What is in your uploaded image(s)?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {IMAGE_CONTENT_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setImageContentType(type.id)}
                            className={`p-2.5 rounded-lg border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              imageContentType === type.id
                                ? 'bg-indigo-900 text-white border-indigo-950 shadow-2xs'
                                : 'bg-white hover:bg-indigo-100/60 text-indigo-950 border-indigo-200'
                            }`}
                          >
                            <span className="truncate">{type.label}</span>
                            {imageContentType === type.id && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        )}

        {/* Optional Student Working Section */}
        <div className="pt-2 border-t border-purple-100 space-y-2">
          <label 
            htmlFor="prompt-working-input"
            className="text-xs font-extrabold text-purple-950 flex items-center justify-between"
          >
            <span>My Working / Proposed Answer (Optional):</span>
            <span className="text-[11px] font-normal text-purple-600">Recommended for error diagnosis</span>
          </label>
          <textarea
            id="prompt-working-input"
            rows={2}
            value={studentWorking}
            onChange={(e) => setStudentWorking(e.target.value)}
            placeholder="Type your calculation steps here if you want the AI to check your math (e.g. q² = 30/150 = 0.20, q = √0.20 = 0.4472...)"
            className="w-full p-3 rounded-xl border border-purple-200 text-xs font-mono text-purple-950 placeholder-purple-400 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. STEP 3: LEARNING GOAL & WHAT YOU WANT THE AI TO DO     */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-purple-200 space-y-5">
        <div className="flex items-center justify-between pb-1 border-b border-purple-100">
          <div className="space-y-0.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-purple-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-900 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Choose Your Learning Goal</span>
            </h2>
            <p className="text-xs text-purple-700">
              Select one or multiple ways you would like the AI assistant to help you.
            </p>
          </div>
          <span className="text-xs text-purple-700 font-medium">Step 3 of 4</span>
        </div>

        {/* Quick Start Presets row */}
        <div className="space-y-2">
          <div className="text-[11px] font-extrabold text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Presets:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {QUICK_START_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="p-2.5 rounded-xl bg-purple-50/70 hover:bg-purple-100 border border-purple-200 text-left transition-all flex flex-col justify-between cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm">{preset.icon}</span>
                  <span className="font-extrabold text-[11px] text-purple-950 truncate">{preset.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Task Multi-Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {TASK_OPTIONS.map((task) => {
            const selected = isTaskSelected(task.label);
            return (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.label)}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-2.5 ${
                  selected
                    ? 'bg-purple-50 border-purple-700 shadow-2xs'
                    : 'bg-white hover:bg-purple-50/40 border-purple-200'
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

        {isTaskSelected('Other') && (
          <div className="pt-1">
            <input
              type="text"
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              placeholder="Type your custom request for the AI..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-purple-300 bg-white text-purple-950 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 5. STEP 4: PREFERENCES, LANGUAGE & EXPLANATION LEVEL      */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-purple-200 space-y-5">
        <div className="flex items-center justify-between pb-1 border-b border-purple-100">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-purple-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-900 text-white text-xs flex items-center justify-center font-bold">
              4
            </span>
            <span>Study Style &amp; Preferences</span>
          </h2>
          <span className="text-xs text-purple-700 font-medium">Step 4 of 4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Preferred Language */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wide">
              Preferred Language
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

          {/* Explanation Level */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wide">
              Explanation Level
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

          {/* Answering Preference */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-purple-950 uppercase tracking-wide">
              Answering Preference
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

        {/* Generate Button Row */}
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
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 order-1 sm:order-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Generate Study Prompt</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. GENERATED PROMPT OUTPUT SECTION                        */}
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
                <span>Your AI Study Prompt is Ready</span>
              </div>
              <h2 className="text-xl font-extrabold text-purple-950">
                Custom Study Prompt
              </h2>
              <p className="text-xs text-purple-700 mt-0.5">
                Formatted for {platform === 'chatgpt' ? 'ChatGPT' : platform === 'gemini' ? 'Gemini' : otherPlatformName || 'AI Platform'} • SB015 Matriculation Biology
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
                  <span>📋 Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Original Image Attachment Reminder Banner */}
          {isUsingOriginalImage && (
            <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-extrabold text-indigo-950 text-sm">
                  <Paperclip className="w-4 h-4 text-indigo-700" />
                  <span>📎 Remember to attach your original image in {platform === 'chatgpt' ? 'ChatGPT' : platform === 'gemini' ? 'Gemini' : 'your AI platform'}</span>
                </div>
                <p className="text-indigo-800 leading-relaxed">
                  Your generated prompt tells the AI to inspect your original image without guessing unclear text. Copy your prompt, then upload your original image file directly in the {platform === 'chatgpt' ? 'ChatGPT' : platform === 'gemini' ? 'Gemini' : 'AI'} chat.
                </p>
              </div>

              <span className="shrink-0 font-black text-[11px] text-indigo-900 bg-indigo-200 px-3 py-1 rounded-lg">
                {uploadedImages.length} Image{uploadedImages.length > 1 ? 's' : ''} to attach
              </span>
            </div>
          )}

          {/* Prompt Content Preview Box */}
          <div className="relative">
            <pre className="w-full p-4 sm:p-5 rounded-xl bg-purple-950 text-purple-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap border border-purple-800 selection:bg-purple-600 selection:text-white max-h-[440px] overflow-y-auto">
              {generatedPrompt}
            </pre>
          </div>

          {/* Next Steps Guide */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-900 font-semibold">
              <span className="text-base">🚀</span>
              <span>
                {isUsingOriginalImage 
                  ? `Next Step: Copy prompt above → Open ${platform === 'chatgpt' ? 'ChatGPT' : platform === 'gemini' ? 'Gemini' : 'your AI'} → Paste & attach your original photo!`
                  : `Next Step: Paste this prompt into ${platform === 'chatgpt' ? 'ChatGPT' : platform === 'gemini' ? 'Gemini' : 'your AI platform'} and start studying!`
                }
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyPrompt}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-950 font-bold border border-purple-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
            >
              <Copy className="w-3.5 h-3.5 text-purple-700" />
              <span>{isCopied ? 'Copied again!' : 'Copy Again'}</span>
            </button>
          </div>
        </section>
      )}

      {/* Camera Capture Modal */}
      <ScanQuestionModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onImageCapturedOrUploaded={handleImageCapturedOrUploaded}
      />

    </div>
  );
};
