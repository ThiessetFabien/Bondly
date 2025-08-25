import { DashboardProvider } from '@/store/context/DashboardContext'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dashboard } from '../Dashboard'

// Mock du hook useSortedPartners
vi.mock('../hooks/sortedPartners', () => ({
  useSortedPartners: () => ({
    sortedPartners: [
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
    ],
  }),
}))

// Mock des composants lourds
vi.mock('../SettingsDashboard', () => ({
  SettingsDashboard: () => <div data-testid='settings-dashboard' />,
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
    <button aria-label={ariaLabel}>Action</button>
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
    tabIndex,
  }: {
    id?: string
    checked: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    ariaLabel: string
    tabIndex?: number
  }) => (
    <label htmlFor={id}>
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
      />
    </label>
  ),
}))

// Mock des icônes SVG avec le bon format d'export
vi.mock('@/shared/components/icons/Email.svg', () => ({
  Email: () => <svg data-testid='email-icon' />,
}))

vi.mock('@/shared/components/icons/Phone.svg', () => ({
  Phone: () => <svg data-testid='phone-icon' />,
}))

vi.mock('@/shared/components/icons/Relation.svg', () => ({
  Relation: () => <svg data-testid='relation-icon' />,
}))

vi.mock('lucide-react', () => ({
  Building2: () => <svg data-testid='building-icon' />,
  Contact: () => <svg data-testid='contact-icon' />,
  MessageSquare: () => <svg data-testid='message-icon' />,
  Star: () => <svg data-testid='star-icon' />,
  User: () => <svg data-testid='user-icon' />,
  Users: () => <svg data-testid='users-icon' />,
}))

describe("Dashboard - Tests d'intégration", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  const renderDashboard = () =>
    render(
      <DashboardProvider>
        <Dashboard />
      </DashboardProvider>
    )

  describe('Rendu de base', () => {
    it('affiche le composant Dashboard', () => {
      renderDashboard()

      // Vérifier que le composant se rend sans erreur
      expect(screen.getByTestId('settings-dashboard')).toBeInTheDocument()
    })

    it('affiche les données des partenaires', async () => {
      renderDashboard()

      // Attendre que les données soient rendues
      await waitFor(() => {
        expect(
          screen.getByText('Cabinet Dubois & Associés')
        ).toBeInTheDocument()
      })

      expect(screen.getByText('Cabinet Dupont')).toBeInTheDocument()
      expect(screen.getByText('jean')).toBeInTheDocument()
      expect(screen.getByText('marie')).toBeInTheDocument()
    })

    it('affiche les en-têtes de colonnes', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(screen.getByText('Entreprise')).toBeInTheDocument()
      })

      expect(screen.getByText('Notation')).toBeInTheDocument()
      expect(screen.getByText('Interlocuteur')).toBeInTheDocument()
    })
  })

  describe('Interface de sélection', () => {
    it('affiche les checkboxes de sélection', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(screen.getByLabelText('Sélectionner tout')).toBeInTheDocument()
      })

      expect(
        screen.getByLabelText('Sélectionner cabinet dubois & associés')
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText('Sélectionner cabinet dupont')
      ).toBeInTheDocument()
    })

    it("permet l'interaction avec les checkboxes", async () => {
      renderDashboard()

      await waitFor(() => {
        expect(
          screen.getByLabelText('Sélectionner cabinet dubois & associés')
        ).toBeInTheDocument()
      })

      const checkbox = screen.getByLabelText(
        'Sélectionner cabinet dubois & associés'
      )
      expect(checkbox).not.toBeChecked()

      await user.click(checkbox)

      // Dans un test d'intégration, nous vérifions que l'interaction fonctionne
      // même si l'état n'est pas persisté entre les re-renders
      expect(checkbox).toBeChecked()
    })
  })

  describe('Structure de la table', () => {
    it('utilise une structure de table sémantique', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument()
      })

      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1) // En-tête + au moins une ligne de données
    })

    it('a des cellules avec le bon contenu', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(
          screen.getByText('Cabinet Dubois & Associés')
        ).toBeInTheDocument()
      })

      // Vérifier que les informations des partenaires sont présentes
      expect(screen.getByText('marie.dubois@example.com')).toBeInTheDocument()
      expect(
        screen.getByText('jean.dupont@cabinet-dupont.fr')
      ).toBeInTheDocument()
    })
  })

  describe('Accessibilité', () => {
    it('a les labels ARIA appropriés', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(screen.getByLabelText('Sélectionner tout')).toBeInTheDocument()
      })

      expect(
        screen.getByLabelText('Sélectionner cabinet dubois & associés')
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText('Sélectionner cabinet dupont')
      ).toBeInTheDocument()
    })

    it('a une structure de table accessible', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument()
      })

      const columnHeaders = screen.getAllByRole('columnheader')
      expect(columnHeaders.length).toBeGreaterThan(0)
    })
  })
})
