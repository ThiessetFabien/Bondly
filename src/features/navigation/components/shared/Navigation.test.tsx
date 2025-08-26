import { DashboardProvider } from '@/store/context/DashboardContext'
import { render, screen } from '@testing-library/react'
import { Navigation } from '.'

describe('SidebarNavigation', () => {
  it('affiche le bouton "Tous les partenaires"', () => {
    render(
      <DashboardProvider>
        <Navigation
          isExpanded={true}
          animationDelays={{ navBase: 0, navIncrement: 0.05, search: 0.1 }}
        />
      </DashboardProvider>
    )
    expect(screen.getByText(/Tous les partenaires/i)).toBeInTheDocument()
  })
})
