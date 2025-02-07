'use client'

import { useEffect, useState } from 'react'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { db } from '@/app/lib/firebase/firebase'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import type { PageRevisionStats } from '@/app/lib/types/quran'
import { surahPages } from '@/app/lib/data/surahPages'

const QURAN_TOTAL_PAGES = 604

interface SurahProgress {
  lastRevised: string | null
  strength: 'Weak' | 'Medium' | 'Strong'
}

export default function PageRevisionStats() {
  const { user } = useAuthContext()
  const [stats, setStats] = useState<PageRevisionStats>({
    pagesRevisedToday: 0,
    totalPagesRevised: 0,
    totalPages: QURAN_TOTAL_PAGES,
    lastRevisedPages: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Set up real-time listener
    const userProfileRef = doc(db, 'userProfiles', user.uid)
    const unsubscribe = onSnapshot(userProfileRef, async (doc) => {
      const userData = doc.data()
      if (userData?.pageRevisionStats) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Check if we need to reset the daily counter
        const lastResetDate = userData.pageRevisionStats.lastResetDate ? 
          new Date(userData.pageRevisionStats.lastResetDate) : null
        
        if (!lastResetDate || lastResetDate.getTime() < today.getTime()) {
          // Reset the daily counter at midnight
          await updateDoc(userProfileRef, {
            'pageRevisionStats.pagesRevisedToday': 0,
            'pageRevisionStats.lastResetDate': today.toISOString()
          })
        }

        setStats({
          totalPagesRevised: userData.pageRevisionStats.totalPagesRevised || 0,
          pagesRevisedToday: userData.pageRevisionStats.pagesRevisedToday || 0,
          totalPages: QURAN_TOTAL_PAGES,
          lastRevisedPages: userData.pageRevisionStats.lastRevisedPages || []
        })
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mt-1">
        <div className="bg-background/20 rounded-lg p-3">
          <h3 className="text-emerald-400 text-lg font-semibold">Today's Pages</h3>
          <p className="text-2xl font-bold text-text">{stats.pagesRevisedToday}</p>
          <p className="text-sm text-text-secondary">pages revised today</p>
        </div>
        
        <div className="bg-background/20 rounded-lg p-3">
          <h3 className="text-blue-400 text-lg font-semibold">All Time</h3>
          <p className="text-2xl font-bold text-text">
            {stats.totalPagesRevised}
          </p>
          <p className="text-sm text-text-secondary">total pages revised</p>
        </div>
      </div>
    </div>
  )
} 