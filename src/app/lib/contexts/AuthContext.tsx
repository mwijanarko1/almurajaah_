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
  User,
  getIdToken
} from 'firebase/auth'
import { auth, db } from '@/app/lib/firebase/firebase'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const router = useRouter()

  const fetchUserProfile = async (userId: string, retryCount = 3) => {
    try {
      const userProfileDoc = await getDoc(doc(db, 'userProfiles', userId))
      if (userProfileDoc.exists()) {
        return userProfileDoc
      } else if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return fetchUserProfile(userId, retryCount - 1)
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return fetchUserProfile(userId, retryCount - 1)
      }
      return null
    }
  }

  const setSessionToken = async (user: User) => {
    try {
      const token = await getIdToken(user, true)
      Cookies.set('session', token, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
    } catch (error) {
      console.error('Error setting session token:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        try {
          await setSessionToken(user)
          await fetchUserProfile(user.uid)
        } catch (error) {
          console.error('Error in auth state change:', error)
        }
      } else {
        Cookies.remove('session')
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
      
      await setSessionToken(userCredential.user)
      
      let retryCount = 3
      while (retryCount > 0) {
        try {
          await setDoc(doc(db, 'userProfiles', userCredential.user.uid), {
            name: name || userCredential.user.displayName || '',
            email: userCredential.user.email,
            memorizedJuz: [],
            memorizedSurahs: [],
            juzProgress: {},
            surahProgress: {},
            revisionCycle: 7
          })
          break
        } catch (error) {
          console.error(`Error creating user profile (attempt ${4 - retryCount}/3):`, error)
          retryCount--
          if (retryCount === 0) throw error
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      router.push('/dashboard')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsAuthenticating(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      await setSessionToken(userCredential.user)
      router.push('/dashboard')
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account exists with this email. Please sign up first.')
      }
      if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.')
      }
      throw error
    } finally {
      setIsAuthenticating(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsAuthenticating(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      await setSessionToken(result.user)
      
      const userProfileDoc = await fetchUserProfile(result.user.uid)
      
      if (!userProfileDoc?.exists()) {
        let retryCount = 3
        while (retryCount > 0) {
          try {
            await setDoc(doc(db, 'userProfiles', result.user.uid), {
              name: result.user.displayName || '',
              email: result.user.email,
              memorizedJuz: [],
              memorizedSurahs: [],
              juzProgress: {},
              surahProgress: {},
              revisionCycle: 7
            })
            break
          } catch (error) {
            console.error(`Error creating user profile (attempt ${4 - retryCount}/3):`, error)
            retryCount--
            if (retryCount === 0) throw error
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Detailed Google sign-in error:', {
        code: error.code,
        message: error.message,
        details: error
      })
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

  const deleteAccount = async () => {
    if (!user) return
    setIsAuthenticating(true)
    try {
      await deleteDoc(doc(db, 'userProfiles', user.uid))
      await user.delete()
      router.push('/')
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (loading || isAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#192f3a] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#192f3a]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      signUp, 
      signIn, 
      signInWithGoogle, 
      signOut,
      deleteAccount 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext) 