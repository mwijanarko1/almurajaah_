'use client'

import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#192f3a] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="text-[#2C3E50] hover:text-[#1B4D3E] transition-colors"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-[#2C3E50] ml-4">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-lg">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">1. Information We Collect</h2>
            <p className="text-[#34495E] mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-[#34495E] mb-4">
              <li>Your name and email address when you create an account</li>
              <li>Your Quran memorization progress</li>
              <li>Usage data and preferences within the application</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">2. How We Use Your Information</h2>
            <p className="text-[#34495E] mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-[#34495E] mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Track your progress and personalize your experience</li>
              <li>Communicate with you about updates and features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">3. Data Security</h2>
            <p className="text-[#34495E] mb-4">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">4. Data Sharing</h2>
            <p className="text-[#34495E] mb-4">
              We do not sell or share your personal information with third parties except as necessary to provide our services or as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">5. Your Rights</h2>
            <p className="text-[#34495E] mb-4">
              You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 