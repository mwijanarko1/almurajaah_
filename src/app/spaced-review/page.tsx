'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import SpacedRepetition from '@/app/components/quran/SpacedRepetition'
import PageLayout from '@/app/components/ui/PageLayout'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase/firebase'
import { surahs } from '@/app/lib/data/surahs'

interface UserProfile {
  memorizedSurahs: { number: number }[]
  surahProgress: { [key: string]: { lastRevised: string | null; strength: string } }
  juzProgress: { [key: string]: { lastRevised: string | null; strength: string } }
  revisionCycle: number
}

export default function SpacedReviewPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'userProfiles', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile
          setUserProfile(data)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, router])

  const handleJuzRevisionUpdate = async (juzNumber: number, date: string) => {
    if (!user || !userProfile) return

    try {
      const updatedJuzProgress = {
        ...userProfile.juzProgress,
        [juzNumber.toString()]: {
          ...userProfile.juzProgress[juzNumber.toString()],
          lastRevised: date
        }
      }

      await updateDoc(doc(db, 'userProfiles', user.uid), {
        juzProgress: updatedJuzProgress,
      })

      setUserProfile({
        ...userProfile,
        juzProgress: updatedJuzProgress,
      })
    } catch (error) {
      console.error('Error updating juz revision:', error)
    }
  }

  const handleSurahRevisionUpdate = async (surahNumber: number, date: string) => {
    if (!user || !userProfile) return

    try {
      const updatedSurahProgress = {
        ...userProfile.surahProgress,
        [surahNumber.toString()]: {
          ...userProfile.surahProgress[surahNumber.toString()] || { strength: 'Medium' },
          lastRevised: date
        }
      }

      const surah = surahs.find(s => s.number === surahNumber)
      if (!surah) return

      const updatedJuzProgress = { ...userProfile.juzProgress }
      
      surah.juz.forEach(juzNum => {
        const surahsInJuz = surahs.filter(s => s.juz.includes(juzNum))
        const memorizedSurahsInJuz = surahsInJuz.filter(s => 
          userProfile.memorizedSurahs.some(ms => ms.number === s.number)
        )
        
        if (memorizedSurahsInJuz.length === 0) return

        const allSurahsRevised = memorizedSurahsInJuz.every(s => {
          const surahProgress = updatedSurahProgress[s.number.toString()]
          if (!surahProgress?.lastRevised) return false
          
          const lastRevisionDate = new Date(surahProgress.lastRevised)
          const cycleStartDate = new Date()
          cycleStartDate.setDate(cycleStartDate.getDate() - userProfile.revisionCycle)
          
          return lastRevisionDate >= cycleStartDate
        })

        if (allSurahsRevised && memorizedSurahsInJuz.length > 0) {
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
      console.error('Error updating surah revision:', error)
    }
  }

  const handleJuzStrengthChange = async (juzNumber: number, newStrength: 'Weak' | 'Medium' | 'Strong') => {
    if (!user || !userProfile) return

    try {
      const surahsInJuz = surahs.filter(surah => surah.juz.includes(juzNumber))
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
    }
  }

  const handleSurahStrengthChange = async (surahNumber: number, newStrength: 'Weak' | 'Medium' | 'Strong') => {
    if (!user || !userProfile) return

    try {
      const updatedSurahProgress = {
        ...userProfile.surahProgress,
        [surahNumber.toString()]: {
          ...userProfile.surahProgress[surahNumber.toString()] || { lastRevised: null },
          strength: newStrength
        }
      }

      const surah = surahs.find(s => s.number === surahNumber)
      if (!surah) return

      const updatedJuzProgress = { ...userProfile.juzProgress }
      
      surah.juz.forEach(juzNum => {
        const allSurahsInJuz = surahs.filter(s => s.juz.includes(juzNum))
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
    }
  }

  if (isLoading || !userProfile) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <SpacedRepetition
          userProfile={userProfile}
          onJuzRevisionUpdate={handleJuzRevisionUpdate}
          onSurahRevisionUpdate={handleSurahRevisionUpdate}
          onJuzStrengthChange={handleJuzStrengthChange}
          onSurahStrengthChange={handleSurahStrengthChange}
        />
      </div>
    </PageLayout>
  )
} 