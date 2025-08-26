import { DashboardProvider } from '@/store/context/DashboardContext'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SettingsDashboard } from '../SettingsDashboard'

const renderWithProvider = (children: React.ReactNode) => {
  return render(<DashboardProvider>{children}</DashboardProvider>)
}

describe('SettingsDashboard', () => {
  it('renders without error', () => {
    renderWithProvider(<SettingsDashboard />)

    // Vérifier que les boutons de tri sont présents
    expect(screen.getByText('Entreprise de A à Z')).toBeInTheDocument()
    expect(screen.getByText('Filtré par statut : Actif')).toBeInTheDocument()
  })
})
