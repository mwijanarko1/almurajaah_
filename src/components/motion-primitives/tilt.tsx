'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface TiltProps {
  children: ReactNode
  rotationFactor?: number
  isRevese?: boolean
  className?: string
}

export function Tilt({
  children,
  rotationFactor = 8,
  isRevese = false,
  className = ''
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    isRevese ? [rotationFactor, -rotationFactor] : [-rotationFactor, rotationFactor]
  )
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    isRevese ? [-rotationFactor, rotationFactor] : [rotationFactor, -rotationFactor]
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const rotateXValue = mouseY / (rect.height / 2)
    const rotateYValue = mouseX / (rect.width / 2)

    x.set(rotateYValue)
    y.set(rotateXValue)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}