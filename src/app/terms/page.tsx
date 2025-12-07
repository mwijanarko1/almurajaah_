'use client'

import { useRouter } from 'next/navigation'

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-[#2C3E50] ml-4">Terms of Service</h1>
        </div>
        
        <div className="prose prose-lg">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#34495E] mb-4">
              By accessing and using Al-Murajaah, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">2. User Responsibilities</h2>
            <p className="text-[#34495E] mb-4">
              Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">3. Content Guidelines</h2>
            <p className="text-[#34495E] mb-4">
              Users agree to use the service in accordance with Islamic principles and to maintain respect for the Quran and its teachings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">4. Service Modifications</h2>
            <p className="text-[#34495E] mb-4">
              We reserve the right to modify or discontinue the service at any time, with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">5. Limitation of Liability</h2>
            <p className="text-[#34495E] mb-4">
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 