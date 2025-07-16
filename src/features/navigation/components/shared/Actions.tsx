'use client'

import { cn } from '@/services/lib/utils'
import { motion } from 'framer-motion'
import { LogOut, Settings } from 'lucide-react'

interface SidebarActionsProps {
  isCompact: boolean
  animationDelay: number
  isMobile?: boolean
}

export function SidebarActions({
  isCompact,
  animationDelay,
  isMobile = false,
}: SidebarActionsProps) {
  if (isMobile) {
    return (
      <motion.section
        className='border-t border-white/20 bg-white/5 backdrop-blur-xl px-4 py-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: animationDelay, duration: 0.2 }}
        aria-label='Actions utilisateur'
      >
        <div className='flex flex-col space-y-3'>
          <motion.button
            className={cn(
              'flex items-center justify-center space-x-3 w-full px-4 py-3 rounded-xl border border-white/20 transition-all duration-300 ease-out',
              // Style parfaitement identique au menu burger
              'bg-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-yellow-300/40',
              'shadow-[0_4px_16px_-4px] shadow-black/20 hover:shadow-[0_6px_20px_-4px] hover:shadow-yellow-500/20',
              'focus:outline-none focus:ring-2 focus:ring-yellow-300/30 focus:ring-offset-0',
              'hover:translate-y-[-1px] active:translate-y-0'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label='Ouvrir les paramètres'
          >
            <div className='p-1.5 rounded-lg border border-white/10 bg-white/10 hover:bg-yellow-400/15 hover:border-yellow-300/30 transition-all duration-300'>
              <Settings className='h-4 w-4 text-white/80 hover:text-yellow-300 transition-colors duration-300' />
            </div>
            <span className='font-medium text-sm text-white/85 hover:text-yellow-300 transition-colors duration-300 flex-1 text-center'>
              Paramètres
            </span>
          </motion.button>
          <motion.button
            className={cn(
              'flex items-center justify-center space-x-3 w-full px-4 py-3 rounded-xl border border-white/20 transition-all duration-300 ease-out',
              // Style parfaitement identique au menu burger
              'bg-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-red-300/40',
              'shadow-[0_4px_16px_-4px] shadow-black/20 hover:shadow-[0_6px_20px_-4px] hover:shadow-red-500/20',
              'focus:outline-none focus:ring-2 focus:ring-red-300/30 focus:ring-offset-0',
              'hover:translate-y-[-1px] active:translate-y-0'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label='Se déconnecter'
          >
            <div className='p-1.5 rounded-lg border border-white/10 bg-white/10 hover:bg-red-400/15 hover:border-red-300/30 transition-all duration-300'>
              <LogOut className='h-4 w-4 text-white/80 hover:text-red-300 transition-colors duration-300' />
            </div>
            <span className='font-medium text-sm text-white/85 hover:text-red-300 transition-colors duration-300 flex-1 text-center'>
              Déconnexion
            </span>
          </motion.button>
        </div>
      </motion.section>
    )
  }

  return (
    <section
      className={cn(
        'border-t border-white/20 bg-white/5 backdrop-blur-xl py-4',
        isCompact ? 'px-4' : 'px-4'
      )}
      aria-label='Actions utilisateur'
    >
      <div
        className={cn(
          'flex items-center',
          isCompact ? 'flex-col space-y-1' : 'justify-between'
        )}
      >
        <motion.button
          className={cn(
            // Taille adaptée et cohérente avec les items de navigation
            isCompact ? 'w-10 h-10' : 'w-14 h-14',
            'rounded-lg border border-white/20 transition-all duration-300 ease-out overflow-hidden',
            'flex items-center justify-center', // Simplification: centrage direct
            // Style parfaitement identique au menu burger
            'bg-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-yellow-300/40',
            'shadow-[0_4px_16px_-4px] shadow-black/20 hover:shadow-[0_6px_20px_-4px] hover:shadow-yellow-500/20',
            'focus:outline-none focus:ring-2 focus:ring-yellow-300/30 focus:ring-offset-0',
            'hover:translate-y-[-1px] active:translate-y-0',
            isCompact ? 'tooltip tooltip-right' : ''
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label='Ouvrir les paramètres'
          data-tip={isCompact ? 'Paramètres' : undefined}
        >
          <Settings
            className={cn(
              // Taille d'icône adaptée et cohérente
              isCompact ? 'h-4 w-4' : 'h-5 w-5',
              'text-white/80 hover:text-yellow-300 transition-colors duration-300'
            )}
          />
        </motion.button>

        <motion.button
          className={cn(
            // Taille adaptée et cohérente avec les items de navigation
            isCompact ? 'w-10 h-10' : 'w-14 h-14',
            'rounded-lg border border-white/20 transition-all duration-300 ease-out overflow-hidden',
            'flex items-center justify-center', // Simplification: centrage direct
            // Style parfaitement identique au menu burger
            'bg-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-red-300/40',
            'shadow-[0_4px_16px_-4px] shadow-black/20 hover:shadow-[0_6px_20px_-4px] hover:shadow-red-500/20',
            'focus:outline-none focus:ring-2 focus:ring-red-300/30 focus:ring-offset-0',
            'hover:translate-y-[-1px] active:translate-y-0',
            isCompact ? 'tooltip tooltip-right' : ''
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: animationDelay + 0.1, duration: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label='Se déconnecter'
          data-tip={isCompact ? 'Déconnexion' : undefined}
        >
          <LogOut
            className={cn(
              // Taille d'icône adaptée et cohérente
              isCompact ? 'h-4 w-4' : 'h-5 w-5',
              'text-white/80 hover:text-red-300 transition-colors duration-300'
            )}
          />
        </motion.button>
      </div>

      {/* Indicateur de statut de connexion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: animationDelay + 0.2, duration: 0.3 }}
        className={cn(
          'mt-2',
          isCompact ? 'flex justify-center' : 'flex justify-start'
        )}
      ></motion.div>
    </section>
  )
}

SidebarActions.displayName = 'SidebarActions'
