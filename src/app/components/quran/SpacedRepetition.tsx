'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase/firebase'
import { ReviewQuality, SpacedRepetitionState } from '@/app/lib/spaced-repetition/types'
import { motion } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { surahs } from '@/app/lib/data/surahs'

const INTERVALS = {
  AGAIN: {
    time: '<10m',
    effect: 'Reset revision date'
  },
  HARD: {
    time: '2d',
    effect: '+5 days'
  },
  GOOD: {
    time: '8mo',
    effect: '+2 days'
  },
  EASY: {
    time: '1.7y',
    effect: 'Keep current'
  }
}

function InfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-background/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text">Spaced Review Rules</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Rating System:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Needs Revision:</strong> Resets the last revised date to make it appear as needing revision</li>
                <li><strong>Hard:</strong> Sets the revision date to show up in 1 day</li>
                <li><strong>Medium:</strong> Sets the revision date to show up in 3 days</li>
                <li><strong>Easy:</strong> Sets the revision date to show up after your full revision cycle</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Card Behavior:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Cards are shown one at a time</li>
                <li>After rating, the card is removed from spaced review</li>
                <li>Cards will reappear in spaced review when marked as revised in the dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function SpacedRepetition() {
  const { user } = useAuthContext()
  const [dueCards, setDueCards] = useState<number[]>([])
  const [currentCard, setCurrentCard] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  useEffect(() => {
    if (!user) return

    const fetchDueCards = async (attempt = 1) => {
      try {
        setError(null)
        const userDoc = await getDoc(doc(db, 'userProfiles', user.uid))
        if (!userDoc.exists()) return

        const userProfile = userDoc.data()
        const now = new Date()
        const dueCards: number[] = []

        userProfile.memorizedSurahs.forEach((surah: { number: number }) => {
          const surahProgress = userProfile.surahProgress[surah.number.toString()]
          
          if (!surahProgress?.lastRevised) {
            dueCards.push(surah.number)
            return
          }

          const lastRevised = new Date(surahProgress.lastRevised)
          const diffTime = Math.abs(now.getTime() - lastRevised.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays >= (userProfile.revisionCycle || 7)) {
            dueCards.push(surah.number)
          }
        })

        // Sort cards numerically
        const sortedDueCards = dueCards.sort((a, b) => a - b)
        setDueCards(sortedDueCards)
        if (sortedDueCards.length > 0) {
          setCurrentCard(sortedDueCards[0])
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching due cards:', error)
        if (attempt < MAX_RETRIES) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
          setTimeout(() => fetchDueCards(attempt + 1), delay)
        } else {
          setError('Failed to load your revision cards. Please check your internet connection and try again.')
          setLoading(false)
        }
      }
    }

    fetchDueCards()
  }, [user])

  const getNextCard = (currentCard: number, remainingCards: number[]) => {
    // Find the next surah number that's greater than the current one
    const nextSurah = remainingCards.find(num => num > currentCard)
    // If no higher number found, return the first card (wrap around)
    return nextSurah || remainingCards[0] || null
  }

  const handleRating = async (quality: ReviewQuality) => {
    if (!user || !currentCard) return

    setIsChanging(true)
    setError(null)

    const updateWithRetry = async (attempt = 1) => {
      try {
        const userProfileRef = doc(db, 'userProfiles', user.uid)
        const userProfileSnap = await getDoc(userProfileRef)
        const userProfile = userProfileSnap.data()

        if (userProfile) {
          const now = new Date()
          let lastRevisedDate: Date

          if (quality === 1) { // Needs Revision
            lastRevisedDate = new Date(now.getTime() - (userProfile.revisionCycle + 1) * 24 * 60 * 60 * 1000)
          } else if (quality === 2) { // Hard - Show up in 1 day
            lastRevisedDate = new Date(now.getTime() - (userProfile.revisionCycle - 1) * 24 * 60 * 60 * 1000)
          } else if (quality === 3) { // Medium - Show up in 3 days
            lastRevisedDate = new Date(now.getTime() - (userProfile.revisionCycle - 3) * 24 * 60 * 60 * 1000)
          } else { // Easy - Reset to show up after revisionCycle days
            lastRevisedDate = now
          }

          const updatedSurahProgress = {
            ...userProfile.surahProgress,
            [currentCard.toString()]: {
              ...userProfile.surahProgress[currentCard.toString()],
              lastRevised: lastRevisedDate.toISOString()
            }
          }

          // Check if all surahs in any juz are revised
          const updatedJuzProgress = { ...userProfile.juzProgress }
          const juzData = surahs.find(s => s.number === currentCard)?.juz
          
          if (juzData) {
            const juzNumbers = Array.isArray(juzData) ? juzData : [juzData]
            
            juzNumbers.forEach(juzNumber => {
              const surahsInJuz = surahs.filter(s => {
                const surahJuz = Array.isArray(s.juz) ? s.juz : [s.juz]
                return surahJuz.includes(juzNumber)
              })

              const memorizedSurahsInJuz = surahsInJuz.filter(s => 
                userProfile.memorizedSurahs.some((ms: { number: number }) => ms.number === s.number)
              )

              // Check if all memorized surahs in this juz are recently revised
              const allSurahsRevised = memorizedSurahsInJuz.every(s => {
                const surahProgress = updatedSurahProgress[s.number.toString()]
                if (!surahProgress?.lastRevised) return false
                
                const lastRevised = new Date(surahProgress.lastRevised)
                const diffTime = Math.abs(now.getTime() - lastRevised.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                
                return diffDays < (userProfile.revisionCycle || 7)
              })

              if (allSurahsRevised && memorizedSurahsInJuz.length > 0) {
                updatedJuzProgress[juzNumber.toString()] = {
                  ...updatedJuzProgress[juzNumber.toString()],
                  lastRevised: now.toISOString()
                }
              }
            })
          }

          await updateDoc(userProfileRef, {
            surahProgress: updatedSurahProgress,
            juzProgress: updatedJuzProgress
          })

          const remainingDue = dueCards.filter(num => num !== currentCard)
          const nextCard = getNextCard(currentCard, remainingDue)
          
          setTimeout(() => {
            setDueCards(remainingDue)
            setCurrentCard(nextCard)
            setIsChanging(false)
            setError(null)
          }, 300) // Match the animation duration
        }
      } catch (error) {
        console.error('Error updating ratings:', error)
        if (attempt < MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
          setTimeout(() => updateWithRetry(attempt + 1), delay)
        } else {
          setError('Failed to save your rating. Your progress will be saved when you reconnect.')
          setIsChanging(false)
        }
      }
    }

    updateWithRetry()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const InfoHeader = () => (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold text-text">
          Spaced Review Session
        </h3>
        <button
          onClick={() => setShowInfoModal(true)}
          className="p-1.5 text-text hover:bg-background/10 rounded-full transition-colors"
          aria-label="Show spaced review rules"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      {currentCard && (
        <span className="text-text-secondary">
          {dueCards.length} surahs remaining
        </span>
      )}
    </div>
  )

  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto">
        <InfoHeader />
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
          <h3 className="text-2xl font-semibold text-text">All caught up! 🎉</h3>
          <p className="text-text-secondary mb-6">
            No surahs due for revision right now. Check back later!
          </p>
        </div>
        <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
      </div>
    )
  }

  const currentSurah = surahs.find(s => s.number === currentCard)
  if (!currentSurah) return null

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}
      
      <InfoHeader />

      <motion.div
        key={currentCard}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
        className={`bg-red-950 rounded-xl overflow-hidden shadow-lg ${isChanging ? 'pointer-events-none' : ''}`}
      >
        {/* Card Header */}
        <div className="relative">
          <select
            value={currentCard}
            onChange={(e) => setCurrentCard(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          >
            {dueCards.map((surahNumber) => {
              const surah = surahs.find(s => s.number === surahNumber)
              return (
                <option key={surahNumber} value={surahNumber}>
                  Surah {surahNumber}: {surah?.name}
                </option>
              )
            })}
          </select>
          <div className="bg-red-900 text-white px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-red-800 transition-colors">
            <h2 className="text-2xl font-semibold">
              Surah {currentSurah.number}: {currentSurah.name}
            </h2>
            <svg className="w-5 h-5 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Rating Buttons */}
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => handleRating(1)}
              className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-[#444] hover:bg-[#555] transition-colors text-white"
              disabled={isChanging}
            >
              <span className="font-medium">Needs Revision</span>
            </button>
            <button
              onClick={() => handleRating(2)}
              className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-[#444] hover:bg-[#555] transition-colors text-white"
              disabled={isChanging}
            >
              <span className="font-medium">Hard</span>
            </button>
            <button
              onClick={() => handleRating(3)}
              className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-[#444] hover:bg-[#555] transition-colors text-white"
              disabled={isChanging}
            >
              <span className="font-medium">Medium</span>
            </button>
            <button
              onClick={() => handleRating(4)}
              className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-[#444] hover:bg-[#555] transition-colors text-white"
              disabled={isChanging}
            >
              <span className="font-medium">Easy</span>
            </button>
          </div>
        </div>
      </motion.div>

      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  )
} 