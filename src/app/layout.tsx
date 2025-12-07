import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/app/lib/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Al Muraja'ah - Transform Your Quran Memorization Journey",
  description: 'Effortlessly track your progress, set goals, and stay motivated with our intelligent Quran revision app.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Navbar will be rendered inside individual pages where needed */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
