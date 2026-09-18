import React from 'react';

interface HeaderProps {
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  return (
    <header className="w-full bg-[#FAF9F6] border-b border-purple-200/80 shadow-xs relative z-30">
      {/* Official Header Container with the user-provided GenAIde image */}
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-center">
        <div
          onClick={onNavigateHome}
          className="cursor-pointer flex items-center justify-center max-w-full"
          title="GenAIde: Your AI-Aided PopGen Tutor"
        >
          {/* Display the exact attached image without changes, cropping, or filters */}
          <img
            id="genaide-official-header-img"
            src="/GenAIde (1).png"
            onError={(e) => {
              // Fallback to alias paths if needed
              const target = e.currentTarget;
              if (target.src.endsWith('/GenAIde%20(1).png') || target.src.endsWith('/GenAIde (1).png')) {
                target.src = '/genaide-header.png';
              }
            }}
            alt="GenAIde: Your AI-Aided PopGen Tutor"
            className="w-full h-auto object-contain max-h-[140px] sm:max-h-[170px] md:max-h-[190px] select-none transition-transform duration-200 hover:scale-[1.008]"
            loading="eager"
          />
        </div>
      </div>
    </header>
  );
};
