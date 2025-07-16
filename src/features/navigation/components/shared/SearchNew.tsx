'use client'

import { cn } from '@/services/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearSearch,
  selectSearchTerm,
  setSearchTerm,
} from '@/store/slices/uiSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useCallback } from 'react'

interface SidebarSearchProps {
  isExpanded: boolean
  isCompact: boolean
  animationDelay: number
  isMobile?: boolean
}

export function SidebarSearchComponent({
  isExpanded,
  isCompact,
  animationDelay,
  isMobile = false,
}: SidebarSearchProps) {
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(selectSearchTerm)

  const handleSearchChange = useCallback(
    (value: string) => {
      dispatch(setSearchTerm(value))
    },
    [dispatch]
  )

  const handleClearSearch = useCallback(() => {
    dispatch(clearSearch())
  }, [dispatch])

  if (isCompact) {
    return (
      <section className='px-4 py-1'>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'w-10 h-8 rounded-lg mx-auto',
            'bg-white/5 backdrop-blur-sm',
            'border border-white/10',
            'flex items-center justify-center',
            'hover:border-white/20 hover:bg-white/10',
            'transition-all duration-200 cursor-pointer'
          )}
        >
          <Search className='w-3.5 h-3.5 text-white/70' />
        </motion.div>
      </section>
    )
  }

  return (
    <section className={cn('px-4 py-1', isMobile && 'px-4 py-2')}>
      <AnimatePresence mode='wait'>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: animationDelay }}
            className='relative'
          >
            <div
              className={cn(
                'relative rounded-xl overflow-hidden',
                'bg-white/5 backdrop-blur-sm',
                'border border-white/10'
              )}
            >
              <div className='relative flex items-center'>
                <Search className='absolute left-3 w-4 h-4 text-white/50 pointer-events-none z-10' />
                <input
                  type='text'
                  placeholder='Rechercher...'
                  value={searchTerm}
                  onChange={e => handleSearchChange(e.target.value)}
                  className={cn(
                    'w-full h-10 pl-10 pr-10',
                    'bg-transparent text-white/90 text-sm',
                    'placeholder:text-white/40',
                    'border-none outline-none'
                  )}
                />
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleClearSearch}
                    className={cn(
                      'absolute right-2 p-1 rounded-lg',
                      'bg-white/10 hover:bg-white/20',
                      'transition-all duration-200'
                    )}
                  >
                    <X className='w-3 h-3 text-white/60' />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
