import { SortedASC, SortedDESC } from '@/shared/components/icons/Sorted.svg'
import { useIsMobile } from '@/shared/hooks/useIsMobile.hooks'
import { cnIcon } from '@/shared/styles/icons.styles'
import { UserCheck } from 'lucide-react'
import { cn } from '../../../services/lib/utils'
import { ActionButton } from '../../../shared/components/buttons/ActionButton'
import { Croix } from '../../../shared/components/icons/Croix.svg'
import {
  allFirstLetterToUpperCase,
  oneFirstLetterToUpperCase,
} from '../../../shared/utils/formatStrings'
import { useDashboard } from '../../../store/context/DashboardContext'
import { STATUS_OPTIONS } from '../contants/constants'

export const SettingsDashboard = () => {
  const { state, dispatch } = useDashboard()
  const { sortBy, sortOrder, statusFilter, activeClassification } = state
  const isMobile = useIsMobile()

  const sortedEnters = () => {
    switch (sortBy + '-' + sortOrder) {
      case 'company-asc':
        return 'A → Z'
      case 'company-desc':
        return 'Z → A'
      case 'rating-asc':
        return 'Note ↑'
      case 'rating-desc':
        return 'Note ↓'
      case 'relations-asc':
        return 'Relations ↑'
      case 'relations-desc':
        return 'Relations ↓'
      default:
        return 'Trier'
    }
  }
  const sortedAriaLabels = () => {
    switch (sortBy + '-' + sortOrder) {
      case 'company-asc':
        return 'Entreprise de A à Z'
      case 'company-desc':
        return 'Entreprise de Z à A'
      case 'rating-asc':
        return 'Note croissante'
      case 'rating-desc':
        return 'Note décroissante'
      case 'relations-asc':
        return 'Relation croissante'
      case 'relations-desc':
        return 'Relation décroissante'
      default:
        return 'Trier'
    }
  }

  return (
    <section className='flex flex-row justify-between items-stretch mb-2 w-full gap-2'>
      <div className='dropdown dropdown-bottom items-center'>
        <ActionButton
          tabIndex={0}
          icon={
            sortOrder !== 'asc' ? (
              <SortedASC className={cn(cnIcon, 'text-primary')} />
            ) : (
              <SortedDESC className={cn(cnIcon, 'text-primary')} />
            )
          }
          title={isMobile ? sortedEnters() : `Tri par : ${sortedAriaLabels()}`}
          ariaLabel={sortedAriaLabels()}
          className='w-fit justify-start p-2 font-normal text-xs'
        />
        <ul
          tabIndex={0}
          className='dropdown-content z-[1] menu p-2 shadow-sm bg-base-100 rounded-box w-full'
        >
          <li>
            <a
              onClick={() => {
                dispatch({ type: 'SET_SORT_BY', payload: 'company' })
                dispatch({ type: 'SET_SORT_ORDER', payload: 'asc' })
              }}
            >
              {isMobile ? 'A → Z' : 'Entreprise de A à Z'}
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                dispatch({ type: 'SET_SORT_BY', payload: 'company' })
                dispatch({ type: 'SET_SORT_ORDER', payload: 'desc' })
              }}
            >
              {isMobile ? 'Z → A' : 'Entreprise de Z à A'}
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                dispatch({ type: 'SET_SORT_BY', payload: 'rating' })
                dispatch({ type: 'SET_SORT_ORDER', payload: 'asc' })
              }}
            >
              {isMobile ? 'Note ↑' : 'Note croissante'}
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                dispatch({ type: 'SET_SORT_BY', payload: 'rating' })
                dispatch({ type: 'SET_SORT_ORDER', payload: 'desc' })
              }}
            >
              {isMobile ? 'Note ↓' : 'Note décroissante'}
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                dispatch({ type: 'SET_SORT_BY', payload: 'relations' })
                dispatch({ type: 'SET_SORT_ORDER', payload: 'asc' })
              }}
            >
              {isMobile ? 'Relations ↑' : 'Relations croissantes'}
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                dispatch({ type: 'SET_SORT_BY', payload: 'relations' })
                dispatch({ type: 'SET_SORT_ORDER', payload: 'desc' })
              }}
            >
              {isMobile ? 'Relations ↓' : 'Relations décroissantes'}
            </a>
          </li>
        </ul>
      </div>
      {activeClassification && isMobile && (
        <div className='flex items-center gap-1 ml-2'>
          <ActionButton
            icon={<Croix className={cn(cnIcon, 'text-error')} />}
            title={`${isMobile ? '' : 'Catégorie : '}${allFirstLetterToUpperCase(activeClassification)}`}
            ariaLabel={`Catégorie : ${allFirstLetterToUpperCase(activeClassification)}`}
            onClick={() =>
              dispatch({ type: 'SET_ACTIVE_CLASSIFICATION', payload: '' })
            }
            className='w-fit justify-start p-2 font-normal text-xs'
          />
        </div>
      )}
      {/* À droite : statut */}
      {!isMobile && (
        <div className='flex flex-1 dropdown dropdown-bottom items-center justify-end w-full'>
          <ActionButton
            tabIndex={0}
            icon={<UserCheck className={cn(cnIcon, 'text-primary')} />}
            title={`Filtré par statut : ${oneFirstLetterToUpperCase(STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'Tous')}`}
            ariaLabel={`Filtré par statut : ${oneFirstLetterToUpperCase(STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'Tous')}`}
            className='w-fit justify-start p-2 font-normal text-xs'
          />
          <ul
            tabIndex={0}
            className='dropdown-content z-[1] menu p-2 shadow-sm bg-base-100 rounded-box w-fit'
          >
            {STATUS_OPTIONS.map(opt => (
              <li key={opt.value}>
                <a
                  onClick={() =>
                    dispatch({
                      type: 'SET_STATUS_FILTER',
                      payload: opt.value,
                    })
                  }
                >
                  {oneFirstLetterToUpperCase(opt.label)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
