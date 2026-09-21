import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download,
  Copy, 
  Check, 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight,
  PenTool,
  Eraser,
  Trash2,
  FileType,
  Image as ImageIcon,
  Layers,
  Smartphone,
  Tablet,
  Undo2,
  Redo2,
  Highlighter,
  Pencil,
  Grid,
  AlignLeft,
  CircleDot,
  FileCheck,
  Calendar,
  AlertCircle,
  Archive,
  HelpCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    front: "What is the definition of a Gene Pool?",
    back: "The total number of genes and their different alleles that are present in a population of a particular species of organisms at a given time.",
    category: "Definition"
  },
  {
    id: 2,
    front: "What are the 5 conditions for Hardy-Weinberg Equilibrium?",
    back: "1. Large population size\n2. Random mating\n3. No mutation\n4. No migration (no gene flow)\n5. No natural selection",
    category: "Conditions"
  },
  {
    id: 3,
    front: "Why must you ALWAYS start calculations with the homozygous recessive trait (q²)?",
    back: "Because dominant individuals are a mixture of TWO genotypes: homozygous dominant (p²) AND heterozygous (2pq). Only recessive individuals have a single known genotype (aa = q²).",
    category: "Golden Rule"
  },
  {
    id: 4,
    front: "What is the difference between p and p²?",
    back: "p is the frequency of the DOMINANT ALLELE.\np² is the frequency of the HOMOZYGOUS DOMINANT GENOTYPE.",
    category: "Symbols"
  },
  {
    id: 5,
    front: "Why does the heterozygous term in Hardy-Weinberg have a 2 in front (2pq)?",
    back: "Because heterozygotes can be formed in TWO ways: dominant allele from mother + recessive from father (pq), OR recessive from mother + dominant from father (qp). pq + qp = 2pq.",
    category: "Formula"
  },
  {
    id: 6,
    front: "What is the critical rule for symbols when a population is NOT in Hardy-Weinberg?",
    back: "DO NOT USE SYMBOLS (p, q, p², q², 2pq)! Write out full verbal terms: 'Frequency of dominant allele', 'Frequency of recessive allele', etc.",
    category: "Examiner Rule"
  },
  {
    id: 7,
    front: "How do you calculate Gene Pool Size in diploid organisms?",
    back: "Total number of alleles = 2 × Total number of individuals (diploid organisms carry 2 alleles per gene).",
    category: "Formula"
  },
  {
    id: 8,
    front: "What are the standard decimal place rules based on population size?",
    back: "• 10 - 99: 1 decimal place\n• 100 - 999: 2 decimal places\n• 1000 and above: 3 decimal places\n(Or follow explicit question instructions)",
    category: "Standard"
  }
];

const COLORS = [
  { name: 'Purple', value: '#6b21a8' },
  { name: 'Indigo', value: '#1e1b4b' },
  { name: 'Blue', value: '#1d4ed8' },
  { name: 'Emerald', value: '#047857' },
  { name: 'Red', value: '#b91c1c' },
  { name: 'Dark', value: '#0f172a' }
];

const HIGHLIGHTER_COLORS = [
  { name: 'Yellow', value: 'rgba(250, 204, 21, 0.4)' },
  { name: 'Green', value: 'rgba(52, 211, 153, 0.4)' },
  { name: 'Cyan', value: 'rgba(56, 189, 248, 0.4)' },
  { name: 'Pink', value: 'rgba(244, 114, 182, 0.4)' }
];

type PaperBg = 'white' | 'grid' | 'lined' | 'dotted' | 'cream';

const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').slice(0, 40) || 'Scratchpad';
};

export const NotesView: React.FC = () => {
  // Flashcard state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Scratchpad data per card
  const [cardTitles, setCardTitles] = useState<{ [cardId: number]: string }>({});
  const [cardTextNotes, setCardTextNotes] = useState<{ [cardId: number]: string }>({});
  const [cardBackgrounds, setCardBackgrounds] = useState<{ [cardId: number]: PaperBg }>({});

  // Drawing tools & settings
  const [drawTool, setDrawTool] = useState<'pen' | 'pencil' | 'highlighter' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState('#6b21a8');
  const [highlighterColor, setHighlighterColor] = useState('rgba(250, 204, 21, 0.4)');
  const [penWidth, setPenWidth] = useState(3);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Canvas Refs & stroke history (Undo/Redo)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scratchpadDocRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // History stack per card for Undo/Redo
  const strokeHistoryRef = useRef<{ [cardId: number]: string[] }>({});
  const strokeIndexRef = useRef<{ [cardId: number]: number }>({});

  const currentCard = FLASHCARDS[currentCardIdx];
  const currentPaperBg: PaperBg = cardBackgrounds[currentCard.id] || 'white';
  const todayDateStr = '2026-09-21';

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load saved titles, notes, backgrounds from localStorage
  useEffect(() => {
    const loadedNotes: { [key: number]: string } = {};
    const loadedTitles: { [key: number]: string } = {};
    const loadedBgs: { [key: number]: PaperBg } = {};

    FLASHCARDS.forEach(card => {
      const savedText = localStorage.getItem(`genaide_card_text_note_${card.id}`);
      if (savedText) loadedNotes[card.id] = savedText;

      const savedTitle = localStorage.getItem(`genaide_card_title_${card.id}`);
      if (savedTitle) loadedTitles[card.id] = savedTitle;

      const savedBg = localStorage.getItem(`genaide_card_bg_${card.id}`) as PaperBg | null;
      if (savedBg) loadedBgs[card.id] = savedBg;
    });

    setCardTextNotes(loadedNotes);
    setCardTitles(loadedTitles);
    setCardBackgrounds(loadedBgs);
  }, []);

  // Initialize or restore drawing canvas when card index changes
  useEffect(() => {
    setIsFlipped(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas dimensions to crisp Retina resolution
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width > 0 ? rect.width : 600;
    const displayHeight = 260;

    canvas.width = Math.floor(displayWidth * 2);
    canvas.height = Math.floor(displayHeight * 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Initialize history stack for this card if not present
    if (!strokeHistoryRef.current[currentCard.id]) {
      strokeHistoryRef.current[currentCard.id] = [];
      strokeIndexRef.current[currentCard.id] = -1;
    }

    // Restore saved drawing data URL if present
    const savedDrawing = localStorage.getItem(`genaide_card_drawing_${currentCard.id}`);
    if (savedDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (strokeHistoryRef.current[currentCard.id].length === 0) {
          strokeHistoryRef.current[currentCard.id] = [savedDrawing];
          strokeIndexRef.current[currentCard.id] = 0;
        }
      };
      img.src = savedDrawing;
    } else {
      // Empty initial state
      const blankData = canvas.toDataURL('image/png');
      if (strokeHistoryRef.current[currentCard.id].length === 0) {
        strokeHistoryRef.current[currentCard.id] = [blankData];
        strokeIndexRef.current[currentCard.id] = 0;
      }
    }
  }, [currentCardIdx]);

  // Save current drawing to localStorage and record in undo history
  const recordCanvasStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    localStorage.setItem(`genaide_card_drawing_${currentCard.id}`, dataUrl);

    // Update undo history
    const cardId = currentCard.id;
    const history = strokeHistoryRef.current[cardId] || [];
    const currentIndex = strokeIndexRef.current[cardId] ?? -1;

    // Truncate any future redo states
    const updatedHistory = history.slice(0, currentIndex + 1);
    updatedHistory.push(dataUrl);

    // Limit history to 30 states to keep memory lean
    if (updatedHistory.length > 30) {
      updatedHistory.shift();
    }

    strokeHistoryRef.current[cardId] = updatedHistory;
    strokeIndexRef.current[cardId] = updatedHistory.length - 1;
  };

  const handleUndo = () => {
    const cardId = currentCard.id;
    const history = strokeHistoryRef.current[cardId] || [];
    const currentIndex = strokeIndexRef.current[cardId] ?? -1;

    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      strokeIndexRef.current[cardId] = newIndex;
      const targetDataUrl = history[newIndex];

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        localStorage.setItem(`genaide_card_drawing_${cardId}`, targetDataUrl);
      };
      img.src = targetDataUrl;
    }
  };

  const handleRedo = () => {
    const cardId = currentCard.id;
    const history = strokeHistoryRef.current[cardId] || [];
    const currentIndex = strokeIndexRef.current[cardId] ?? -1;

    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      strokeIndexRef.current[cardId] = newIndex;
      const targetDataUrl = history[newIndex];

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        localStorage.setItem(`genaide_card_drawing_${cardId}`, targetDataUrl);
      };
      img.src = targetDataUrl;
    }
  };

  // Text note and title change handlers
  const handleTextNoteChange = (val: string) => {
    setCardTextNotes(prev => ({ ...prev, [currentCard.id]: val }));
    localStorage.setItem(`genaide_card_text_note_${currentCard.id}`, val);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 1500);
  };

  const handleTitleChange = (val: string) => {
    setCardTitles(prev => ({ ...prev, [currentCard.id]: val }));
    localStorage.setItem(`genaide_card_title_${currentCard.id}`, val);
  };

  const handlePaperBgChange = (bg: PaperBg) => {
    setCardBackgrounds(prev => ({ ...prev, [currentCard.id]: bg }));
    localStorage.setItem(`genaide_card_bg_${currentCard.id}`, bg);
  };

  // Insert math / biological formula shortcuts into typed note
  const handleInsertSymbol = (sym: string) => {
    const currentText = cardTextNotes[currentCard.id] || '';
    const updated = currentText ? `${currentText} ${sym}` : sym;
    handleTextNoteChange(updated);
  };

  // Canvas Drawing Coordinate Mapping
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e && e.touches.length > 1) return;
    isDrawingRef.current = true;
    const coords = getCanvasCoords(e);
    lastPosRef.current = coords;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    if (drawTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, penWidth * 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (drawTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = highlighterColor;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (drawTool === 'pencil') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = penColor;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, penWidth, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const coords = getCanvasCoords(e);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (drawTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = penWidth * 16;
    } else if (drawTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = highlighterColor;
      ctx.lineWidth = 26;
    } else if (drawTool === 'pencil') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth * 2.2;
    }

    ctx.stroke();
    ctx.restore();

    lastPosRef.current = coords;
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPosRef.current = null;
      recordCanvasStroke();
    }
  };

  // Safe Clear with Confirmation
  const promptClear = () => {
    const hasDrawing = !!localStorage.getItem(`genaide_card_drawing_${currentCard.id}`);
    const hasNotes = !!(cardTextNotes[currentCard.id] && cardTextNotes[currentCard.id].trim().length > 0);

    if (hasDrawing || hasNotes) {
      setIsClearModalOpen(true);
    } else {
      executeClear();
    }
  };

  const executeClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    localStorage.removeItem(`genaide_card_drawing_${currentCard.id}`);
    localStorage.removeItem(`genaide_card_text_note_${currentCard.id}`);

    setCardTextNotes(prev => ({ ...prev, [currentCard.id]: '' }));

    // Reset undo history
    if (canvas) {
      const blankData = canvas.toDataURL('image/png');
      strokeHistoryRef.current[currentCard.id] = [blankData];
      strokeIndexRef.current[currentCard.id] = 0;
    }
    setIsClearModalOpen(false);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % FLASHCARDS.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };

  const handleCopySummary = () => {
    const summaryText = `CHAPTER 5: POPULATION GENETICS SUMMARY CHEATSHEET
1. Gene Pool = Total genes and alleles in a population at a given time.
   Diploid: Gene pool size = 2 × N.
2. Hardy-Weinberg Law = Allele frequencies remain constant generation to generation.
   5 Conditions: Large pop, Random mating, No mutation, No migration, No natural selection.
3. Equations:
   p + q = 1 (Alleles)
   p² + 2pq + q² = 1 (Genotypes)
4. Golden Step Sequence:
   Step 1: q² = Recessive / Total
   Step 2: q = √q²
   Step 3: p = 1 - q
   Step 4: 2pq = 2(p)(q) & p² = (p)²
5. Non-H-W Population Rule:
   DO NOT USE p and q symbols. Write full words. Count alleles: (2 × Homo) + Hetero.
6. Decimal Rules:
   10-99 (1 d.p.), 100-999 (2 d.p.), 1000+ (3 d.p.).`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Paper Background Pattern Styling
  const getPaperBgStyle = (bg: PaperBg): React.CSSProperties => {
    switch (bg) {
      case 'grid':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        };
      case 'lined':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(transparent, transparent 27px, #cbd5e1 28px)',
          backgroundSize: '100% 28px'
        };
      case 'dotted':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px'
        };
      case 'cream':
        return {
          backgroundColor: '#fefce8',
        };
      case 'white':
      default:
        return {
          backgroundColor: '#ffffff',
        };
    }
  };

  // =========================================================================
  // RELIABLE HIGH-RESOLUTION SCRATCHPAD EXPORT ENGINE (CANVAS & PDF)
  // =========================================================================

  // Helper: Trigger browser download for any Blob reliably in iframes and all browsers
  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 1500);
  };

  // Helper: Universally draw a rounded rectangle on Canvas 2D
  const drawCanvasRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // Helper: Word wrap for typed notes, equations, and Punnett squares
  const wrapTextLines = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const outputLines: string[] = [];
    const paragraphs = text.split('\n');
    for (const para of paragraphs) {
      if (!para) {
        outputLines.push('');
        continue;
      }
      const words = para.split(' ');
      let currentLine = '';
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (ctx.measureText(word).width > maxWidth) {
          if (currentLine) {
            outputLines.push(currentLine);
            currentLine = '';
          }
          let chunk = '';
          for (let c = 0; c < word.length; c++) {
            const testChunk = chunk + word[c];
            if (ctx.measureText(testChunk).width > maxWidth) {
              outputLines.push(chunk);
              chunk = word[c];
            } else {
              chunk = testChunk;
            }
          }
          currentLine = chunk;
          continue;
        }

        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          outputLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        outputLines.push(currentLine);
      }
    }
    return outputLines;
  };

  // Dedicated Render Engine: Render complete Scratchpad state onto an ultra-crisp Canvas
  const renderScratchpadToCanvas = async (cardId: number): Promise<HTMLCanvasElement> => {
    // Wait for document fonts if available
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // ignore font readiness errors
      }
    }

    const card = FLASHCARDS.find((c) => c.id === cardId) || FLASHCARDS[0];
    const rawTitle = cardTitles[cardId] || `Scratchpad ${card.id}`;
    const rawNotes = cardTextNotes[cardId] || localStorage.getItem(`genaide_card_text_note_${cardId}`) || '';
    const paperBg = cardBackgrounds[cardId] || 'white';

    // 1. Get drawing data (active canvas or localStorage)
    let drawingDataUrl: string | null = null;
    if (cardId === currentCard.id && canvasRef.current) {
      try {
        drawingDataUrl = canvasRef.current.toDataURL('image/png');
      } catch (e) {
        drawingDataUrl = localStorage.getItem(`genaide_card_drawing_${cardId}`);
      }
    } else {
      drawingDataUrl = localStorage.getItem(`genaide_card_drawing_${cardId}`);
    }

    let drawingImg: HTMLImageElement | null = null;
    if (drawingDataUrl && drawingDataUrl.startsWith('data:image')) {
      drawingImg = await new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = drawingDataUrl!;
      });
    }

    // 2. Measure layout metrics (Base width 1000px, 2x Retina scale)
    const baseWidth = 1000;
    const padding = 36;
    const innerWidth = baseWidth - padding * 2;

    const measureCanvas = document.createElement('canvas');
    const mCtx = measureCanvas.getContext('2d');
    if (mCtx) {
      mCtx.font = '14px "SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace';
    }
    const wrappedNotes = mCtx ? wrapTextLines(mCtx, rawNotes, innerWidth - 36) : rawNotes.split('\n');
    const notesLineHeight = 24;
    const notesContentHeight = Math.max(120, wrappedNotes.length * notesLineHeight + 40);

    const headerHeight = 110;
    const questionBoxHeight = 58;
    const drawingBoxHeight = 440;
    const footerHeight = 48;
    const gap = 16;

    const baseHeight = padding + headerHeight + gap + questionBoxHeight + gap + drawingBoxHeight + gap + notesContentHeight + gap + footerHeight + padding;

    // 3. Create high-resolution export canvas (scale = 2 for crisp 300-DPI-equivalent Retina output)
    const scale = 2;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = Math.floor(baseWidth * scale);
    exportCanvas.height = Math.floor(baseHeight * scale);

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) throw new Error('Failed to acquire 2D context for export canvas');

    ctx.scale(scale, scale);

    // 4. Render Background
    if (paperBg === 'cream') {
      ctx.fillStyle = '#fefce8';
      ctx.fillRect(0, 0, baseWidth, baseHeight);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, baseWidth, baseHeight);
    }

    // Draw chosen paper texture
    if (paperBg === 'grid') {
      ctx.save();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x <= baseWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, baseHeight);
        ctx.stroke();
      }
      for (let y = 0; y <= baseHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(baseWidth, y);
        ctx.stroke();
      }
      ctx.restore();
    } else if (paperBg === 'lined') {
      ctx.save();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.2;
      const lineSpacing = 28;
      for (let y = lineSpacing; y <= baseHeight; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(baseWidth, y);
        ctx.stroke();
      }
      ctx.restore();
    } else if (paperBg === 'dotted') {
      ctx.save();
      ctx.fillStyle = '#94a3b8';
      const dotSpacing = 20;
      for (let x = dotSpacing; x < baseWidth; x += dotSpacing) {
        for (let y = dotSpacing; y < baseHeight; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // Outer decorative border
    ctx.save();
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 3;
    drawCanvasRoundRect(ctx, 16, 16, baseWidth - 32, baseHeight - 32, 20);
    ctx.stroke();
    ctx.restore();

    let currentY = padding;

    // 5. Header Area
    ctx.save();
    ctx.fillStyle = '#faf5ff';
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 1.5;
    drawCanvasRoundRect(ctx, padding, currentY, innerWidth, headerHeight, 16);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.fillStyle = '#3b0764';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(rawTitle, padding + 20, currentY + 38);

    // Topic Category
    ctx.fillStyle = '#6b21a8';
    ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Topic: Chapter 5 Population Genetics (${card.category})`, padding + 20, currentY + 64);

    // Date & Page Badges (Top Right)
    const dateText = `Date: ${todayDateStr}`;
    const pageText = `Page ${card.id} of ${FLASHCARDS.length}`;
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    const dateWidth = ctx.measureText(dateText).width + 20;
    const pageWidth = ctx.measureText(pageText).width + 20;

    // Date pill
    ctx.fillStyle = '#f3e8ff';
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 1;
    drawCanvasRoundRect(ctx, padding + innerWidth - dateWidth - pageWidth - 24, currentY + 22, dateWidth, 28, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#581c87';
    ctx.fillText(dateText, padding + innerWidth - dateWidth - pageWidth - 14, currentY + 41);

    // Page pill
    drawCanvasRoundRect(ctx, padding + innerWidth - pageWidth - 16, currentY + 22, pageWidth, 28, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#581c87';
    ctx.fillText(pageText, padding + innerWidth - pageWidth - 6, currentY + 41);

    currentY += headerHeight + gap;
    ctx.restore();

    // 6. Flashcard Question Context Box
    ctx.save();
    ctx.fillStyle = '#f5f3ff';
    ctx.strokeStyle = '#ddd6fe';
    ctx.lineWidth = 1;
    drawCanvasRoundRect(ctx, padding, currentY, innerWidth, questionBoxHeight, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4c1d95';
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('REVISION FLASHCARD PROMPT:', padding + 16, currentY + 22);

    ctx.fillStyle = '#1e1b4b';
    ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    let displayQuestion = card.front;
    if (ctx.measureText(displayQuestion).width > innerWidth - 40) {
      while (displayQuestion.length > 20 && ctx.measureText(`${displayQuestion}...`).width > innerWidth - 40) {
        displayQuestion = displayQuestion.slice(0, -1);
      }
      displayQuestion += '...';
    }
    ctx.fillText(displayQuestion, padding + 16, currentY + 42);

    currentY += questionBoxHeight + gap;
    ctx.restore();

    // 7. Handwriting / Drawing Section
    ctx.save();
    ctx.fillStyle = '#581c87';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('HANDWRITTEN NOTES, SKETCHES & EQUATIONS:', padding, currentY - 4);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    drawCanvasRoundRect(ctx, padding, currentY, innerWidth, drawingBoxHeight, 14);
    ctx.fill();
    ctx.stroke();

    if (drawingImg) {
      const imgAspect = drawingImg.width / drawingImg.height;
      let drawW = innerWidth;
      let drawH = drawW / imgAspect;
      if (drawH > drawingBoxHeight) {
        drawH = drawingBoxHeight;
        drawW = drawH * imgAspect;
      }
      const drawX = padding + (innerWidth - drawW) / 2;
      const drawY = currentY + (drawingBoxHeight - drawH) / 2;

      ctx.drawImage(drawingImg, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[No handwritten drawing saved for this card]', padding + innerWidth / 2, currentY + drawingBoxHeight / 2);
      ctx.textAlign = 'start';
    }

    currentY += drawingBoxHeight + gap;
    ctx.restore();

    // 8. Typed Notes & Calculations Section
    ctx.save();
    ctx.fillStyle = '#581c87';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('TYPED NOTES & CALCULATIONS:', padding, currentY - 4);

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    drawCanvasRoundRect(ctx, padding, currentY, innerWidth, notesContentHeight, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = '14px "SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace';
    if (wrappedNotes.length > 0 && rawNotes.trim()) {
      let textY = currentY + 28;
      for (const line of wrappedNotes) {
        ctx.fillText(line, padding + 18, textY);
        textY += notesLineHeight;
      }
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('[No typed calculations or notes recorded]', padding + 18, currentY + 32);
    }

    currentY += notesContentHeight + gap;
    ctx.restore();

    // 9. Document Footer
    ctx.save();
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, currentY);
    ctx.lineTo(padding + innerWidth, currentY);
    ctx.stroke();

    ctx.fillStyle = '#7e22ce';
    ctx.font = '600 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('GenAIde Biology • Chapter 5 Population Genetics Study Scratchpad', padding, currentY + 26);

    ctx.fillStyle = '#6b21a8';
    ctx.textAlign = 'right';
    ctx.fillText(`Card #${card.id} of ${FLASHCARDS.length} • Exported on ${todayDateStr}`, padding + innerWidth, currentY + 26);
    ctx.restore();

    return exportCanvas;
  };

  // =========================================================================
  // EXPORT 1: DOWNLOAD CURRENT SCRATCHPAD AS HIGH-RESOLUTION PNG IMAGE
  // =========================================================================
  const handleDownloadImageCurrent = async () => {
    setIsDownloading(true);
    setDownloadProgress('Capturing scratchpad image...');
    try {
      const exportCanvas = await renderScratchpadToCanvas(currentCard.id);
      const blob = await new Promise<Blob | null>((resolve) => {
        exportCanvas.toBlob((b) => resolve(b), 'image/png');
      });

      if (!blob) {
        throw new Error('Failed to generate image blob');
      }

      const rawTitle = cardTitles[currentCard.id] || `Scratchpad_${currentCard.id}`;
      const cleanTitle = sanitizeFilename(rawTitle);
      const filename = `GenAIde_${cleanTitle}_${todayDateStr}.png`;
      
      triggerBlobDownload(blob, filename);
      showToast('✓ Scratchpad image downloaded.', 'success');
    } catch (err) {
      console.error('Failed to export image', err);
      showToast('⚠️ Unable to export the scratchpad. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  // =========================================================================
  // EXPORT 2: DOWNLOAD ALL SCRATCHPADS AS ZIP (ALL PAGES AS IMAGES)
  // =========================================================================
  const handleDownloadImageAllPages = async () => {
    setIsDownloading(true);
    setDownloadProgress('Generating ZIP archive of all pages...');
    try {
      const zip = new JSZip();

      for (let i = 0; i < FLASHCARDS.length; i++) {
        const card = FLASHCARDS[i];
        setDownloadProgress(`Rendering image for page ${i + 1} of ${FLASHCARDS.length}...`);

        const pageCanvas = await renderScratchpadToCanvas(card.id);
        const blob = await new Promise<Blob | null>((resolve) => {
          pageCanvas.toBlob((b) => resolve(b), 'image/png');
        });

        if (blob) {
          const rawTitle = cardTitles[card.id] || `Scratchpad_${card.id}`;
          const cleanTitle = sanitizeFilename(rawTitle);
          zip.file(`GenAIde_Page_${card.id}_${cleanTitle}.png`, blob);
        }
      }

      setDownloadProgress('Packaging ZIP archive...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      triggerBlobDownload(zipBlob, `GenAIde_All_Scratchpads_Pages_1-8_${todayDateStr}.zip`);

      showToast('✓ All scratchpad pages exported.', 'success');
    } catch (err) {
      console.error('Failed to export all pages as ZIP', err);
      showToast('⚠️ Unable to export the scratchpad. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  // =========================================================================
  // EXPORT 3: DOWNLOAD CURRENT SCRATCHPAD AS CLEAN A4 PDF
  // =========================================================================
  const handleDownloadPdfCurrent = async () => {
    setIsDownloading(true);
    setDownloadProgress('Generating PDF document...');
    try {
      const exportCanvas = await renderScratchpadToCanvas(currentCard.id);
      const imgData = exportCanvas.toDataURL('image/png');

      const orientation = exportCanvas.width > exportCanvas.height ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);

      const imgAspect = exportCanvas.width / exportCanvas.height;
      let renderWidth = availableWidth;
      let renderHeight = renderWidth / imgAspect;

      if (renderHeight > availableHeight) {
        renderHeight = availableHeight;
        renderWidth = renderHeight * imgAspect;
      }

      const xPos = margin + ((availableWidth - renderWidth) / 2);
      const yPos = margin + ((availableHeight - renderHeight) / 2);

      pdf.addImage(imgData, 'PNG', xPos, yPos, renderWidth, renderHeight, undefined, 'FAST');

      const rawTitle = cardTitles[currentCard.id] || `Scratchpad_${currentCard.id}`;
      const cleanTitle = sanitizeFilename(rawTitle);
      pdf.save(`GenAIde_${cleanTitle}_${todayDateStr}.pdf`);

      showToast('✓ Scratchpad PDF downloaded.', 'success');
    } catch (err) {
      console.error('Failed to export PDF', err);
      showToast('⚠️ Unable to export the scratchpad. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  // =========================================================================
  // EXPORT 4: DOWNLOAD MULTI-PAGE PDF (ALL SCRATCHPAD PAGES 1 TO 8)
  // =========================================================================
  const handleDownloadPdfAllPages = async () => {
    setIsDownloading(true);
    setDownloadProgress('Generating multi-page PDF document...');
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);

      for (let i = 0; i < FLASHCARDS.length; i++) {
        const card = FLASHCARDS[i];
        setDownloadProgress(`Rendering PDF page ${i + 1} of ${FLASHCARDS.length}...`);

        if (i > 0) {
          pdf.addPage();
        }

        const pageCanvas = await renderScratchpadToCanvas(card.id);
        const imgData = pageCanvas.toDataURL('image/png');
        const imgAspect = pageCanvas.width / pageCanvas.height;

        let renderWidth = availableWidth;
        let renderHeight = renderWidth / imgAspect;

        if (renderHeight > availableHeight) {
          renderHeight = availableHeight;
          renderWidth = renderHeight * imgAspect;
        }

        const xPos = margin + ((availableWidth - renderWidth) / 2);
        const yPos = margin + ((availableHeight - renderHeight) / 2);

        pdf.addImage(imgData, 'PNG', xPos, yPos, renderWidth, renderHeight, undefined, 'FAST');
      }

      pdf.save(`GenAIde_All_Scratchpads_Pages_1-8_${todayDateStr}.pdf`);
      showToast('✓ Scratchpad PDF downloaded.', 'success');
    } catch (err) {
      console.error('Failed to export multi-page PDF', err);
      showToast('⚠️ Unable to export the scratchpad. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Toast Notification Banner */}
      {toast && (
        <div 
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border font-bold text-xs sm:text-sm animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : 'bg-rose-50 text-rose-950 border-rose-300'
          }`}
        >
          {toast.type === 'success' ? (
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
          <FileText className="w-4 h-4 text-purple-700" />
          <span>High-Yield Revision & Flashcards</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
              Study Notes & Interactive Flashcards
            </h2>
            <p className="text-xs sm:text-sm text-purple-800">
              High-yield Chapter 5 summary notes, concept flashcards, and an <strong>interactive scratchpad</strong> for handwriting, drawing, and calculation.
            </p>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied Cheatsheet!' : 'Copy Summary Notes'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Deck Selector + Active Card + Scratchpad */}
      <div className="space-y-4">
        {/* Card Selector Deck Bar */}
        <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-extrabold text-purple-950 whitespace-nowrap flex items-center gap-1">
              <Layers className="w-4 h-4 text-purple-700" />
              <span>Select Card &amp; Scratchpad:</span>
            </span>
            {FLASHCARDS.map((fc, idx) => (
              <button
                key={fc.id}
                onClick={() => {
                  setCurrentCardIdx(idx);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
                  currentCardIdx === idx
                    ? 'bg-purple-800 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                Card {fc.id}
              </button>
            ))}
          </div>

          <div className="text-xs text-purple-700 font-bold hidden md:block">
            Viewing: <strong>Card #{currentCard.id} ({currentCard.category})</strong>
          </div>
        </div>

        {/* Card & Scratchpad Workspace Grid */}
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-md space-y-6">
          {/* Workspace Info Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-700" />
              <div>
                <h3 className="font-extrabold text-lg text-purple-950">
                  Flashcard #{currentCard.id}: {currentCard.front.split('?')[0]}
                </h3>
                <p className="text-xs text-purple-700">
                  Topic Category: <strong className="text-purple-900">{currentCard.category}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-950 font-extrabold border border-purple-300">
                Card {currentCardIdx + 1} of {FLASHCARDS.length}
              </span>
            </div>
          </div>

          {/* Grid Layout: Left Flashcard | Right Scratchpad Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* ========================================================= */}
            {/* LEFT COLUMN: INTERACTIVE FLASHCARD                        */}
            {/* ========================================================= */}
            <div className="space-y-4 flex flex-col justify-between h-full">
              <div>
                <div className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Interactive Concept Card</span>
                  <span className="text-[11px] text-purple-600 font-semibold italic">Tap card to flip answer</span>
                </div>

                {/* Flip Card Box */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-[290px] p-6 rounded-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 text-white border-2 border-purple-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-300 transition-all select-none shadow-lg group relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-950/80 text-amber-300 border border-purple-600 flex items-center gap-1">
                    <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                    <span>{isFlipped ? 'ANSWER REVEALED' : 'QUESTION'}</span>
                  </div>

                  <div className="text-xs font-extrabold uppercase tracking-widest text-purple-300 mb-3">
                    {isFlipped ? 'Answer:' : 'Revision Question:'}
                  </div>

                  <div className="text-base sm:text-lg font-bold text-white whitespace-pre-line leading-relaxed max-w-md">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </div>

                  <div className="mt-6 text-[11px] text-purple-300 font-medium">
                    (Click anywhere on card to {isFlipped ? 'show question' : 'flip answer'})
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevCard}
                  className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Card</span>
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  Flip Card
                </button>

                <button
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <span>Next Card</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN: GENAIde SCRATCHPAD WORKSPACE                */}
            {/* ========================================================= */}
            <div className="space-y-4">
              
              {/* Paper Texture & Options Selector (Outside Export Container) */}
              <div className="bg-purple-50/90 p-3 rounded-xl border border-purple-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-purple-950 flex items-center gap-1">
                    <span>Paper Style:</span>
                  </span>
                  {(['white', 'grid', 'lined', 'dotted', 'cream'] as PaperBg[]).map((bgType) => (
                    <button
                      key={bgType}
                      onClick={() => handlePaperBgChange(bgType)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        currentPaperBg === bgType
                          ? 'bg-purple-800 text-white shadow-xs'
                          : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      {bgType}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-purple-700 font-semibold">
                  <Tablet className="w-3.5 h-3.5 text-purple-600" />
                  <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                  <span>Stylus &amp; Touch Active</span>
                </div>
              </div>

              {/* Drawing Toolbar (Pen, Pencil, Highlighter, Colors, Sizes) */}
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Tools: Pen, Pencil, Highlighter, Eraser */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDrawTool('pen')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                      drawTool === 'pen'
                        ? 'bg-purple-800 text-white shadow-xs'
                        : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                    }`}
                    title="Pen (Solid handwriting)"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Pen</span>
                  </button>

                  <button
                    onClick={() => setDrawTool('pencil')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                      drawTool === 'pencil'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                    }`}
                    title="Pencil (Fine sketch lines)"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Pencil</span>
                  </button>

                  <button
                    onClick={() => setDrawTool('highlighter')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                      drawTool === 'highlighter'
                        ? 'bg-amber-400 text-purple-950 font-black shadow-xs'
                        : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                    }`}
                    title="Highlighter (Translucent accent marks)"
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                    <span>Highlighter</span>
                  </button>

                  <button
                    onClick={() => setDrawTool('eraser')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                      drawTool === 'eraser'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                    }`}
                    title="Eraser (Clean erasure)"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span>Eraser</span>
                  </button>
                </div>

                {/* Colors: Pen Palette vs Highlighter Palette */}
                {drawTool === 'highlighter' ? (
                  <div className="flex items-center gap-1">
                    {HIGHLIGHTER_COLORS.map((hc) => (
                      <button
                        key={hc.name}
                        onClick={() => setHighlighterColor(hc.value)}
                        style={{ backgroundColor: hc.value }}
                        className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-transform ${
                          highlighterColor === hc.value ? 'border-purple-950 scale-125 shadow-xs' : 'border-slate-300'
                        }`}
                        title={hc.name}
                      />
                    ))}
                  </div>
                ) : drawTool === 'pencil' ? (
                  <span className="text-[10px] font-mono text-slate-500 font-bold">Graphite #475569</span>
                ) : (
                  <div className="flex items-center gap-1">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setPenColor(c.value)}
                        style={{ backgroundColor: c.value }}
                        className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-transform ${
                          penColor === c.value ? 'border-purple-950 scale-125 shadow-xs' : 'border-white opacity-80'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                )}

                {/* Stroke Size */}
                <div className="flex items-center gap-1 text-[10px] font-bold text-purple-900">
                  <span>Size:</span>
                  {[2, 4, 7].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setPenWidth(sz)}
                      className={`px-2 py-0.5 rounded font-mono cursor-pointer ${
                        penWidth === sz ? 'bg-purple-900 text-white font-extrabold' : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      {sz === 2 ? 'S' : sz === 4 ? 'M' : 'L'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Math & Biology Quick Symbol Stamps */}
              <div className="bg-purple-50/70 p-2 rounded-xl border border-purple-200 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-extrabold text-purple-900 mr-1 flex items-center gap-1">
                  <span>Formula Stamps:</span>
                </span>
                {['p²', '2pq', 'q²', 'p', 'q', '√', '1-q', '→', 'AA', 'Aa', 'aa'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleInsertSymbol(sym)}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-purple-100 text-purple-950 font-mono font-bold text-[11px] border border-purple-200 cursor-pointer transition-all active:scale-95"
                    title={`Insert ${sym} into typed notes`}
                  >
                    {sym}
                  </button>
                ))}
              </div>

              {/* ========================================================= */}
              {/* THE CLEAN EXPORTABLE SCRATCHPAD DOCUMENT CONTAINER        */}
              {/* Captured by html2canvas; contains ONLY the student work   */}
              {/* ========================================================= */}
              <div
                ref={scratchpadDocRef}
                id={`scratchpad-doc-${currentCard.id}`}
                className="p-5 rounded-2xl border-2 border-purple-300 shadow-sm space-y-3 transition-all select-none"
                style={getPaperBgStyle(currentPaperBg)}
              >
                {/* Document Header (Included in PNG and PDF export) */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200/90 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-purple-100 text-purple-800">
                      <PenTool className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={cardTitles[currentCard.id] || `Scratchpad ${currentCard.id}`}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder={`Scratchpad ${currentCard.id}`}
                        className="font-black text-sm sm:text-base text-purple-950 bg-transparent border-b border-transparent hover:border-purple-300 focus:border-purple-600 focus:outline-hidden px-1"
                        title="Click to rename this scratchpad"
                      />
                      <div className="text-[10px] text-purple-700 font-semibold px-1">
                        Topic: <span className="text-purple-900 font-bold">{currentCard.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-purple-900 font-semibold">
                    <div className="flex items-center gap-1 bg-purple-100/90 px-2 py-0.5 rounded-lg border border-purple-200 text-[11px]">
                      <Calendar className="w-3 h-3 text-purple-700" />
                      <span>{todayDateStr}</span>
                    </div>
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200/80 text-purple-950">
                      Page {currentCard.id} of {FLASHCARDS.length}
                    </div>
                  </div>
                </div>

                {/* Handwriting / Drawing Canvas Surface */}
                <div className="relative rounded-xl border border-purple-300/80 overflow-hidden bg-transparent shadow-inner">
                  <div className="absolute top-1.5 right-2 pointer-events-none text-[9px] text-purple-400 font-bold uppercase tracking-widest opacity-60">
                    Handwriting &amp; Touch Canvas
                  </div>

                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-52 sm:h-64 cursor-crosshair touch-none"
                    style={{ touchAction: 'none' }}
                  />
                </div>

                {/* Typed Notes & Equations Area */}
                <div className="space-y-1">
                  <div className="text-[11px] font-extrabold text-purple-950 flex items-center justify-between">
                    <span>Typed Notes &amp; Calculations (Card #{currentCard.id}):</span>
                    {isSavedNotice && (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Auto-Saved
                      </span>
                    )}
                  </div>
                  <textarea
                    value={cardTextNotes[currentCard.id] || ''}
                    onChange={(e) => handleTextNoteChange(e.target.value)}
                    placeholder={`Type calculations, working steps, or revision notes for Card #${currentCard.id}...`}
                    className="w-full h-24 p-2.5 rounded-xl border border-purple-300 bg-white/90 backdrop-blur-xs font-mono text-xs text-purple-950 leading-relaxed focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                {/* Watermark / Footer in Document Area */}
                <div className="text-[10px] text-purple-800 font-semibold pt-2 border-t border-purple-200/80 flex items-center justify-between">
                  <span>GenAIde Chapter 5 Population Genetics</span>
                  <span>Scratchpad {currentCard.id} ({currentCard.category})</span>
                </div>
              </div>

              {/* ========================================================= */}
              {/* RECOMMENDED SCRATCHPAD FOOTER (Section 18 & 19)           */}
              {/* Controls: Undo, Redo, Clear | Export: Image, PDF          */}
              {/* ========================================================= */}
              <div className="bg-purple-100/70 p-3 rounded-2xl border-2 border-purple-200 flex flex-wrap items-center justify-between gap-3">
                {/* Undo, Redo, Clear Controls */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-purple-950 mr-1">
                    Scratchpad:
                  </span>
                  <button
                    onClick={handleUndo}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-2xs"
                    title="Undo last stroke"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Undo</span>
                  </button>

                  <button
                    onClick={handleRedo}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-2xs"
                    title="Redo stroke"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                    <span>Redo</span>
                  </button>

                  <button
                    onClick={promptClear}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-2xs"
                    title="Clear current scratchpad"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Clear</span>
                  </button>
                </div>

                {/* Quick Export Mini Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-purple-950">
                    Export:
                  </span>
                  <button
                    onClick={handleDownloadImageCurrent}
                    disabled={isDownloading}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                    title="Download current scratchpad as PNG image"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image</span>
                  </button>

                  <button
                    onClick={handleDownloadPdfCurrent}
                    disabled={isDownloading}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                    title="Download current scratchpad as PDF document"
                  >
                    <FileType className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION 1: DEDICATED DOWNLOAD SCRATCHPAD SECTION          */}
              {/* Clear, prominent, non-intrusive export center             */}
              {/* ========================================================= */}
              <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 p-5 rounded-2xl text-white border-2 border-purple-700 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>Download Scratchpad</span>
                    </h3>
                    <p className="text-xs text-purple-200">
                      Save your calculations, diagrams, and handwriting to your device.
                    </p>
                  </div>

                  {downloadProgress && (
                    <div className="text-xs font-bold text-amber-300 bg-purple-900/90 px-3 py-1 rounded-lg border border-purple-600 animate-pulse">
                      {downloadProgress}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Download as Image (PNG) */}
                  <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-700/80 flex flex-col justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5 mb-1">
                        <ImageIcon className="w-4 h-4" />
                        <span>Download as Image (PNG)</span>
                      </div>
                      <p className="text-[11px] text-purple-200 leading-snug">
                        High-quality sharp PNG preserving your handwriting, drawings, and paper background.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleDownloadImageCurrent}
                        disabled={isDownloading}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-purple-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-purple-950" />
                        <span>Current Page</span>
                      </button>

                      <button
                        onClick={handleDownloadImageAllPages}
                        disabled={isDownloading}
                        className="py-2 px-3 rounded-xl bg-purple-800 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs border border-purple-500 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        title="Download all scratchpad pages as ZIP archive"
                      >
                        <Archive className="w-3.5 h-3.5 text-amber-300" />
                        <span>All (ZIP)</span>
                      </button>
                    </div>
                  </div>

                  {/* Download as PDF */}
                  <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-700/80 flex flex-col justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5 mb-1">
                        <FileType className="w-4 h-4" />
                        <span>Download as PDF</span>
                      </div>
                      <p className="text-[11px] text-purple-200 leading-snug">
                        Clean A4 document containing your complete notes and diagrams without website clutter.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleDownloadPdfCurrent}
                        disabled={isDownloading}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-purple-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileType className="w-3.5 h-3.5 text-purple-950" />
                        <span>Current Page</span>
                      </button>

                      <button
                        onClick={handleDownloadPdfAllPages}
                        disabled={isDownloading}
                        className="py-2 px-3 rounded-xl bg-purple-800 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs border border-purple-500 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        title="Export all 8 scratchpads into a multi-page PDF"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-300" />
                        <span>All (Multi-Page)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CLEAR SCRATCHPAD CONFIRMATION MODAL (Section 19)          */}
      {/* ========================================================= */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl border-2 border-purple-200 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-black text-purple-950">Clear Scratchpad Work?</h4>
            </div>

            <p className="text-xs text-purple-800 leading-relaxed">
              Clear all your handwriting, drawings, and typed notes for <strong>Scratchpad {currentCard.id}</strong>? Your other scratchpads will remain safe.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeClear}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Clear Scratchpad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
