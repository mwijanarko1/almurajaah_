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
import { juzData } from '@/app/lib/data/quranData'
import { QURAN_VERSES } from '@/app/lib/data/verses'
import PageLayout from '@/app/components/ui/PageLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Calendar, BookOpen } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
} from '@/components/motion-primitives/carousel'
import SpacedRepetition from '@/app/components/quran/SpacedRepetition'
import type { SelectedSurah } from '@/app/components/JuzCard'
import PageRevisionStats from '@/app/components/quran/PageRevisionStats'
import FlippableCard from '@/app/components/dashboard/FlippableCard'
import { LiquidGlassCard } from '@/components/ui/liquid-glass'
import DashboardTabs from '@/components/DashboardTabs'

type ViewMode = 'juz' | 'surah' | 'spaced'
type SortOption = 'number' | 'lastRevised' | 'strength'

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
  streakStats?: {
    currentStreak: number
    lastLoginDate: string
    bestStreak: number
  }
}

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
        
        // Initialize missing fields
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

        // Handle streak logic
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const lastLoginDate = data.streakStats?.lastLoginDate ? 
          new Date(data.streakStats.lastLoginDate) : null
        lastLoginDate?.setHours(0, 0, 0, 0)

        let currentStreak = data.streakStats?.currentStreak || 0
        let bestStreak = data.streakStats?.bestStreak || 0

        if (!lastLoginDate) {
          // First time login
          currentStreak = 1
          bestStreak = 1
        } else {
          const diffTime = Math.abs(today.getTime() - lastLoginDate.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          if (diffDays === 1) {
            // Consecutive day
            currentStreak++
            bestStreak = Math.max(currentStreak, bestStreak)
          } else if (diffDays > 1) {
            // Streak broken
            currentStreak = 1
          }
          // If diffDays === 0, same day login, keep current streak
        }

        // Update streak information
        await updateDoc(doc(db, 'userProfiles', user.uid), {
          juzProgress: data.juzProgress,
          surahProgress: data.surahProgress,
          revisionCycle: data.revisionCycle,
          streakStats: {
            currentStreak,
            lastLoginDate: today.toISOString(),
            bestStreak
          }
        })

        setUserProfile({
          ...data,
          streakStats: {
            currentStreak,
            lastLoginDate: today.toISOString(),
            bestStreak
          }
        })
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
      const updatedJuzProgress = {
        ...userProfile.juzProgress,
        [juzNumber.toString()]: {
          ...userProfile.juzProgress[juzNumber.toString()],
          lastRevised: date
        }
      }

      await updateDoc(doc(db, 'userProfiles', user!.uid), {
        juzProgress: updatedJuzProgress,
      })

      setUserProfile({
        ...userProfile,
        juzProgress: updatedJuzProgress,
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
        // Get all surahs in this juz that are memorized
        const surahsInJuz = getSurahsInJuz(juzNum)
        const memorizedSurahsInJuz = surahsInJuz.filter(s => 
          userProfile.memorizedSurahs.some(ms => ms.number === s.number)
        )
        
        // Skip if no surahs are memorized in this juz
        if (memorizedSurahsInJuz.length === 0) return

        // Check if all memorized surahs in this juz are revised
        const allSurahsRevised = memorizedSurahsInJuz.every(s => {
          const surahProgress = updatedSurahProgress[s.number.toString()]
          if (!surahProgress?.lastRevised) return false
          
          const lastRevisionDate = new Date(surahProgress.lastRevised)
          const cycleStartDate = new Date()
          cycleStartDate.setDate(cycleStartDate.getDate() - userProfile.revisionCycle)
          
          return lastRevisionDate >= cycleStartDate
        })

        if (allSurahsRevised && memorizedSurahsInJuz.length > 0) {
          // Find the most recent revision date among all surahs
          const mostRecentDate = memorizedSurahsInJuz
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
    // Only count as needing revision if it's strictly past the revision cycle
    return diffDays > (userProfile.revisionCycle || 7)
  }

  const items = useMemo(() => {
    if (!userProfile) return []

    if (viewMode === 'spaced') {
      return [] // SpacedRepetition component handles its own items
    } else if (viewMode === 'juz') {
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
      return userProfile.memorizedSurahs.map(s => s.number)
    }
  }, [viewMode, userProfile])

  const sortedItems = useMemo(() => {
    if (!items || !userProfile) return []

    if (viewMode === 'spaced') {
      return [] // SpacedRepetition component handles its own items
    }

    return [...items].sort((a, b) => {
      if (viewMode === 'juz') {
        const juzA = userProfile.juzProgress[a.toString()]
        const juzB = userProfile.juzProgress[b.toString()]

        switch (sortBy) {
          case 'lastRevised': {
            // If neither has been revised, sort by number
            if (!juzA?.lastRevised && !juzB?.lastRevised) return Number(a) - Number(b)
            // If only one hasn't been revised, it should come first
            if (!juzA?.lastRevised) return -1
            if (!juzB?.lastRevised) return 1

            // Sort by date, oldest first
            return new Date(juzA.lastRevised).getTime() - new Date(juzB.lastRevised).getTime()
          }
          
          case 'strength': {
            const strengthOrder = { Weak: 0, Medium: 1, Strong: 2 }
            // Sort by strength (weak first), then by number if same strength
            const strengthDiff = strengthOrder[juzA?.strength || 'Medium'] - strengthOrder[juzB?.strength || 'Medium']
            return strengthDiff === 0 ? Number(a) - Number(b) : strengthDiff
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
            // If neither has been revised, sort by number
            if (!surahA?.lastRevised && !surahB?.lastRevised) return Number(a) - Number(b)
            // If only one hasn't been revised, it should come first
            if (!surahA?.lastRevised) return -1
            if (!surahB?.lastRevised) return 1

            // Sort by date, oldest first
            return new Date(surahA.lastRevised).getTime() - new Date(surahB.lastRevised).getTime()
          }
          
          case 'strength': {
            const strengthOrder = { Weak: 0, Medium: 1, Strong: 2 }
            // Sort by strength (weak first), then by number if same strength
            const strengthDiff = strengthOrder[surahA?.strength || 'Medium'] - strengthOrder[surahB?.strength || 'Medium']
            return strengthDiff === 0 ? Number(a) - Number(b) : strengthDiff
          }
          
          default: // 'number'
            return Number(a) - Number(b)
        }
      }
    })
  }, [items, userProfile, viewMode, sortBy])

  const getJuzStats = () => {
    if (!userProfile) return { needRevision: 0, relaxed: 0, total: 0 }

    // Only count Juz that are either directly selected or have all their Surahs selected
    const relevantJuz = Array.from({ length: 30 }, (_, i) => i + 1)
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

    const stats = relevantJuz.reduce((acc, juzNum) => {
      const progress = userProfile.juzProgress[juzNum.toString()]
      if (needsRevision(progress)) {
        acc.needRevision++
      } else {
        acc.relaxed++
      }
      return acc
    }, { needRevision: 0, relaxed: 0 })

    return { ...stats, total: relevantJuz.length }
  }

  const getSurahStats = () => {
    if (!userProfile) return { needRevision: 0, relaxed: 0, total: 0 }

    const stats = userProfile.memorizedSurahs.reduce((acc, surah) => {
      const progress = userProfile.surahProgress[surah.number.toString()]
      if (needsRevision(progress)) {
        acc.needRevision++
      } else {
        acc.relaxed++
      }
      return acc
    }, { needRevision: 0, relaxed: 0 })

    return { ...stats, total: userProfile.memorizedSurahs.length }
  }

  const handleRevisionCycleChange = async (newCycle: number) => {
    if (!user || !userProfile) return
    setIsLoading(true)

    try {
      await updateDoc(doc(db, 'userProfiles', user.uid), {
        revisionCycle: newCycle
      })

      setUserProfile({
        ...userProfile,
        revisionCycle: newCycle
      })
    } catch (error) {
      console.error('Error updating revision cycle:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRevisionStats = () => {
    if (!userProfile) return { needRevision: 0, relaxed: 0 }

    if (viewMode === 'spaced') {
      // For spaced view, we'll count all items that need revision
      const needRevision = userProfile.memorizedSurahs.filter(surah => {
        const progress = userProfile.surahProgress[surah.number.toString()]
        return needsRevision(progress)
      }).length
      const total = userProfile.memorizedSurahs.length
      return { needRevision, relaxed: total - needRevision }
    } else if (viewMode === 'juz') {
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
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text leading-tight">
              Welcome back, {user?.displayName || 'User'}
            </h1>
          </div>

          {/* Full Width Container for Carousel and Widgets */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Carousel Section - 80% width on larger screens, full width on smaller */}
            <div className="w-full md:w-4/5">
          <LiquidGlassCard
            glowIntensity="sm"
            shadowIntensity="sm"
            borderRadius="12px"
            blurIntensity="sm"
                className="w-full h-full p-3 sm:p-4 lg:p-6"
          >
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Carousel */}
              <Carousel className="w-full">
                <CarouselContent>
                  {/* Juz Progress Slide */}
                  <CarouselItem>
                    <div className="space-y-3 lg:space-y-4">
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-center text-text">Juz Progress</h3>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                        <div className="bg-white/5 dark:bg-black/5 rounded-lg p-2 lg:p-3 text-center border border-white/10 dark:border-white/5 aspect-square flex flex-col justify-center">
                          <div className="text-green-400 text-xs sm:text-sm lg:text-base font-semibold mb-1">Relax</div>
                          <div className="text-base sm:text-lg lg:text-xl font-bold text-text">
                            {getJuzStats().relaxed}
                          </div>
                          <div className="text-xs text-text/60">Juz</div>
                        </div>
                        <div className="bg-white/5 dark:bg-black/5 rounded-lg p-2 lg:p-3 text-center border border-white/10 dark:border-white/5 aspect-square flex flex-col justify-center">
                          <div className="text-red-400 text-xs sm:text-sm lg:text-base font-semibold mb-1">Need Revision</div>
                          <div className="text-base sm:text-lg lg:text-xl font-bold text-text">
                            {getJuzStats().needRevision}
                          </div>
                          <div className="text-xs text-text/60">Juz</div>
                        </div>
                        <div className="bg-white/5 dark:bg-black/5 rounded-lg p-2 lg:p-3 text-center border border-white/10 dark:border-white/5 aspect-square flex flex-col justify-center">
                          <div className="text-blue-400 text-xs sm:text-sm lg:text-base font-semibold mb-1">Total Progress</div>
                          <div className="text-base sm:text-lg lg:text-xl font-bold text-text">
                            {getJuzStats().total}/30
                          </div>
                          <div className="text-xs text-text/60">Juz</div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>

                  {/* Surah Progress Slide */}
                  <CarouselItem>
                    <div className="space-y-3 lg:space-y-4">
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-center text-text">Surah Progress</h3>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                        <div className="bg-white/5 dark:bg-black/5 rounded-lg p-2 lg:p-3 text-center border border-white/10 dark:border-white/5 aspect-square flex flex-col justify-center">
                          <div className="text-green-400 text-xs sm:text-sm lg:text-base font-semibold mb-1">Relax</div>
                          <div className="text-base sm:text-lg lg:text-xl font-bold text-text">
                            {getSurahStats().relaxed}
                          </div>
                          <div className="text-xs text-text/60">Surahs</div>
                        </div>
                        <div className="bg-white/5 dark:bg-black/5 rounded-lg p-2 lg:p-3 text-center border border-white/10 dark:border-white/5 aspect-square flex flex-col justify-center">
                          <div className="text-red-400 text-xs sm:text-sm lg:text-base font-semibold mb-1">Need Revision</div>
                          <div className="text-base sm:text-lg lg:text-xl font-bold text-text">
                            {getSurahStats().needRevision}
                          </div>
                          <div className="text-xs text-text/60">Surahs</div>
                        </div>
                        <div className="bg-white/5 dark:bg-black/5 rounded-lg p-2 lg:p-3 text-center border border-white/10 dark:border-white/5 aspect-square flex flex-col justify-center">
                          <div className="text-blue-400 text-xs sm:text-sm lg:text-base font-semibold mb-1">Total Progress</div>
                          <div className="text-base sm:text-lg lg:text-xl font-bold text-text">
                            {getSurahStats().total}/114
                          </div>
                          <div className="text-xs text-text/60">Surahs</div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>

                  {/* Quran Verse Slides */}
                  {QURAN_VERSES.map((verse, index) => (
                    <CarouselItem key={index}>
                      <div className="space-y-3 lg:space-y-4">
                        <div className="text-center space-y-3 lg:space-y-4">
                          <blockquote className="text-sm sm:text-base lg:text-lg text-text/80 italic leading-relaxed px-2">
                            "{verse.verse}"
                          </blockquote>
                          <cite className="text-xs sm:text-sm lg:text-base text-text/60 font-medium">
                            {verse.reference}
                          </cite>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNavigation alwaysShow />
                <CarouselIndicator />
              </Carousel>
            </div>
          </LiquidGlassCard>
            </div>

            {/* Widgets Section - 20% width on larger screens, full width on smaller */}
            <div className="w-full md:w-1/5 grid grid-cols-3 md:grid-cols-1 gap-2 sm:gap-3 lg:gap-4 md:flex md:flex-col">
            <LiquidGlassCard
              glowIntensity="sm"
              shadowIntensity="sm"
              borderRadius="12px"
              blurIntensity="sm"
                className="p-2 sm:p-3 lg:p-4 text-center aspect-square md:aspect-auto md:flex-1 flex flex-col justify-center"
            >
              <div className="flex flex-col items-center space-y-1 lg:space-y-2">
                <Flame className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-400" />
                <div className="text-sm sm:text-lg lg:text-xl font-bold text-text">
                  {userProfile?.streakStats?.currentStreak || 0}
                </div>
                <div className="text-xs text-text/60">Day Streak</div>
              </div>
            </LiquidGlassCard>

            <LiquidGlassCard
              glowIntensity="sm"
              shadowIntensity="sm"
              borderRadius="12px"
              blurIntensity="sm"
                className="p-2 sm:p-3 lg:p-4 text-center aspect-square md:aspect-auto md:flex-1 flex flex-col justify-center"
            >
              <div className="flex flex-col items-center space-y-1 lg:space-y-2">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-400" />
                <div className="text-sm sm:text-lg lg:text-xl font-bold text-text">
                  12
                </div>
                <div className="text-xs text-text/60">Pages Today</div>
              </div>
            </LiquidGlassCard>

            <LiquidGlassCard
              glowIntensity="sm"
              shadowIntensity="sm"
              borderRadius="12px"
              blurIntensity="sm"
                className="p-2 sm:p-3 lg:p-4 text-center aspect-square md:aspect-auto md:flex-1 flex flex-col justify-center"
            >
              <div className="flex flex-col items-center space-y-1 lg:space-y-2">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-400" />
                <div className="text-sm sm:text-lg lg:text-xl font-bold text-text">
                  1,247
                </div>
                <div className="text-xs text-text/60">All-time Pages</div>
              </div>
            </LiquidGlassCard>
            </div>
          </div>

          {/* View and Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <DashboardTabs
              activeTab={viewMode}
              onTabChange={setViewMode}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            disabled={viewMode === 'spaced'}
            className="w-full sm:w-auto bg-surface text-text px-3 sm:px-4 py-2 rounded-lg border border-background/10 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="number">Sort by Number</option>
            <option value="lastRevised">Sort by Last Revised</option>
            <option value="strength">Sort by Strength</option>
          </select>

          {/* Items Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'spaced' ? (
                userProfile ? (
                  <div className="col-span-full">
                    <SpacedRepetition
                      userProfile={userProfile}
                      onJuzRevisionUpdate={handleJuzRevisionUpdate}
                      onSurahRevisionUpdate={handleSurahRevisionUpdate}
                      onJuzStrengthChange={handleJuzStrengthChange}
                      onSurahStrengthChange={handleSurahStrengthChange}
                    />
                  </div>
                ) : (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="text-[#192f3a]">Loading user profile...</div>
                    </div>
                  </div>
                )
              ) : viewMode === 'surah' ? (
                (sortedItems as number[]).map((surahNumber) => {
                  const surah = surahs.find(s => s.number === surahNumber)
                  if (!surah) return null

                  return (
                    <SurahCard
                      key={surahNumber}
                      surahNumber={surah.number}
                      surahName={surah.name}
                      juzNumber={surah.juz[0]}
                      lastRevised={userProfile?.surahProgress[surah.number.toString()]?.lastRevised || null}
                      strength={userProfile?.surahProgress[surah.number.toString()]?.strength || 'Medium'}
                      revisionCycle={userProfile?.revisionCycle || 7}
                      onStrengthChange={(newStrength) => handleSurahStrengthChange(surah.number, newStrength)}
                      onRevisionUpdate={handleSurahRevisionUpdate}
                    />
                  )
                })
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
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </PageLayout>
  )
} 