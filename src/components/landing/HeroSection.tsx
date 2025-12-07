'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Globe } from 'lucide-react'
import { Tilt } from '@/components/motion-primitives/tilt'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#192f3a] overflow-hidden flex items-center justify-center">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-12">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <Tilt rotationFactor={8} isRevese>
              <div className="relative">
                <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-[rgb(138,190,160)] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(138,190,160,0.3)] overflow-hidden">
                  <Image
                    src="/final-image(4) copy.jpg"
                    alt="Al Muraja'ah Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </Tilt>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold text-[rgb(138,190,160)] leading-tight">
              Al Muraja'ah
            </h1>
          </div>

          {/* Quranic Verse */}
          <div className="max-w-4xl mx-auto space-y-4">
            <blockquote className="text-xl md:text-2xl text-[rgb(138,190,160)] italic font-light">
              "It is certainly We Who have revealed the Reminder, and it is certainly We Who will preserve it."
            </blockquote>
            <cite className="text-lg text-[rgb(138,190,160)]/80">— Quran 15:9</cite>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://apps.apple.com/gb/app/al-murajaah/id6742374091"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <div className="flex w-56 h-16 bg-white text-black rounded-xl items-center justify-center">
                <div className="mr-3">
                  <svg viewBox="0 0 384 512" width="35" height="45">
                    <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-2xl font-semibold font-sans -mt-1">App Store</div>
                </div>
              </div>
            </a>

            <Link
              href="/auth"
              className="group relative w-56 h-16 px-10 py-5 border-2 border-[rgb(138,190,160)] rounded-xl bg-[rgb(138,190,160)] text-[rgb(28,43,49)] font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <span className="flex items-center justify-center gap-3">
                <Globe className="w-[35px] h-[45px]" />
                Web App
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}