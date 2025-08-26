import { Archive, Ban } from 'lucide-react'
import React from 'react'

interface FabButtonDualActionProps {
  onArchive: () => void
  onBlacklist: () => void
  titleArchive?: string
  titleBlacklist?: string
}

export const FabButtonDualAction: React.FC<FabButtonDualActionProps> = ({
  onArchive,
  onBlacklist,
  titleArchive = 'Archiver',
  titleBlacklist = 'Blacklister',
}) => (
  <div className='fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-md bg-base-100 flex items-center justify-center sm:w-16 sm:h-16 sm:bottom-6 sm:right-6 sm:shadow-lg'>
    <div className='w-full h-full flex items-center justify-center relative'>
      <button
        onClick={onArchive}
        title={titleArchive}
        className='absolute left-0 top-0 w-1/2 h-full flex items-center justify-center rounded-l-full bg-primary text-white hover:bg-primary/90 transition z-10 sm:w-1/2 sm:h-full'
        aria-label={titleArchive}
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          width: '50%',
          height: '100%',
        }}
      >
        <Archive size={26} />
      </button>
      <button
        onClick={onBlacklist}
        title={titleBlacklist}
        className='absolute right-0 top-0 w-1/2 h-full flex items-center justify-center rounded-r-full bg-error text-white hover:bg-error/90 transition z-10 sm:w-1/2 sm:h-full'
        aria-label={titleBlacklist}
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: '50%',
          height: '100%',
        }}
      >
        <Ban size={26} />
      </button>
    </div>
  </div>
)
