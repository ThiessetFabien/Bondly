'use client'

import { cn } from '@/services/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearSearch as clearSearchRedux,
  selectSearchTerm,
  setSearchTerm,
} from '@/store/slices/uiSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

interface SidebarSearchEnhancedProps {
  _isExpanded: boolean
  animationDelay: number
  isMobile?: boolean
}

export function SidebarSearchEnhanced({
  _isExpanded,
  animationDelay,
  isMobile = false,
}: SidebarSearchEnhancedProps) {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(selectSearchTerm)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      dispatch(setSearchTerm(value))
    },
    [dispatch]
  )

  const clearSearch = useCallback(() => {
    dispatch(clearSearchRedux())
    inputRef.current?.focus()
  }, [dispatch])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  if (!_isExpanded && !isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: animationDelay, duration: 0.3 }}
        className='px-4 py-2'
      >
        <div className='relative'>
          <div
            className={cn(
              'w-10 h-10 rounded-xl border border-white/20 backdrop-blur-xl transition-all duration-300',
              'bg-white/10 hover:bg-white/15 hover:border-white/30',
              'flex items-center justify-center cursor-pointer tooltip tooltip-right group',
              isFocused && 'ring-2 ring-white/30 bg-white/15'
            )}
            data-tip='Rechercher'
            onClick={() => inputRef.current?.focus()}
          >
            <Search className='w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300' />
          </div>

          {/* Input caché pour la fonctionnalité */}
          <input
            ref={inputRef}
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className='absolute opacity-0 pointer-events-none'
            aria-label='Rechercher dans les classifications'
          />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.3 }}
      className={cn(
        'relative',
        isMobile ? 'px-4 py-2' : 'px-4 py-3 border-b border-white/10'
      )}
    >
      <div className='relative'>
        <div
          className={cn(
            'flex items-center rounded-xl border transition-all duration-300',
            'bg-white/10 backdrop-blur-xl',
            isFocused
              ? 'border-white/30 bg-white/15 shadow-[0_4px_20px_-4px] shadow-white/20'
              : 'border-white/20 hover:border-white/25'
          )}
        >
          <div className='flex items-center justify-center w-10 h-10'>
            <Search className='w-4 h-4 text-white/70' />
          </div>

          <input
            ref={inputRef}
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder='Rechercher...'
            className={cn(
              'flex-1 bg-transparent text-white/90 placeholder-white/50 text-sm',
              'border-none outline-none py-2 pr-2',
              searchQuery && 'pr-8'
            )}
            aria-label='Rechercher dans les classifications'
          />

          {/* Bouton de suppression */}
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className={cn(
                  'absolute right-2 w-6 h-6 rounded-full',
                  'bg-white/20 hover:bg-white/30 transition-colors duration-200',
                  'flex items-center justify-center group'
                )}
                aria-label='Effacer la recherche'
              >
                <X className='w-3 h-3 text-white/70 group-hover:text-white transition-colors' />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

SidebarSearchEnhanced.displayName = 'SidebarSearchEnhanced'
