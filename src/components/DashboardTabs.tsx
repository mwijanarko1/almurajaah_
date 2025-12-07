'use client';

import { LayoutGrid, List, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export type ViewMode = 'juz' | 'surah' | 'spaced';

export type TabItem = {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
};

const TABS: TabItem[] = [
  {
    id: 'juz',
    label: 'Juz View',
    icon: <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  {
    id: 'surah',
    label: 'Surah View',
    icon: <List className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  {
    id: 'spaced',
    label: 'Spaced Review',
    icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
];

export type DashboardTabsProps = {
  activeTab: ViewMode;
  onTabChange: (tab: ViewMode) => void;
  className?: string;
};

export default function DashboardTabs({
  activeTab,
  onTabChange,
  className = ""
}: DashboardTabsProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex w-full bg-white/5 dark:bg-black/5 rounded-xl border border-white/10 dark:border-white/5 p-1 backdrop-blur-sm">
        {/* Animated background indicator */}
        <motion.div
          className="absolute top-1 bottom-1 bg-emerald-600 rounded-lg shadow-sm"
          initial={false}
          animate={{
            left: `${TABS.findIndex(tab => tab.id === activeTab) * 100 / TABS.length}%`,
            width: `${100 / TABS.length}%`,
          }}
          transition={{
            type: "spring",
            bounce: 0.15,
            duration: 0.3,
          }}
        />

        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-text/70 hover:text-text/90 hover:bg-white/5 dark:hover:bg-black/5'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}