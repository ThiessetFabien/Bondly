'use client'

import { cn } from '@/services/lib/utils'
import { ActionButton } from '@/shared/components/buttons/ActionButton'
import { cnIcon } from '@/shared/styles/icons.styles'
import clsx from 'clsx'
import { LogOut, Settings } from 'lucide-react'

interface SidebarActionsProps {
  isCompact: boolean
  animationDelay: number
  isMobile?: boolean
}

export function SidebarActions({ isCompact }: SidebarActionsProps) {
  return (
    <section
      className={cn(
        'border-t border-base-300 bg-base-200/80 backdrop-blur p-4 shadow-inner',
        'flex items-center w-full',
        isCompact ? 'flex-col space-y-1' : 'justify-between'
      )}
      aria-label='Actions utilisateur'
    >
      <ActionButton
        variant='circle'
        icon={
          <Settings
            className={cn(
              cnIcon,
              'group-hover:text-yellow-400 transition-colors duration-300'
            )}
          />
        }
        ariaLabel='Ouvrir les paramètres'
        title=''
        className={clsx(
          'group',
          isCompact ? 'w-10 h-10' : 'w-14 h-14',
          'border border-base-300 bg-base-100/80 backdrop-blur-xl hover:bg-yellow-100/20 hover:border-yellow-300/60',
          'shadow-md hover:shadow-yellow-500/20',
          'focus:outline-none focus:ring-2 focus:ring-yellow-300/30 focus:ring-offset-0',
          'hover:translate-y-[-1px] active:translate-y-0',
          isCompact ? 'tooltip tooltip-right' : ''
        )}
        // onClick={...} // à compléter selon logique existante
      />

      <ActionButton
        variant='circle'
        icon={
          <LogOut
            className={cn(
              cnIcon,
              'group-hover:text-red-400 transition-colors duration-300'
            )}
          />
        }
        ariaLabel='Se déconnecter'
        title=''
        className={clsx(
          'group',
          isCompact ? 'w-10 h-10' : 'w-14 h-14',
          'border border-base-300 bg-base-100/80 backdrop-blur-xl hover:bg-red-100/20 hover:border-red-300/60',
          'shadow-md hover:shadow-red-500/20',
          'focus:outline-none focus:ring-2 focus:ring-red-300/30 focus:ring-offset-0',
          'hover:translate-y-[-1px] active:translate-y-0',
          isCompact ? 'tooltip tooltip-right' : ''
        )}
        // onClick={...} // à compléter selon logique existante
      />
    </section>
  )
}

SidebarActions.displayName = 'SidebarActions'
