// Composant de recherche universel pour la sidebar (fusionné)
'use client'

import { cn } from '@/services/lib/utils'
import { Croix } from '@/shared/components/icons/Croix.svg'
import { cnIcon } from '@/shared/styles/icons.styles'
import { useDashboard } from '@/store/context/DashboardContext'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useCallback, useRef } from 'react'

interface SidebarSearchProps {
  isExpanded: boolean
  isMobile?: boolean
  isCompact?: boolean
}

export function SidebarSearch({
  isExpanded,
  isMobile = false,
  isCompact = false,
}: SidebarSearchProps) {
  const { state, dispatch } = useDashboard()
  const searchTerm = state.searchTerm || ''
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })
    },
    [dispatch]
  )

  const handleClearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' })
    inputRef.current?.focus()
  }, [dispatch])

  // Affiche le composant même en mode compact desktop
  if (!isExpanded && !isMobile && !isCompact) return null

  const isCompactDesktop = isCompact && !isExpanded && !isMobile
  return (
    <section className='py-2' aria-label='Recherche partenaires'>
      <div
        className={cn(
          'relative w-full',
          isCompactDesktop || isMobile
            ? 'flex justify-center items-center'
            : 'pl-4 pr-8'
        )}
      >
        <input
          ref={inputRef}
          type='text'
          value={isCompactDesktop ? '' : searchTerm}
          onChange={handleSearchChange}
          placeholder={isCompactDesktop ? '' : 'Rechercher...'}
          className={cn(
            'input input-bordered input-sm w-full pl-10 text-base-content bg-base-100 placeholder-base-content/60',
            isCompactDesktop &&
              'w-10 min-w-0 max-w-[40px] h-10 bg-transparent shadow-none focus:ring-0 focus:outline-none',
            isCompactDesktop ? 'cursor-default select-none' : ''
          )}
          readOnly={isCompactDesktop}
          tabIndex={isCompactDesktop ? -1 : 0}
          style={isCompactDesktop ? { pointerEvents: 'none' } : {}}
        />
        <span
          className={cn(
            'absolute text-base-content/60 pointer-events-none',
            isCompactDesktop
              ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              : 'left-3 top-1/2 -translate-y-1/2',
            isMobile || isCompact ? '' : 'pl-4'
          )}
        >
          <Search className={cnIcon} />
        </span>
        {!isCompactDesktop && (
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClearSearch}
                className='absolute right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center group top-1/2 -translate-y-1/2'
                aria-label='Effacer la recherche'
                tabIndex={0}
              >
                <Croix className='w-4 h-4' />
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
