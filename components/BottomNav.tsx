
import React from 'react';
import { FileText, PieChart, Plus, MoreHorizontal, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: 'TRANS', icon: FileText, label: 'Trans.' },
    { id: 'STATS', icon: PieChart, label: 'Stats' },
    { id: 'ADD_OVERLAY', icon: Plus, label: '', isFab: true }, // Special FAB item
    { id: 'AI_CHAT', icon: Sparkles, label: 'Advisor' },
    { id: 'MORE', icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <div className="md:hidden bg-white dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-2 z-40 w-full">
      <div className="flex justify-around items-end h-14 pb-2">
        {navItems.map((item) => {
          if (item.isFab) {
            return (
              <button 
                key={item.id}
                onClick={() => onChangeView(item.id as ViewState)}
                className="relative -top-6 group"
              >
                <div className="bg-[#FF5252] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 dark:shadow-red-900/20 transform transition-transform duration-200 group-active:scale-95">
                  <Plus size={28} strokeWidth={2.5} />
                </div>
              </button>
            );
          }

          const Icon = item.icon;
          const isActive = currentView === item.id;
          const colorClass = isActive ? 'text-[#FF5252]' : 'text-gray-400 dark:text-gray-500';
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`flex flex-col items-center justify-center w-16 transition-all duration-200 ${isActive ? '-translate-y-1' : ''}`}
            >
              <Icon size={22} className={`${colorClass} mb-1`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${colorClass} transition-opacity duration-200`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
