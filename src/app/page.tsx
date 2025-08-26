'use client'

import { Dashboard } from '@/features/dashboard/components/Dashboard'
import { ActionButton } from '../shared/components/buttons/ActionButton'
import { FabButton } from '../shared/components/buttons/FabButton'
import { FabButtonDualAction } from '../shared/components/buttons/FabButtonDualAction'

import { X } from 'lucide-react'

/**
 * Main page of the partners dashboard.
 * Displays the list of partners with filters, multi-row selection, and contextual actions (add, edit, archive, blacklist).
 * Uses Redux for search filter and sidebar state management.
 * Floating action buttons adapt to selection and responsiveness.
 * @component
 */

export default function Page() {
  return <PageContent />
}

import { cn } from '@/services/lib/utils'
import { useIsMobile } from '@/shared/hooks/useIsMobile.hooks'
import { useDashboard } from '../store/context/DashboardContext'

function PageContent() {
  const { state, dispatch } = useDashboard()
  const { isExpanded, isMobileOpen } = state.sidebar
  const { selectedRows } = state
  const setSelectedRows = (rows: string[]) =>
    dispatch({ type: 'SET_SELECTED_ROWS', payload: rows })
  const isMobile = useIsMobile()

  const fabAction = () =>
    alert("TODO: ouvrir le formulaire d'ajout de partenaire")
  const fabIcon: 'plus' | 'edit' | 'archive' | 'ban' = 'plus'

  const deselectBtnClasses =
    'fixed z-50 bg-error text-white rounded-full flex items-center justify-center shadow-md hover:bg-error/90 transition w-14 h-14 bottom-4 left-4 sm:w-16 sm:h-16 sm:bottom-6 ' +
    (isExpanded
      ? 'lg:left-[calc(320px+1.5rem)]'
      : 'lg:left-[calc(64px+1.5rem)]')

  let fab = null
  switch (true) {
    case selectedRows.length === 1 && !isMobileOpen:
      fab = (
        <div
          className='fixed bottom-6 right-6 z-50 w-16 h-16 flex items-end justify-end sm:static sm:w-auto sm:h-auto'
          role='region'
          aria-label='Action modifier partenaire'
        >
          <FabButton
            onClick={() =>
              alert(`TODO: modifier le partenaire ${selectedRows[0]}`)
            }
            title='Modifier le partenaire sélectionné'
            icon='edit'
          />
        </div>
      )
      break
    case selectedRows.length > 1 && !isMobileOpen:
      fab = (
        <div
          className='fixed bottom-6 right-6 z-50 w-16 h-16 flex items-end justify-end sm:static sm:w-auto sm:h-auto'
          role='region'
          aria-label='Actions de masse partenaires'
        >
          <FabButtonDualAction
            onArchive={() =>
              alert(
                `TODO: archiver les partenaires sélectionnés: ${selectedRows.join(', ')}`
              )
            }
            onBlacklist={() =>
              alert(
                `TODO: blacklister les partenaires sélectionnés: ${selectedRows.join(', ')}`
              )
            }
            titleArchive='Archiver la sélection'
            titleBlacklist='Blacklister la sélection'
          />
        </div>
      )
      break
    case !isMobileOpen:
      fab = (
        <div
          className='fixed bottom-6 right-6 z-50 w-16 h-16 flex items-end justify-end sm:static sm:w-auto sm:h-auto'
          role='region'
          aria-label='Action ajouter partenaire'
        >
          <FabButton
            onClick={fabAction}
            title='Ajouter un partenaire'
            icon={fabIcon}
          />
        </div>
      )
      break
    default:
      fab = null
  }

  return (
    <>
      <section
        className={cn(
          'scrollbar-none overflow-auto',
          isMobile && 'mt-8',
          'w-full h-full max-w-[100vw] ' +
            (!isMobile
              ? isExpanded
                ? 'lg:max-w-[calc(100vw-280px)] lg:ml-[280px]'
                : 'lg:max-w-[calc(100vw-64px)] lg:ml-[64px]'
              : ''),
          ' mx-auto bg-base-100 space-y-6 shadow-xl p-4 md:p-8'
        )}
        aria-labelledby='dashboard-title'
      >
        <header className='space-y-6'>
          <h1
            id='dashboard-title'
            className='text-4xl font-bold text-primary m-0 hidden sm:block'
          >
            Vos partenaires
          </h1>
          <p className='text-base-content hidden sm:block'>
            Centralisez et optimisez la gestion de vos partenaires
            professionnels.
          </p>
        </header>
        <div className='w-full max-w-full overflow-auto'>
          <Dashboard
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            aria-label='Tableau des partenaires'
          />
        </div>
      </section>
      {/* Bouton de désélection flottant */}
      {selectedRows.length > 0 && isMobile && (
        <div
          className='fixed bottom-0 left-0 z-50 w-16 h-16 flex items-end justify-start sm:w-auto sm:h-auto sm:static'
          role='region'
          aria-label='Désélectionner tous les partenaires'
        >
          <ActionButton
            variant='circle'
            icon={<X size={32} />}
            ariaLabel='Désélectionner tous les partenaires'
            title=''
            onClick={() => setSelectedRows([])}
            className={deselectBtnClasses}
          />
        </div>
      )}
      {fab}
    </>
  )
}
