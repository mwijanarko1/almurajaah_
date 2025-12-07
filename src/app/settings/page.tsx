'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/lib/contexts/AuthContext'
import { updateEmail, updateProfile } from 'firebase/auth'
import Navbar from '@/app/components/Navbar'
import { LogOut } from 'lucide-react'
import PageLayout from '@/app/components/ui/PageLayout'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContainer,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionWrapper,
} from '@/components/ui/accordion'



export default function Settings() {
  const { user, signOut, deleteAccount } = useAuthContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')


  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    // Initialize form with user data
    setName(user.displayName || '')
    setEmail(user.email || '')
  }, [user, router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name })
      }
      if (email !== user.email) {
        await updateEmail(user, email)
      }
      setSuccess('Profile updated successfully')
    } catch (err) {
      setError('Failed to update profile')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true)
      setError('')
      // Call deleteAccount and let AuthContext handle the redirect
      await deleteAccount()
    } catch (error) {
      console.error('Error deleting account:', error)
      setError('Failed to delete account. Please try again.')
      setShowDeleteConfirm(false)
      setIsLoading(false)
    }
  }



  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold text-text mb-8">Settings</h1>

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded-md mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-2 rounded-md mb-4">
              {success}
            </div>
          )}

          <AccordionContainer>
            <AccordionWrapper>
              <Accordion>
                <AccordionItem value='profile'>
                  <AccordionHeader className='text-lg font-semibold'>
                    Profile Settings
                  </AccordionHeader>
                  <AccordionPanel>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-text-secondary mb-1">Name</label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-background text-text px-4 py-2 rounded-md border border-text-secondary focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-text-secondary mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-background text-text px-4 py-2 rounded-md border border-text-secondary focus:outline-none focus:border-primary"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors disabled:bg-text-secondary"
                      >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </form>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem value='account-deletion'>
                  <AccordionHeader className='text-lg font-semibold'>
                    Account Deletion
                  </AccordionHeader>
                  <AccordionPanel>
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-semibold text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-text-secondary mb-4 max-w-md">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </AccordionWrapper>
          </AccordionContainer>

          {/* Account Deletion Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Delete Account</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete your account? This action cannot be undone.
                  All your data will be permanently deleted.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sign Out Section */}
          <div className="bg-surface rounded-lg p-6 mb-8">
            <div className="text-center">
              <button
                onClick={signOut}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition-colors mx-auto"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 