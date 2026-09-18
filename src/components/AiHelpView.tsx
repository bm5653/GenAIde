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
  Award
} from 'lucide-react';
import { 
  analyzeUploadedWorkingImage, 
  SAMPLE_WORKING_IMAGES, 
  StepEvaluationResult,
  SampleWorking
} from '../utils/popgenImageAnalyzer';
import { QUESTIONS_DATA } from '../data/questionsData';
import { ADDITIONAL_QUESTIONS } from '../data/pastYearAdditionalQuestions';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  imageUrl?: string;
  imageName?: string;
  stepEvaluation?: StepEvaluationResult;
}

const PRESET_QUERIES = [
  "How do I know whether to use Hardy-Weinberg or Gene Pool Counting?",
  "Why can't I start calculation with the dominant trait?",
  "What do I do when individuals are removed or added to the population?",
  "How do I convert between allele frequency and genotype frequency?",
  "Explain why 2pq has a 2 in front of it.",
  "What are the official decimal place rules for Matriculation Biology?"
];

export const AiHelpView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am GenAIde, your AI-aided Population Genetics tutor. 🧬\n\nRemember our core motto: **\"Think First. Calculate Second. Use AI Wisely.\"**\n\n📸 **New:** You can now **upload a photo or screenshot of your handwritten calculation steps**! I will inspect your working step-by-step, award a **tick symbol (✓)** for each correct step, and pinpoint any conceptual or arithmetic slips without spoiling the answer.",
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [stagedImage, setStagedImage] = useState<{ dataUrl: string; name: string; size: string } | null>(null);
  const [selectedQuestionTag, setSelectedQuestionTag] = useState<string>('Auto-detect');
  const [showSampleSelector, setShowSampleSelector] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<{ url: string; title: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
        name: file.name || 'handwritten_steps.jpg',
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

  const generateSocraticResponse = (query: string): string => {
    const q = query.toLowerCase();

    if ((q.includes("hardy-weinberg") && q.includes("gene pool")) || q.includes("know whether") || q.includes("difference")) {
      return `Great question! Here is how to distinguish them in exam questions:

1. **Standard Hardy-Weinberg:** Look for phrases like *"assuming the population is in genetic equilibrium"* or standard random-mating baseline data with only recessive and dominant phenotypes. Use $q^2 \\to q \\to p \\to 2pq$.

2. **Gene Pool Allele Counting:** Use this when:
   - The question gives you exact genotype breakdown directly (e.g. 70 TT, 20 Tt, 10 tt).
   - An event broke equilibrium: individuals died, were culled, or migrated into the population!
   - Total alleles = $2 \\times N$.
   - **Crucial Rule:** Do NOT use $p$ or $q$ symbols when calculating non-H-W gene pool frequencies! Write full words like *"Frequency of dominant allele"*.

What kind of data does your specific question provide?`;
    }

    if (q.includes("dominant") && (q.includes("start") || q.includes("can't") || q.includes("why"))) {
      return `A vital rule in Population Genetics! 🎯

**Why you CANNOT start with the dominant phenotype:**
Individuals showing the dominant trait are actually a mixture of TWO distinct genotypes:
- Homozygous dominant ($p^2$)
- Heterozygous ($2pq$)

If 840 out of 1000 sheep are white (dominant), $840/1000 = 0.84$ equals $(p^2 + 2pq)$, **NOT $p^2$**! You cannot take the square root of 0.84 to get $p$.

**The Golden Strategy:**
Always look for the **recessive trait** first ($q^2$). Recessive individuals can ONLY have one genotype: homozygous recessive ($aa$).
Once you have $q^2$, you take $q = \\sqrt{q^2}$, then simply find $p = 1 - q$.

Does that make the recessive-first priority clear?`;
    }

    if (q.includes("removed") || q.includes("added") || q.includes("killed") || q.includes("migrat")) {
      return `This is the famous **"New Population"** scenario that catches many students off guard!

Whenever individuals are killed, culled, or migrate in, **Hardy-Weinberg equilibrium is broken**. Here is the 5-step master protocol:

1. **New Population Size:** Calculate $N_{new} = N_{original} \\pm \\text{Individuals changed}$.
2. **Surviving / New Genotypes:** Determine how many homozygous dominant, heterozygous, and homozygous recessive individuals remain.
3. **New Gene Pool Size:** Multiply new population by 2 ($2 \\times N_{new}$).
4. **Count Alleles:**
   - Dominant alleles = $(2 \\times \\text{Homozygous Dominant}) + (1 \\times \\text{Heterozygous})$
   - Recessive alleles = $(2 \\times \\text{Homozygous Recessive}) + (1 \\times \\text{Heterozygous})$
5. **New Frequencies:** Divide each count by the new gene pool size.

Notice: Write out full verbal terms (*Frequency of dominant allele*), avoiding bare $p$ and $q$ symbols!

Would you like to try this on a specific question?`;
    }

    if (q.includes("2pq") && (q.includes("2") || q.includes("why") || q.includes("front"))) {
      return `Ah, the factor of 2! 🧬

Remember that in a diploid population with random fertilization:
- A heterozygous individual can inherit allele **A** from the mother and allele **a** from the father (probability = $p \\times q$).
- OR they can inherit allele **a** from the mother and allele **A** from the father (probability = $q \\times p$).

Both combinations ($Aa$ and $aA$) result in a heterozygous individual!
Adding them together:
$(p \\times q) + (q \\times p) = 2pq$.

That is why you must **never forget to multiply by 2** when calculating heterozygous frequency!`;
    }

    if (q.includes("step 3") || q.includes("fix step")) {
      return `Let's focus directly on **Step 3**!

1. If you're solving a **Standard Hardy-Weinberg** problem, Step 3 is typically finding $p = 1 - q$. Make sure you use the unrounded value of $q$ to avoid drift in your subsequent calculation of $2pq$.
2. If this is a **New Population** problem (migration or culling), remember: do **NOT** take the square root of surviving individuals! Calculate the total number of surviving alleles by multiplying the surviving population by 2 ($2 \\times N_{new}$).

What specific numbers do you currently have written down for Step 3?`;
    }

    if (q.includes("decimal") || q.includes("rounding") || q.includes("place")) {
      return `Here are the official Matriculation standard rules for decimal places:

1. **If the question specifies:** Always follow the exact instruction (e.g. *"All calculation must be in 4 decimal places"*).
2. **If NOT specified, follow population size N:**
   - Population **10 – 99**: **1 decimal place** (e.g. 0.8)
   - Population **100 – 999** (and percentages): **2 decimal places** (e.g. 0.37 or 14.00%)
   - Population **1000 and above**: **3 decimal places** (e.g. 0.087)

Keep unrounded figures in your calculator during intermediate steps, and round your final reported answers according to this rule!`;
    }

    return `Let's work through that together! 💡

To give you the best guidance:
1. What is the organism and trait in your problem?
2. Which phenotype is dominant, and which is recessive?
3. What numbers or percentages are given?

Remember: Always start by identifying the homozygous recessive phenotype ($q^2$)! You can also upload a photo of your working steps anytime.`;
  };

  const handleSend = (text?: string) => {
    const msgText = (text || inputVal).trim();
    if (!msgText && !stagedImage) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: msgText || (stagedImage ? `Please check my uploaded working steps for ${selectedQuestionTag !== 'Auto-detect' ? selectedQuestionTag : 'this question'}.` : ''),
      time: 'Just now',
      imageUrl: stagedImage?.dataUrl,
      imageName: stagedImage?.name
    };

    setMessages(prev => [...prev, userMsg]);
    const imageToAnalyze = stagedImage;
    setStagedImage(null);
    if (!text) setInputVal('');
    setIsTyping(true);

    if (imageToAnalyze) {
      // Analyze the uploaded image using the PopGen Step-by-Step Diagnostic Engine
      setTimeout(() => {
        const evaluation = analyzeUploadedWorkingImage(
          imageToAnalyze.name,
          msgText,
          selectedQuestionTag !== 'Auto-detect' ? selectedQuestionTag : undefined
        );

        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I have thoroughly inspected your handwritten working steps for **${evaluation.questionNumber}** (${evaluation.questionTitle}).\n\nHere is your **Step-by-Step Diagnostic Evaluation**: A tick symbol (✓) is awarded for each correct step below!`,
          time: 'Just now',
          stepEvaluation: evaluation
        };

        setMessages(prev => [...prev, botReply]);
        setIsTyping(false);
      }, 1200);
    } else {
      // Standard text query Socratic answer
      setTimeout(() => {
        const reply = generateSocraticResponse(msgText);
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: reply,
            time: 'Just now'
          }
        ]);
        setIsTyping(false);
      }, 600);
    }
  };

  return (
    <div 
      className="space-y-6 pb-12"
      onPaste={handlePaste}
    >
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
            <Bot className="w-4 h-4 text-purple-700" />
            <span>Socratic AI PopGen Tutor &amp; Image Step-Checker</span>
          </div>
          <button
            onClick={() => setShowSampleSelector(!showSampleSelector)}
            className="px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200 flex items-center gap-1.5 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-purple-700" />
            <span>Sample Student Photos</span>
          </button>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
          GenAIde AI Help Desk
        </h2>
        <p className="text-xs sm:text-sm text-purple-800">
          Ask questions, or <strong>upload photos of your handwritten working steps</strong>. GenAIde verifies your calculations step-by-step, awards <strong>tick symbols (✓)</strong> for correct steps, and guides you socratically through mistakes.
        </p>
      </div>

      {/* Sample Handwritten Working Selector Drawer */}
      {showSampleSelector && (
        <div className="bg-purple-900 text-white p-5 rounded-2xl shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-purple-700/60 pb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-300" />
              <h3 className="font-bold text-sm text-purple-100">
                Try Sample Handwritten Student Working Images
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
            No camera or notebook photo right now? Select one of these realistic student handwritten calculation scans to test how AI checks your steps and awards tick marks:
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

      {/* Main Chat & Toolbox layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-purple-200 shadow-xs flex flex-col h-[720px] overflow-hidden">
          
          {/* Top Chat Bar with Image Upload Shortcut */}
          <div className="p-3 bg-purple-50/80 border-b border-purple-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-purple-900 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Socratic PopGen Dialogue</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-100 text-purple-900 font-bold text-xs border border-purple-300 flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Upload photo of your notebook or exam sheet"
              >
                <Upload className="w-3.5 h-3.5 text-purple-700" />
                <span>Upload Working Photo</span>
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
                      <div className="relative group cursor-pointer" onClick={() => setPreviewModalImage({ url: m.imageUrl!, title: m.imageName || 'Handwritten Working' })}>
                        <img 
                          src={m.imageUrl} 
                          alt="Uploaded steps" 
                          className="w-full max-h-56 object-contain rounded-lg bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg text-white font-bold text-xs gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>Click to Enlarge</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-purple-100 px-1 font-mono">
                        <span>📷 {m.imageName || 'steps.jpg'}</span>
                        <span className="text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded">Uploaded Step Photo</span>
                      </div>
                    </div>
                  )}

                  {/* Message Text */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {m.text}
                  </div>

                  {/* Rich Step-by-Step Diagnostic Review Card */}
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

                        {/* Verdict / Score Badge */}
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
                            className="px-2.5 py-1 rounded-md bg-purple-800 hover:bg-purple-700 text-purple-100 text-xs font-semibold border border-purple-600 transition-colors"
                          >
                            Explain Step 3 in detail →
                          </button>
                          <button
                            onClick={() => handleSend("Show me the correct formula for this step.")}
                            className="px-2.5 py-1 rounded-md bg-purple-800 hover:bg-purple-700 text-purple-100 text-xs font-semibold border border-purple-600 transition-colors"
                          >
                            Show formula template →
                          </button>
                          <button
                            onClick={() => handleSend("How should I round my final answer for this population size?")}
                            className="px-2.5 py-1 rounded-md bg-purple-800 hover:bg-purple-700 text-purple-100 text-xs font-semibold border border-purple-600 transition-colors"
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
                <span>GenAIde is reading your steps and checking against the mark scheme...</span>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Staged Image Banner (ready to send) */}
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
                  <div className="text-[11px] text-purple-700">{stagedImage.size} • Ready for AI step checking</div>
                  {/* Question Tag Selector */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold text-purple-900">Target Question:</span>
                    <select
                      value={selectedQuestionTag}
                      onChange={(e) => setSelectedQuestionTag(e.target.value)}
                      className="px-2 py-0.5 rounded bg-white border border-purple-300 text-[11px] font-bold text-purple-950 focus:outline-hidden"
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
                  className="p-1.5 rounded-lg hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button
                  onClick={() => handleSend()}
                  className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Check My Steps Now</span>
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
                className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-purple-200 text-purple-900 text-[11px] font-semibold border border-purple-200 shadow-2xs transition-colors"
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
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-all flex items-center justify-center shrink-0"
              title="Upload photo of your handwritten working (or paste with Ctrl+V)"
            >
              <Camera className="w-4 h-4 text-purple-700" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={stagedImage ? "Add an optional question about your photo (or press Send)..." : "Ask a question or paste working image (Ctrl+V)..."}
              className="flex-1 px-3 py-2 rounded-xl border border-purple-300 font-mono text-xs sm:text-sm text-purple-950 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
            
            <button
              onClick={() => handleSend()}
              className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>
        </div>

        {/* Right 1 Column: Math Toolbox + Persona Info */}
        <div className="space-y-4">
          
          {/* Quick Photo Upload Helper Card */}
          <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-xs space-y-3">
            <div className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-700" />
              <span>Submit Working Image</span>
            </div>
            <p className="text-xs text-purple-800 leading-relaxed">
              Snap a photo of your notebook or test paper. AI will analyze each step and award <strong>tick symbols (✓)</strong>!
            </p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50/50 cursor-pointer text-center space-y-1.5 transition-all"
            >
              <Upload className="w-5 h-5 mx-auto text-purple-600" />
              <div className="font-bold text-xs text-purple-900">
                Click to browse or drop photo here
              </div>
              <div className="text-[11px] text-purple-600">
                Supports PNG, JPG, or paste directly (Ctrl+V)
              </div>
            </div>

            <button
              onClick={() => setShowSampleSelector(true)}
              className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs border border-purple-200 flex items-center justify-center gap-1.5"
            >
              <span>🖼️ Select from Sample Student Scans</span>
            </button>
          </div>

          <MathToolbox lastActiveInputRef={inputRef} />

          <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs space-y-2 text-xs text-purple-950">
            <div className="font-bold text-purple-900 border-b border-purple-100 pb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Socratic AI Principles</span>
            </div>
            <p className="text-purple-800 text-[11px] leading-relaxed">
              GenAIde is designed not to cheat for you, but to scaffold your mental models. It tests whether you understand:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-purple-800 text-[11px]">
              <li>Which phenotype is recessive ($q^2$)</li>
              <li>Whether equilibrium has broken</li>
              <li>Why the factor of 2 belongs in $2pq$</li>
              <li>How to avoid premature rounding</li>
            </ul>
          </div>
        </div>
      </div>

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
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black"
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
                className="px-4 py-1.5 rounded-lg bg-purple-900 text-white font-bold text-xs"
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
