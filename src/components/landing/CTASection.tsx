'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Download, Globe, Star, Users, Shield } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-[#192f3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          {/* Logo and Title */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[rgb(138,190,160)] blur-2xl opacity-30" />
              <div className="relative w-20 h-20 bg-[rgb(138,190,160)] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(138,190,160,0.3)] overflow-hidden">
                <Image
                  src="/final-image(4) copy.jpg"
                  alt="Al Muraja'ah Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold text-[rgb(138,190,160)]">
              Ready to Transform Your Journey?
            </h2>
            <p className="text-xl md:text-2xl text-[rgb(138,190,160)]/80 max-w-3xl mx-auto">
              Join thousands of Muslims worldwide who have revolutionized their Quran memorization with Al Muraja'ah
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 my-12">
            <div className="flex items-center space-x-2 text-[rgb(138,190,160)]">
              <Shield className="w-5 h-5" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center space-x-2 text-[rgb(138,190,160)]">
              <Users className="w-5 h-5" />
              <span>Trusted Worldwide</span>
            </div>
            <div className="flex items-center space-x-2 text-[rgb(138,190,160)]">
              <Star className="w-5 h-5" />
              <span>No Ads, No Subscriptions</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="https://apps.apple.com/gb/app/al-murajaah/id6742374091"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-10 py-5 bg-[rgb(138,190,160)] rounded-xl text-[rgb(28,43,49)] font-bold text-lg shadow-lg shadow-[rgba(138,190,160,0.3)] hover:shadow-[rgba(138,190,160,0.5)] transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-3">
                <Download className="w-6 h-6" />
                Download for iOS
                <span className="text-sm font-normal">(Coming to Android)</span>
              </span>
            </Link>

            <Link
              href="/auth"
              className="group relative px-10 py-5 border-2 border-[rgb(138,190,160)] rounded-xl text-[rgb(138,190,160)] font-bold text-lg hover:bg-[rgb(138,190,160)] hover:text-[rgb(28,43,49)] transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-3">
                <Globe className="w-6 h-6" />
                Try Web Version
              </span>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 space-y-4">
            <p className="text-[rgb(138,190,160)]/60">
              Available on iOS App Store • Web version works on all devices
            </p>
            <p className="text-sm text-[rgb(138,190,160)]/50">
              Start your journey today. Your first 30 days are completely free with full access to all features.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}