import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dashboard } from '../Dashboard'

// Mock des composants dépendants pour éviter les erreurs
vi.mock('../SettingsDashboard', () => ({
  SettingsDashboard: () => <div data-testid='settings-dashboard'>Settings</div>,
}))

vi.mock('../desktop/TableHeaderCell', () => ({
  TableHeaderCell: ({
    title,
    icon,
    className,
  }: {
    title: string
    icon?: React.ReactNode
    className?: string
  }) => (
    <th className={className}>
      {icon}
      {title}
    </th>
  ),
}))

vi.mock('../mobile/CompanyAndNameCell', () => ({
  CompanyAndNameCell: ({
    partner,
  }: {
    partner: { company: string; firstName: string; lastName: string }
  }) => (
    <div data-testid='company-name-cell'>
      {partner.company} - {partner.firstName} {partner.lastName}
    </div>
  ),
}))

vi.mock('@/shared/components/buttons/ActionLinkButton', () => ({
  ActionLinkButton: ({ ariaLabel }: { ariaLabel: string }) => (
    <a aria-label={ariaLabel}>Action</a>
  ),
}))

vi.mock('@/shared/components/badges/Badge', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

vi.mock('@/shared/components/checkbox/Checkbox', () => ({
  Checkbox: ({
    id,
    checked,
    onChange,
    ariaLabel,
  }: {
    id?: string
    checked: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    ariaLabel: string
  }) => (
    <label htmlFor={id}>
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
      />
    </label>
  ),
}))

// Mock des icônes
vi.mock('@/shared/components/icons/Email.svg', () => ({
  Email: () => <svg data-testid='email-icon' />,
}))

vi.mock('@/shared/components/icons/Phone.svg', () => ({
  Phone: () => <svg data-testid='phone-icon' />,
}))

vi.mock('@/shared/components/icons/Relation.svg', () => ({
  Relation: () => <svg data-testid='relation-icon' />,
}))

// Mock de Lucide React
vi.mock('lucide-react', () => ({
  Building2: () => <svg data-testid='building-icon' />,
  Contact: () => <svg data-testid='contact-icon' />,
  MessageSquare: () => <svg data-testid='message-icon' />,
  Star: () => <svg data-testid='star-icon' />,
  User: () => <svg data-testid='user-icon' />,
  Users: () => <svg data-testid='users-icon' />,
}))

// Mock des données de test - utilise les vraies données du projet
import partnersData from '@/data/partners.json'

// Mock des hooks et données
import { DashboardProvider } from '@/store/context/DashboardContext'

// Mock du hook useSortedPartners avec les vraies données de test
vi.mock('@/features/dashboard/hooks/sortedPartners', () => ({
  useSortedPartners: () => ({
    sortedPartners: partnersData.partners.slice(0, 3), // Prendre seulement les 3 premiers pour simplifier les tests
  }),
}))

// Mock du contexte Dashboard pour un contrôle d'état simplifiée
const mockDispatch = vi.fn()

// Mock object qui sera modifiable dans les tests
const mockContextValue = {
  state: {
    searchTerm: '',
    sidebar: { isExpanded: true, isMobileOpen: false, isHovered: false },
    sortBy: 'company' as const,
    sortOrder: 'asc' as const,
    statusFilter: '', // Aucun filtre de statut pour afficher tous les partenaires
    activeClassification: '', // Aucun filtre de classification pour afficher tous les partenaires
    classifications: [],
    selectedRows: [] as string[],
  },
  dispatch: mockDispatch,
}

vi.mock('@/store/context/DashboardContext', () => ({
  DashboardProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDashboard: () => mockContextValue,
}))

// Wrapper simplifié pour les tests
const DashboardWrapper = () => (
  <DashboardProvider>
    <Dashboard />
  </DashboardProvider>
)

describe('Dashboard - Tests de sélection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Réinitialiser l'état du contexte
    mockContextValue.state.selectedRows = []
  })

  describe('Affichage et structure', () => {
    it('affiche la liste des partenaires', () => {
      render(<DashboardWrapper />)

      // Vérifier la présence de contenu générique plutôt que des données spécifiques
      expect(screen.getByRole('table')).toBeInTheDocument()

      // Vérifier qu'au moins une ligne de données est présente
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1) // En-tête + au moins une ligne de données
    })

    it('affiche les en-têtes de colonnes', () => {
      render(<DashboardWrapper />)

      expect(screen.getByText('Entreprise')).toBeInTheDocument()
      expect(screen.getByText('Notation')).toBeInTheDocument()
      expect(screen.getByText('Interlocuteur')).toBeInTheDocument()
    })

    it("affiche la checkbox d'en-tête", () => {
      render(<DashboardWrapper />)

      const headerCheckbox = screen.getByLabelText('Sélectionner tout')
      expect(headerCheckbox).toBeInTheDocument()
      expect(headerCheckbox).not.toBeChecked()
    })
  })

  describe('Sélection totale', () => {
    it("affiche l'état indéterminé pour une sélection partielle", () => {
      // Configurer l'état initial avec une sélection partielle
      mockContextValue.state.selectedRows = ['1']

      render(<DashboardWrapper />)

      const headerCheckbox = screen.getByLabelText(
        'Sélectionner tout'
      ) as HTMLInputElement
      expect(headerCheckbox.indeterminate).toBe(true)
      expect(headerCheckbox.checked).toBe(false)
    })

    it("affiche l'état coché pour une sélection complète", () => {
      // Configurer l'état initial avec toutes les sélections
      mockContextValue.state.selectedRows = ['1', '2', '3']

      render(<DashboardWrapper />)

      const headerCheckbox = screen.getByLabelText(
        'Sélectionner tout'
      ) as HTMLInputElement
      expect(headerCheckbox.indeterminate).toBe(false)
      expect(headerCheckbox.checked).toBe(true)
    })
  })

  describe('Accessibilité', () => {
    it('a les labels ARIA appropriés', () => {
      render(<DashboardWrapper />)

      expect(screen.getByLabelText('Sélectionner tout')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Sélectionner cabinet dubois & associés')
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText('Sélectionner cabinet dupont')
      ).toBeInTheDocument()
    })

    it('a les rôles appropriés pour la table', () => {
      render(<DashboardWrapper />)

      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(0)
    })
  })
})
