'use client'

import { getIconForClassification } from '@/services/getIconForClassification'
import { cn } from '@/services/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectClassificationsError,
  selectClassificationsLoading,
  selectFilteredClassifications,
  selectSelectedClassification,
  setSelectedClassification,
} from '@/store/slices/classificationsSlice'
import { setSidebarMobileOpen } from '@/store/slices/uiSlice'
import { motion } from 'framer-motion'
import { Grid, Settings, LogOut } from 'lucide-react'
import { JSX, useCallback } from 'react'

interface SidebarNavigationProps {
  isExpanded: boolean
  animationDelays: {
    navBase: number
    navIncrement: number
    search: number
  }
  isMobile?: boolean
}

export function SidebarNavigation(props: SidebarNavigationProps): JSX.Element {
  const { isExpanded, animationDelays, isMobile = false } = props
  const dispatch = useAppDispatch()
  const classifications = useAppSelector(selectFilteredClassifications)
  const selectedClassification = useAppSelector(selectSelectedClassification)
  const loading = useAppSelector(selectClassificationsLoading)
  const error = useAppSelector(selectClassificationsError)

  const handleClassificationClick = useCallback(
    (classification: string | null) => {
      dispatch(setSelectedClassification(classification))
      if (isMobile) {
        dispatch(setSidebarMobileOpen(false))
      }
    },
    [dispatch, isMobile]
  )

  const renderAllPartnersButton = () => {
    const isActive = selectedClassification === null
    if (isMobile) {
      return (
        <motion.li
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          role='none'
        >
          <a
            onClick={() => handleClassificationClick(null)}
            className={cn(
              'group flex items-center space-x-3 p-3 rounded-xl cursor-pointer relative overflow-hidden',
              'transition-all duration-300 ease-out border border-white/20',
              isActive
                ? 'bg-white/15 border-white/30 text-white shadow-[0_8px_32px_-8px] shadow-white/20'
                : 'bg-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-white/30 hover:translate-y-[-1px] active:translate-y-0',
              !isActive &&
                'hover:shadow-[0_4px_16px_-4px] hover:shadow-black/20'
            )}
            role='menuitem'
            aria-current={isActive ? 'page' : undefined}
            aria-label='Afficher tous les partenaires'
            data-tip={!isExpanded ? 'Tous les partenaires' : undefined}
          >
            <Grid
              className={cn(
                !isExpanded ? 'w-5 h-5' : 'w-5 h-5',
                'transition-all duration-300 group-hover:scale-110 flex-shrink-0',
                isActive ? 'text-white' : 'text-white/75 group-hover:text-white'
              )}
            />
            {!!isExpanded && (
              <motion.span
                className={cn(
                  'font-medium text-sm transition-all duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-white/85 group-hover:text-white'
                )}
                initial={isExpanded ? { opacity: 0, x: -10 } : false}
                animate={isExpanded ? { opacity: 1, x: 0 } : false}
                transition={
                  isExpanded
                    ? { delay: animationDelays.search + 0.03, duration: 0.2 }
                    : { duration: 0.3, ease: 'easeOut' }
                }
              >
                Tous les partenaires
              </motion.span>
            )}
          </a>
        </motion.li>
      )
    }
    // Desktop
    return (
      <li role='none'>
        <a
          onClick={() => handleClassificationClick(null)}
          className={cn(
            'group flex items-center cursor-pointer relative',
            'transition-all duration-300 ease-out',
            'rounded-xl border border-white/20',
            !isExpanded
              ? 'justify-center items-center w-10 h-10 tooltip tooltip-right p-0'
              : 'space-x-3 px-3 py-2 min-h-[40px]',
            isActive
              ? 'bg-white/15 border-white/30 text-white shadow-[0_8px_32px_-8px] shadow-white/20'
              : 'bg-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-white/30 hover:translate-y-[-1px] active:translate-y-0',
            !isActive && 'hover:shadow-[0_4px_16px_-4px] hover:shadow-black/20'
          )}
          role='menuitem'
          aria-current={isActive ? 'page' : undefined}
          aria-label='Afficher tous les partenaires'
          data-tip={!isExpanded ? 'Tous les partenaires' : undefined}
        >
          <Grid
            className={cn(
              !isExpanded ? 'w-5 h-5' : 'w-5 h-5',
              'transition-all duration-300 group-hover:scale-110 flex-shrink-0',
              isActive ? 'text-white' : 'text-white/75 group-hover:text-white'
            )}
          />
          {!!isExpanded && (
            <motion.span
              className={cn(
                'font-medium text-sm transition-all duration-300',
                isActive ? 'text-white' : 'text-white/85 group-hover:text-white'
              )}
              initial={isExpanded ? { opacity: 0, x: -10 } : false}
              animate={isExpanded ? { opacity: 1, x: 0 } : false}
              transition={
                isExpanded
                  ? { delay: animationDelays.search + 0.03, duration: 0.2 }
                  : { duration: 0.3, ease: 'easeOut' }
              }
            >
              Tous les partenaires
            </motion.span>
          )}
        </a>
      </li>
    )
  }

  const renderClassificationItems = () => {
    if (loading) return null
    if (error) return null
    return classifications.map((classification, index: number) => {
      const isActive = selectedClassification === classification.name
      let IconComponent = getIconForClassification(classification.icon ?? '')
      if (!IconComponent || typeof IconComponent !== 'function') {
        IconComponent = Grid
      }
      // Structure et style identiques à renderAllPartnersButton
      const baseClasses = [
        'group flex items-center cursor-pointer relative',
        'transition-all duration-300 ease-out',
        'rounded-xl border border-white/20',
        !isExpanded
          ? 'justify-center items-center w-10 h-10 tooltip tooltip-right p-0'
          : 'space-x-3 px-3 py-2 min-h-[40px] h-10', // h-10 pour uniformiser la hauteur
        isActive
          ? 'bg-white/15 border-white/30 text-white shadow-[0_8px_32px_-8px] shadow-white/20'
          : 'bg-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-white/30 hover:translate-y-[-1px] active:translate-y-0',
        !isActive && 'hover:shadow-[0_4px_16px_-4px] hover:shadow-black/20',
      ]
      return (
        <li role='none' key={classification.id}>
          <a
            onClick={() => handleClassificationClick(classification.name)}
            className={cn(...baseClasses)}
            role='menuitem'
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Filtrer par ${classification.name}`}
            data-tip={!isExpanded ? classification.name : undefined}
          >
            <span className='flex items-center justify-center w-5 h-5'>
              <IconComponent className='w-5 h-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0' />
            </span>
            {!!isExpanded && (
              <motion.span
                className={cn(
                  'font-medium text-sm transition-all duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-white/85 group-hover:text-white'
                )}
                initial={isExpanded ? { opacity: 0, x: -10 } : false}
                animate={isExpanded ? { opacity: 1, x: 0 } : false}
                transition={
                  isExpanded
                    ? {
                        delay:
                          animationDelays.navBase +
                          index * animationDelays.navIncrement +
                          0.05,
                        duration: 0.2,
                      }
                    : {
                        duration: 0.3,
                        ease: 'easeOut',
                      }
                }
              >
                {classification.name}
              </motion.span>
            )}
          </a>
        </li>
      )
    })
  }

  // Rendu uniforme pour les boutons paramètres et logout
  const renderSettingsAndLogout = () => {
    // À adapter selon vos routes/actions réelles
    const items = [
      {
        key: 'settings',
        label: 'Paramètres',
        icon: Settings,
        onClick: () => {
          /* TODO: navigation vers paramètres */
        },
        aria: 'Aller aux paramètres',
      },
      {
        key: 'logout',
        label: 'Déconnexion',
        icon: LogOut,
        onClick: () => {
          /* TODO: action logout */
        },
        aria: 'Se déconnecter',
      },
    ]
    return items.map((item, idx) => {
      const IconComponent = item.icon
      // Structure et style identiques aux autres items
      const baseClasses = [
        'group flex items-center cursor-pointer relative',
        'transition-all duration-300 ease-out',
        'rounded-xl border border-white/20',
        !isExpanded
          ? 'justify-center items-center w-10 h-10 tooltip tooltip-right p-0'
          : 'space-x-3 px-3 py-2 min-h-[40px] h-10', // h-10 pour uniformiser la hauteur
        'bg-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-white/30 hover:translate-y-[-1px] active:translate-y-0',
        'hover:shadow-[0_4px_16px_-4px] hover:shadow-black/20',
      ]
      return (
        <li role='none' key={item.key}>
          <a
            onClick={item.onClick}
            className={cn(...baseClasses)}
            role='menuitem'
            aria-label={item.aria}
            data-tip={!isExpanded ? item.label : undefined}
          >
            <span className='flex items-center justify-center w-5 h-5'>
              {IconComponent && typeof IconComponent === 'function' ? (
                <IconComponent className='w-5 h-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0' />
              ) : null}
            </span>
            {!!isExpanded && (
              <motion.span
                className={cn(
                  'font-medium text-sm transition-all duration-300',
                  'text-white/85 group-hover:text-white'
                )}
                initial={isExpanded ? { opacity: 0, x: -10 } : false}
                animate={isExpanded ? { opacity: 1, x: 0 } : false}
                transition={
                  isExpanded
                    ? {
                        delay:
                          animationDelays.navBase +
                          (classifications.length + idx) *
                            animationDelays.navIncrement +
                          0.05,
                        duration: 0.2,
                      }
                    : {
                        duration: 0.3,
                        ease: 'easeOut',
                      }
                }
              >
                {item.label}
              </motion.span>
            )}
          </a>
        </li>
      )
    })
  }

  return (
    <nav
      className={cn(
        isMobile ? 'mt-4' : 'flex-1 py-4',
        !isMobile && (!isExpanded ? 'px-4' : 'px-4')
      )}
      aria-label='Navigation par classification'
    >
      <ul
        className={cn(
          !isExpanded ? 'space-y-1' : 'space-y-1.5',
          isMobile && 'space-y-3'
        )}
        role='menu'
      >
        {renderAllPartnersButton()}
        {renderClassificationItems()}
        {renderSettingsAndLogout()}
      </ul>
    </nav>
  )
}

SidebarNavigation.displayName = 'SidebarNavigation'
