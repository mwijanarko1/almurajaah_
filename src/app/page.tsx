'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Calendar, BarChart2, Users, ChevronDown, Check, Download, Globe, Smartphone, Repeat, Sparkles, Award } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  const stagger = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }
  }

  return (
    <div className="min-h-screen bg-[rgb(28,43,49)]">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative w-32 h-32"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-[rgb(138,190,160)] blur-2xl opacity-30 animate-pulse" />
          
          {/* Logo Container */}
          <div className="relative w-32 h-32 bg-[rgb(138,190,160)] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(138,190,160,0.3)] hover:shadow-[0_0_50px_rgba(138,190,160,0.5)] transition-all duration-500 overflow-hidden">
            <Image
              src="/final-image(4) copy.jpg"
              alt="Al Muraja'ah Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="max-w-4xl space-y-8 relative"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-[rgb(138,190,160)]">
            Welcome to Al Muraja&apos;ah
          </h1>
          
          <div className="space-y-4">
            <p className="text-2xl md:text-3xl text-[rgb(138,190,160)] italic font-light">
              "It is certainly We Who have revealed the Reminder, and it is certainly We Who will preserve it."
            </p>
            <p className="text-lg text-[rgb(138,190,160)]">
              (Quran 15:9)
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12"
          >
            <Link
              href="https://apps.apple.com/gb/app/al-murajaah/id6742374091"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 w-64 bg-[rgb(138,190,160)] hover:bg-[rgba(138,190,160,0.9)] rounded-xl text-[rgb(28,43,49)] font-medium shadow-lg shadow-[rgba(138,190,160,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download the App
              </span>
            </Link>

            <Link
              href="/auth"
              className="group relative px-8 py-4 w-64 bg-[rgb(28,43,49)] hover:bg-[rgba(138,190,160,0.1)] rounded-xl text-[rgb(138,190,160)] font-medium border border-[rgb(138,190,160)] transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                Try the Website
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <button 
          onClick={scrollToNext}
          className="flex flex-col items-center text-[rgb(138,190,160)] hover:text-[rgba(138,190,160,0.9)] transition-colors animate-bounce mt-24"
          aria-label="Scroll to learn more"
        >
          <span className="text-sm mb-2">Learn More</span>
          <ChevronDown className="w-6 h-6" />
        </button>
      </motion.section>

      {/* Problem Section */}
      <motion.section 
        {...fadeInUp}
        id="problem"
        className="relative py-24 px-4 bg-[rgb(28,43,49)]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-5xl font-bold text-center mb-16 text-[rgb(138,190,160)]">
            Struggling to Stay Consistent?
          </motion.h2>
          
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-16 h-16 bg-[rgb(138,190,160)] rounded-2xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <Repeat className="w-8 h-8 text-[rgb(28,43,49)]" />
              </div>
              <p className="text-xl text-[rgb(138,190,160)]">
                Forgetting what you've memorized
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-16 h-16 bg-[rgb(138,190,160)] rounded-2xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-[rgb(28,43,49)]" />
              </div>
              <p className="text-xl text-[rgb(138,190,160)]">
                Falling behind on revision cycles
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-16 h-16 bg-[rgb(138,190,160)] rounded-2xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-[rgb(28,43,49)]" />
              </div>
              <p className="text-xl text-[rgb(138,190,160)]">
                Losing motivation amidst daily distractions
              </p>
            </motion.div>
          </motion.div>

          <motion.p {...fadeInUp} className="text-2xl text-[rgb(138,190,160)] text-center mt-16 max-w-3xl mx-auto font-light">
            These challenges are real—but they don't have to hold you back. Whether you're at home or on the go, Al Muraja'ah has you covered.
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        {...fadeInUp}
        id="features"
        className="relative py-24 px-4 bg-[rgb(28,43,49)]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-5xl font-bold text-center mb-6 text-[rgb(138,190,160)]">
            Your Personal Quran Revision Companion
          </motion.h2>
          <motion.p {...fadeInUp} className="text-2xl text-[rgb(138,190,160)] text-center mb-16 max-w-3xl mx-auto font-light">
            On Web and Mobile
          </motion.p>
          
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ margin: "-100px" }}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-12 h-12 bg-[rgb(138,190,160)] rounded-xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-[rgb(28,43,49)]" />
              </div>
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                Smart Scheduling
              </h3>
              <p className="text-[rgb(138,190,160)]">
                Automatically schedule revisions based on how challenging you found each surah—available on both the website and app.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-12 h-12 bg-[rgb(138,190,160)] rounded-xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <BarChart2 className="w-6 h-6 text-[rgb(28,43,49)]" />
              </div>
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                Visual Dashboard
              </h3>
              <p className="text-[rgb(138,190,160)]">
                See which juz need attention (highlighted in red) and celebrate your successes (highlighted in green)—synced across devices.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-12 h-12 bg-[rgb(138,190,160)] rounded-xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <Award className="w-6 h-6 text-[rgb(28,43,49)]" />
              </div>
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                Daily Streaks
              </h3>
              <p className="text-[rgb(138,190,160)]">
                Build momentum and stay motivated with streak counters and reminders, whether you're using your phone or computer.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-12 h-12 bg-[rgb(138,190,160)] rounded-xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <Repeat className="w-6 h-6 text-[rgb(28,43,49)]" />
              </div>
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                Spaced Repetition
              </h3>
              <p className="text-[rgb(138,190,160)]">
                Focus on retaining what matters most with optimized revision intervals, no matter where you access Al Muraja'ah.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Section */}
      <motion.section 
        {...fadeInUp}
        id="why-choose"
        className="relative py-24 px-4 bg-[rgb(28,43,49)]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-5xl font-bold text-center mb-16 text-[rgb(138,190,160)]">
            Built for Every Memorizer, Everywhere
          </motion.h2>
          
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                For Beginners
              </h3>
              <p className="text-[rgb(138,190,160)]">
                Start small and build a strong foundation with structured tracking—on the web or app.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                For Intermediate Learners
              </h3>
              <p className="text-[rgb(138,190,160)]">
                Focus on challenging surahs with personalized tips, available wherever you are.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                For Advanced Memorizers
              </h3>
              <p className="text-[rgb(138,190,160)]">
                Organize your cycles and master all 30 juz with ease, synced across devices.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-16 h-16 bg-[rgb(138,190,160)] rounded-2xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center">
                  <Globe className="w-7 h-7 text-[rgb(28,43,49)] -mr-1" />
                  <Smartphone className="w-7 h-7 text-[rgb(28,43,49)] -ml-1" />
                </div>
              </div>
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                Cross-Platform Flexibility
              </h3>
              <p className="text-[rgb(138,190,160)]">
                Use the website at home and the app on the go—your progress syncs automatically.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-16 h-16 bg-[rgb(138,190,160)] rounded-2xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <Check className="w-8 h-8 text-[rgb(28,43,49)]" />
              </div>
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                100% Free
              </h3>
              <p className="text-[rgb(138,190,160)]">
                No hidden fees, just powerful tools to support your spiritual growth.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="group bg-[rgba(138,190,160,0.1)] p-8 rounded-2xl border border-[rgba(138,190,160,0.2)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300">
              <div className="w-16 h-16 bg-[rgb(138,190,160)] rounded-2xl rotate-12 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform duration-300">
                <Users className="w-8 h-8 text-[rgb(28,43,49)]" />
              </div>
              <h3 className="text-2xl font-medium text-[rgb(138,190,160)] mb-4">
                Trusted Worldwide
              </h3>
              <p className="text-[rgb(138,190,160)]">
                Trusted by Quran memorizers worldwide.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Journey Section */}
      <motion.section 
        {...fadeInUp}
        id="journey"
        className="relative py-24 px-4 bg-[rgb(28,43,49)]"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-5xl font-bold text-center mb-12 text-[rgb(138,190,160)]">
            From Your Browser to Your Pocket
          </motion.h2>
          
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ margin: "-100px" }}
            className="bg-[rgba(138,190,160,0.1)] p-12 rounded-2xl border border-[rgba(138,190,160,0.2)]"
          >
            <ul className="space-y-8">
              <motion.li variants={fadeInUp} className="flex items-start gap-6">
                <div className="w-10 h-10 bg-[rgb(138,190,160)] rounded-xl rotate-12 flex items-center justify-center flex-shrink-0 group-hover:rotate-0 transition-transform duration-300">
                  <Check className="w-6 h-6 text-[rgb(28,43,49)]" />
                </div>
                <p className="text-xl text-[rgb(138,190,160)]">
                  Al Muraja'ah began as a website designed to simplify Quran revision.
                </p>
              </motion.li>
              
              <motion.li variants={fadeInUp} className="flex items-start gap-6">
                <div className="w-10 h-10 bg-[rgb(138,190,160)] rounded-xl rotate-12 flex items-center justify-center flex-shrink-0 group-hover:rotate-0 transition-transform duration-300">
                  <Check className="w-6 h-6 text-[rgb(28,43,49)]" />
                </div>
                <p className="text-xl text-[rgb(138,190,160)]">
                  Based on user feedback, we developed a mobile app to make it even more accessible and convenient.
                </p>
              </motion.li>
              
              <motion.li variants={fadeInUp} className="flex items-start gap-6">
                <div className="w-10 h-10 bg-[rgb(138,190,160)] rounded-xl rotate-12 flex items-center justify-center flex-shrink-0 group-hover:rotate-0 transition-transform duration-300">
                  <Check className="w-6 h-6 text-[rgb(28,43,49)]" />
                </div>
                <p className="text-xl text-[rgb(138,190,160)]">
                  Now, you can switch between the website and app seamlessly, ensuring your revision journey is uninterrupted.
                </p>
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        {...fadeInUp}
        id="cta"
        className="relative py-24 px-4 bg-[rgb(28,43,49)]"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo with glow effect */}
          <motion.div 
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative w-32 h-32 mx-auto mb-12"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-[rgb(138,190,160)] blur-2xl opacity-30 animate-pulse" />
            
            {/* Logo Container */}
            <div className="relative w-32 h-32 bg-[rgb(138,190,160)] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(138,190,160,0.3)] hover:shadow-[0_0_50px_rgba(138,190,160,0.5)] transition-all duration-500 overflow-hidden">
              <Image
                src="/final-image(4) copy.jpg"
                alt="Al Muraja'ah Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-5xl font-bold mb-12 text-[rgb(138,190,160)]">
            Start Your Quran Journey Today
          </motion.h2>
          
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ margin: "-100px" }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link
              href="https://apps.apple.com/gb/app/al-murajaah/id6742374091"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 w-64 bg-[rgb(138,190,160)] hover:bg-[rgba(138,190,160,0.9)] rounded-xl text-[rgb(28,43,49)] font-medium shadow-lg shadow-[rgba(138,190,160,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download the App
              </span>
            </Link>

            <Link
              href="/auth"
              className="group relative px-8 py-4 w-64 bg-[rgb(28,43,49)] hover:bg-[rgba(138,190,160,0.1)] rounded-xl text-[rgb(138,190,160)] font-medium border border-[rgb(138,190,160)] transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                Try the Website
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        {...fadeInUp}
        className="relative py-12 px-4 bg-[rgb(28,43,49)] border-t border-[rgba(138,190,160,0.2)]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-[rgb(138,190,160)] mb-4">Quick Links</h3>
              <nav className="flex flex-wrap gap-6">
                <Link href="/auth" className="text-[rgb(138,190,160)] hover:text-[rgba(138,190,160,0.8)] transition-colors">
                  Get Started
                </Link>
                <Link href="/terms" className="text-[rgb(138,190,160)] hover:text-[rgba(138,190,160,0.8)] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({ prevPath: window.location.pathname }, '', '/terms');
                    window.location.href = '/terms';
                  }}>
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-[rgb(138,190,160)] hover:text-[rgba(138,190,160,0.8)] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({ prevPath: window.location.pathname }, '', '/privacy');
                    window.location.href = '/privacy';
                  }}>
                  Privacy Policy
                </Link>
              </nav>
            </div>

            {/* Tagline */}
            <div className="text-right">
              <p className="text-2xl text-[rgb(138,190,160)] font-light italic">
                Al-Muraja&apos;ah: Revive, Retain, Reconnect.
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
