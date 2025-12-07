'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase/firebase'
import Navbar from '@/app/components/Navbar'
import { juzData } from '@/app/lib/data/quranData'
import PageLayout from '@/app/components/ui/PageLayout'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContainer,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionWrapper,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'

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
  const [customDays, setCustomDays] = useState('')
  const [isCustom, setIsCustom] = useState(false)

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
        const cycle = data.revisionCycle || 7
        setRevisionCycle(cycle)
        // Check if it's a custom value (not in preset list)
        const presetValues = [3, 5, 7, 10, 14]
        if (!presetValues.includes(cycle)) {
          setIsCustom(true)
          setCustomDays(cycle.toString())
        } else {
          setIsCustom(false)
          setCustomDays('')
        }
      }
    }

    fetchUserProfile()
  }, [user, router])

  const saveProfile = async (updatedMemorizedJuz: number[], updatedMemorizedSurahs: SelectedSurah[], updatedRevisionCycle: number = revisionCycle, showSuccess: boolean = false) => {
    if (!user) return

    try {
      setError('')
      if (showSuccess) {
      setSuccess('')
      }

      const userDoc = await getDoc(doc(db, 'userProfiles', user.uid))
      const currentData = userDoc.exists() ? userDoc.data() as UserProfile : { juzProgress: {}, surahProgress: {} }

      // Update juzProgress for newly added Juz
      const updatedJuzProgress = { ...currentData.juzProgress }
      updatedMemorizedJuz.forEach(juzNum => {
        if (!updatedJuzProgress[juzNum]) {
          updatedJuzProgress[juzNum] = {
            lastRevised: null,
            strength: 'Medium'
          }
        }
      })

      // Remove juzProgress for removed Juz
      Object.keys(updatedJuzProgress).forEach(juzNum => {
        if (!updatedMemorizedJuz.includes(Number(juzNum))) {
          delete updatedJuzProgress[juzNum]
        }
      })

      // Update surahProgress for newly added Surahs
      const updatedSurahProgress = { ...currentData.surahProgress }
      updatedMemorizedSurahs.forEach(surah => {
        if (!updatedSurahProgress[surah.number]) {
          updatedSurahProgress[surah.number] = {
            lastRevised: null,
            strength: 'Medium'
          }
        }
      })

      // Remove surahProgress for removed Surahs
      Object.keys(updatedSurahProgress).forEach(surahNum => {
        if (!updatedMemorizedSurahs.some(s => s.number === Number(surahNum))) {
          delete updatedSurahProgress[surahNum]
        }
      })

      await updateDoc(doc(db, 'userProfiles', user.uid), {
        memorizedJuz: updatedMemorizedJuz,
        memorizedSurahs: updatedMemorizedSurahs,
        revisionCycle: updatedRevisionCycle,
        juzProgress: updatedJuzProgress,
        surahProgress: updatedSurahProgress
      })

      if (showSuccess) {
      setSuccess('Profile updated successfully')
      }
    } catch (err) {
      setError('Failed to update profile')
      console.error(err)
    }
  }

  const toggleJuz = async (juzNumber: number) => {
    const juz = juzData.find(j => j.number === juzNumber)
    if (!juz) return

    let updatedMemorizedJuz = memorizedJuz
    let updatedMemorizedSurahs = memorizedSurahs

    if (memorizedJuz.includes(juzNumber)) {
      // Remove Juz and its Surahs
      updatedMemorizedJuz = memorizedJuz.filter(num => num !== juzNumber)
      updatedMemorizedSurahs = memorizedSurahs.filter(surah => !surah.juz.includes(juzNumber))
    } else {
      // Add Juz and all its Surahs
      updatedMemorizedJuz = [...memorizedJuz, juzNumber]
      const newSurahs = juz.surahs.map(surah => ({
        number: surah.number,
        juz: [juzNumber]
      }))
      const updated = [...memorizedSurahs]
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
      updatedMemorizedSurahs = updated
    }

    // Update local state immediately for responsive UI
    setMemorizedJuz(updatedMemorizedJuz)
    setMemorizedSurahs(updatedMemorizedSurahs)

    // Auto-save to Firebase
    await saveProfile(updatedMemorizedJuz, updatedMemorizedSurahs)
  }

  const toggleSurah = async (surahNumber: number, juzNumber: number) => {
    const existingIndex = memorizedSurahs.findIndex(s => s.number === surahNumber)
    let updatedSurahs;

    if (existingIndex >= 0) {
      // Surah exists in selection
      const updatedJuz = memorizedSurahs[existingIndex].juz.includes(juzNumber)
        ? memorizedSurahs[existingIndex].juz.filter(j => j !== juzNumber)
        : [...memorizedSurahs[existingIndex].juz, juzNumber]

      if (updatedJuz.length === 0) {
        // Remove Surah if no Juz are selected
        updatedSurahs = memorizedSurahs.filter(s => s.number !== surahNumber)
      } else {
        updatedSurahs = [
          ...memorizedSurahs.slice(0, existingIndex),
          { ...memorizedSurahs[existingIndex], juz: updatedJuz },
          ...memorizedSurahs.slice(existingIndex + 1)
        ]
      }
    } else {
      // Add new Surah
      updatedSurahs = [...memorizedSurahs, { number: surahNumber, juz: [juzNumber] }]
    }

    // After updating Surahs, check if all Surahs in the Juz are selected
    const juz = juzData.find(j => j.number === juzNumber)
    if (!juz) return

    const allSurahsSelected = juz.surahs.every(surah =>
      updatedSurahs.some(s => s.number === surah.number && s.juz.includes(juzNumber))
    )

    // Update Juz selection state
    let updatedMemorizedJuz = memorizedJuz
    if (allSurahsSelected && !memorizedJuz.includes(juzNumber)) {
      updatedMemorizedJuz = [...memorizedJuz, juzNumber]
    } else if (!allSurahsSelected && memorizedJuz.includes(juzNumber)) {
      updatedMemorizedJuz = memorizedJuz.filter(num => num !== juzNumber)
    }

    // Update local state immediately for responsive UI
    setMemorizedJuz(updatedMemorizedJuz)
    setMemorizedSurahs(updatedSurahs)

    // Auto-save to Firebase
    await saveProfile(updatedMemorizedJuz, updatedSurahs)
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
              <h1 className="text-3xl font-bold text-text">Memorization Settings</h1>
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
              <h2 className="text-xl font-semibold text-text mb-4">Revision Cycle</h2>
              <p className="text-text-secondary mb-4">Set how often you want to revise each Juz:</p>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                {[3, 5, 7, 10, 14].map(days => {
                  const presetValues = [3, 5, 7, 10, 14]
                  const isSelected = revisionCycle === days && presetValues.includes(revisionCycle)
                  return (
                    <motion.button
                      key={days}
                      onClick={async () => {
                        setRevisionCycle(days)
                        setIsCustom(false)
                        setCustomDays('')
                        await saveProfile(memorizedJuz, memorizedSurahs, days)
                      }}
                      className={`
                        rounded-lg border p-4 text-center transition-all
                        ${isSelected
                          ? 'bg-green-500 text-white border-green-500 shadow-md'
                          : 'bg-background text-text border-background/10 hover:bg-surface hover:border-background/20'}
                      `}
                      animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-2xl font-bold mb-1">{days}</div>
                      <div className="text-xs opacity-80">Days</div>
                    </motion.button>
                  )
                })}
              </div>

              <div className="border-t border-background/10 pt-4">
                <label className="text-sm font-medium text-text mb-2 block">Custom Days</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter days"
                    value={customDays}
                    onChange={(e) => {
                      const value = e.target.value
                      setCustomDays(value)
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        const days = Number(customDays)
                        if (days > 0 && !isNaN(days)) {
                          setRevisionCycle(days)
                          setIsCustom(true)
                          await saveProfile(memorizedJuz, memorizedSurahs, days)
                        }
                      }
                    }}
                    className="flex-1"
                  />
                  <button
                    onClick={async () => {
                      const days = Number(customDays)
                      if (days > 0 && !isNaN(days)) {
                        setRevisionCycle(days)
                        setIsCustom(true)
                        await saveProfile(memorizedJuz, memorizedSurahs, days)
                      }
                    }}
                    disabled={!customDays || isNaN(Number(customDays)) || Number(customDays) <= 0}
                    className="px-4 py-2 rounded-md transition-colors text-sm font-medium bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                  >
                    Apply
                  </button>
                </div>
                {isCustom && revisionCycle && ![3, 5, 7, 10, 14].includes(revisionCycle) && (
                  <div className="mt-3">
                    <motion.button
                      onClick={async () => {
                        setRevisionCycle(revisionCycle)
                        setIsCustom(true)
                        await saveProfile(memorizedJuz, memorizedSurahs, revisionCycle)
                      }}
                      className="rounded-lg border border-green-500 bg-green-500 text-white p-3 w-full text-center transition-all shadow-md hover:bg-green-600"
                      animate={{ scale: 1.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-xl font-bold mb-1">{revisionCycle}</div>
                      <div className="text-xs opacity-80">Days (Custom)</div>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

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

              <AccordionContainer className="max-h-[400px] overflow-y-auto pr-2">
                <AccordionWrapper>
                  <Accordion type="multiple">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNumber) => {
                      const juz = juzData.find(j => j.number === juzNumber)

                      return (
                        <AccordionItem key={juzNumber} value={juzNumber.toString()}>
                          <AccordionHeader chevronPosition="left" className="flex items-center">
                            <span className="text-lg text-text ml-1">Juz {juzNumber}</span>
                            <div className="flex-1"></div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleJuz(juzNumber)
                              }}
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
                          </AccordionHeader>
                          <AccordionPanel>
                            {juz && (
                              <div className="space-y-2">
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
                          </AccordionPanel>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </AccordionWrapper>
              </AccordionContainer>
            </div>

          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 