'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import SpacedRepetition from '@/app/components/quran/SpacedRepetition'
import PageLayout from '@/app/components/ui/PageLayout'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase/firebase'

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

      await updateDoc(doc(db, 'userProfiles', user.uid), {
        surahProgress: updatedSurahProgress,
      })

      setUserProfile({
        ...userProfile,
        surahProgress: updatedSurahProgress,
      })
    } catch (error) {
      console.error('Error updating surah revision:', error)
    }
  }

  const handleJuzStrengthChange = async (juzNumber: number, newStrength: 'Weak' | 'Medium' | 'Strong') => {
    if (!user || !userProfile) return

    try {
      const updatedJuzProgress = {
        ...userProfile.juzProgress,
        [juzNumber.toString()]: {
          ...userProfile.juzProgress[juzNumber.toString()],
          strength: newStrength
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

      await updateDoc(doc(db, 'userProfiles', user.uid), {
        surahProgress: updatedSurahProgress,
      })

      setUserProfile({
        ...userProfile,
        surahProgress: updatedSurahProgress,
      })
    } catch (error) {
      console.error('Error updating surah strength:', error)
    }
  }


  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {userProfile && (
          <SpacedRepetition
            userProfile={userProfile}
            onJuzRevisionUpdate={handleJuzRevisionUpdate}
            onSurahRevisionUpdate={handleSurahRevisionUpdate}
            onJuzStrengthChange={handleJuzStrengthChange}
            onSurahStrengthChange={handleSurahStrengthChange}
          />
        )}
      </div>
    </PageLayout>
  )
} 