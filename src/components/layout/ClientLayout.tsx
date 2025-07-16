'use client'

import { useSidebarResponsive } from '@/features/navigation/hooks'
import { Sidebar } from '@/features/navigation'
import { memo, Suspense } from 'react'

interface ClientLayoutProps {
  readonly children: React.ReactNode
}

// Loading fallback components optimisés
const SidebarSkeleton = () => (
  <div className='w-80 h-screen bg-muted animate-pulse border-r border-border' />
)

const ContentSkeleton = () => (
  <div className='flex-1 p-6 space-y-4'>
    <div className='h-8 bg-muted rounded-lg animate-pulse' />
    <div className='h-64 bg-muted rounded-lg animate-pulse' />
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='h-32 bg-muted rounded-lg animate-pulse' />
      ))}
    </div>
  </div>
)

// Layout principal avec hooks modernes optimisés
export const ClientLayout = memo<ClientLayoutProps>(({ children }) => {
  const { mainContentClasses } = useSidebarResponsive()

  return (
    <div className='relative min-h-screen bg-background'>
      {/* Sidebar avec gestion responsive intégrée */}
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>

      <div className={mainContentClasses}>
        <main
          className='flex-1 overflow-auto bg-background relative z-content-base'
          role='main'
          aria-label='Contenu principal'
        >
          <Suspense fallback={<ContentSkeleton />}>
            <div className='container mx-auto p-6 space-y-8'>{children}</div>
          </Suspense>
        </main>
      </div>
    </div>
  )
})

ClientLayout.displayName = 'ClientLayout'
