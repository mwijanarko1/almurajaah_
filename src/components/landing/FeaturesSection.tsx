'use client'

import { Calendar, BarChart2, Award, Repeat, BookOpen, Target, Zap } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered spaced repetition schedules your revisions at optimal intervals for maximum retention.'
    },
    {
      icon: BarChart2,
      title: 'Visual Progress',
      description: 'Track your memorization journey with beautiful dashboards showing completion rates and streaks.'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Stay motivated with daily streaks, badges, and milestones celebrating your spiritual growth.'
    },
    {
      icon: Repeat,
      title: 'Spaced Repetition',
      description: 'Scientifically proven method ensures you retain what you memorize long-term.'
    },
    {
      icon: BookOpen,
      title: 'Complete Quran',
      description: 'Organize and track all 30 juz with detailed progress for each surah and page.'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Set personalized targets and receive intelligent reminders to stay on track.'
    }
  ]

  return (
    <section id="features" className="py-20 bg-[#192f3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[rgb(138,190,160)] mb-6">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-[rgb(138,190,160)]/80 max-w-3xl mx-auto">
            Powerful tools designed specifically for Quran memorization, combining traditional wisdom with modern technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-[rgba(138,190,160,0.05)] p-6 rounded-2xl border border-[rgba(138,190,160,0.1)] hover:border-[rgba(138,190,160,0.3)] transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-[rgb(138,190,160)] rounded-xl rotate-12 flex items-center justify-center mb-4 group-hover:rotate-0 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-[rgb(28,43,49)]" />
              </div>
              <h3 className="text-xl font-semibold text-[rgb(138,190,160)] mb-3">
                {feature.title}
              </h3>
              <p className="text-[rgb(138,190,160)]/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}