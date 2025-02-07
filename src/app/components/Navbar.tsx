'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Settings, LogOut, Clock, Home } from 'lucide-react'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const { signOut } = useAuthContext()

  // Don't show navbar on landing page
  if (pathname === '/') return null

  return (
    <nav className="fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-md z-50 pt-8 sm:pt-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-text">
            Al-Murajaah
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/' ? 'text-emerald-500' : 'text-text hover:text-emerald-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              href="/spaced-review"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/spaced-review' ? 'text-emerald-500' : 'text-text hover:text-emerald-500'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="hidden sm:inline">Spaced Review</span>
            </Link>

            <Link
              href="/profile"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/profile' ? 'text-emerald-500' : 'text-text hover:text-emerald-500'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            <Link
              href="/settings"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/settings' ? 'text-emerald-500' : 'text-text hover:text-emerald-500'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-text hover:text-emerald-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 