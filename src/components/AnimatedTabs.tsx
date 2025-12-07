'use client';

import { Home, Brain, Settings } from 'lucide-react';
import { AnimatedBackground } from '@/components/motion-primitives/animated-background';

export type TabType = 'home' | 'profile' | 'settings';

export type AnimatedTabsProps = {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
};

const TABS = [
  {
    id: 'home' as TabType,
    label: 'Home',
    icon: <Home className='h-5 w-5' />,
  },
  {
    id: 'profile' as TabType,
    label: 'Memorization',
    icon: <Brain className='h-5 w-5' />,
  },
  {
    id: 'settings' as TabType,
    label: 'Settings',
    icon: <Settings className='h-5 w-5' />,
  },
];

export default function AnimatedTabs({ activeTab = 'home', onTabChange }: AnimatedTabsProps) {
  return (
    <div className='w-full max-w-sm mx-auto px-4 py-3'>
      <div className='flex w-full space-x-2 rounded-xl border border-zinc-950/10 bg-white p-2 shadow-lg'>
        <AnimatedBackground
          defaultValue={activeTab}
          className='rounded-lg bg-zinc-100'
          transition={{
            type: 'spring',
            bounce: 0.2,
            duration: 0.3,
          }}
          onValueChange={(value) => onTabChange?.(value as TabType)}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              data-id={tab.id}
              type='button'
              className='flex-1 inline-flex flex-col items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 py-2 px-2 min-h-[3rem]'
            >
              <div className="flex flex-col items-center justify-center">
                {tab.icon}
                <span className="text-xs mt-1 text-center leading-tight">{tab.label}</span>
              </div>
            </button>
          ))}
        </AnimatedBackground>
      </div>
    </div>
  );
}