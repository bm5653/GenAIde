import React from 'react';

interface CuteRobotIconProps {
  className?: string;
  isAnimated?: boolean;
}

export const CuteRobotIcon: React.FC<CuteRobotIconProps> = ({ 
  className = "w-7 h-7", 
  isAnimated = false 
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${isAnimated ? 'animate-bounce' : ''}`}
    >
      <defs>
        {/* Head Gradient matching header's deep purple & vivid violet tones */}
        <linearGradient id="cuteRobotHeadGrad" x1="12" y1="14" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="45%" stopColor="#7E22CE" />
          <stop offset="100%" stopColor="#3B0764" />
        </linearGradient>

        {/* Visor Screen Gradient - Deep navy indigo space */}
        <linearGradient id="cuteRobotScreenGrad" x1="16" y1="22" x2="48" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        {/* Glowing Antenna Orb */}
        <linearGradient id="cuteRobotAntennaGrad" x1="28" y1="4" x2="36" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Neon Emerald Glowing Eyes */}
        <linearGradient id="cuteRobotEyeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* 1. Antenna stem */}
      <path 
        d="M 32 17 V 10" 
        stroke="#C084FC" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />

      {/* 2. Glowing Antenna Orb with highlight */}
      <circle cx="32" cy="8" r="4.5" fill="url(#cuteRobotAntennaGrad)" stroke="#E0E7FF" strokeWidth="1.2" />
      <circle cx="30.5" cy="6.5" r="1.5" fill="#FFFFFF" opacity="0.9" />

      {/* 3. Ear Pods / Audio receptors (matching cyan & purple header theme) */}
      {/* Left Ear */}
      <rect x="6" y="27" width="5.5" height="13" rx="2.75" fill="#581C87" stroke="#C084FC" strokeWidth="1.5" />
      <circle cx="8.75" cy="33.5" r="1.5" fill="#38BDF8" />

      {/* Right Ear */}
      <rect x="52.5" y="27" width="5.5" height="13" rx="2.75" fill="#581C87" stroke="#C084FC" strokeWidth="1.5" />
      <circle cx="55.25" cy="33.5" r="1.5" fill="#38BDF8" />

      {/* 4. Robot Head Body */}
      <rect 
        x="11" 
        y="16" 
        width="42" 
        height="35" 
        rx="14" 
        fill="url(#cuteRobotHeadGrad)" 
        stroke="#E9D5FF" 
        strokeWidth="2" 
      />

      {/* 5. Forehead Circuit Chip Accent (Ties directly to the AI Circuit header theme) */}
      <rect x="27" y="18" width="10" height="2.5" rx="1.25" fill="#34D399" opacity="0.95" />

      {/* 6. Dark Visor Screen */}
      <rect 
        x="15.5" 
        y="23" 
        width="33" 
        height="23" 
        rx="8" 
        fill="url(#cuteRobotScreenGrad)" 
        stroke="#A855F7" 
        strokeWidth="1.5" 
      />

      {/* 7. Cute Large Expressive Eyes (Glowing Emerald with White Twinkle Sparkle) */}
      {/* Left Eye */}
      <rect x="21" y="28" width="7" height="8" rx="3.5" fill="url(#cuteRobotEyeGrad)" />
      <circle cx="23" cy="29.5" r="1.5" fill="#FFFFFF" />
      <circle cx="26" cy="33.5" r="0.8" fill="#FFFFFF" opacity="0.8" />

      {/* Right Eye */}
      <rect x="36" y="28" width="7" height="8" rx="3.5" fill="url(#cuteRobotEyeGrad)" />
      <circle cx="38" cy="29.5" r="1.5" fill="#FFFFFF" />
      <circle cx="41" cy="33.5" r="0.8" fill="#FFFFFF" opacity="0.8" />

      {/* 8. Sweet Blush Cheeks */}
      <circle cx="19.5" cy="39" r="2.2" fill="#F472B6" opacity="0.85" />
      <circle cx="44.5" cy="39" r="2.2" fill="#F472B6" opacity="0.85" />

      {/* 9. Cheerful Smiling Mouth (Glowing Cyan arc) */}
      <path 
        d="M 28.5 37 Q 32 40.5 35.5 37" 
        stroke="#38BDF8" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
