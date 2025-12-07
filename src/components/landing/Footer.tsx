'use client'

import Link from 'next/link'
import { Heart, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#192f3a] border-t border-[rgba(138,190,160,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[rgb(138,190,160)] rounded-full flex items-center justify-center">
                <span className="text-[rgb(28,43,49)] font-bold text-sm">ال</span>
              </div>
              <span className="text-xl font-bold text-[rgb(138,190,160)]">Al Muraja'ah</span>
            </div>
            <p className="text-[rgb(138,190,160)]/70 max-w-md">
              Empowering Muslims worldwide to memorize and retain the Holy Quran through intelligent technology and proven methodologies.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[rgb(138,190,160)]/60 hover:text-[rgb(138,190,160)] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[rgb(138,190,160)]/60 hover:text-[rgb(138,190,160)] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@almurajaah.com"
                className="text-[rgb(138,190,160)]/60 hover:text-[rgb(138,190,160)] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[rgb(138,190,160)]">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/auth" className="text-[rgb(138,190,160)]/70 hover:text-[rgb(138,190,160)] transition-colors">
                Get Started
              </Link>
              <Link href="#features" className="text-[rgb(138,190,160)]/70 hover:text-[rgb(138,190,160)] transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-[rgb(138,190,160)]/70 hover:text-[rgb(138,190,160)] transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-[rgb(138,190,160)]/70 hover:text-[rgb(138,190,160)] transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[rgb(138,190,160)]">Support</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/terms" className="text-[rgb(138,190,160)]/70 hover:text-[rgb(138,190,160)] transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:support@almurajaah.com" className="text-[rgb(138,190,160)]/70 hover:text-[rgb(138,190,160)] transition-colors">
                Contact Support
              </a>
              <a href="#" className="text-[rgb(138,190,160)]/70 hover:text-[rgb(138,190,160)] transition-colors">
                FAQ
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[rgba(138,190,160,0.2)] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[rgb(138,190,160)]/60 text-sm">
              © {currentYear} Al Muraja'ah. All rights reserved.
            </p>
            <p className="text-[rgb(138,190,160)]/60 text-sm flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>for the Ummah</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}