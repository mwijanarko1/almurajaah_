'use client'

import { useState, useEffect } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase/firebase'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface JuzCardProps {
  juzNumber: number
  lastRevised: string | null
  strength: 'Weak' | 'Medium' | 'Strong'
  revisionCycle: number
  onStrengthChange: (newStrength: 'Weak' | 'Medium' | 'Strong') => void
  onRevisionUpdate: (juzNumber: number, date: string) => void
}

export default function JuzCard({ 
  juzNumber, 
  lastRevised, 
  strength,
  revisionCycle,
  onStrengthChange,
  onRevisionUpdate
}: JuzCardProps) {
  const [daysSinceRevision, setDaysSinceRevision] = useState<number | null>(null)
  const { user } = useAuthContext()
  const [isUpdating, setIsUpdating] = useState(false)

  const strengthColors = {
    Weak: 'text-red-500',
    Medium: 'text-yellow-500',
    Strong: 'text-green-500'
  }

  const strengthIcons = {
    Weak: '●○○',
    Medium: '●●○',
    Strong: '●●●'
  }

  const nextStrength: { [key: string]: 'Weak' | 'Medium' | 'Strong' } = {
    Weak: 'Medium',
    Medium: 'Strong',
    Strong: 'Weak'
  }

  useEffect(() => {
    if (lastRevised) {
      const lastDate = new Date(lastRevised)
      const today = new Date()
      
      // Reset time parts to compare just the dates
      lastDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      
      if (lastDate.getTime() === today.getTime()) {
        setDaysSinceRevision(0)
      } else {
        const diffTime = Math.abs(today.getTime() - lastDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        setDaysSinceRevision(diffDays)
      }
    } else {
      setDaysSinceRevision(null)
    }
  }, [lastRevised])

  const needsRevision = () => {
    if (!lastRevised) return true // If never revised, needs revision
    return daysSinceRevision !== null && daysSinceRevision >= revisionCycle
  }

  const getRevisionStatus = () => {
    if (!lastRevised) return 'Not Started'
    return needsRevision() ? 'Revise Now' : 'Relax'
  }

  const handleRevisionUpdate = async () => {
    if (!user) return
    setIsUpdating(true)
    const today = new Date().toISOString()

    try {
      await updateDoc(doc(db, 'userProfiles', user.uid), {
        [`juzProgress.${juzNumber}.lastRevised`]: today
      })
      onRevisionUpdate(juzNumber, today)
    } catch (error) {
      console.error('Error updating revision:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleStrengthClick = () => {
    onStrengthChange(nextStrength[strength])
  }

  const getProgressPercentage = () => {
    if (!lastRevised || daysSinceRevision === null) return 0
    const progress = Math.max(0, 100 - (daysSinceRevision / revisionCycle * 100))
    return Math.round(progress)
  }

  const getCardColor = () => {
    if (!lastRevised) return 'bg-red-900' // Not started
    if (daysSinceRevision === null) return 'bg-red-900'
    
    const progress = getProgressPercentage()
    
    if (progress <= 0) return 'bg-red-900' // Overdue
    if (progress <= 25) return 'bg-red-800'
    if (progress <= 50) return 'bg-yellow-800'
    if (progress <= 75) return 'bg-green-800'
    return 'bg-green-700' // Recently revised
  }

  const getProgressRingColor = () => {
    const progress = getProgressPercentage()
    if (progress <= 25) return '#EF4444' // red
    if (progress <= 50) return '#F59E0B' // yellow
    if (progress <= 75) return '#10B981' // green
    return '#059669' // emerald
  }

  const getRevisionTimeDisplay = () => {
    if (!daysSinceRevision) return 'Revise in 7 days'
    if (daysSinceRevision >= revisionCycle) return 'Revise now'
    
    const daysUntilRevision = revisionCycle - daysSinceRevision
    if (daysUntilRevision <= 0) return 'Revise now'
    
    const daysText = daysUntilRevision === 1 ? 'day' : 'days'
    return `Revise in ${daysUntilRevision} ${daysText}`
  }

  return (
    <div className={`