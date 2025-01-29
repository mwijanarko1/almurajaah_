'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase/firebase'
import Navbar from '@/app/components/Navbar'
import { ChevronDown, ChevronUp, Save, X } from 'lucide-react'
import { juzData } from '@/app/lib/data/quranData'
import PageLayout from '@/app/components/ui/PageLayout'
import { motion } from 'framer-motion'

interface UserProfile {
  memorizedJuz: number[]
  memorizedSurahs: SelectedSurah[]
  juzProgress: { [key: string]: JuzProgress }
  surahProgress: { [key: string]: SurahProgress }
  revisionCycle: number
}

interface JuzProgress {
  lastRevised: string | null
  strength: 'Weak' | 'Medium' | 'Strong'
}

interface SurahProgress {
  lastRevised: string | null
  strength: 'Weak' | 'Medium' | 'Strong'
}

interface SelectedSurah {
  number: number
  juz: number[]
}

interface Surah {
  number: number
  name: string
  verses?: string
  juz: number[]
}

interface Juz {
  number: number
  surahs: Surah[]
}

export default function Profile() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Profile states
  const [memorizedJuz, setMemorizedJuz] = useState<number[]>([])
  const [memorizedSurahs, setMemorizedSurahs] = useState<SelectedSurah[]>([])
  const [revisionCycle, setRevisionCycle] = useState(7)
  const [expandedJuz, setExpandedJuz] = useState<number[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    const fetchUserProfile = async () => {
      const userDoc = await getDoc(doc(db, 'userProfiles', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile
        setMemorizedJuz(data.memorizedJuz || [])
        setMemorizedSurahs(data.memorizedSurahs || [])
        setRevisionCycle(data.revisionCycle || 7)
      }
    }

    fetchUserProfile()
  }, [user, router])

  const toggleJuz = (juzNumber: number) => {
    const juz = juzData.find(j => j.number === juzNumber)
    if (!juz) return

    if (memorizedJuz.includes(juzNumber)) {
      // Remove Juz and its Surahs
      setMemorizedJuz(prev => prev.filter(num => num !== juzNumber))
      setMemorizedSurahs(prev => prev.filter(surah => !surah.juz.includes(juzNumber)))
    } else {
      // Add Juz and all its Surahs
      setMemorizedJuz(prev => [...prev, juzNumber])
      const newSurahs = juz.surahs.map(surah => ({
        number: surah.number,
        juz: [juzNumber]
      }))
      setMemorizedSurahs(prev => {
        const updated = [...prev]
        newSurahs.forEach(newSurah => {
          const existingIndex = updated.findIndex(s => s.number === newSurah.number)
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              juz: Array.from(new Set([...updated[existingIndex].juz, ...newSurah.juz]))
            }
          } else {
            updated.push(newSurah)
          }
        })
        return updated
      })
    }
    setHasChanges(true)
  }

  const toggleSurah = (surahNumber: number, juzNumber: number) => {
    setMemorizedSurahs(prev => {
      const existingIndex = prev.findIndex(s => s.number === surahNumber)
      let updatedSurahs;
      
      if (existingIndex >= 0) {
        // Surah exists in selection
        const updatedJuz = prev[existingIndex].juz.includes(juzNumber)
          ? prev[existingIndex].juz.filter(j => j !== juzNumber)
          : [...prev[existingIndex].juz, juzNumber]
        
        if (updatedJuz.length === 0) {
          // Remove Surah if no Juz are selected
          updatedSurahs = prev.filter(s => s.number !== surahNumber)
        } else {
          updatedSurahs = [
            ...prev.slice(0, existingIndex),
            { ...prev[existingIndex], juz: updatedJuz },
            ...prev.slice(existingIndex + 1)
          ]
        }
      } else {
        // Add new Surah
        updatedSurahs = [...prev, { number: surahNumber, juz: [juzNumber] }]
      }

      // After updating Surahs, check if all Surahs in the Juz are selected
      const juz = juzData.find(j => j.number === juzNumber)
      if (!juz) return updatedSurahs

      const allSurahsSelected = juz.surahs.every(surah => 
        updatedSurahs.some(s => s.number === surah.number && s.juz.includes(juzNumber))
      )

      // Update Juz selection state
      if (allSurahsSelected && !memorizedJuz.includes(juzNumber)) {
        setMemorizedJuz(prev => [...prev, juzNumber])
      } else if (!allSurahsSelected && memorizedJuz.includes(juzNumber)) {
        setMemorizedJuz(prev => prev.filter(num => num !== juzNumber))
      }

      setHasChanges(true)
      return updatedSurahs
    })
  }

  const toggleExpand = (juzNumber: number) => {
    setExpandedJuz(prev => 
      prev.includes(juzNumber)
        ? prev.filter(num => num !== juzNumber)
        : [...prev, juzNumber]
    )
  }

  const handleSave = async () => {
    if (!user) return
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const userDoc = await getDoc(doc(db, 'userProfiles', user.uid))
      const currentData = userDoc.exists() ? userDoc.data() as UserProfile : { juzProgress: {}, surahProgress: {} }
      
      // Update juzProgress for newly added Juz
      const updatedJuzProgress = { ...currentData.juzProgress }
      memorizedJuz.forEach(juzNum => {
        if (!updatedJuzProgress[juzNum]) {
          updatedJuzProgress[juzNum] = {
            lastRevised: null,
            strength: 'Medium'
          }
        }
      })

      // Remove juzProgress for removed Juz
      Object.keys(updatedJuzProgress).forEach(juzNum => {
        if (!memorizedJuz.includes(Number(juzNum))) {
          delete updatedJuzProgress[juzNum]
        }
      })

      // Update surahProgress for newly added Surahs
      const updatedSurahProgress = { ...currentData.surahProgress }
      memorizedSurahs.forEach(surah => {
        if (!updatedSurahProgress[surah.number]) {
          updatedSurahProgress[surah.number] = {
            lastRevised: null,
            strength: 'Medium'
          }
        }
      })

      // Remove surahProgress for removed Surahs
      Object.keys(updatedSurahProgress).forEach(surahNum => {
        if (!memorizedSurahs.some(s => s.number === Number(surahNum))) {
          delete updatedSurahProgress[surahNum]
        }
      })

      await updateDoc(doc(db, 'userProfiles', user.uid), {
        memorizedJuz,
        memorizedSurahs,
        revisionCycle,
        juzProgress: updatedJuzProgress,
        surahProgress: updatedSurahProgress
      })

      setSuccess('Profile updated successfully')
      setHasChanges(false)
    } catch (err) {
      setError('Failed to update profile')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const isSurahSelected = (surahNumber: number, juzNumber: number) => {
    return memorizedSurahs.some(s => 
      s.number === surahNumber && s.juz.includes(juzNumber)
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-text">Profile Settings</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-background text-text-secondary hover:bg-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                  Back to Home
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || isLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-secondary transition-colors disabled:bg-text-secondary"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-2 rounded-md mb-4">
                {success}
              </div>
            )}

            <div className="bg-surface rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-text">Memorized Juz & Surahs</h2>
                  <p className="text-text-secondary mt-1">Select the Juz or individual Surahs you have memorized</p>
                </div>
                <div className="text-text-secondary">
                  {memorizedJuz.length}/30 Juz
                </div>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNumber) => {
                  const juz = juzData.find(j => j.number === juzNumber)
                  const isExpanded = expandedJuz.includes(juzNumber)
                  
                  return (
                    <div key={juzNumber} className="space-y-2">
                      <div
                        className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-surface transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleExpand(juzNumber)}
                            className="text-text-secondary hover:text-text transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                          <span className="text-lg text-text">Juz {juzNumber}</span>
                        </div>
                        <button
                          onClick={() => toggleJuz(juzNumber)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            memorizedJuz.includes(juzNumber) ? 'bg-[#2ECC71]' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform bg-white ${
                              memorizedJuz.includes(juzNumber) ? 'translate-x-6' : ''
                            }`}
                          />
                        </button>
                      </div>
                      
                      {/* Surahs List */}
                      {isExpanded && juz && (
                        <div className="ml-8 space-y-2">
                          {juz.surahs.map((surah) => (
                            <div
                              key={`${surah.number}-${surah.verses || 'full'}`}
                              className="flex items-center justify-between p-2 rounded-lg bg-background bg-opacity-50"
                            >
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => toggleSurah(surah.number, juzNumber)}
                                  className={`w-10 h-5 rounded-full transition-colors relative ${
                                    isSurahSelected(surah.number, juzNumber) ? 'bg-[#2ECC71]' : 'bg-gray-600'
                                  }`}
                                >
                                  <span
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform bg-white ${
                                      isSurahSelected(surah.number, juzNumber) ? 'translate-x-5' : ''
                                    }`}
                                  />
                                </button>
                                <div>
                                  <span className="text-primary">
                                    {surah.number}. {surah.name}
                                  </span>
                                  {surah.verses && (
                                    <span className="text-text-secondary text-sm ml-2">
                                      (Verses: {surah.verses})
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-lg font-arabic text-text-secondary">
                                {surah.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-surface rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text mb-4">Revision Cycle</h2>
              <p className="text-text-secondary mb-4">Set how often you want to revise each Juz:</p>
              
              <div className="flex gap-4">
                {[3, 5, 7, 10, 14].map(days => (
                  <button
                    key={days}
                    onClick={() => {
                      setRevisionCycle(days)
                      setHasChanges(true)
                    }}
                    className={`
                      px-4 py-2 rounded-md transition-colors
                      ${revisionCycle === days
                        ? 'bg-primary text-white'
                        : 'bg-background text-text-secondary hover:bg-surface'}
                    `}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 