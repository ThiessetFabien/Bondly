import { render, screen } from '@testing-library/react'
import { SidebarNavigation } from './Navigation'
import { Provider } from 'react-redux'
import { store } from '@/store'

describe('SidebarNavigation', () => {
  it('affiche le bouton "Tous les partenaires"', () => {
    render(
      <Provider store={store}>
        <SidebarNavigation
          isExpanded={true}
          animationDelays={{ navBase: 0, navIncrement: 0.05, search: 0.1 }}
        />
      </Provider>
    )
    expect(screen.getByText(/Tous les partenaires/i)).toBeInTheDocument()
  })
})
