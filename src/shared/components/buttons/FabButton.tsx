import { cn } from '@/services/lib/utils'
import { Archive, Ban, Edit, Plus } from 'lucide-react'
import React from 'react'
import { ActionButton } from './ActionButton'

interface FabButtonProps {
  onClick: () => void
  title?: string
  icon?: 'plus' | 'edit' | 'archive' | 'ban'
  isExpanded?: boolean
  isMobileOpen?: boolean
}

export const FabButton: React.FC<FabButtonProps> = ({
  onClick,
  title = 'Ajouter',
  icon = 'plus',
}) => {
  let IconComponent
  switch (icon) {
    case 'edit':
      IconComponent = Edit
      break
    case 'archive':
      IconComponent = Archive
      break
    case 'ban':
      IconComponent = Ban
      break
    case 'plus':
    default:
      IconComponent = Plus
      break
  }
  return (
    <div className={cn('fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6')}>
      <ActionButton
        variant='circle'
        icon={<IconComponent size={28} className='sm:size-8' />}
        ariaLabel={title}
        title={''}
        onClick={onClick}
        className='btn-primary w-14 h-14 sm:w-16 sm:h-16 shadow-md sm:shadow-lg'
      />
    </div>
  )
}
