'use client'

import { getAllClassifications } from '@/features/navigation/services/Classifications'
import type { PartnerClassification } from '@/shared/types/Partner'
import { createContext, ReactNode, useContext, useReducer } from 'react'

// Import JSON statique (NodeNext + resolveJsonModule)

export type DashboardState = {
  searchTerm: string
  sidebar: {
    isExpanded: boolean
    isMobileOpen: boolean
    isHovered: boolean
  }
  sortBy: 'company' | 'rating' | 'relations'
  sortOrder: 'asc' | 'desc'
  statusFilter: string
  activeClassification: string
  classifications: PartnerClassification[]
  selectedRows: string[]
}

const initialState: DashboardState = {
  searchTerm: '',
  sidebar: {
    isExpanded: true,
    isMobileOpen: false,
    isHovered: false,
  },
  sortBy: 'company',
  sortOrder: 'asc',
  statusFilter: 'active',
  activeClassification: '',
  classifications: getAllClassifications(),
  selectedRows: [],
}

type DashboardAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'TOGGLE_SIDEBAR_EXPANDED' }
  | { type: 'SET_SIDEBAR_EXPANDED'; payload: boolean }
  | { type: 'SET_SIDEBAR_MOBILE_OPEN'; payload: boolean }
  | { type: 'SET_SIDEBAR_HOVERED'; payload: boolean }
  | { type: 'SET_SORT_BY'; payload: 'company' | 'rating' | 'relations' }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' }
  | { type: 'SET_STATUS_FILTER'; payload: string }
  | { type: 'SET_ACTIVE_CLASSIFICATION'; payload: string }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'SET_CLASSIFICATIONS'; payload: PartnerClassification[] }
  | { type: 'SET_SELECTED_ROWS'; payload: string[] }

function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload }
    case 'CLEAR_SEARCH':
      return { ...state, searchTerm: '' }
    case 'TOGGLE_SIDEBAR_EXPANDED':
      return {
        ...state,
        sidebar: { ...state.sidebar, isExpanded: !state.sidebar.isExpanded },
      }
    case 'SET_SIDEBAR_EXPANDED':
      return {
        ...state,
        sidebar: { ...state.sidebar, isExpanded: action.payload },
      }
    case 'SET_SIDEBAR_MOBILE_OPEN':
      return {
        ...state,
        sidebar: { ...state.sidebar, isMobileOpen: action.payload },
      }
    case 'SET_SIDEBAR_HOVERED':
      return {
        ...state,
        sidebar: { ...state.sidebar, isHovered: action.payload },
      }
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload }
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload }
    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.payload }
    case 'SET_ACTIVE_CLASSIFICATION':
      return { ...state, activeClassification: action.payload }
    case 'SET_CLASSIFICATIONS':
      return { ...state, classifications: action.payload }
    case 'SET_SELECTED_ROWS':
      return { ...state, selectedRows: action.payload }
    default:
      return state
  }
}

const DashboardContext = createContext<
  | {
      state: DashboardState
      dispatch: React.Dispatch<DashboardAction>
    }
  | undefined
>(undefined)

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx)
    throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // Si jamais on veut recharger dynamiquement (ex: SSR/hydratation ou hot reload), on peut garder ce useEffect :
  // useEffect(() => {
  //   dispatch({ type: 'SET_CLASSIFICATIONS', payload: getDynamicClassifications() })
  // }, [])

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  )
}
