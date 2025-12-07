'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgb(28,43,49)]/95 backdrop-blur-sm border-b border-[rgba(138,190,160,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[rgb(138,190,160)] rounded-full flex items-center justify-center">
              <Image
                src="/final-image(4) copy.jpg"
                alt="Al Muraja'ah Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-[rgb(138,190,160)]">Al Muraja'ah</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-[rgb(138,190,160)] hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-[rgb(138,190,160)] hover:text-white transition-colors">
              About
            </Link>
            <Link href="/auth" className="text-[rgb(138,190,160)] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/auth"
              className="bg-[rgb(138,190,160)] text-[rgb(28,43,49)] px-4 py-2 rounded-lg font-medium hover:bg-[rgb(138,190,160)]/90 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[rgb(138,190,160)]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(138,190,160,0.2)]">
            <div className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-[rgb(138,190,160)] hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#about"
                className="text-[rgb(138,190,160)] hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/auth"
                className="text-[rgb(138,190,160)] hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="bg-[rgb(138,190,160)] text-[rgb(28,43,49)] px-4 py-2 rounded-lg font-medium hover:bg-[rgb(138,190,160)]/90 transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}