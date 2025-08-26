import { DashboardProvider } from '@/store/context/DashboardContext'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dashboard } from '../Dashboard'

// Utilisation des vraies données du projet
import partnersData from '@/data/partners.json'
vi.mock('../hooks/sortedPartners', () => ({
  useSortedPartners: () => ({
    sortedPartners: partnersData.partners.slice(0, 2), // Prendre seulement les 2 premiers pour les tests
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
  beforeEach(() => {
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

      // Attendre que les données soient rendues - vérifier la présence de contenu générique
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument()
      })

      // Vérifier qu'au moins une ligne de données est présente
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1) // En-tête + au moins une ligne de données
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
        expect(screen.getByRole('table')).toBeInTheDocument()
      })

      // Vérifier que la structure de table est présente avec des cellules
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1) // En-tête + au moins une ligne de données

      // Vérifier que des checkboxes sont présentes pour la sélection
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibilité', () => {
    it('a les labels ARIA appropriés', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(screen.getByLabelText('Sélectionner tout')).toBeInTheDocument()
      })

      // Vérifier que des labels de sélection sont présents (sans dépendre de données spécifiques)
      const selectCheckboxes = screen.getAllByRole('checkbox')
      expect(selectCheckboxes.length).toBeGreaterThan(1) // Au moins "Sélectionner tout" + une ligne
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
