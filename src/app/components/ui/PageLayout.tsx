import Navbar from '@/app/components/Navbar'
import { motion } from 'framer-motion'

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-transparent">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 min-h-screen bg-[#192f3a]"
      >
        <Navbar />
        {children}
      </motion.div>
    </div>
  )
} 