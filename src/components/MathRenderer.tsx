import React from 'react';

interface MathRendererProps {
  content: string;
  className?: string;
}

// Helper to replace math tokens (p², q², 2pq, p+q=1, etc.) within any string
const renderInlineTokens = (text: string): React.ReactNode[] => {
  // Regex to match math patterns:
  // p^2, q^2, p^{2}, q^{2}, p², q², 2pq, 2PQ, p + q = 1, p² + 2pq + q² = 1, p^2 + 2pq + q^2 = 1, √q², \sqrt{q^2}, \sqrt{q²}, \frac{...}{...}
  const regex = /(p\^\{?2\}?|q\^\{?2\}?|p²|q²|2pq|2PQ|p\s*\+\s*q\s*=\s*1|p[²\^2]+\s*\+\s*2pq\s*\+\s*q[²\^2]+\s*=\s*1|√\s*q[²\^2]+|\\sqrt\{q\^?2?\}|\\sqrt\{q²\}|\\frac\{[^}]+\}\{[^}]+\})/gi;

  const parts = text.split(regex);

  return parts.map((token, idx) => {
    if (!token) return null;

    const lower = token.toLowerCase().replace(/\s+/g, '');

    // Check for p² / p^2 / p^{2}
    if (lower === 'p^2' || lower === 'p^{2}' || lower === 'p²') {
      return (
        <span key={idx} className="font-mono font-bold text-inherit whitespace-nowrap">
          <i>p</i><sup className="text-[0.75em] font-bold">2</sup>
        </span>
      );
    }

    // Check for q² / q^2 / q^{2}
    if (lower === 'q^2' || lower === 'q^{2}' || lower === 'q²') {
      return (
        <span key={idx} className="font-mono font-bold text-inherit whitespace-nowrap">
          <i>q</i><sup className="text-[0.75em] font-bold">2</sup>
        </span>
      );
    }

    // Check for 2pq
    if (lower === '2pq') {
      return (
        <span key={idx} className="font-mono font-bold text-inherit whitespace-nowrap">
          2<i>pq</i>
        </span>
      );
    }

    // Check for p + q = 1
    if (lower === 'p+q=1') {
      return (
        <span key={idx} className="font-mono font-bold text-inherit whitespace-nowrap">
          <i>p</i> + <i>q</i> = 1
        </span>
      );
    }

    // Check for p² + 2pq + q² = 1
    if (lower.includes('p') && lower.includes('2pq') && lower.includes('q') && lower.includes('=1')) {
      return (
        <span key={idx} className="font-mono font-bold text-inherit whitespace-nowrap">
          <i>p</i><sup className="text-[0.75em]">2</sup> + 2<i>pq</i> + <i>q</i><sup className="text-[0.75em]">2</sup> = 1
        </span>
      );
    }

    // Check for square root √q² or \sqrt{q^2}
    if (lower.startsWith('√') || lower.startsWith('\\sqrt')) {
      return (
        <span key={idx} className="font-mono font-bold text-inherit whitespace-nowrap">
          √<i>q</i><sup className="text-[0.75em]">2</sup>
        </span>
      );
    }

    // Check for LaTeX fractions
    if (token.startsWith('\\frac{')) {
      const fracMatch = token.match(/\\frac\{([^}]+)\}\{([^}]+)\}/);
      if (fracMatch) {
        return (
          <span key={idx} className="inline-flex flex-col items-center align-middle mx-1 text-[0.85em] leading-tight font-mono font-semibold">
            <span className="border-b border-current px-1">{renderInlineTokens(fracMatch[1])}</span>
            <span className="px-1">{renderInlineTokens(fracMatch[2])}</span>
          </span>
        );
      }
    }

    return <span key={idx}>{token}</span>;
  });
};

// Function to format inline markdown (bold, italic, code) and math symbols
export const formatMathString = (text: string): React.ReactNode[] => {
  // Normalize LaTeX delimiters like $...$ or \(...\)
  const cleanText = text.replace(/\$([^$]+)\$/g, '$1');
  const lines = cleanText.split('\n');

  return lines.map((line, lineIdx) => {
    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('* ');
    const isQuote = line.trim().startsWith('>');

    // Split line by bold `**...**` and italic `*...*` and inline code `` `...` ``
    const segments = line.split(/(\*\*.*?\*\*|\*[^*]+\*|`[^`]+`)/g);

    const formattedSegments = segments.map((seg, sIdx) => {
      if (!seg) return null;

      // Bold: **text**
      if (seg.startsWith('**') && seg.endsWith('**') && seg.length >= 4) {
        const inner = seg.slice(2, -2);
        return (
          <strong key={sIdx} className="font-bold text-inherit">
            {renderInlineTokens(inner)}
          </strong>
        );
      }

      // Italic: *text*
      if (seg.startsWith('*') && seg.endsWith('*') && !seg.startsWith('**') && seg.length >= 2) {
        const inner = seg.slice(1, -1);
        return (
          <em key={sIdx} className="italic text-inherit">
            {renderInlineTokens(inner)}
          </em>
        );
      }

      // Inline code: `text`
      if (seg.startsWith('`') && seg.endsWith('`') && seg.length >= 2) {
        const inner = seg.slice(1, -1);
        return (
          <code key={sIdx} className="px-1.5 py-0.5 rounded bg-purple-100/80 text-purple-950 font-mono text-[0.9em] font-semibold">
            {renderInlineTokens(inner)}
          </code>
        );
      }

      // Regular text segment
      return <React.Fragment key={sIdx}>{renderInlineTokens(seg)}</React.Fragment>;
    });

    if (isQuote) {
      return (
        <blockquote key={lineIdx} className="border-l-3 border-purple-500 pl-3 my-1.5 text-purple-900 bg-purple-50/50 py-1 rounded-r-lg italic">
          {formattedSegments}
        </blockquote>
      );
    }

    return (
      <div key={lineIdx} className={`${lineIdx > 0 ? 'mt-1' : ''} ${isBullet ? 'pl-2' : ''}`}>
        {formattedSegments}
      </div>
    );
  });
};

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const paragraphs = content.split('\n\n');

  return (
    <div className={`space-y-2.5 text-xs sm:text-sm leading-relaxed ${className}`}>
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Headings ### Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-purple-950 text-sm sm:text-base border-b border-purple-200/80 pb-1 mt-3 mb-1.5 flex items-center gap-1.5">
              {formatMathString(trimmed.replace('### ', ''))}
            </h4>
          );
        }

        // Headings ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-extrabold text-purple-950 text-base sm:text-lg border-b border-purple-300 pb-1 mt-4 mb-2">
              {formatMathString(trimmed.replace('## ', ''))}
            </h3>
          );
        }

        return (
          <div key={idx} className="font-sans text-inherit">
            {formatMathString(trimmed)}
          </div>
        );
      })}
    </div>
  );
};
