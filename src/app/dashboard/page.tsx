'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase/firebase'
import JuzCard from '@/app/components/JuzCard'
import SurahCard from '@/app/components/SurahCard'
import Navbar from '@/app/components/Navbar'
import { surahs } from '@/app/lib/data/surahs'
import { LayoutGrid, List } from 'lucide-react'
import { juzData } from '@/app/lib/data/quranData'
import PageLayout from '@/app/components/ui/PageLayout'
import { motion } from 'framer-motion'
import SpacedRepetition from '@/app/components/quran/SpacedRepetition'
import type { SelectedSurah } from '@/app/components/JuzCard'
import PageRevisionStats from '@/app/components/quran/PageRevisionStats'
import FlippableCard from '@/app/components/dashboard/FlippableCard'

interface JuzProgress {
  lastRevised: string | null
  strength: 'Weak' | 'Medium' | 'Strong'
}

interface SurahProgress {
  lastRevised: string | null
  strength: 'Weak' | 'Medium' | 'Strong'
}

interface UserProfile {
  memorizedJuz: number[]
  memorizedSurahs: SelectedSurah[]
  juzProgress: { [key: string]: JuzProgress }
  surahProgress: { [key: string]: SurahProgress }
  revisionCycle: number
}

type SortOption = 'number' | 'lastRevised' | 'strength'
type ViewMode = 'juz' | 'surah'

const MOTIVATIONAL_QUOTES = [
  "The Prophet ﷺ said:\n\n\"Be diligent in maintaining your connection with this Qur'an, for by the One in Whose hand is the soul of Muhammad, it escapes more easily than a camel from its tether.\""
]

export default function Dashboard() {
  const { user } = useAuthContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('number')
  const [viewMode, setViewMode] = useState<ViewMode>('juz')
  const [quote, setQuote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Set random motivational quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
    setQuote(randomQuote)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    const fetchUserProfile = async () => {
      const userDoc = await getDoc(doc(db, 'userProfiles', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile
        if (!data.juzProgress) {
          data.juzProgress = {}
          data.memorizedJuz.forEach(juzNum => {
            data.juzProgress[juzNum] = {
              lastRevised: null,
              strength: 'Medium'
            }
          })
        }
        if (!data.surahProgress) {
          data.surahProgress = {}
        }
        if (!data.revisionCycle) {
          data.revisionCycle = 7
        }
        await updateDoc(doc(db, 'userProfiles', user.uid), {
          juzProgress: data.juzProgress,
          surahProgress: data.surahProgress,
          revisionCycle: data.revisionCycle
        })
        setUserProfile(data)
      }
    }

    fetchUserProfile()
  }, [user, router])

  const getSurahsInJuz = (juzNum: number) => {
    return surahs.filter(surah => surah.juz.includes(juzNum))
  }

  const handleJuzRevisionUpdate = async (juzNumber: number, date: string) => {
    if (!userProfile) return
    setIsLoading(true)

    try {
      // Update all surahs in this juz
      const surahsInJuz = getSurahsInJuz(juzNumber)
      const updatedSurahProgress = { ...userProfile.surahProgress }
      
      surahsInJuz.forEach(surah => {
        updatedSurahProgress[surah.number.toString()] = {
          ...updatedSurahProgress[surah.number.toString()] || { strength: 'Medium' },
          lastRevised: date
        }
      })

      const updatedJuzProgress = {
        ...userProfile.juzProgress,
        [juzNumber.toString()]: {
          ...userProfile.juzProgress[juzNumber.toString()],
          lastRevised: date
        }
      }

      await updateDoc(doc(db, 'userProfiles', user!.uid), {
        juzProgress: updatedJuzProgress,
        surahProgress: updatedSurahProgress
      })

      setUserProfile({
        ...userProfile,
        juzProgress: updatedJuzProgress,
        surahProgress: updatedSurahProgress
      })
    } catch (error) {
      console.error('Error updating juz revision:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSurahRevisionUpdate = async (surahNumber: number, date: string) => {
    if (!userProfile) return
    setIsLoading(true)

    try {
      // Update the surah progress
      const updatedSurahProgress = {
        ...userProfile.surahProgress,
        [surahNumber.toString()]: {
          ...userProfile.surahProgress[surahNumber.toString()] || { strength: 'Medium' },
          lastRevised: date
        }
      }

      // Find which juz this surah belongs to
      const surah = surahs.find(s => s.number === surahNumber)
      if (!surah) return

      // For each juz this surah belongs to, check if all its surahs are revised
      const updatedJuzProgress = { ...userProfile.juzProgress }
      
      surah.juz.forEach(juzNum => {
        if (!userProfile.memorizedJuz.includes(juzNum)) return

        const allSurahsInJuz = getSurahsInJuz(juzNum)
        const allSurahsRevised = allSurahsInJuz.every(s => {
          const surahProgress = updatedSurahProgress[s.number.toString()]
          if (!surahProgress?.lastRevised) return false
          
          const lastRevisionDate = new Date(surahProgress.lastRevised)
          const cycleStartDate = new Date()
          cycleStartDate.setDate(cycleStartDate.getDate() - userProfile.revisionCycle)
          
          return lastRevisionDate >= cycleStartDate
        })

        if (allSurahsRevised) {
          // Find the most recent revision date among all surahs
          const mostRecentDate = allSurahsInJuz
            .map(s => new Date(updatedSurahProgress[s.number.toString()].lastRevised!))
            .reduce((latest, current) => current > latest ? current : latest)
            .toISOString()

          updatedJuzProgress[juzNum.toString()] = {
            ...updatedJuzProgress[juzNum.toString()],
            lastRevised: mostRecentDate
          }
        }
      })

      await updateDoc(doc(db, 'userProfiles', user!.uid), {
        surahProgress: updatedSurahProgress,
        juzProgress: updatedJuzProgress
      })

      setUserProfile({
        ...userProfile,
        surahProgress: updatedSurahProgress,
        juzProgress: updatedJuzProgress
      })
    } catch (error) {
      console.error('Error updating surah revision:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJuzStrengthChange = async (juzNumber: number, newStrength: 'Weak' | 'Medium' | 'Strong') => {
    if (!user || !userProfile) return
    setIsLoading(true)

    try {
      // Update strength for all surahs in this juz
      const surahsInJuz = getSurahsInJuz(juzNumber)
      const updatedSurahProgress = { ...userProfile.surahProgress }
      
      surahsInJuz.forEach(surah => {
        updatedSurahProgress[surah.number.toString()] = {
          ...updatedSurahProgress[surah.number.toString()] || { lastRevised: null },
          strength: newStrength
        }
      })

      const updatedJuzProgress = {
        ...userProfile.juzProgress,
        [juzNumber.toString()]: {
          ...userProfile.juzProgress[juzNumber.toString()],
          strength: newStrength
        }
      }

      await updateDoc(doc(db, 'userProfiles', user.uid), {
        juzProgress: updatedJuzProgress,
        surahProgress: updatedSurahProgress
      })

      setUserProfile({
        ...userProfile,
        juzProgress: updatedJuzProgress,
        surahProgress: updatedSurahProgress
      })
    } catch (error) {
      console.error('Error updating juz strength:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSurahStrengthChange = async (surahNumber: number, newStrength: 'Weak' | 'Medium' | 'Strong') => {
    if (!user || !userProfile) return
    setIsLoading(true)

    try {
      const updatedSurahProgress = {
        ...userProfile.surahProgress,
        [surahNumber.toString()]: {
          ...userProfile.surahProgress[surahNumber.toString()] || { lastRevised: null },
          strength: newStrength
        }
      }

      // Find which juz this surah belongs to
      const surah = surahs.find(s => s.number === surahNumber)
      if (!surah) return

      // For each juz this surah belongs to, check if all its surahs have the same strength
      const updatedJuzProgress = { ...userProfile.juzProgress }
      
      surah.juz.forEach(juzNum => {
        const allSurahsInJuz = getSurahsInJuz(juzNum)
        const allSurahsSameStrength = allSurahsInJuz.every(s => 
          updatedSurahProgress[s.number.toString()]?.strength === newStrength
        )

        if (allSurahsSameStrength) {
          updatedJuzProgress[juzNum.toString()] = {
            ...updatedJuzProgress[juzNum.toString()],
            strength: newStrength
          }
        }
      })

      await updateDoc(doc(db, 'userProfiles', user.uid), {
        surahProgress: updatedSurahProgress,
        juzProgress: updatedJuzProgress
      })

      setUserProfile({
        ...userProfile,
        surahProgress: updatedSurahProgress,
        juzProgress: updatedJuzProgress
      })
    } catch (error) {
      console.error('Error updating surah strength:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const needsRevision = (progress: JuzProgress | SurahProgress | null | undefined) => {
    // If no progress or userProfile exists, consider it as needing revision
    if (!progress || !userProfile) return true
    
    // If lastRevised doesn't exist, it needs revision
    if (!progress.lastRevised) return true
    
    const lastDate = new Date(progress.lastRevised)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - lastDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= (userProfile.revisionCycle || 7) // Default to 7 days if revisionCycle not set
  }

  const items = useMemo(() => {
    if (!userProfile) return []

    if (viewMode === 'juz') {
      // Show Juz that are either directly selected or have at least one Surah selected
      return Array.from({ length: 30 }, (_, i) => i + 1).filter(juzNum => {
        const isDirectlySelected = userProfile.memorizedJuz.includes(juzNum)
        if (isDirectlySelected) return true

        // Check if any Surah in this Juz is selected for this specific juz
        const surahsInJuz = surahs.filter(surah => surah.juz.includes(juzNum))
        const hasSelectedSurah = surahsInJuz.some(surah => 
          userProfile.memorizedSurahs.some(s => 
            s.number === surah.number && s.juz.includes(juzNum)
          )
        )
        return hasSelectedSurah
      })
    } else {
      // In Surah view, show all selected Surahs regardless of Juz selection
      return surahs.filter(surah => 
        userProfile.memorizedSurahs.some(s => s.number === surah.number)
      )
    }
  }, [viewMode, userProfile])

  const sortedItems = useMemo(() => {
    if (!items || !userProfile) return []

    return [...items].sort((a, b) => {
      if (viewMode === 'juz') {
        const juzA = userProfile.juzProgress[a.toString()]
        const juzB = userProfile.juzProgress[b.toString()]

        switch (sortBy) {
          case 'lastRevised': {
            if (!juzA?.lastRevised && !juzB?.lastRevised) return 0
            if (!juzA?.lastRevised) return -1
            if (!juzB?.lastRevised) return 1

            const dateA = new Date(juzA.lastRevised)
            const dateB = new Date(juzB.lastRevised)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            dateA.setHours(0, 0, 0, 0)
            dateB.setHours(0, 0, 0, 0)

            const daysA = Math.ceil(Math.abs(today.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24))
            const daysB = Math.ceil(Math.abs(today.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24))

            const needsRevisionA = daysA >= userProfile.revisionCycle
            const needsRevisionB = daysB >= userProfile.revisionCycle

            if (needsRevisionA && !needsRevisionB) return -1
            if (!needsRevisionA && needsRevisionB) return 1

            return daysB - daysA
          }
          
          case 'strength': {
            const strengthOrder = { Weak: 0, Medium: 1, Strong: 2 }
            return strengthOrder[juzB?.strength || 'Medium'] - strengthOrder[juzA?.strength || 'Medium']
          }
          
          default: // 'number'
            return Number(a) - Number(b)
        }
      } else {
        // Surah view
        const surahA = userProfile.surahProgress[a.toString()]
        const surahB = userProfile.surahProgress[b.toString()]

        switch (sortBy) {
          case 'lastRevised': {
            if (!surahA?.lastRevised && !surahB?.lastRevised) return 0
            if (!surahA?.lastRevised) return -1
            if (!surahB?.lastRevised) return 1

            return new Date(surahB.lastRevised).getTime() - new Date(surahA.lastRevised).getTime()
          }
          
          case 'strength': {
            const strengthOrder = { Weak: 0, Medium: 1, Strong: 2 }
            return strengthOrder[surahB?.strength || 'Medium'] - strengthOrder[surahA?.strength || 'Medium']
          }
          
          default: // 'number'
            return Number(a) - Number(b)
        }
      }
    })
  }, [items, userProfile, viewMode, sortBy])

  const getRevisionStats = () => {
    if (!userProfile) return { needRevision: 0, relaxed: 0 }
    
    if (viewMode === 'juz') {
      // Only count Juz that are either directly selected or have all their Surahs selected
      return Array.from({ length: 30 }, (_, i) => i + 1)
        .filter(juzNum => {
          const isDirectlySelected = userProfile.memorizedJuz.includes(juzNum)
          if (isDirectlySelected) return true

          // Check if all Surahs in this Juz are selected
          const surahsInJuz = surahs.filter(surah => surah.juz.includes(juzNum))
          const allSurahsSelected = surahsInJuz.every(surah => 
            userProfile.memorizedSurahs.some(s => s.number === surah.number)
          )
          return allSurahsSelected
        })
        .reduce(
          (acc, juzNum) => {
            const juz = userProfile.juzProgress[juzNum.toString()]
            if (needsRevision(juz)) {
              acc.needRevision++
            } else {
              acc.relaxed++
            }
            return acc
          },
          { needRevision: 0, relaxed: 0 }
        )
    } else {
      // Only count Surahs that are selected
      return surahs
        .filter(surah => userProfile.memorizedSurahs.some(s => s.number === surah.number))
        .reduce(
          (acc, surah) => {
            const progress = userProfile.surahProgress[surah.number.toString()]
            if (needsRevision(progress)) {
              acc.needRevision++
            } else {
              acc.relaxed++
            }
            return acc
          },
          { needRevision: 0, relaxed: 0 }
        )
    }
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-900">Loading...</p>
        </div>
      </div>
    )
  }

  const stats = getRevisionStats()

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Flippable Summary Card */}
          <FlippableCard 
            userName={user?.displayName || null}
            quote={quote}
            stats={{
              relaxed: stats.relaxed,
              needRevision: stats.needRevision,
              totalItems: viewMode === 'juz' ? items.length : userProfile.memorizedSurahs.length,
              viewMode
            }}
          />

          {/* View and Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('juz')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                  viewMode === 'juz'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Juz View</span>
              </button>
              <button
                onClick={() => setViewMode('surah')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                  viewMode === 'surah'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Surah View</span>
              </button>
            </div>
            
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add Juz/Surah</span>
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full sm:w-auto bg-surface text-text px-3 sm:px-4 py-2 rounded-lg border border-background/10 text-sm sm:text-base"
          >
            <option value="number">Sort by Number</option>
            <option value="lastRevised">Sort by Last Revised</option>
            <option value="strength">Sort by Strength</option>
          </select>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {viewMode === 'surah' ? (
              (sortedItems as typeof surahs).map((surah) => (
                <SurahCard
                  key={surah.number}
                  surahNumber={surah.number}
                  surahName={surah.name}
                  juzNumber={surah.juz[0]}
                  lastRevised={userProfile?.surahProgress[surah.number.toString()]?.lastRevised || null}
                  strength={userProfile?.surahProgress[surah.number.toString()]?.strength || 'Medium'}
                  revisionCycle={userProfile?.revisionCycle || 7}
                  onStrengthChange={(newStrength) => handleSurahStrengthChange(surah.number, newStrength)}
                  onRevisionUpdate={handleSurahRevisionUpdate}
                />
              ))
            ) : (
              (sortedItems as number[]).map((juzNumber) => {
                const juz = juzData.find(j => j.number === juzNumber)
                if (!juz) return null
                
                return (
                  <JuzCard
                    key={juzNumber}
                    juzNumber={juzNumber}
                    lastRevised={userProfile?.juzProgress[juzNumber.toString()]?.lastRevised || null}
                    strength={userProfile?.juzProgress[juzNumber.toString()]?.strength || 'Medium'}
                    revisionCycle={userProfile?.revisionCycle || 7}
                    onStrengthChange={(newStrength) => handleJuzStrengthChange(juzNumber, newStrength)}
                    onRevisionUpdate={handleJuzRevisionUpdate}
                    memorizedSurahs={userProfile?.memorizedSurahs || []}
                    totalSurahsInJuz={juz.surahs.length}
                  />
                )
              })
            )}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 