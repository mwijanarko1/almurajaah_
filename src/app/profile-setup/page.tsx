'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { db } from '@/app/lib/firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { juzData } from '@/app/lib/data/quranData'

interface SelectedSurah {
  number: number
  juz: number[]
}

export default function ProfileSetup() {
  const [selectedJuz, setSelectedJuz] = useState<number[]>([])
  const [selectedSurahs, setSelectedSurahs] = useState<SelectedSurah[]>([])
  const [revisionCycle, setRevisionCycle] = useState(7) // Default 7 days
  const [isLoading, setIsLoading] = useState(false)
  const [expandedJuz, setExpandedJuz] = useState<number[]>([])
  const { user } = useAuthContext()
  const router = useRouter()

  const toggleJuz = (juzNumber: number) => {
    const juz = juzData.find(j => j.number === juzNumber)
    if (!juz) return

    if (selectedJuz.includes(juzNumber)) {
      // Remove Juz and its Surahs
      setSelectedJuz(prev => prev.filter(num => num !== juzNumber))
      setSelectedSurahs(prev => prev.filter(surah => !surah.juz.includes(juzNumber)))
    } else {
      // Add Juz and all its Surahs
      setSelectedJuz(prev => [...prev, juzNumber])
      const newSurahs = juz.surahs.map(surah => ({
        number: surah.number,
        juz: [juzNumber]
      }))
      setSelectedSurahs(prev => {
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
  }

  const toggleSurah = (surahNumber: number, juzNumber: number) => {
    setSelectedSurahs(prev => {
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

      // After updating Surahs, check if all Surahs in the current Juz are selected
      const juz = juzData.find(j => j.number === juzNumber)
      if (!juz) return updatedSurahs

      // Only check Surahs that belong to this specific Juz
      const allSurahsInJuzSelected = juz.surahs.every(surah => 
        updatedSurahs.some(s => s.number === surah.number && s.juz.includes(juzNumber))
      )

      // Update Juz selection state only for the current Juz
      if (allSurahsInJuzSelected && !selectedJuz.includes(juzNumber)) {
        setSelectedJuz(prev => [...prev, juzNumber].sort((a, b) => a - b))
      } else if (!allSurahsInJuzSelected && selectedJuz.includes(juzNumber)) {
        setSelectedJuz(prev => prev.filter(num => num !== juzNumber))
      }

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

  const handleSubmit = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      const userProfileRef = doc(db, 'userProfiles', user.uid)
      const juzProgress: { [key: string]: any } = {}
      const surahProgress: { [key: string]: any } = {}
      
      selectedJuz.forEach(juzNum => {
        juzProgress[juzNum] = {
          lastRevised: null,
          strength: 'Medium'
        }
      })

      selectedSurahs.forEach(surah => {
        surahProgress[surah.number] = {
          lastRevised: null,
          strength: 'Medium'
        }
      })

      await setDoc(userProfileRef, {
        memorizedJuz: selectedJuz,
        memorizedSurahs: selectedSurahs,
        juzProgress,
        surahProgress,
        revisionCycle,
        setupCompleted: true,
        displayName: user.displayName || 'User'
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedJuz.length === 30) {
      setSelectedJuz([])
      setSelectedSurahs([])
    } else {
      const allJuz = Array.from({ length: 30 }, (_, i) => i + 1)
      setSelectedJuz(allJuz)
      
      const allSurahs = juzData.reduce<SelectedSurah[]>((acc, juz) => {
        juz.surahs.forEach(surah => {
          const existingIndex = acc.findIndex(s => s.number === surah.number)
          if (existingIndex >= 0) {
            acc[existingIndex].juz.push(juz.number)
          } else {
            acc.push({ number: surah.number, juz: [juz.number] })
          }
        })
        return acc
      }, [])
      setSelectedSurahs(allSurahs)
    }
  }

  const isSurahSelected = (surahNumber: number, juzNumber: number) => {
    return selectedSurahs.some(s => 
      s.number === surahNumber && s.juz.includes(juzNumber)
    )
  }

  return (
    <main className="min-h-screen bg-[#0A2E1F] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1B4D3E] rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">
            Setup Your Profile
          </h1>
          <p className="text-gray-300 mb-8">
            Select the Juz or individual Surahs you have memorized and set your revision cycle.
          </p>

          {/* Revision Cycle Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Revision Cycle
            </h2>
            <p className="text-gray-300 mb-4">
              How many days should one cycle of revision be?
            </p>
            <div className="flex flex-wrap gap-4">
              {[3, 5, 7, 10, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setRevisionCycle(days)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${revisionCycle === days
                      ? 'bg-[#2ECC71] text-white'
                      : 'bg-black bg-opacity-20 text-gray-300 hover:bg-opacity-30'
                    }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Juz Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Select Memorized Juz or Surahs
              </h2>
              <button
                onClick={handleSelectAll}
                className="text-[#2ECC71] hover:text-[#27AE60] text-sm"
              >
                {selectedJuz.length === 30 ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNumber) => {
                const juz = juzData.find(j => j.number === juzNumber)
                const isExpanded = expandedJuz.includes(juzNumber)
                
                return (
                  <div key={juzNumber} className="space-y-2">
                    <div
                      className="flex items-center justify-between p-3 rounded-lg bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleExpand(juzNumber)}
                          className="text-gray-300 hover:text-white transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <span className="text-lg text-white">Juz {juzNumber}</span>
                      </div>
                      <button
                        onClick={() => toggleJuz(juzNumber)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          selectedJuz.includes(juzNumber) ? 'bg-[#2ECC71]' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform bg-white ${
                            selectedJuz.includes(juzNumber) ? 'translate-x-6' : ''
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
                            className="flex items-center justify-between p-2 rounded-lg bg-black bg-opacity-10"
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
                                <span className="text-[#2ECC71]">
                                  {surah.number}. {surah.name}
                                </span>
                                {surah.verses && (
                                  <span className="text-gray-400 text-sm ml-2">
                                    (Verses: {surah.verses})
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-lg font-arabic text-gray-300">
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

          <button
            onClick={handleSubmit}
            disabled={selectedSurahs.length === 0 || isLoading}
            className={`w-full py-3 rounded-lg text-white font-medium transition-colors
              ${selectedSurahs.length === 0 || isLoading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-[#2ECC71] hover:bg-[#27AE60]'
              }`}
          >
            {isLoading ? 'Setting up...' : 'Continue to Dashboard'}
          </button>
        </div>
      </div>
    </main>
  )
} 