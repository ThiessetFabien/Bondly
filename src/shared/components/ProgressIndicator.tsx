'use client'

import { cn } from '@/services/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ProgressIndicatorProps {
  isActive: boolean
  progress?: number
  className?: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

export function ProgressIndicator({
  isActive,
  progress = 0,
  className = '',
  color = 'blue',
}: ProgressIndicatorProps) {
  const [internalProgress, setInternalProgress] = useState(progress)

  useEffect(() => {
    setInternalProgress(progress)
  }, [progress])

  const getColorClass = () => {
    switch (color) {
      case 'green':
        return 'bg-green-400'
      case 'purple':
        return 'bg-purple-400'
      case 'orange':
        return 'bg-orange-400'
      default:
        return 'bg-blue-400'
    }
  }

  if (!isActive) return null

  return (
    <motion.div
      className={cn(
        'w-full h-2 rounded-full overflow-hidden',
        'bg-white/10',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={cn('h-2 rounded-full', getColorClass())}
        initial={{ width: 0 }}
        animate={{ width: `${internalProgress}%` }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  )
}

ProgressIndicator.displayName = 'ProgressIndicator'
