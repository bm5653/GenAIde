import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Clock, 
  Brain,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ExitQuestion {
  id: number;
  scenario: string;
  question: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

const EXIT_QUESTIONS: ExitQuestion[] = [
  {
    id: 1,
    scenario: "In a population of rabbits in Hardy-Weinberg equilibrium, 9% of the rabbits have white fur (recessive phenotype, bb).",
    question: "What is the expected frequency of homozygous dominant rabbits (BB)?",
    options: [
      { text: "q² = 0.09 → q = 0.30 → p = 0.70 → p² = (0.70)² = 0.49", isCorrect: true, explanation: "Correct! q = √0.09 = 0.30. Dominant allele p = 1 - 0.30 = 0.70. Therefore p² = (0.70)² = 0.49." },
      { text: "1 - 0.09 = 0.91", isCorrect: false, explanation: "0.91 is the combined frequency of dominant phenotypes (p² + 2pq), not just homozygous dominant (p²)." },
      { text: "(0.09)² = 0.0081", isCorrect: false, explanation: "0.09 is already q², you do not square it again." },
      { text: "2 × 0.70 × 0.30 = 0.42", isCorrect: false, explanation: "0.42 is 2pq (heterozygous carriers), not homozygous dominant (p²)." }
    ]
  },
  {
    id: 2,
    scenario: "A survey of 1000 sheep finds that 840 sheep have white wool (dominant) and 160 sheep have black wool (recessive).",
    question: "What is the recessive allele frequency (q) in this sheep population?",
    options: [
      { text: "0.16", isCorrect: false, explanation: "0.16 is q² (the homozygous recessive genotype frequency), not q!" },
      { text: "0.40", isCorrect: true, explanation: "Spot on! q² = 160/1000 = 0.16. Therefore q = √0.16 = 0.40." },
      { text: "0.60", isCorrect: false, explanation: "0.60 is p (dominant allele frequency), because p = 1 - 0.40." },
      { text: "0.84", isCorrect: false, explanation: "0.84 is the dominant phenotype frequency." }
    ]
  },
  {
    id: 3,
    scenario: "In a college of 1200 students, 200 students have facial dimples (dominant trait).",
    question: "Why is it a FATAL ERROR to write p² = 200/1200 = 0.167?",
    options: [
      { text: "Because dimples is controlled by 3 alleles.", isCorrect: false, explanation: "No, dimples is a single-gene Mendelian trait." },
      { text: "Because students with dimples consist of BOTH homozygous dominant (p²) AND heterozygous (2pq) genotypes.", isCorrect: true, explanation: "Exact! The 200 dimpled students are p² + 2pq. Non-dimpled students (1000) are homozygous recessive q²." },
      { text: "Because you forgot to multiply by 100.", isCorrect: false, explanation: "The error is biological/genotypic, not percentage conversion." },
      { text: "Because p² is always 1.", isCorrect: false, explanation: "p² is not always 1." }
    ]
  },
  {
    id: 4,
    scenario: "You are calculating allele frequencies for a flock of 450 geese under standard Matriculation syllabus rules.",
    question: "If no decimal places are specified in the question, to how many decimal places should your final answers be rounded?",
    options: [
      { text: "1 decimal place", isCorrect: false, explanation: "1 d.p. is for small populations between 10 and 99." },
      { text: "2 decimal places", isCorrect: true, explanation: "Correct! For populations between 100 and 999, the official standard is 2 decimal places." },
      { text: "3 decimal places", isCorrect: false, explanation: "3 d.p. is for populations of 1000 or greater." },
      { text: "4 decimal places", isCorrect: false, explanation: "4 d.p. is only used if explicitly instructed." }
    ]
  },
  {
    id: 5,
    scenario: "An exam problem asks: 'In a human population of 25,000, calculate the allele frequencies to 5 decimal places.' A student writes: 'p = 0.98, q = 0.02'.",
    question: "Why would this student lose marks in the Matriculation biology exam?",
    options: [
      { text: "Because allele frequencies must always sum to 100%.", isCorrect: false, explanation: "Allele frequencies sum to 1.0 (or 100%), but that is not why marks were deducted." },
      { text: "Because the question explicitly specified 5 decimal places (e.g., p = 0.98125), and ignoring stated precision instructions loses marks.", isCorrect: true, explanation: "Correct! Always obey question-specific decimal instructions (e.g. 5 decimal places for large genetic disease surveys)!" },
      { text: "Because p cannot exceed 0.90 in humans.", isCorrect: false, explanation: "Allele frequencies can take any value between 0 and 1." },
      { text: "Because Hardy-Weinberg never applies to human populations.", isCorrect: false, explanation: "Hardy-Weinberg principles frequently apply to autosomal traits in human populations." }
    ]
  }
];

export const ExitTicketView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const q = EXIT_QUESTIONS[currentIdx];

  const handleSelect = (optIdx: number) => {
    if (selectedOption !== null) return; // Prevent changing after pick
    setSelectedOption(optIdx);
    setAnswers(prev => ({ ...prev, [q.id]: optIdx }));
  };

  const handleNext = () => {
    if (currentIdx < EXIT_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      // Trigger celebration if high score
      const finalScore = calculateScore();
      if (finalScore >= 4) {
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch {}
      }
    }
  };

  const calculateScore = () => {
    let score = 0;
    EXIT_QUESTIONS.forEach(item => {
      const picked = answers[item.id];
      if (picked !== undefined && item.options[picked]?.isCorrect) {
        score += 1;
      }
    });
    return score;
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers({});
    setIsFinished(false);
  };

  const score = calculateScore();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
          <Target className="w-4 h-4 text-amber-700" />
          <span>Post-Lesson Diagnostic Check</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
          Chapter 5 Exit Ticket Diagnostic
        </h2>
        <p className="text-xs sm:text-sm text-purple-800">
          5 high-yield exam scenarios testing your conceptual reflexes, decimal rules, and non-H-W diagnostic intuition.
        </p>
      </div>

      {!isFinished ? (
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 shadow-xs space-y-5">
          {/* Progress row */}
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md">
              Question {currentIdx + 1} of {EXIT_QUESTIONS.length}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold">
              <Brain className="w-4 h-4" />
              <span>Diagnostic Reflector</span>
            </div>
          </div>

          {/* Scenario Context */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-1 text-xs sm:text-sm">
            <div className="font-bold text-purple-900 uppercase tracking-wider text-[11px]">
              Scenario:
            </div>
            <p className="text-purple-950 font-medium leading-relaxed">
              {q.scenario}
            </p>
          </div>

          {/* Question Stem */}
          <h3 className="text-base sm:text-lg font-bold text-purple-950">
            {q.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              const isPicked = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-3.5 rounded-xl text-xs sm:text-sm font-semibold text-left border transition-all flex items-start gap-3 ${
                    selectedOption !== null
                      ? opt.isCorrect
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-xs'
                        : isPicked
                        ? 'bg-red-100 border-red-400 text-red-950'
                        : 'bg-gray-50 border-gray-200 opacity-60 text-gray-700'
                      : 'bg-white hover:bg-purple-50 text-purple-950 border-purple-200 active:scale-[0.99]'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {selectedOption !== null && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {selectedOption !== null && isPicked && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Explanation upon pick */}
          {selectedOption !== null && (
            <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
              q.options[selectedOption].isCorrect
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                : 'bg-red-50 border border-red-300 text-red-900'
            }`}>
              <strong>{q.options[selectedOption].isCorrect ? '✓ Exact! ' : '✗ Incorrect: '}</strong>
              {q.options[selectedOption].explanation}
            </div>
          )}

          {/* Next Button */}
          {selectedOption !== null && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
              >
                <span>{currentIdx < EXIT_QUESTIONS.length - 1 ? 'Next Scenario' : 'View Diagnostic Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Summary Screen */
        <div className="bg-white p-8 rounded-2xl border-2 border-purple-200 shadow-md space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-800 mx-auto flex items-center justify-center shadow-xs">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-purple-950">
              Exit Ticket Diagnostic Completed!
            </h3>
            <p className="text-sm text-purple-700 font-medium">
              You scored <span className="font-extrabold text-purple-950 text-base">{score}</span> out of <span className="font-extrabold text-purple-950 text-base">{EXIT_QUESTIONS.length}</span> ({Math.round(score / EXIT_QUESTIONS.length * 100)}%)
            </p>
          </div>

          {/* Diagnostic Badge */}
          <div className="max-w-md mx-auto p-4 rounded-xl border text-xs sm:text-sm leading-relaxed bg-purple-50 text-purple-950 border-purple-200">
            {score === 5 ? (
              <div>
                🎉 <strong>Distinction Level:</strong> Flawless reflex! You distinguish H-W equilibrium from gene pool counting, apply recessive-first priority, and observe decimal rules accurately.
              </div>
            ) : score >= 3 ? (
              <div>
                👍 <strong>Solid Foundation:</strong> Good understanding of the core formulas. Review <em>PopGen Pitfalls</em> to eliminate small traps around population size changes and dominant trait wording.
              </div>
            ) : (
              <div>
                📚 <strong>Recommended Action:</strong> Revisit the <em>POP GEN 4-Step Strategy</em> and the <em>PopGen Pitfalls</em> to master the calculation sequence before your next exam.
              </div>
            )}
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs sm:text-sm shadow-md inline-flex items-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exit Ticket</span>
          </button>
        </div>
      )}
    </div>
  );
};
