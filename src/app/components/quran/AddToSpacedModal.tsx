'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { surahs } from '@/app/lib/data/surahs'
import type { Surah } from '@/app/lib/data/surahs'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase/firebase'

interface AddToSpacedModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (selectedSurahs: number[]) => void
  currentSpacedSurahs: number[]
}

interface JuzData {
  number: number
  surahs: Surah[]
}

// Group surahs by Juz
const juzData: JuzData[] = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
  surahs: surahs.filter(surah => surah.juz.includes(i + 1))
}))

export default function AddToSpacedModal({
  isOpen,
  onClose,
  onAdd,
  currentSpacedSurahs
}: AddToSpacedModalProps) {
  const { user } = useAuthContext()
  const [selectedSurahs, setSelectedSurahs] = useState<number[]>(currentSpacedSurahs)
  const [memorizedSurahs, setMemorizedSurahs] = useState<number[]>([])
  const [expandedJuz, setExpandedJuz] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch memorized surahs when modal opens
  useEffect(() => {
    const fetchMemorizedSurahs = async () => {
      if (!user) return
      const userDoc = await getDoc(doc(db, 'userProfiles', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        const memorizedSurahNumbers = data.memorizedSurahs.map((s: any) => s.number)
        setMemorizedSurahs(memorizedSurahNumbers)
      }
      setLoading(false)
    }
    if (isOpen) {
      fetchMemorizedSurahs()
    }
  }, [isOpen, user])

  const toggleJuz = (juzNumber: number, juzMemorizedSurahs: Surah[], e: React.MouseEvent) => {
    // Prevent the click from triggering the expand/collapse
    e.stopPropagation()

    // Check if all surahs in this juz are selected
    const allSelected = juzMemorizedSurahs.every(surah => 
      selectedSurahs.includes(surah.number)
    )

    // Toggle all surahs in this juz
    if (allSelected) {
      // Remove all surahs in this juz
      setSelectedSurahs(prev => 
        prev.filter(num => !juzMemorizedSurahs.some(s => s.number === num))
      )
    } else {
      // Add all surahs in this juz
      const surahsToAdd = juzMemorizedSurahs
        .map(s => s.number)
        .filter(num => !selectedSurahs.includes(num))
      setSelectedSurahs(prev => [...prev, ...surahsToAdd])
    }
  }

  const handleExpand = (juzNumber: number) => {
    setExpandedJuz(prev =>
      prev.includes(juzNumber)
        ? prev.filter(num => num !== juzNumber)
        : [...prev, juzNumber]
    )
  }

  const toggleSurah = (surahNumber: number) => {
    setSelectedSurahs(prev =>
      prev.includes(surahNumber)
        ? prev.filter(num => num !== surahNumber)
        : [...prev, surahNumber]
    )
  }

  const handleAdd = () => {
    onAdd(selectedSurahs)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-text">Add Surahs to Spaced Review</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : memorizedSurahs.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              No memorized surahs found. Please memorize some surahs first.
            </div>
          ) : (
            <div className="space-y-2">
              {juzData.map(juz => {
                const juzMemorizedSurahs = juz.surahs.filter(surah => 
                  memorizedSurahs.includes(surah.number)
                )
                
                if (juzMemorizedSurahs.length === 0) return null

                const isExpanded = expandedJuz.includes(juz.number)
                
                return (
                  <div key={juz.number} className="bg-background/5 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 hover:bg-background/10 transition-colors">
                      <button
                        onClick={() => handleExpand(juz.number)}
                        className="flex items-center gap-2 flex-1"
                      >
                        <ChevronDown 
                          className={`w-5 h-5 text-text-secondary transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                        <span className="font-medium text-text">Juz {juz.number}</span>
                      </button>
                      <button
                        onClick={(e) => toggleJuz(juz.number, juzMemorizedSurahs, e)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          juzMemorizedSurahs.every(surah => selectedSurahs.includes(surah.number))
                            ? 'bg-[#4CAF50]'
                            : 'bg-[#333]'
                        }`}
                      >
                        <div
                          className={`absolute left-[2px] inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            juzMemorizedSurahs.every(surah => selectedSurahs.includes(surah.number))
                              ? 'translate-x-5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-2">
                            {juzMemorizedSurahs.map(surah => (
                              <div
                                key={surah.number}
                                className="flex items-center justify-between p-2 rounded-lg bg-background/10"
                              >
                                <span className="text-text-secondary">
                                  Surah {surah.number}: {surah.name}
                                </span>
                                <button
                                  onClick={() => toggleSurah(surah.number)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    selectedSurahs.includes(surah.number)
                                      ? 'bg-[#4CAF50]'
                                      : 'bg-[#333]'
                                  }`}
                                >
                                  <div
                                    className={`absolute left-[2px] inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                                      selectedSurahs.includes(surah.number)
                                        ? 'translate-x-5'
                                        : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-6 flex justify-end">
          <button
            onClick={handleAdd}
            className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-xl font-medium"
          >
            Add Selected Surahs
          </button>
        </div>
      </motion.div>
    </div>
  )
} 