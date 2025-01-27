'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth'
import { auth, db } from '@/app/lib/firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isSetupComplete: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        // Check if user has completed setup
        const userProfileDoc = await getDoc(doc(db, 'userProfiles', user.uid))
        setIsSetupComplete(userProfileDoc.exists() && userProfileDoc.data()?.setupCompleted)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    setIsAuthenticating(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (name) {
        await updateProfile(userCredential.user, { displayName: name })
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsAuthenticating(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } finally {
      setIsAuthenticating(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsAuthenticating(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Check if user profile exists
      const userProfileDoc = await getDoc(doc(db, 'userProfiles', result.user.uid))
      if (!userProfileDoc.exists()) {
        setIsSetupComplete(false)
      }
    } catch (error: any) {
      // Don't throw error if user just closed the popup
      if (error.code !== 'auth/popup-closed-by-user') {
        throw error
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  const signOut = async () => {
    setIsAuthenticating(true)
    try {
      await firebaseSignOut(auth)
      router.push('/')
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (loading || isAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-900">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isSetupComplete, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext) 