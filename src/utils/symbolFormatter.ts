import { StepItem } from '../types';

/**
 * Utility to format mathematical and population genetics symbols cleanly.
 * Converts raw LaTeX expressions, ASCII formulas, sqrt, and exponents into
 * official curriculum-standard Unicode symbols (e.g. q², p², 2pq, √q², →, ×, etc.).
 */

export function getStandardFullDescription(
  step: StepItem,
  questionText?: string
): { fullPrefix: string; description: string; symbol: string } {
  const symbol = step.expectedSymbol || '';
  const desc = step.symbolDescription || '';
  const title = step.title || '';
  const instruction = step.instruction || '';
  const concept = step.expectedConcept || '';

  // 1. If step.symbolDescription exists, use it directly as specified
  if (desc) {
    if (symbol) {
      return {
        fullPrefix: `${desc}, ${symbol} = `,
        description: desc,
        symbol
      };
    } else {
      return {
        fullPrefix: `${desc} = `,
        description: desc,
        symbol: ''
      };
    }
  }

  const combined = `${title} ${instruction} ${concept} ${questionText || ''}`.toLowerCase();

  // 2. Check for "number of ..." phrasing in step or question
  if (combined.includes('number of')) {
    const match = (title + ' ' + instruction + ' ' + concept).match(/number of\s+([a-z0-9\s-]+?)(?=\s+(?:in|for|of|is|are|with|who|to|from|\.|\,|$))/i) ||
                  (questionText || '').match(/number of\s+([a-z0-9\s-]+?)(?=\s+(?:in|for|of|is|are|with|who|to|from|\.|\,|$))/i) ||
                  title.match(/number of [a-z0-9\s-]+/i) ||
                  concept.match(/number of [a-z0-9\s-]+/i);
    if (match) {
      let raw = match[0].trim();
      const capitalized = raw.charAt(0).toUpperCase() + raw.slice(1);
      return {
        fullPrefix: `${capitalized}${symbol ? `, ${symbol}` : ''} = `,
        description: capitalized,
        symbol: symbol || ''
      };
    }
  }

  // 3. Check for "percentage of ..." phrasing
  if (combined.includes('percentage of')) {
    const match = (title + ' ' + instruction + ' ' + concept).match(/percentage of\s+([a-z0-9\s-]+?)(?=\s+(?:in|for|of|is|are|with|who|to|from|\.|\,|$))/i) ||
                  (questionText || '').match(/percentage of\s+([a-z0-9\s-]+?)(?=\s+(?:in|for|of|is|are|with|who|to|from|\.|\,|$))/i);
    if (match) {
      let raw = match[0].trim();
      const capitalized = raw.charAt(0).toUpperCase() + raw.slice(1);
      return {
        fullPrefix: `${capitalized} = `,
        description: capitalized,
        symbol: ''
      };
    }
  }

  // 4. Standard Hardy-Weinberg terms
  if (concept.includes('q²') || title.includes('q²') || combined.includes('homozygous recessive')) {
    return {
      fullPrefix: 'Frequency of homozygous recessive genotype, q² = ',
      description: 'Frequency of homozygous recessive genotype',
      symbol: 'q²'
    };
  }
  if (concept.includes('p²') || title.includes('p²') || combined.includes('homozygous dominant')) {
    return {
      fullPrefix: 'Frequency of homozygous dominant genotype, p² = ',
      description: 'Frequency of homozygous dominant genotype',
      symbol: 'p²'
    };
  }
  if (concept.includes('2pq') || title.includes('2pq') || combined.includes('heterozyg') || combined.includes('carrier')) {
    return {
      fullPrefix: 'Frequency of heterozygous genotype, 2pq = ',
      description: 'Frequency of heterozygous genotype',
      symbol: '2pq'
    };
  }
  if (symbol === 'q' || concept.startsWith('q =') || title.includes('q ') || combined.includes('recessive allele')) {
    return {
      fullPrefix: 'Frequency of recessive allele, q = ',
      description: 'Frequency of recessive allele',
      symbol: 'q'
    };
  }
  if (symbol === 'p' || concept.startsWith('p =') || title.includes('p ') || combined.includes('dominant allele')) {
    return {
      fullPrefix: 'Frequency of dominant allele, p = ',
      description: 'Frequency of dominant allele',
      symbol: 'p'
    };
  }

  return {
    fullPrefix: '',
    description: '',
    symbol: ''
  };
}

export function formatPopGenSymbols(text: string): string {
  if (!text) return '';

  let res = text;

  // 1. Remove double backslashes that might come from escaped JS/JSON strings
  res = res.replace(/\\\\([a-zA-Z]+)/g, '\\$1');

  // 2. LaTeX formatting wrappers
  res = res.replace(/\\(?:text|mathrm|mathbf|mathit)\{([^{}]+)\}/g, '$1');
  res = res.replace(/\\left\s*([(\[{|])/g, '$1');
  res = res.replace(/\\right\s*([)\]}|])/g, '$1');

  // 3. Convert LaTeX fractions: \frac{numerator}{denominator} and \dfrac{...}{...}
  res = res.replace(/\\d?frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1) / ($2)');
  res = res.replace(/\\d?frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1) / ($2)');

  // 4. Convert roots: \sqrt{...}, \sqrt x, sqrt(...), sqrt x, \surd
  res = res.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  res = res.replace(/\\sqrt\s*([a-zA-Z0-9²³\.\_]+)/g, '√$1');
  res = res.replace(/\bsqrt\s*\(([^{}()]+)\)/gi, '√($1)');
  res = res.replace(/\bsqrt\s+([a-zA-Z0-9²³\.\_]+)/gi, '√$1');
  res = res.replace(/\\surd/g, '√');

  // 5. Common LaTeX & ASCII operators and relations
  res = res.replace(/\\approx\b|~=/g, '≈');
  res = res.replace(/\\pm\b|\+-/g, '±');
  res = res.replace(/\\(?:ge|geq)\b|>=/g, '≥');
  res = res.replace(/\\(?:le|leq)\b|<=/g, '≤');
  res = res.replace(/\\(?:ne|neq)\b|!=|<>/g, '≠');
  res = res.replace(/\\times\b/g, '×');
  res = res.replace(/\\cdot\b/g, '·');
  res = res.replace(/\\div\b/g, '÷');
  res = res.replace(/\\(?:dots|ldots)\b/g, '…');
  res = res.replace(/\\quad\b/g, ' ');
  res = res.replace(/\\qquad\b/g, '  ');
  res = res.replace(/\\sum\b/g, '∑');
  res = res.replace(/\\Delta\b/g, 'Δ');
  res = res.replace(/\\mu\b/g, 'μ');
  res = res.replace(/\\chi\b/g, 'χ');

  // 6. Multiplication asterisk between numbers/variables e.g. 2 * p * q -> 2 × p × q
  res = res.replace(/(\b\d+|\bp|\bq|\bN)\s*\*\s*(\d+|\bp|\bq|\bN)/gi, '$1 × $2');
  res = res.replace(/(\b\d+|\bp|\bq|\bN)\s*\*\s*(\d+|\bp|\bq|\bN)/gi, '$1 × $2');

  // 7. Common exponents in PopGen: p^2, q^2, (p+q)^2, chi^2
  res = res.replace(/\b([pPqQ])\s*\^\s*\{?2\}?/g, '$1²');
  res = res.replace(/\b([pPqQ])2\b/g, '$1²');
  res = res.replace(/\b([pPqQ])\s*\^\s*\{?3\}?/g, '$1³');
  res = res.replace(/\bχ\s*\^\s*\{?2\}?|\bchi\s*\^\s*\{?2\}?/gi, 'χ²');
  res = res.replace(/\((p\s*[\+\-]\s*q)\)\s*\^\s*\{?2\}?/gi, '($1)²');
  res = res.replace(/\(([pPqQ])\)\s*\^\s*\{?2\}?/g, '($1)²');
  res = res.replace(/([0-9\.]+)\s*\^\s*\{?2\}?/g, '$1²');
  res = res.replace(/([0-9\.]+)\s*\^\s*\{?3\}?/g, '$1³');

  // General superscripts
  res = res.replace(/\^2\b|\^\{2\}/g, '²');
  res = res.replace(/\^3\b|\^\{3\}/g, '³');
  res = res.replace(/\^0\b|\^\{0\}/g, '⁰');
  res = res.replace(/\^1\b|\^\{1\}/g, '¹');

  // Subscripts
  res = res.replace(/_\{new\}|_new\b/gi, ' (new)');
  res = res.replace(/_\{total\}|_total\b/gi, ' (total)');
  res = res.replace(/_0\b|_\{0\}/g, '₀');
  res = res.replace(/_1\b|_\{1\}/g, '₁');
  res = res.replace(/_2\b|_\{2\}/g, '₂');
  res = res.replace(/_t\b|_\{t\}/g, 'ₜ');

  // 8. Clean up simplified square roots e.g. √(q²) -> √q², √(0.16) -> √0.16
  res = res.replace(/√\(([a-zA-Z²³]+)\)/g, '√$1');
  res = res.replace(/√\(([0-9\.]+)\)/g, '√$1');

  // 9. Standardize arrows
  res = res.replace(/\\(?:rightarrow|to)\b|\s*-->\s*|\s*->\s*|\s*==>\s*/g, ' → ');
  res = res.replace(/\\leftarrow\b|\s*<--\s*|\s*<-\s*/g, ' ← ');
  res = res.replace(/\\leftrightarrow\b|\s*<->\s*/g, ' ↔ ');

  // 10. Strip display math markers $$ ... $$ and inline math $ ... $
  res = res.replace(/\$\$(.*?)\$\$/gs, '$1');
  res = res.replace(/\$(.*?)\$/g, '$1');

  // 11. Clean up accidental lone dollar signs before variables
  res = res.replace(/\$([a-zA-Z0-9])/g, '$1');

  return res;
}
