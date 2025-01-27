'use client'

import Link from 'next/link'
import { BookOpen, Calendar, BarChart2, Users, ChevronDown } from 'lucide-react'
import IslamicPattern from '@/app/components/ui/IslamicPattern'
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
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  const stagger = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <IslamicPattern />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 bg-emerald-900/30 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-32 h-32 bg-[#1a2e3b] rounded-full flex items-center justify-center mb-12"
        >
          <BookOpen className="w-16 h-16 text-[#98F5C4]" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="max-w-4xl space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#F5F5DC]">
            Welcome to Al Muraja&apos;ah
          </h1>
          
          <div className="space-y-2">
            <p className="text-xl md:text-2xl text-[#F5F5DC] italic">
              "It is certainly We Who have revealed the Reminder, and it is certainly We Who will preserve it."
            </p>
            <p className="text-lg text-[#F5F5DC] opacity-90">
              (Quran 15:9)
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col items-center gap-8 mt-12"
        >
          <Link
            href="/auth"
            className="bg-[#2ECC71] text-white px-12 py-4 rounded-full text-xl font-semibold hover:bg-[#27AE60] transition-colors"
          >
            Bismillah
          </Link>

          <button 
            onClick={scrollToNext}
            className="flex flex-col items-center text-[#98F5C4] hover:text-[#98F5C4]/80 transition-colors animate-bounce"
            aria-label="Scroll to learn more"
          >
            <span className="text-sm mb-2">Learn More</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </motion.div>
      </motion.section>

      {/* About Us Section with Hadith */}
      <motion.section 
        {...fadeInUp}
        id="about"
        className="relative z-10 py-24 px-4 border-t border-emerald-800 bg-emerald-900/50 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 {...fadeInUp} className="text-4xl font-bold text-[#F5F5DC] mb-8">
            About Us
          </motion.h2>
          <motion.div {...fadeInUp} className="bg-emerald-800/50 p-8 rounded-lg backdrop-blur-sm mb-8">
            <p className="text-xl text-[#F5F5DC]/90 italic mb-2">
              "The example of a man who has memorised the Qur'an is like that of a hobbled camel. If he remained vigilant, he would be able to retain it (with him), and if he loosened the hobbled camel it would escape."
            </p>
            <p className="text-lg text-[#F5F5DC] opacity-80">
              (Sahih Muslim)
            </p>
          </motion.div>
          <motion.p {...fadeInUp} className="text-lg text-[#F5F5DC]/90 leading-relaxed">
            At the heart of our journey lies a profound inspiration from the words of the Prophet Muhammad (ﷺ). Our vision is rooted in this powerful metaphor—a reminder of the delicate relationship between the memorizer and the Quran. Just as a hobbled camel requires constant attention to prevent it from wandering away, so too does the Quran demand continuous engagement to remain firmly planted in our hearts.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section 
        id="mission"
        className="relative z-10 py-24 px-4 border-b border-emerald-800 bg-emerald-900/50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12"
          >
            <motion.div variants={fadeInUp} className="bg-emerald-800/50 p-8 rounded-lg backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-[#F5F5DC] mb-6">Our Mission</h2>
              <p className="text-lg text-[#F5F5DC]/90 leading-relaxed mb-6">
                We are dedicated to empowering Quran memorizers with the tools and guidance they need to stay vigilant in their memorization journey. Our app is more than a tracker—it is a companion that:
              </p>
              <ul className="list-disc list-inside text-[#F5F5DC]/90 space-y-2">
                <li>Supports your revision by making it structured and manageable.</li>
                <li>Encourages consistency through personalized reminders and insights.</li>
                <li>Strengthens your connection to the Quran by keeping its words fresh in your mind.</li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-emerald-800/50 p-8 rounded-lg backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-[#F5F5DC] mb-6">Our Vision</h2>
              <p className="text-lg text-[#F5F5DC]/90 leading-relaxed">
                We envision a global community of Quran memorizers who not only retain the Quran in their hearts but also embody its teachings in their lives. Through consistent revision and deep connection, we aspire to help every user fulfill the responsibility and honor of carrying Allah's words.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <motion.section 
        {...fadeInUp}
        className="relative z-10 py-24 px-4 border-b border-emerald-800 bg-emerald-900/50 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-4xl font-bold text-[#F5F5DC] text-center mb-8">
            Why We Exist
          </motion.h2>
          <motion.div {...fadeInUp} className="bg-emerald-800/50 p-8 rounded-lg backdrop-blur-sm">
            <p className="text-lg text-[#F5F5DC]/90 leading-relaxed mb-6">
              In an age of distractions, we understand the challenges of staying consistent in Quran memorization and revision. Many memorizers struggle with losing what they've worked so hard to retain, simply because they lack a structured system to keep up with their revisions.
            </p>
            <p className="text-lg text-[#F5F5DC]/90 leading-relaxed">
              This is where our platform comes in. By integrating modern technology with a timeless message, we aim to help you safeguard your Quranic memorization, ensuring it becomes a source of guidance, light, and blessing in your life.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        {...fadeInUp}
        id="features"
        className="relative z-10 py-24 px-4 bg-emerald-900/50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#F5F5DC] mb-6">
              Join Us on This Journey
            </h2>
            <p className="text-lg text-[#F5F5DC]/90 max-w-3xl mx-auto">
              Whether you are just beginning your memorization or looking to strengthen what you've already learned, our app is designed to meet you where you are. Together, let's keep the Quran alive in our hearts—one revision at a time.
            </p>
          </motion.div>
          
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="bg-emerald-800/50 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-[#98F5C4]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F5F5DC] mb-3">
                Personalized Schedule
              </h3>
              <p className="text-[#F5F5DC]/80">
                Create and maintain your own revision schedule based on your memorization progress and goals.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-emerald-800/50 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6 text-[#98F5C4]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F5F5DC] mb-3">
                Progress Tracking
              </h3>
              <p className="text-[#F5F5DC]/80">
                Monitor your memorization strength and track your revision history with detailed analytics.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-emerald-800/50 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#98F5C4]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F5F5DC] mb-3">
                Community Support
              </h3>
              <p className="text-[#F5F5DC]/80">
                Connect with other Quran memorizers and share your journey of preservation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        {...fadeInUp}
        className="relative z-10 bg-emerald-900/80 backdrop-blur-sm border-t border-emerald-800"
      >
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#F5F5DC] mb-4">Quick Links</h3>
              <nav className="flex flex-wrap gap-4">
                <Link href="#about" className="text-[#F5F5DC]/80 hover:text-[#F5F5DC] transition-colors">
                  About Us
                </Link>
                <Link href="#mission" className="text-[#F5F5DC]/80 hover:text-[#F5F5DC] transition-colors">
                  Our Mission
                </Link>
                <Link href="#features" className="text-[#F5F5DC]/80 hover:text-[#F5F5DC] transition-colors">
                  Features
                </Link>
                <Link href="/auth" className="text-[#F5F5DC]/80 hover:text-[#F5F5DC] transition-colors">
                  Get Started
                </Link>
                <Link href="/terms" className="text-[#F5F5DC]/80 hover:text-[#F5F5DC] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({ prevPath: window.location.pathname }, '', '/terms');
                    window.location.href = '/terms';
                  }}>
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-[#F5F5DC]/80 hover:text-[#F5F5DC] transition-colors"
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
              <p className="text-xl text-[#F5F5DC] font-medium italic">
                Al-Muraja&apos;ah: Revive, Retain, Reconnect.
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
