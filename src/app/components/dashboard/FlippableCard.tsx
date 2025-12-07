'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Flame } from 'lucide-react'
import PageRevisionStats from '../quran/PageRevisionStats'

interface FlippableCardProps {
  userName: string | null
  quote: string
  stats: {
    relaxed: number
    needRevision: number
    totalItems: number
    viewMode: 'juz' | 'surah' | 'spaced'
  }
  streak: {
    currentStreak: number
    bestStreak: number
  }
}

export default function FlippableCard({ userName, quote, stats, streak }: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const getItemLabel = (count: number) => {
    switch (stats.viewMode) {
      case 'juz':
        return `Juz${count !== 1 ? '' : ''}`
      case 'surah':
        return `Surah${count !== 1 ? 's' : ''}`
      case 'spaced':
        return `Surah${count !== 1 ? 's' : ''}`
    }
  }

  const getTotalLabel = () => {
    switch (stats.viewMode) {
      case 'juz':
        return '30 Juz'
      case 'surah':
        return '114 Surahs'
      case 'spaced':
        return `${stats.totalItems} Surahs`
    }
  }

  return (
    <div className="w-full perspective-1000">
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="w-full preserve-3d"
        style={{ minHeight: 'fit-content' }}
      >
        {/* Front of card */}
        <div className={`w-full backface-hidden ${isFlipped ? 'invisible' : ''}`}>
          <div className="bg-surface rounded-lg p-4 sm:p-6 w-full">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-text">
                  Welcome back,<br className="sm:hidden" /> {userName}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-lg font-semibold">
                    {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''} streak
                  </span>
                  {streak.bestStreak > 0 && (
                    <span className="text-sm text-text-secondary">
                      (Best: {streak.bestStreak})
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsFlipped(true)}
                className="p-2 rounded-full hover:bg-background/20 transition-colors shrink-0"
                aria-label="View Stats"
              >
                <BarChart3 className="w-6 h-6 text-emerald-500" />
              </button>
            </div>
            
            <div className="flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <div className="bg-background/20 rounded-lg p-3">
                  <h3 className="text-green-400 text-base sm:text-lg font-semibold">Relax</h3>
                  <p className="text-xl sm:text-2xl font-bold text-text">
                    {stats.relaxed} {getItemLabel(stats.relaxed)}
                  </p>
                </div>
                <div className="bg-background/20 rounded-lg p-3">
                  <h3 className="text-red-400 text-base sm:text-lg font-semibold">Need Revision</h3>
                  <p className="text-xl sm:text-2xl font-bold text-text">
                    {stats.needRevision} {getItemLabel(stats.needRevision)}
                  </p>
                </div>
                <div className="bg-background/20 rounded-lg p-3">
                  <h3 className="text-blue-400 text-base sm:text-lg font-semibold">Total Progress</h3>
                  <p className="text-xl sm:text-2xl font-bold text-text">
                    {stats.totalItems}/{getTotalLabel()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className={`w-full backface-hidden rotate-y-180 ${!isFlipped ? 'invisible' : ''}`}
          style={{ position: 'absolute', top: 0 }}
        >
          <div className="bg-surface rounded-lg p-4 sm:p-6 w-full">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-text flex-1">
                Stats
              </h1>
              <button
                onClick={() => setIsFlipped(false)}
                className="p-2 rounded-full hover:bg-background/20 transition-colors shrink-0"
                aria-label="Back to Welcome"
              >
                <BarChart3 className="w-6 h-6 text-emerald-500" />
              </button>
            </div>
            
            <div className="flex flex-col">
              <PageRevisionStats />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 