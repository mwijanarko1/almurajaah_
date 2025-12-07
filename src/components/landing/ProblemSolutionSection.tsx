'use client'

import { AlertTriangle, Clock, Brain, CheckCircle } from 'lucide-react'

export default function ProblemSolutionSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Forgetting Memorized Content',
      description: 'Traditional memorization methods lack systematic review cycles'
    },
    {
      icon: Clock,
      title: 'Time Management Challenges',
      description: 'Difficulty balancing daily life with consistent Quran study'
    },
    {
      icon: Brain,
      title: 'Retention Difficulties',
      description: 'Struggling to retain large amounts of information long-term'
    }
  ]

  const solutions = [
    {
      icon: CheckCircle,
      title: 'Intelligent Scheduling',
      description: 'AI algorithms determine optimal review times based on your learning patterns'
    },
    {
      icon: CheckCircle,
      title: 'Flexible Learning',
      description: 'Access your memorization program anywhere, on any device, at any time'
    },
    {
      icon: CheckCircle,
      title: 'Proven Methodology',
      description: 'Spaced repetition science ensures 90%+ long-term retention rates'
    }
  ]

  return (
    <section className="py-20 bg-[#192f3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[rgb(138,190,160)] mb-6">
            From Struggle to Success
          </h2>
          <p className="text-xl text-[rgb(138,190,160)]/80 max-w-3xl mx-auto">
            We understand the challenges of Quran memorization. Here's how Al Muraja'ah transforms your journey.
          </p>
        </div>

        {/* Problems */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-[rgb(138,190,160)] text-center mb-8">
            Common Challenges Memorizers Face
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="bg-[rgba(220,53,69,0.1)] p-6 rounded-2xl border border-[rgba(220,53,69,0.2)]"
              >
                <div className="w-12 h-12 bg-[rgba(220,53,69,0.2)] rounded-xl rotate-12 flex items-center justify-center mb-4">
                  <problem.icon className="w-6 h-6 text-red-400" />
                </div>
                <h4 className="text-lg font-medium text-[rgb(138,190,160)] mb-2">
                  {problem.title}
                </h4>
                <p className="text-[rgb(138,190,160)]/70 text-sm">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Solutions */}
        <div>
          <h3 className="text-2xl font-semibold text-[rgb(138,190,160)] text-center mb-8">
            How Al Muraja'ah Solves These Issues
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-[rgba(138,190,160,0.1)] p-6 rounded-2xl border border-[rgba(138,190,160,0.2)]"
              >
                <div className="w-12 h-12 bg-[rgb(138,190,160)] rounded-xl rotate-12 flex items-center justify-center mb-4">
                  <solution.icon className="w-6 h-6 text-[rgb(28,43,49)]" />
                </div>
                <h4 className="text-lg font-medium text-[rgb(138,190,160)] mb-2">
                  {solution.title}
                </h4>
                <p className="text-[rgb(138,190,160)]/70 text-sm">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[rgb(138,190,160)]">90%+</div>
              <div className="text-[rgb(138,190,160)]/70">Long-term Retention</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[rgb(138,190,160)]">30</div>
              <div className="text-[rgb(138,190,160)]/70">Juz Organized</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[rgb(138,190,160)]">24/7</div>
              <div className="text-[rgb(138,190,160)]/70">Access Anywhere</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}