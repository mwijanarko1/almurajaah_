'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Settings, LogOut } from 'lucide-react'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const { signOut } = useAuthContext()

  // Don't show navbar on landing page
  if (pathname === '/') return null

  return (
    <nav className="bg-emerald-900/50 backdrop-blur-sm border-b border-emerald-800">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-center px-4 py-3">
          <Link href="/dashboard" className="text-xl font-bold text-[#F5F5DC]">
            Al-Murajaah
          </Link>
        </div>
        {/* Fixed bottom navigation bar for mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-emerald-900/50 backdrop-blur-sm border-t border-emerald-800">
          <div className="flex justify-evenly items-center px-6 py-3">
            <Link 
              href="/profile"
              className="flex flex-col items-center text-[#F5F5DC]/80 hover:text-[#F5F5DC] w-16"
            >
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs text-center">Profile</span>
            </Link>
            <Link 
              href="/settings"
              className="flex flex-col items-center text-[#F5F5DC]/80 hover:text-[#F5F5DC] w-16"
            >
              <Settings className="w-6 h-6 mb-1" />
              <span className="text-xs text-center">Settings</span>
            </Link>
            <button
              onClick={signOut}
              className="flex flex-col items-center text-[#F5F5DC]/80 hover:text-[#F5F5DC] w-16"
            >
              <LogOut className="w-6 h-6 mb-1" />
              <span className="text-xs text-center">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tablet and Desktop Layout */}
      <div className="hidden md:flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-2xl font-bold text-[#F5F5DC]">
          Al-Murajaah
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href="/profile"
            className="flex items-center gap-2 text-[#F5F5DC]/80 hover:text-[#F5F5DC]"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link 
            href="/settings"
            className="flex items-center gap-2 text-[#F5F5DC]/80 hover:text-[#F5F5DC]"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-[#F5F5DC]/80 hover:text-[#F5F5DC]"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  )
} 