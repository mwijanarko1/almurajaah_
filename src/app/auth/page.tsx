'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { auth } from '@/app/lib/firebase/firebase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuthContext()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isSignUp) {
        await signUp(email, password, name)
      } else {
        await signIn(email, password)
      }
      // Redirect is handled in AuthContext
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'Failed to authenticate. Please check your credentials.')
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    
    try {
      await signInWithGoogle()
      // Redirect is handled in AuthContext
    } catch (err: any) {
      console.error('Google sign in error:', err)
      setError(err.message || 'Failed to sign in with Google.')
    }
  }

  return (
    <main className="min-h-screen bg-[#192f3a] relative">
      <div className="relative z-10">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-[#f5f5f5] p-8 rounded-lg shadow-xl">
              <div className="flex items-center mb-6">
                <Link
                  href="/"
                  className="text-[rgb(28,43,49)] hover:text-[rgba(28,43,49,0.8)] mr-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </Link>
                <h2 className="text-2xl font-bold text-[rgb(28,43,49)] flex-1 text-center pr-9">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label htmlFor="name" className="block text-[rgb(28,43,49)] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[rgba(28,43,49,0.2)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(138,190,160)] text-[rgb(28,43,49)]"
                      required={isSignUp}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-[rgb(28,43,49)] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(28,43,49,0.2)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(138,190,160)] text-[rgb(28,43,49)]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-[rgb(28,43,49)] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(28,43,49,0.2)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(138,190,160)] text-[rgb(28,43,49)]"
                    required
                  />
                </div>

                {isSignUp && (
                  <p className="text-sm text-[rgba(28,43,49,0.8)] text-center">
                    By creating an account, you agree with our{' '}
                    <Link href="/terms" className="text-[rgb(138,190,160)] hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[rgb(138,190,160)] hover:underline">Privacy Policy</Link>.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[rgb(138,190,160)] text-[rgb(28,43,49)] py-2 px-4 rounded-md hover:bg-[rgba(138,190,160,0.9)] transition-colors font-medium"
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[rgb(28,43,49)] hover:text-[rgba(138,190,160,0.8)] text-sm hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[rgb(28,43,49)]">or</span>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full mt-4 bg-white border border-[rgba(28,43,49,0.2)] text-[rgb(28,43,49)] py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 