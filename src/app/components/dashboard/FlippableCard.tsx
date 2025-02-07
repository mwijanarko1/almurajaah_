'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import PageRevisionStats from '../quran/PageRevisionStats'

interface FlippableCardProps {
  userName: string | null
  quote: string
  stats: {
    relaxed: number
    needRevision: number
    totalItems: number
    viewMode: 'juz' | 'surah'
  }
}

export default function FlippableCard({ userName, quote, stats }: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="relative h-[300px] sm:h-[250px] perspective-1000">
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full relative preserve-3d"
      >
        {/* Front of card */}
        <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'invisible' : ''}`}>
          <div className="bg-surface rounded-lg p-4 sm:p-6 h-full flex flex-col">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-text">
                Welcome back,<br className="sm:hidden" /> {userName}
              </h1>
              <button
                onClick={() => setIsFlipped(true)}
                className="p-2 rounded-full hover:bg-background/20 transition-colors"
                aria-label="View Stats"
              >
                <BarChart3 className="w-6 h-6 text-emerald-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
              <div className="bg-background/20 rounded-lg p-3">
                <h3 className="text-green-400 text-base sm:text-lg font-semibold">Relax</h3>
                <p className="text-xl sm:text-2xl font-bold text-text">
                  {stats.relaxed} {stats.viewMode === 'juz' ? 'Juz' : 'Surahs'}
                </p>
              </div>
              <div className="bg-background/20 rounded-lg p-3">
                <h3 className="text-red-400 text-base sm:text-lg font-semibold">Need Revision</h3>
                <p className="text-xl sm:text-2xl font-bold text-text">
                  {stats.needRevision} {stats.viewMode === 'juz' ? 'Juz' : 'Surahs'}
                </p>
              </div>
              <div className="bg-background/20 rounded-lg p-3">
                <h3 className="text-blue-400 text-base sm:text-lg font-semibold">Total Progress</h3>
                <p className="text-xl sm:text-2xl font-bold text-text">
                  {stats.totalItems}/{stats.viewMode === 'juz' ? '30 Juz' : '114 Surahs'}
                </p>
              </div>
            </div>

            <p className="text-text-secondary text-center italic text-sm sm:text-base mt-4">{quote}</p>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 ${!isFlipped ? 'invisible' : ''}`}
        >
          <div className="bg-surface rounded-lg p-4 sm:p-6 h-full flex flex-col">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-text">
                Stats
              </h1>
              <button
                onClick={() => setIsFlipped(false)}
                className="p-2 rounded-full hover:bg-background/20 transition-colors"
                aria-label="Back to Welcome"
              >
                <BarChart3 className="w-6 h-6 text-emerald-500" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col">
              <PageRevisionStats />
              <p className="text-text-secondary text-center italic text-sm sm:text-base mt-2">{quote}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 