'use client'

import { cn } from '@/services/lib/utils'
import { ActionButton } from '@/shared/components/buttons/ActionButton'
import { LogoWithText } from '@/shared/components/logos/LogoWithText'
import { cnIconLg } from '@/shared/styles/icons.styles'
import { AnimatePresence, motion } from 'framer-motion'
import { PanelLeftClose } from 'lucide-react'
import { useSidebarState } from '../../hooks/index'

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
        'navbar', // DaisyUI navbar
        'bg-base-200/80 backdrop-blur', // fond neutre, effet blur
        'border-b border-base-300', // bordure douce
        'shadow-md', // ombre douce
        'h-16 min-h-16',
        isExpanded ? 'px-4 justify-between' : 'px-2 justify-center',
        'transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]'
      )}
    >
      <motion.div
        className={
          isExpanded
            ? 'flex items-center justify-between w-full relative z-10'
            : 'flex flex-col items-center justify-center w-full'
        }
        layout
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Row : logo à gauche, titre centré, bouton à droite, tous centrés verticalement */}
        <div className='flex justify-between items-center flex-1'>
          {/* Logo à gauche */}
          <LogoWithText />
          {/* Bouton à droite */}
          <AnimatePresence>
            {isExpanded && (
              <ActionButton
                onClick={toggleExpanded}
                ariaLabel='Réduire le panneau de navigation'
                icon={<PanelLeftClose className={cnIconLg} />}
                title={''}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Le bouton toggle est déjà dans la flex row principale, pas besoin de doublon ici */}
    </header>
  )
}

SidebarDesktopHeader.displayName = 'SidebarDesktopHeader'
