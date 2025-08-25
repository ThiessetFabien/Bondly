// ATTENTION : Ce composant doit être inclus dans un <DashboardContext.Provider> ou <Provider> Redux au plus haut niveau de l'application.
// Sinon, le comportement sera imprévisible et des erreurs peuvent survenir.

'use client'

import { getIconForClassification } from '@/services/getIconForClassification'
import { useDashboard } from '@/store/context/DashboardContext'
import { cn } from '../../../../services/lib/utils'

// Nécessite "resolveJsonModule": true dans tsconfig.json
// plus besoin d'importer les partenaires ici
import { cnIcon } from '@/shared/styles/icons.styles'
import { Grid } from 'lucide-react'
import { JSX } from 'react'
import { ActionButton } from '../../../../shared/components/buttons/ActionButton'
import {
  allFirstLetterToUpperCase,
  normalizeKey,
} from '../../../../shared/utils/formatStrings'

interface SidebarNavigationProps {
  isExpanded: boolean
  isCompact?: boolean
  animationDelays: {
    navBase: number
    navIncrement: number
    search: number
  }
  isMobile?: boolean
}

export function SidebarNavigation(props: SidebarNavigationProps): JSX.Element {
  const { isExpanded, isCompact, isMobile = false } = props
  const { state, dispatch } = useDashboard()
  const { classifications } = state

  const classificationsSorted = [...classifications].sort((a, b) =>
    a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
  )

  const renderAllPartnersButton = () => {
    const handleClickActiveAllClassifications = () => {
      dispatch({ type: 'SET_ACTIVE_CLASSIFICATION', payload: '' })
    }

    const handleClickActiveClassification = (name: string) => {
      const classificationNormalized = normalizeKey(name)
      dispatch({
        type: 'SET_ACTIVE_CLASSIFICATION',
        payload: classificationNormalized,
      })
    }

    const cnClassificationsButtons: string = cn(
      'group flex items-center space-x-3 p-3 rounded-xl cursor-pointer relative transition-all duration-300 ease-out my-1',
      isExpanded ? 'justify-start w-full ' : 'justify-center min-w-0'
    )

    const classificationIsMatched: (classificationName: string) => boolean = (
      classificationName: string
    ) =>
      normalizeKey(state.activeClassification) ===
      normalizeKey(classificationName)

    return (
      <>
        <ActionButton
          icon={<Grid className={cnIcon} />}
          title={isExpanded ? 'Tous les partenaires' : ''}
          ariaLabel='Afficher tous les partenaires'
          onClick={handleClickActiveAllClassifications}
          className={cn(
            cnClassificationsButtons,
            !state.activeClassification
              ? 'bg-accent text-accent-foreground'
              : ''
          )}
        />
        {classifications && classifications.length > 0 && (
          <>
            {classificationsSorted.map(classification => {
              const Icon = getIconForClassification(classification)
              const isActive = classificationIsMatched(classification.name)
              return (
                <ActionButton
                  key={classification.id}
                  icon={<Icon className={cnIcon} />}
                  title={
                    isExpanded
                      ? allFirstLetterToUpperCase(classification.name)
                      : ''
                  }
                  ariaLabel={`Filtrer par ${classification.label || classification.name}`}
                  onClick={() =>
                    handleClickActiveClassification(classification.name)
                  }
                  className={cn(
                    cnClassificationsButtons,
                    isActive ? 'bg-accent text-accent-foreground' : ''
                  )}
                />
              )
            })}
          </>
        )}
      </>
    )
  }

  return (
    <div
      className={cn(
        'w-full',
        isMobile ? 'mt-4 ' : 'pl-4',
        !isCompact && 'pr-4',
        !isMobile && !isExpanded ? 'overflow-x-hidden' : ''
      )}
      aria-label='Navigation par classification'
    >
      <ul
        className={cn(
          'space-y-1.5',
          isMobile && 'w-full flex flex-col items-center justify-center'
        )}
        role='menu'
      >
        {renderAllPartnersButton()}
      </ul>
    </div>
  )
}
SidebarNavigation.displayName = 'SidebarNavigation'
