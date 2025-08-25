import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
const mockPartners = [
  {
    id: '1',
    firstName: 'marie',
    lastName: 'dubois',
    profession: "avocat d'affaires",
    email: 'marie.dubois@example.com',
    phone: '01 23 45 67 89',
    company: 'cabinet dubois & associés',
    rating: 5,
    status: 'active',
    notes: 'excellente collaboration, très professionnelle',
    classifications: ['santé', 'spécialiste'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
    relations: [],
  },
  {
    id: '2',
    firstName: 'jean',
    lastName: 'dupont',
    profession: 'fiscaliste',
    email: 'jean.dupont@cabinet-dupont.fr',
    phone: '01 42 96 78 45',
    company: 'cabinet dupont',
    rating: 4,
    status: 'active',
    notes: 'très réactif, expertise solide en droit commercial',
    classifications: ['juridique', 'affaires'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-12-10T14:15:00Z',
    relations: [],
  },
]

// Mock des hooks et données
import { DashboardProvider } from '@/store/context/DashboardContext'

// Mock du hook useSortedPartners avec bypass du contexte réel
vi.mock('../hooks/sortedPartners', () => ({
  useSortedPartners: () => ({
    sortedPartners: mockPartners,
  }),
}))

// Mock du contexte Dashboard pour contrôler l'état
vi.mock('@/store/context/DashboardContext', async () => {
  const actual = await vi.importActual('@/store/context/DashboardContext')

  let mockSelectedRows: string[] = []
  let mockOnSelectionChange = vi.fn()

  return {
    ...actual,
    useDashboard: () => ({
      state: {
        searchTerm: '',
        sidebar: { isExpanded: true, isMobileOpen: false, isHovered: false },
        sortBy: 'company',
        sortOrder: 'asc',
        statusFilter: 'all',
        activeClassification: 'all',
        classifications: [],
        selectedRows: mockSelectedRows,
      },
      dispatch: vi.fn(),
      actions: {
        setSelectedRows: (rows: string[]) => {
          mockSelectedRows = rows
          mockOnSelectionChange(rows)
        },
      },
    }),
    // Helper pour configurer les mocks dans les tests
    __setMockSelectedRows: (rows: string[]) => {
      mockSelectedRows = rows
    },
    __setMockOnSelectionChange: (fn: ReturnType<typeof vi.fn>) => {
      mockOnSelectionChange = fn
    },
  }
})

// Wrapper pour les tests
const DashboardWrapper = ({
  selectedRows = [],
  onSelectionChange = vi.fn(),
}: {
  selectedRows?: string[]
  onSelectionChange?: (rows: string[]) => void
}) => (
  <DashboardProvider>
    <Dashboard
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
    />
  </DashboardProvider>
)

describe('Dashboard - Tests de sélection', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('Affichage et structure', () => {
    it('affiche la liste des partenaires', () => {
      render(<DashboardWrapper />)

      expect(screen.getByText('Cabinet Dubois & Associés')).toBeInTheDocument()
      expect(screen.getByText('Cabinet Dupont')).toBeInTheDocument()
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

  describe('Sélection individuelle', () => {
    it('permet de sélectionner un partenaire', async () => {
      const onSelectionChange = vi.fn()
      render(<DashboardWrapper onSelectionChange={onSelectionChange} />)

      const checkbox = screen.getByLabelText(
        'Sélectionner cabinet dubois & associés'
      )
      await user.click(checkbox)

      expect(onSelectionChange).toHaveBeenCalledWith(['1'])
    })

    it('permet de désélectionner un partenaire', async () => {
      const onSelectionChange = vi.fn()
      render(
        <DashboardWrapper
          selectedRows={['1']}
          onSelectionChange={onSelectionChange}
        />
      )

      const checkbox = screen.getByLabelText(
        'Sélectionner cabinet dubois & associés'
      )
      expect(checkbox).toBeChecked()

      await user.click(checkbox)

      expect(onSelectionChange).toHaveBeenCalledWith([])
    })
  })

  describe('Sélection multiple', () => {
    it('permet de sélectionner plusieurs partenaires', async () => {
      const onSelectionChange = vi.fn()
      render(<DashboardWrapper onSelectionChange={onSelectionChange} />)

      const checkbox1 = screen.getByLabelText(
        'Sélectionner cabinet dubois & associés'
      )

      await user.click(checkbox1)
      expect(onSelectionChange).toHaveBeenLastCalledWith(['1'])

      // Reset le mock pour le deuxième appel
      onSelectionChange.mockClear()

      // Simuler l'état après le premier clic
      render(
        <DashboardWrapper
          selectedRows={['1']}
          onSelectionChange={onSelectionChange}
        />
      )

      const checkbox2Updated = screen.getByLabelText(
        'Sélectionner cabinet dupont'
      )
      await user.click(checkbox2Updated)

      expect(onSelectionChange).toHaveBeenLastCalledWith(['1', '2'])
    })
  })

  describe('Sélection totale', () => {
    it("sélectionne tous les partenaires avec la checkbox d'en-tête", async () => {
      const onSelectionChange = vi.fn()
      render(<DashboardWrapper onSelectionChange={onSelectionChange} />)

      const headerCheckbox = screen.getByLabelText('Sélectionner tout')
      await user.click(headerCheckbox)

      expect(onSelectionChange).toHaveBeenCalledWith(['1', '2'])
    })

    it("désélectionne tous les partenaires avec la checkbox d'en-tête", async () => {
      const onSelectionChange = vi.fn()
      render(
        <DashboardWrapper
          selectedRows={['1', '2']}
          onSelectionChange={onSelectionChange}
        />
      )

      const headerCheckbox = screen.getByLabelText('Sélectionner tout')
      expect(headerCheckbox).toBeChecked()

      await user.click(headerCheckbox)

      expect(onSelectionChange).toHaveBeenCalledWith([])
    })

    it("affiche l'état indéterminé pour une sélection partielle", () => {
      render(<DashboardWrapper selectedRows={['1']} />)

      const headerCheckbox = screen.getByLabelText(
        'Sélectionner tout'
      ) as HTMLInputElement
      expect(headerCheckbox.indeterminate).toBe(true)
      expect(headerCheckbox.checked).toBe(false)
    })

    it("affiche l'état coché pour une sélection complète", () => {
      render(<DashboardWrapper selectedRows={['1', '2']} />)

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
