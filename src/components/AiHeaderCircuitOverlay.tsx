import React, { useState } from 'react';

interface AiHeaderCircuitOverlayProps {
  isHovered?: boolean;
}

export const AiHeaderCircuitOverlay: React.FC<AiHeaderCircuitOverlayProps> = ({ isHovered = false }) => {
  const [isOverdrive, setIsOverdrive] = useState(false);

  // Trigger overdrive surge on click
  const triggerSurge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOverdrive(true);
    setTimeout(() => setIsOverdrive(false), 2400);
  };

  const activeMode = isHovered || isOverdrive;

  return (
    <div
      onClick={triggerSurge}
      className="absolute pointer-events-auto cursor-pointer group select-none"
      style={{
        left: '57.85%',
        top: '25.48%',
        width: '18.96%',
        height: '43.56%',
      }}
      title="GenAIde AI Neural Engine (Click or hover to surge circuits!)"
    >
      <svg
        viewBox="0 0 238 159"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Intense Neon Glow Filters */}
          <filter id="ai-glow-cyan" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="ai-glow-purple" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="ai-glow-chip" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="ai-trace-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="ai-trace-magenta" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="ai-chip-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E1065" />
            <stop offset="50%" stopColor="#3B0764" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>

          <radialGradient id="ai-chip-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={activeMode ? '#67E8F9' : '#38BDF8'} stopOpacity="0.9" />
            <stop offset="60%" stopColor={activeMode ? '#818CF8' : '#6366F1'} stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B0764" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========================================================
            CIRCUIT TRACE PATHS (THE WIRES)
           ======================================================== */}
        <g
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-opacity duration-300"
          style={{ opacity: activeMode ? 1 : 0.85 }}
        >
          {/* Wire 1: Chip to Apex of A */}
          <path
            id="wire-apex"
            d="M 90 82 L 90 52 L 88 18"
            fill="none"
            stroke="url(#ai-trace-cyan)"
            strokeWidth={activeMode ? 2.2 : 1.6}
            filter="url(#ai-glow-cyan)"
          />

          {/* Wire 2: Chip Upper-Left to A Apex Left */}
          <path
            id="wire-apex-left"
            d="M 80 82 L 72 52 L 76 25"
            fill="none"
            stroke="#818CF8"
            strokeWidth={activeMode ? 1.8 : 1.3}
            filter="url(#ai-glow-purple)"
          />

          {/* Wire 3: Chip Left to Left Leg Outer */}
          <path
            id="wire-leg-left-outer"
            d="M 72 98 L 44 98 L 24 126 L 15 152"
            fill="none"
            stroke="url(#ai-trace-cyan)"
            strokeWidth={activeMode ? 2.2 : 1.6}
            filter="url(#ai-glow-cyan)"
          />

          {/* Wire 4: Chip Bottom-Left to Left Leg Inner */}
          <path
            id="wire-leg-left-inner"
            d="M 78 114 L 60 135 L 48 152"
            fill="none"
            stroke="#A855F7"
            strokeWidth={activeMode ? 1.8 : 1.3}
            filter="url(#ai-glow-purple)"
          />

          {/* Wire 5: Chip Right to Right Leg Outer */}
          <path
            id="wire-leg-right-outer"
            d="M 108 98 L 136 98 L 156 126 L 165 152"
            fill="none"
            stroke="url(#ai-trace-cyan)"
            strokeWidth={activeMode ? 2.2 : 1.6}
            filter="url(#ai-glow-cyan)"
          />

          {/* Wire 6: Chip Bottom-Right to Right Leg Inner */}
          <path
            id="wire-leg-right-inner"
            d="M 102 114 L 120 135 L 136 152"
            fill="none"
            stroke="#A855F7"
            strokeWidth={activeMode ? 1.8 : 1.3}
            filter="url(#ai-glow-purple)"
          />

          {/* Wire 7: Main Data Bus Bridge from "A" Chip into "I" */}
          <path
            id="wire-bridge-main"
            d="M 108 92 L 148 92 L 176 92 L 195 92 L 212 92"
            fill="none"
            stroke="url(#ai-trace-magenta)"
            strokeWidth={activeMode ? 2.4 : 1.8}
            filter="url(#ai-glow-cyan)"
          />

          {/* Wire 8: Upper Bridge into "I" Top */}
          <path
            id="wire-bridge-upper"
            d="M 104 82 L 138 64 L 174 64 L 196 38 L 212 38"
            fill="none"
            stroke="#38BDF8"
            strokeWidth={activeMode ? 1.8 : 1.3}
            filter="url(#ai-glow-cyan)"
          />

          {/* Wire 9: Lower Bridge into "I" Base */}
          <path
            id="wire-bridge-lower"
            d="M 104 114 L 138 126 L 174 126 L 196 142 L 212 142"
            fill="none"
            stroke="#C084FC"
            strokeWidth={activeMode ? 1.8 : 1.3}
            filter="url(#ai-glow-purple)"
          />

          {/* Wire 10: "I" Vertical Spine Data Highway */}
          <path
            id="wire-i-spine"
            d="M 212 15 L 212 150"
            fill="none"
            stroke="url(#ai-trace-cyan)"
            strokeWidth={activeMode ? 2.2 : 1.6}
            filter="url(#ai-glow-cyan)"
          />

          {/* Wire 11: "I" Upper Accent Track */}
          <path
            d="M 198 22 L 226 22"
            fill="none"
            stroke="#A855F7"
            strokeWidth="1.2"
            filter="url(#ai-glow-purple)"
          />

          {/* Wire 12: "I" Lower Accent Track */}
          <path
            d="M 198 146 L 226 146"
            fill="none"
            stroke="#A855F7"
            strokeWidth="1.2"
            filter="url(#ai-glow-purple)"
          />
        </g>

        {/* ========================================================
            CIRCUIT VIAS / NODES (PULSING CONTACT PADS)
           ======================================================== */}
        <g fill="#38BDF8" filter="url(#ai-glow-cyan)">
          {/* Node at apex */}
          <circle cx="88" cy="18" r={activeMode ? 2.8 : 2.2} />
          <circle cx="76" cy="25" r={activeMode ? 2.4 : 1.8} fill="#A855F7" />

          {/* Nodes on legs */}
          <circle cx="15" cy="152" r={activeMode ? 2.8 : 2.2} />
          <circle cx="48" cy="152" r={activeMode ? 2.4 : 1.8} fill="#C084FC" />
          <circle cx="136" cy="152" r={activeMode ? 2.4 : 1.8} fill="#C084FC" />
          <circle cx="165" cy="152" r={activeMode ? 2.8 : 2.2} />

          {/* Nodes in "I" */}
          <circle cx="212" cy="15" r={activeMode ? 2.8 : 2.2} />
          <circle cx="212" cy="38" r={activeMode ? 2.4 : 1.8} fill="#38BDF8" />
          <circle cx="212" cy="142" r={activeMode ? 2.4 : 1.8} fill="#C084FC" />
          <circle cx="212" cy="150" r={activeMode ? 2.8 : 2.2} />
        </g>

        {/* ========================================================
            MICROCHIP PINS (METALLIC LEADS CONNECTING TO BOARD)
           ======================================================== */}
        <g stroke={activeMode ? '#38BDF8' : '#818CF8'} strokeWidth="1.5" strokeLinecap="round">
          {/* Top Pins */}
          <line x1="82" y1="82" x2="82" y2="76" />
          <line x1="90" y1="82" x2="90" y2="76" />
          <line x1="98" y1="82" x2="98" y2="76" />

          {/* Bottom Pins */}
          <line x1="82" y1="114" x2="82" y2="120" />
          <line x1="90" y1="114" x2="90" y2="120" />
          <line x1="98" y1="114" x2="98" y2="120" />

          {/* Left Pins */}
          <line x1="72" y1="88" x2="66" y2="88" />
          <line x1="72" y1="98" x2="66" y2="98" />
          <line x1="72" y1="108" x2="66" y2="108" />

          {/* Right Pins */}
          <line x1="108" y1="88" x2="114" y2="88" />
          <line x1="108" y1="98" x2="114" y2="98" />
          <line x1="108" y1="108" x2="114" y2="108" />
        </g>

        {/* ========================================================
            THE MAIN MICROCHIP IN "A" CROSSBAR
           ======================================================== */}
        <g filter="url(#ai-glow-chip)">
          {/* Chip Base Carrier */}
          <rect
            x="72"
            y="82"
            width="36"
            height="32"
            rx="4"
            fill="url(#ai-chip-metal)"
            stroke={activeMode ? '#38BDF8' : '#A855F7'}
            strokeWidth={activeMode ? 1.6 : 1.2}
          />

          {/* Chip Silicon Die (Center) */}
          <rect
            x="78"
            y="88"
            width="24"
            height="20"
            rx="2"
            fill="#1E1B4B"
            stroke={activeMode ? '#67E8F9' : '#818CF8'}
            strokeWidth="0.8"
          />

          {/* Radiant Neural Core Aura */}
          <circle
            cx="90"
            cy="98"
            r={activeMode ? 12 : 9}
            fill="url(#ai-chip-core-glow)"
            className="animate-pulse"
          />

          {/* Core Chip Status LED */}
          <circle
            cx="90"
            cy="98"
            r={activeMode ? 3.5 : 2.5}
            fill={activeMode ? '#A5F3FC' : '#38BDF8'}
            filter="url(#ai-glow-cyan)"
          >
            <animate
              attributeName="opacity"
              values={activeMode ? "1;0.4;1" : "0.9;0.3;0.9"}
              dur={activeMode ? "0.8s" : "1.8s"}
              repeatCount="indefinite"
            />
          </circle>

          {/* Tiny Microchip Logic Lines */}
          <line x1="82" y1="94" x2="86" y2="94" stroke="#818CF8" strokeWidth="0.6" />
          <line x1="82" y1="102" x2="86" y2="102" stroke="#818CF8" strokeWidth="0.6" />
          <line x1="94" y1="94" x2="98" y2="94" stroke="#818CF8" strokeWidth="0.6" />
          <line x1="94" y1="102" x2="98" y2="102" stroke="#818CF8" strokeWidth="0.6" />
        </g>

        {/* ========================================================
            SECONDARY CO-PROCESSOR IN "I"
           ======================================================== */}
        <g filter="url(#ai-glow-chip)">
          <rect
            x="203"
            y="84"
            width="18"
            height="18"
            rx="3"
            fill="url(#ai-chip-metal)"
            stroke={activeMode ? '#38BDF8' : '#C084FC'}
            strokeWidth="1.2"
          />
          <circle
            cx="212"
            cy="93"
            r={activeMode ? 6 : 4}
            fill="url(#ai-chip-core-glow)"
          />
          <circle
            cx="212"
            cy="93"
            r={activeMode ? 2.5 : 1.8}
            fill={activeMode ? '#F472B6' : '#C084FC'}
            filter="url(#ai-glow-purple)"
          >
            <animate
              attributeName="opacity"
              values={activeMode ? "1;0.2;1" : "0.8;0.3;0.8"}
              dur={activeMode ? "0.9s" : "2.2s"}
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* ========================================================
            STREAMING ENERGY PULSES (MOVING DATA LIGHT PHOTONS)
           ======================================================== */}
        {/* Pulse 1: Chip -> Apex of A */}
        <circle r={activeMode ? 2.8 : 2.2} fill="#38BDF8" filter="url(#ai-glow-cyan)">
          <animateMotion
            path="M 90 82 L 90 52 L 88 18"
            dur={activeMode ? "1.1s" : "2.2s"}
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 2: Chip -> Left Leg */}
        <circle r={activeMode ? 2.8 : 2.2} fill="#818CF8" filter="url(#ai-glow-purple)">
          <animateMotion
            path="M 72 98 L 44 98 L 24 126 L 15 152"
            dur={activeMode ? "1.4s" : "2.8s"}
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 3: Chip -> Right Leg */}
        <circle r={activeMode ? 2.8 : 2.2} fill="#38BDF8" filter="url(#ai-glow-cyan)">
          <animateMotion
            path="M 108 98 L 136 98 L 156 126 L 165 152"
            dur={activeMode ? "1.3s" : "2.6s"}
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 4: Chip -> Bridge -> "I" Center */}
        <circle r={activeMode ? 3.2 : 2.4} fill="#F472B6" filter="url(#ai-glow-cyan)">
          <animateMotion
            path="M 108 92 L 148 92 L 176 92 L 195 92 L 212 92"
            dur={activeMode ? "1.2s" : "2.4s"}
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 5: "I" Top -> Base Highway */}
        <circle r={activeMode ? 2.8 : 2.2} fill="#38BDF8" filter="url(#ai-glow-cyan)">
          <animateMotion
            path="M 212 15 L 212 150"
            dur={activeMode ? "1.0s" : "2.0s"}
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 6: Upper Bridge into "I" Top */}
        <circle r="1.8" fill="#C084FC" filter="url(#ai-glow-purple)">
          <animateMotion
            path="M 104 82 L 138 64 L 174 64 L 196 38 L 212 38"
            dur={activeMode ? "1.5s" : "3.0s"}
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 7: Lower Bridge into "I" Base */}
        <circle r="1.8" fill="#67E8F9" filter="url(#ai-glow-cyan)">
          <animateMotion
            path="M 104 114 L 138 126 L 174 126 L 196 142 L 212 142"
            dur={activeMode ? "1.6s" : "3.2s"}
            repeatCount="indefinite"
          />
        </circle>

        {/* Extra Power Surge Sparkles when active */}
        {activeMode && (
          <g filter="url(#ai-glow-cyan)">
            <circle cx="90" cy="98" r="18" fill="none" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6">
              <animate attributeName="r" values="6;24" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="212" cy="93" r="14" fill="none" stroke="#C084FC" strokeWidth="0.8" opacity="0.6">
              <animate attributeName="r" values="4;18" dur="1.1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="1.1s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>

      {/* Subtle indicator pill on hover/active on desktop */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block whitespace-nowrap">
        <span className="text-[9px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-950/90 text-cyan-300 border border-cyan-500/40 shadow-xs backdrop-blur-xs">
          ⚡ AI Neural Circuits Powered
        </span>
      </div>
    </div>
  );
};
