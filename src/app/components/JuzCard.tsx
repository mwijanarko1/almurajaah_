'use client'

import { useState, useEffect } from 'react'
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore'
import { db } from '@/app/lib/firebase/firebase'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { surahPages } from '@/app/lib/data/surahPages'
import { juzData, type Surah } from '@/app/lib/data/quranData'
import type { SurahPageInfo } from '@/app/lib/types/quran'

export interface SelectedSurah {
  number: number
  juz: number[]
}

interface JuzCardProps {
  juzNumber: number
  lastRevised: string | null
  strength: 'Weak' | 'Medium' | 'Strong'
  revisionCycle: number
  onStrengthChange: (newStrength: 'Weak' | 'Medium' | 'Strong') => void
  onRevisionUpdate: (juzNumber: number, date: string) => void
  memorizedSurahs: SelectedSurah[]
  totalSurahsInJuz: number
}

export default function JuzCard({ 
  juzNumber, 
  lastRevised, 
  strength,
  revisionCycle,
  onStrengthChange,
  onRevisionUpdate,
  memorizedSurahs,
  totalSurahsInJuz
}: JuzCardProps) {
  const [daysSinceRevision, setDaysSinceRevision] = useState<number | null>(null)
  const { user } = useAuthContext()
  const [isUpdating, setIsUpdating] = useState(false)

  const strengthColors = {
    Weak: 'text-red-500',
    Medium: 'text-yellow-500',
    Strong: 'text-green-500'
  }

  const strengthIcons = {
    Weak: '●○○',
    Medium: '●●○',
    Strong: '●●●'
  }

  const nextStrength: { [key: string]: 'Weak' | 'Medium' | 'Strong' } = {
    Weak: 'Medium',
    Medium: 'Strong',
    Strong: 'Weak'
  }

  useEffect(() => {
    if (lastRevised) {
      const lastDate = new Date(lastRevised)
      const today = new Date()
      
      // Reset time parts to compare just the dates
      lastDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      
      if (lastDate.getTime() === today.getTime()) {
        setDaysSinceRevision(0)
      } else {
        const diffTime = Math.abs(today.getTime() - lastDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        setDaysSinceRevision(diffDays)
      }
    } else {
      setDaysSinceRevision(null)
    }
  }, [lastRevised])

  const needsRevision = () => {
    if (!lastRevised) return true // If never revised, needs revision
    return daysSinceRevision !== null && daysSinceRevision >= revisionCycle
  }

  const getRevisionStatus = () => {
    if (!lastRevised) return 'Not Started'
    return needsRevision() ? 'Revise Now' : 'Relax'
  }

  const handleRevisionUpdate = async () => {
    if (!user) return
    setIsUpdating(true)
    const today = new Date().toISOString()

    try {
      // Get all surahs in this juz
      const currentJuz = juzData.find(juz => juz.number === juzNumber)
      if (!currentJuz) throw new Error('Juz not found')
      
      // Calculate total pages in this juz from memorized surahs
      const memorizedSurahsInJuz = currentJuz.surahs.filter(surah => 
        memorizedSurahs.some(ms => ms.number === surah.number)
      )
      
      const totalPages = memorizedSurahsInJuz.reduce((total: number, surah: Surah) => {
        const surahInfo = surahPages.find(s => s.number === surah.number)
        return total + (surahInfo?.pages || 0)
      }, 0)

      // Update the juz progress and page stats
      await updateDoc(doc(db, 'userProfiles', user.uid), {
        [`juzProgress.${juzNumber}.lastRevised`]: today,
        // Update page revision stats
        'pageRevisionStats.lastRevisedPages': arrayUnion(...Array.from({ length: Math.ceil(totalPages) }, (_, i) => i + 1)),
        'pageRevisionStats.totalPagesRevised': increment(Math.ceil(totalPages)),
        'pageRevisionStats.pagesRevisedToday': increment(Math.ceil(totalPages)),
        [`pageRevisionStats.lastRevisionDates.${juzNumber}`]: today
      })
      
      onRevisionUpdate(juzNumber, today)
    } catch (error) {
      console.error('Error updating revision:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleStrengthClick = () => {
    onStrengthChange(nextStrength[strength])
  }

  const getProgressPercentage = () => {
    if (!lastRevised || daysSinceRevision === null) return 0
    const progress = Math.max(0, 100 - (daysSinceRevision / revisionCycle * 100))
    return Math.round(progress)
  }

  const getCardColor = () => {
    if (!lastRevised) return 'bg-red-900' // Not started
    if (daysSinceRevision === null) return 'bg-red-900'
    
    const progress = getProgressPercentage()
    
    if (progress <= 0) return 'bg-red-900' // Overdue
    if (progress <= 25) return 'bg-red-800'
    if (progress <= 50) return 'bg-yellow-800'
    if (progress <= 75) return 'bg-green-800'
    return 'bg-green-700' // Recently revised
  }

  const getProgressRingColor = () => {
    const progress = getProgressPercentage()
    if (progress <= 25) return '#EF4444' // red
    if (progress <= 50) return '#F59E0B' // yellow
    if (progress <= 75) return '#10B981' // green
    return '#059669' // emerald
  }

  const getRevisionTimeDisplay = () => {
    if (!lastRevised) return 'Not Started'
    if (!daysSinceRevision) return `Revise in ${revisionCycle} days`
    if (daysSinceRevision >= revisionCycle) return 'Revise now'
    
    const daysUntilRevision = revisionCycle - daysSinceRevision
    if (daysUntilRevision <= 0) return 'Revise now'
    
    const daysText = daysUntilRevision === 1 ? 'day' : 'days'
    return `Revise in ${daysUntilRevision} ${daysText}`
  }

  const getMemorizationPercentage = () => {
    const memorizedCount = memorizedSurahs.filter(surah => 
      surah.juz.includes(juzNumber)
    ).length
    return Math.round((memorizedCount / totalSurahsInJuz) * 100)
  }

  return (
    <div className={`rounded-lg p-6 text-white ${getCardColor()} transition-colors duration-300 relative`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Juz {juzNumber}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={`${needsRevision() ? 'text-red-300' : 'text-green-300'}`}>
                {getRevisionStatus()}
              </span>
              <span className="text-white text-opacity-60">•</span>
              <span className="text-white text-opacity-60">
                {getRevisionTimeDisplay()}
              </span>
            </div>
          </div>
          <div className="text-lg font-semibold">
            {getMemorizationPercentage()}% memorized
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStrengthClick}
            className="bg-black bg-opacity-20 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm hover:bg-opacity-30 transition-colors"
          >
            <span className={strengthColors[strength]}>
              {strengthIcons[strength]}
            </span>
            <span className={strengthColors[strength]}>
              {strength}
            </span>
          </button>

          <button
            onClick={handleRevisionUpdate}
            disabled={isUpdating}
            className="flex-1 py-1.5 px-3 rounded-md transition-colors text-sm font-medium bg-black bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Mark as Revised'}
          </button>
        </div>

        {/* View Details Link */}
        <Link
          href={`/juz/${juzNumber}`}
          className="flex items-center justify-between text-[#2ECC71] hover:text-white transition-colors mt-4 pt-4 border-t border-gray-700"
        >
          <span>View Surahs</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}