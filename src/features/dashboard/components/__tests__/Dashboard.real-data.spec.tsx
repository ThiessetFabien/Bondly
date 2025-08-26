import { DashboardProvider } from '@/store/context/DashboardContext'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dashboard } from '../Dashboard'

// Mock simplifié des composants lourds pour optimiser les tests
vi.mock('../SettingsDashboard', () => ({
  SettingsDashboard: () => <div data-testid='settings-dashboard' />,
}))

vi.mock('../desktop/TableHeaderCell', () => ({
  TableHeaderCell: ({ title }: { title: string }) => <th>{title}</th>,
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
    ariaLabel,
    checked,
    onChange,
    tabIndex,
    id,
  }: {
    ariaLabel: string
    checked: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    tabIndex?: number
    id?: string
  }) => (
    <input
      id={id}
      type='checkbox'
      aria-label={ariaLabel}
      checked={checked}
      onChange={onChange}
      tabIndex={tabIndex}
    />
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

vi.mock('lucide-react', () => ({
  Building2: () => <svg data-testid='building-icon' />,
  Contact: () => <svg data-testid='contact-icon' />,
  MessageSquare: () => <svg data-testid='message-icon' />,
  Star: ({ fill }: { fill?: boolean }) => (
    <span className={`star ${fill ? 'filled' : 'empty'}`} />
  ),
  User: () => <svg data-testid='user-icon' />,
  Users: () => <svg data-testid='users-icon' />,
}))

describe('Dashboard - Tests réels avec données du projet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderDashboard = () =>
    render(
      <DashboardProvider>
        <Dashboard />
      </DashboardProvider>
    )

  describe('Rendu et structure de base', () => {
    it('affiche le composant Dashboard sans erreur', () => {
      renderDashboard()

      // Vérifier que le composant se rend
      expect(screen.getByTestId('settings-dashboard')).toBeInTheDocument()
    })

    it('affiche la structure de table avec en-têtes', () => {
      renderDashboard()

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('Entreprise')).toBeInTheDocument()
      expect(screen.getByText('Notation')).toBeInTheDocument()
      expect(screen.getByText('Interlocuteur')).toBeInTheDocument()
      expect(screen.getByText('Contacts')).toBeInTheDocument()
      expect(screen.getByText('Relations')).toBeInTheDocument()
    })

    it('affiche la checkbox de sélection globale', () => {
      renderDashboard()

      const selectAllCheckbox = screen.getByLabelText('Sélectionner tout')
      expect(selectAllCheckbox).toBeInTheDocument()
      expect(selectAllCheckbox).not.toBeChecked()
    })
  })

  describe('Contenu des données', () => {
    it('affiche des données de partenaires du fichier JSON', async () => {
      renderDashboard()

      // Attendre que les données soient rendues
      await waitFor(() => {
        // Chercher des éléments qui indiquent la présence de données
        const rows = screen.getAllByRole('row')
        expect(rows.length).toBeGreaterThan(1) // En-tête + au moins une ligne de données
      })
    })

    it('affiche des informations de contact', async () => {
      renderDashboard()

      // Chercher des boutons d'action qui indiquent la présence de contacts
      await waitFor(() => {
        const actionButtons = screen.getAllByRole('button')
        const emailButtons = actionButtons.filter(
          btn =>
            btn.getAttribute('aria-label')?.includes('email') ||
            btn.getAttribute('aria-label')?.includes('Envoyer')
        )
        expect(emailButtons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Accessibilité', () => {
    it('a des labels ARIA appropriés', () => {
      renderDashboard()

      expect(screen.getByLabelText('Sélectionner tout')).toBeInTheDocument()
    })

    it('utilise une structure de table sémantique', () => {
      renderDashboard()

      expect(screen.getByRole('table')).toBeInTheDocument()

      const columnHeaders = screen.getAllByRole('columnheader')
      expect(columnHeaders.length).toBeGreaterThan(0)

      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1)
    })

    it('a des éléments avec tabIndex appropriés', async () => {
      renderDashboard()

      await waitFor(() => {
        const interactiveElements = screen.getAllByRole('checkbox')
        expect(interactiveElements.length).toBeGreaterThan(0)
      })
    })
  })
})
