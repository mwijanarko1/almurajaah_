'use client'

import PageLayout from '@/app/components/ui/PageLayout'
import { motion } from 'framer-motion'

export default function JuzSelection() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Existing content wrapped in motion divs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Keep your existing content here */}
        </motion.div>
      </div>
    </PageLayout>
  )
} 