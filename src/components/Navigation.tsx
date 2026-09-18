import React, { useState } from 'react';
import { TabType } from '../types';
import { 
  Home, 
  BookOpen, 
  TableProperties, 
  PenTool, 
  GraduationCap, 
  Users, 
  AlertTriangle, 
  Target, 
  Bot, 
  FileText, 
  BarChart3, 
  Menu, 
  X 
} from 'lucide-react';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn Chapter 5', icon: BookOpen },
    { id: 'toolbox', label: 'PopGen Toolbox', icon: TableProperties },
    { id: 'practice', label: 'Step Solver', icon: PenTool },
    { id: 'past-year', label: 'Past Year & Q&A', icon: GraduationCap },
    { id: 'new-population', label: 'New Population', icon: Users, badge: 'High Impact' },
    { id: 'pitfalls', label: 'PopGen Pitfalls', icon: AlertTriangle },
    { id: 'exit-ticket', label: 'Exit Ticket', icon: Target, badge: 'Game' },
    { id: 'ai-help', label: 'AI Help Desk', icon: Bot, badge: 'Photo Check' },
    { id: 'notes', label: 'Notes & Flashcards', icon: FileText },
    { id: 'progress', label: 'My Progress', icon: BarChart3 },
  ];

  const handleSelect = (tab: TabType) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#2E1065] text-white shadow-md border-b border-purple-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Desktop & Tablet Navigation Row */}
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Brand/Mobile Title Indicator */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-purple-900/80 text-purple-200 hover:text-white hover:bg-purple-800 border border-purple-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-sm text-purple-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {navItems.find(item => item.id === activeTab)?.label}
            </span>
          </div>

          {/* Desktop Horizontal Menu */}
          <div className="hidden lg:flex items-center gap-1 w-full justify-between overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs font-semibold'
                      : 'text-purple-200 hover:text-white hover:bg-purple-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full tracking-wider ${
                      item.badge === 'Game'
                        ? 'bg-amber-400 text-purple-950'
                        : 'bg-purple-400 text-purple-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Jump Shortcuts for Mobile/Tablet Top Bar */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={() => handleSelect('practice')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                activeTab === 'practice'
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-purple-900/70 border-purple-700 text-purple-200'
              }`}
            >
              Solve
            </button>
            <button
              onClick={() => handleSelect('exit-ticket')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                activeTab === 'exit-ticket'
                  ? 'bg-amber-500 border-amber-300 text-purple-950 font-bold'
                  : 'bg-purple-900/70 border-purple-700 text-amber-300'
              }`}
            >
              Exit Ticket
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-800 bg-[#250d53] py-2 px-1 grid grid-cols-2 sm:grid-cols-3 gap-1 shadow-xl animate-in slide-in-from-top duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-purple-600 text-white font-semibold shadow-xs'
                      : 'text-purple-200 hover:bg-purple-800/70 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};
