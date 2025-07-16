'use client'

import { cn } from '@/services/lib/utils'
import { Logo } from '@/shared/components/Logo'
import { AnimatePresence, motion } from 'framer-motion'
import { PanelLeftClose } from 'lucide-react'
import { useSidebarState } from '../../hooks'

interface SidebarDesktopHeaderProps {
  isExpanded: boolean
  animationDelay: number
}

export function SidebarDesktopHeader({
  isExpanded,
}: SidebarDesktopHeaderProps) {
  const { toggleExpanded } = useSidebarState()

  return (
    <header
      className={cn(
        'flex items-center border-b border-white/10 bg-white/5 backdrop-blur-xl relative',
        'shadow-[0_1px_0_0] shadow-white/10',
        'h-16',
        isExpanded ? 'px-4 justify-between' : 'px-2 justify-center',
        'transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]'
      )}
    >
      <motion.div
        className={
          isExpanded
            ? 'flex items-center relative z-10'
            : 'flex flex-col items-center justify-center w-full'
        }
        layout
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className='relative'>
          <Logo />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              transition={{
                delay: isExpanded ? 0.1 : 0,
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className='ml-3'
            >
              <h2 className='text-lg font-semibold text-white/95 drop-shadow-lg tracking-tight whitespace-nowrap'>
                Relations Manager
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bouton toggle repensé pour le mode compact */}
      <AnimatePresence>
        {isExpanded && (
          <motion.button
            onClick={toggleExpanded}
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            whileHover={{
              scale: 1.05,
              rotateZ: 3,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'group relative overflow-hidden rounded-xl border border-white/20 transition-all duration-300',
              'bg-white/10 backdrop-blur-xl hover:bg-white/20 hover:border-white/40',
              'shadow-[0_4px_16px_-4px] shadow-black/30 hover:shadow-[0_6px_24px_-6px] hover:shadow-white/20',
              'focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-0',
              'w-10 h-10'
            )}
            aria-label='Réduire le panneau de navigation'
          >
            <motion.div
              className='flex items-center justify-center w-full h-full'
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <PanelLeftClose className='w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300' />
            </motion.div>

            {/* Effet de brillance au hover renforcé */}
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
            </div>

            {/* Indicateur de pulse subtil */}
            <div className='absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300' />
          </motion.button>
        )}
      </AnimatePresence>
    </header>
  )
}

SidebarDesktopHeader.displayName = 'SidebarDesktopHeader'
