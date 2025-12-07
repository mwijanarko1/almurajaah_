'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import AnimatedTabs, { TabType } from '@/components/AnimatedTabs'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuthContext()

  // Don't show on landing page or auth pages
  if (pathname === '/' || pathname.startsWith('/auth')) return null

  // Determine active tab based on current pathname
  const getActiveTab = (): TabType => {
    if (pathname.startsWith('/dashboard')) return 'home'
    if (pathname.startsWith('/profile')) return 'profile'
    if (pathname.startsWith('/settings')) return 'settings'
    return 'home' // default
  }

  const handleTabChange = (tab: TabType) => {
    switch (tab) {
      case 'home':
        router.push('/dashboard?view=juz')
        break
      case 'profile':
        router.push('/profile')
        break
      case 'settings':
        router.push('/settings')
        break
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <AnimatedTabs
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />
    </div>
  )
} 