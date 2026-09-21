import React, { useState } from 'react';
import { TabType } from '../types';
import { CuteRobotIcon } from './CuteRobotIcon';
import { 
  Home, 
  BookOpen, 
  TableProperties, 
  PenTool, 
  GraduationCap, 
  AlertTriangle, 
  Target, 
  Bot, 
  FileText, 
  BarChart3, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Compass
} from 'lucide-react';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export interface NavItem {
  id: TabType;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeClass?: string;
  category: 'core' | 'tools';
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [mobileExpanded, setMobileExpanded] = useState(true);

  // Core Learning & Practice tabs (Row 1)
  const coreNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, category: 'core' },
    { id: 'learn', label: 'Learn Chapter 5', shortLabel: 'Learn Ch 5', icon: BookOpen, category: 'core' },
    { id: 'toolbox', label: 'PopGen Toolbox', shortLabel: 'Toolbox', icon: TableProperties, category: 'core' },
    { id: 'past-year', label: 'Tutorial & PSPM', shortLabel: 'Tutorial/PSPM', icon: GraduationCap, badge: 'Bank', badgeClass: 'bg-emerald-400 text-purple-950 font-extrabold', category: 'core' },
  ];

  // Mastery, AI & Review tabs (Row 2)
  const toolsNavItems: NavItem[] = [
    { id: 'pitfalls', label: 'PopGen Pitfalls', shortLabel: 'Pitfalls', icon: AlertTriangle, category: 'tools' },
    { id: 'exit-ticket', label: 'Exit Ticket', shortLabel: 'Exit Ticket', icon: Target, badge: 'Game', badgeClass: 'bg-amber-400 text-purple-950 font-extrabold', category: 'tools' },
    { id: 'genaide-tutor', label: 'GenAIde Study Prompt', shortLabel: 'Study Prompt', icon: CuteRobotIcon, badge: 'PROMPT', badgeClass: 'bg-emerald-400 text-emerald-950 font-extrabold', category: 'tools' },
    { id: 'notes', label: 'Notes & Flashcards', shortLabel: 'Notes/Cards', icon: FileText, badge: 'Cards', badgeClass: 'bg-cyan-300 text-cyan-950 font-bold', category: 'tools' },
    { id: 'progress', label: 'My Progress', shortLabel: 'Progress', icon: BarChart3, badge: 'Stats', badgeClass: 'bg-rose-300 text-rose-950 font-bold', category: 'tools' },
  ];

  const allNavItems = [...coreNavItems, ...toolsNavItems];

  const handleSelect = (tab: TabType) => {
    onTabChange(tab);
  };

  const activeItem = allNavItems.find(item => item.id === activeTab);

  return (
    <nav className="sticky top-0 z-40 bg-[#2E1065] text-white shadow-lg border-b border-purple-800/90">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2">

        {/* ========================================================= */}
        {/* DESKTOP & TABLET TWO-TIER NAVIGATION (Always 100% visible) */}
        {/* ========================================================= */}
        <div className="hidden sm:flex flex-col gap-1.5">
          {/* Row 1: Core Curriculum & Interactive Practice */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1 pb-1 border-b border-purple-800/60">
            <span className="text-[10px] font-extrabold text-purple-300/80 uppercase tracking-widest px-2 py-0.5 rounded bg-purple-900/60 border border-purple-700/50 hidden md:inline-flex items-center gap-1 shrink-0">
              <BookOpen className="w-3 h-3 text-purple-400" />
              <span>Core Modules</span>
            </span>

            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs font-bold ring-1 ring-purple-300'
                      : 'text-purple-200 hover:text-white hover:bg-purple-800/70'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full tracking-wider shrink-0 ${item.badgeClass || 'bg-purple-300 text-purple-950'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Row 2: Exam Mastery, AI & Support Tools (Exit Ticket, AI Help Desk, Notes & Flashcards, My Progress) */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1 pt-0.5">
            <span className="text-[10px] font-extrabold text-amber-300/90 uppercase tracking-widest px-2 py-0.5 rounded bg-purple-900/60 border border-purple-700/50 hidden md:inline-flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Mastery & Tools</span>
            </span>

            {toolsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs font-bold ring-1 ring-purple-300'
                      : 'text-purple-200 hover:text-white hover:bg-purple-800/70'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full tracking-wider shrink-0 ${item.badgeClass || 'bg-amber-400 text-purple-950 font-bold'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE RESPONSIVE NAVIGATION (< 640px)                    */}
        {/* Generous touch targets, horizontal quick-scroller & grid   */}
        {/* ========================================================= */}
        <div className="sm:hidden flex flex-col gap-2.5">
          {/* Active Tab Bar with Drawer Toggle */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="text-[11px] text-purple-300 font-semibold shrink-0 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Active:</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 text-white text-xs font-bold shadow-xs truncate">
                {activeItem?.icon && <activeItem.icon className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                <span className="truncate">{activeItem?.label}</span>
              </span>
            </div>

            <button
              onClick={() => setMobileExpanded(!mobileExpanded)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-900/90 text-purple-100 hover:text-white text-xs font-bold border border-purple-600 active:bg-purple-800 shrink-0 cursor-pointer shadow-2xs min-h-[40px]"
              aria-label="Toggle all navigation tabs menu"
            >
              <span>{mobileExpanded ? 'Close Menu' : 'All 10 Tabs'}</span>
              {mobileExpanded ? <ChevronUp className="w-4 h-4 text-purple-300" /> : <ChevronDown className="w-4 h-4 text-purple-300" />}
            </button>
          </div>

          {/* Quick horizontal tab pill scrollbar for fast 1-tap switching without opening drawer */}
          {!mobileExpanded && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {allNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[38px] cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white font-bold shadow-xs ring-1 ring-purple-300'
                        : 'bg-purple-900/70 text-purple-200 hover:bg-purple-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-purple-300'}`} />
                    <span>{item.shortLabel || item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* All 10 Tabs Mobile Drawer Grid (Generous 48px touch targets for mobile thumbs) */}
          {mobileExpanded && (
            <div className="bg-[#240b54] p-3 rounded-xl border border-purple-700/80 space-y-3 animate-in fade-in duration-150 shadow-xl">
              {/* Category 1: Core Learning & Practice */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-200 flex items-center gap-1.5 pb-0.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Core Learning &amp; Practice</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {coreNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`mobile-core-nav-${item.id}`}
                        onClick={() => {
                          handleSelect(item.id);
                          setMobileExpanded(false);
                        }}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-colors min-h-[46px] cursor-pointer ${
                          isActive
                            ? 'bg-purple-600 text-white font-bold shadow-xs ring-1 ring-purple-300'
                            : 'bg-purple-900/70 text-purple-100 hover:bg-purple-800 hover:text-white'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-purple-700' : 'bg-purple-950/80'}`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                        </div>
                        <span className="font-semibold text-xs flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-300 text-purple-950 font-bold shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: Mastery, AI & Review Tools */}
              <div className="space-y-1.5 pt-2 border-t border-purple-800/70">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 pb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Mastery, AI &amp; Review Tools</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {toolsNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`mobile-tool-nav-${item.id}`}
                        onClick={() => {
                          handleSelect(item.id);
                          setMobileExpanded(false);
                        }}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-colors min-h-[46px] cursor-pointer ${
                          isActive
                            ? 'bg-purple-600 text-white font-bold shadow-xs ring-1 ring-purple-300'
                            : 'bg-purple-900/70 text-purple-100 hover:bg-purple-800 hover:text-white'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-purple-700' : 'bg-purple-950/80'}`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                        </div>
                        <span className="font-semibold text-xs flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={`ml-auto text-[9px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0 ${item.badgeClass || 'bg-amber-400 text-purple-950'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
