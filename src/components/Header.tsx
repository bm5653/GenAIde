import React, { useState } from 'react';
import { genaideHeaderImg } from '../assets/images';
import { AiHeaderCircuitOverlay } from './AiHeaderCircuitOverlay';

interface HeaderProps {
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="w-full bg-[#FAF9F6] border-b border-purple-200/80 shadow-xs relative z-30">
      {/* Official Header Container scaled to fit website width across all gadgets */}
      <div className="w-full max-w-7xl mx-auto px-1 sm:px-4 py-1 sm:py-2 flex items-center justify-center">
        <div
          onClick={onNavigateHome}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="cursor-pointer w-full flex items-center justify-center group"
          title="GenAIde: Your AI-Aided PopGen Tutor (Click to go Home, or hover/click AI to activate circuits)"
        >
          {/* Relative banner frame keeping exact aspect ratio across all gadgets */}
          <div className="relative w-full max-w-full inline-block transition-transform duration-200 group-hover:scale-[1.003]">
            {/* Base Banner Image */}
            <img
              id="genaide-official-header-img"
              src={genaideHeaderImg}
              alt="GenAIde: Your AI-Aided PopGen Tutor"
              className="w-full h-auto object-contain block select-none"
              loading="eager"
            />

            {/* Glowing & Animated Circuit Wires & Chip overlay for the word 'AI' */}
            <AiHeaderCircuitOverlay isHovered={isHovered} />
          </div>
        </div>
      </div>
    </header>
  );
};
