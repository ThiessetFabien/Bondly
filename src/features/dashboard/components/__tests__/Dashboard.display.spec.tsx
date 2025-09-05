import { DashboardProvider } from '@/store/context/DashboardContext'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dashboard } from '../Dashboard'

// Utilisation des vraies données du projet pour les tests de sélection
import partnersData from '@/data/partners.json'
vi.mock('../hooks/sortedPartners', () => ({
  useSortedPartners: () => ({
    sortedPartners: partnersData.partners,
  }),
}))

// Mocks simplifiés des composants
vi.mock('../SettingsDashboard', () => ({
  SettingsDashboard: () => null,
}))

vi.mock('../desktop/TableHeaderCell', () => ({
  TableHeaderCell: ({ title }: { title: string }) => <th>{title}</th>,
}))

vi.mock('../mobile/CompanyAndNameCell', () => ({
  CompanyAndNameCell: ({ partner }: { partner: { company: string } }) => (
    <div>{partner.company}</div>
  ),
}))

vi.mock('@/shared/components/buttons/ActionLinkButton', () => ({
  ActionLinkButton: () => <button>Action</button>,
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
  }: {
    ariaLabel: string
    checked: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }) => (
    <input
      type='checkbox'
      aria-label={ariaLabel}
      checked={checked}
      onChange={onChange}
    />
  ),
}))

vi.mock('lucide-react', () => ({
  Building2: () => null,
  Contact: () => null,
  MessageSquare: () => null,
  Star: () => null,
  User: () => null,
  Users: () => null,
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

describe('Dashboard - Affichage et contenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderDashboard = () =>
    render(
      <DashboardProvider>
        <Dashboard />
      </DashboardProvider>
    )

  describe('Affichage des éléments de sélection', () => {
    it('affiche la checkbox de sélection globale', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(screen.getByLabelText('Sélectionner tout')).toBeInTheDocument()
      })
    })

    it('affiche les checkboxes pour chaque partenaire', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(
          screen.getByLabelText('Sélectionner assurance petit')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Contenu du dashboard', () => {
    it('affiche les informations des partenaires', async () => {
      renderDashboard()

      await waitFor(() => {
        expect(screen.getByText('Assurance Petit')).toBeInTheDocument()
      })
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
})
