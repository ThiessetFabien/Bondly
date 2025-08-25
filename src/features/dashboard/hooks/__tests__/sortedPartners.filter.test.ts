import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSortedPartners } from '../sortedPartners'

// Mock des données JSON directement dans vi.mock
vi.mock('@/data/partners.json', () => ({
  default: {
    partners: [
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        profession: 'Développeur Senior',
        email: 'jean.dupont@techcorp.com',
        phone: '0123456789',
        company: 'TechCorp',
        rating: 4.5,
        status: 'active',
        notes: 'Excellent partenaire',
        classifications: ['tech', 'startup'],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        relations: [
          {
            id: '1',
            name: 'Marie Martin',
            company: 'DesignStudio',
            type: 'business',
          },
        ],
      },
      {
        id: '2',
        firstName: 'Marie',
        lastName: 'Martin',
        profession: 'UX Designer',
        email: 'marie.martin@designstudio.com',
        phone: '0987654321',
        company: 'DesignStudio',
        rating: 3.8,
        status: 'active',
        notes: 'Bon contact design',
        classifications: ['design', 'ux'],
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
        relations: [],
      },
      {
        id: '3',
        firstName: 'Pierre',
        lastName: 'Durand',
        profession: 'Consultant',
        email: 'pierre.durand@consultant.fr',
        phone: '0555666777',
        company: 'Zebra Consulting',
        rating: 5.0,
        status: 'archived',
        notes: 'Ancien partenaire',
        classifications: ['consulting'],
        createdAt: '2023-01-03',
        updatedAt: '2023-01-03',
        relations: [],
      },
    ],
  },
}))

// Mock du contexte Dashboard
let mockDashboardState: {
  searchTerm: string
  sidebar: { isExpanded: boolean; isMobileOpen: boolean; isHovered: boolean }
  sortBy: string
  sortOrder: string
  statusFilter: string
  activeClassification: string
  classifications: string[]
  selectedRows: string[]
} = {
  searchTerm: '',
  sidebar: { isExpanded: true, isMobileOpen: false, isHovered: false },
  sortBy: 'company',
  sortOrder: 'asc',
  statusFilter: 'active',
  activeClassification: '',
  classifications: [],
  selectedRows: [],
}

vi.mock('@/store/context/DashboardContext', () => ({
  useDashboard: () => ({
    state: mockDashboardState,
    dispatch: vi.fn(),
  }),
}))

describe('useSortedPartners - Filtres et Recherche', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Réinitialiser l'état par défaut
    mockDashboardState = {
      searchTerm: '',
      sidebar: { isExpanded: true, isMobileOpen: false, isHovered: false },
      sortBy: 'company',
      sortOrder: 'asc',
      statusFilter: 'active',
      activeClassification: '',
      classifications: [],
      selectedRows: [],
    }
  })

  describe('Filtrage par statut', () => {
    it('filtre les partenaires actifs par défaut', () => {
      const { result } = renderHook(() => useSortedPartners())

      const activePartners = result.current.sortedPartners
      expect(activePartners).toHaveLength(2)
      expect(activePartners.every(p => p.status === 'active')).toBe(true)
    })

    it('filtre les partenaires archivés', () => {
      mockDashboardState.statusFilter = 'archived'
      const { result } = renderHook(() => useSortedPartners())

      const archivedPartners = result.current.sortedPartners
      expect(archivedPartners).toHaveLength(1)
      expect(archivedPartners[0].status).toBe('archived')
      expect(archivedPartners[0].company).toBe('Zebra Consulting')
    })
  })

  describe('Recherche par terme', () => {
    it('recherche par nom de société', () => {
      mockDashboardState.searchTerm = 'TechCorp'
      const { result } = renderHook(() => useSortedPartners())

      const searchResults = result.current.sortedPartners
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].company).toBe('TechCorp')
    })

    it('recherche insensible à la casse', () => {
      mockDashboardState.searchTerm = 'techcorp'
      const { result } = renderHook(() => useSortedPartners())

      const searchResults = result.current.sortedPartners
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].company).toBe('TechCorp')
    })

    it('retourne une liste vide pour une recherche sans résultat', () => {
      mockDashboardState.searchTerm = 'inexistant'
      const { result } = renderHook(() => useSortedPartners())

      const searchResults = result.current.sortedPartners
      expect(searchResults).toHaveLength(0)
    })
  })

  describe('Filtrage par classification', () => {
    it('filtre par classification tech', () => {
      mockDashboardState.activeClassification = 'tech'
      const { result } = renderHook(() => useSortedPartners())

      const filteredPartners = result.current.sortedPartners
      expect(filteredPartners).toHaveLength(1)
      expect(filteredPartners[0].classifications).toContain('tech')
    })

    it('filtre par classification design', () => {
      mockDashboardState.activeClassification = 'design'
      const { result } = renderHook(() => useSortedPartners())

      const filteredPartners = result.current.sortedPartners
      expect(filteredPartners).toHaveLength(1)
      expect(filteredPartners[0].classifications).toContain('design')
    })
  })

  describe('Tri des résultats', () => {
    it('trie par société A → Z par défaut', () => {
      const { result } = renderHook(() => useSortedPartners())

      const sortedPartners = result.current.sortedPartners
      const companies = sortedPartners.map(p => p.company)
      expect(companies).toEqual(['DesignStudio', 'TechCorp'])
    })

    it('trie par société Z → A', () => {
      mockDashboardState.sortBy = 'company'
      mockDashboardState.sortOrder = 'desc'
      const { result } = renderHook(() => useSortedPartners())

      const sortedPartners = result.current.sortedPartners
      const companies = sortedPartners.map(p => p.company)
      expect(companies).toEqual(['TechCorp', 'DesignStudio'])
    })

    it('trie par notation croissante', () => {
      mockDashboardState.sortBy = 'rating'
      mockDashboardState.sortOrder = 'asc'
      const { result } = renderHook(() => useSortedPartners())

      const sortedPartners = result.current.sortedPartners
      const ratings = sortedPartners.map(p => p.rating)
      expect(ratings).toEqual([3.8, 4.5])
    })

    it('trie par notation décroissante', () => {
      mockDashboardState.sortBy = 'rating'
      mockDashboardState.sortOrder = 'desc'
      const { result } = renderHook(() => useSortedPartners())

      const sortedPartners = result.current.sortedPartners
      const ratings = sortedPartners.map(p => p.rating)
      expect(ratings).toEqual([4.5, 3.8])
    })
  })

  describe('Combinaison de filtres', () => {
    it('combine recherche et filtre de statut', () => {
      mockDashboardState.searchTerm = 'développeur'
      mockDashboardState.statusFilter = 'active'
      const { result } = renderHook(() => useSortedPartners())

      const results = result.current.sortedPartners
      expect(results).toHaveLength(1)
      expect(results[0].profession).toContain('Développeur')
      expect(results[0].status).toBe('active')
    })

    it('combine recherche et classification', () => {
      mockDashboardState.searchTerm = 'Jean'
      mockDashboardState.activeClassification = 'tech'
      const { result } = renderHook(() => useSortedPartners())

      const results = result.current.sortedPartners
      expect(results).toHaveLength(1)
      expect(results[0].firstName).toBe('Jean')
      expect(results[0].classifications).toContain('tech')
    })
  })
})
