// Test-first approach: définir le comportement attendu d'un composant Partner
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PartnerCard } from '../components/PartnerCard'
import type { Partner } from '../types'

const mockPartner: Partner = {
  id: '1',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '0123456789',
  company: 'Cabinet Dupont',
  profession: "Avocat d'affaires",
  rating: 4,
  status: 'active',
  notes: 'Excellent partenaire',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  classifications: ["Avocat d'affaires", 'Droit des sociétés'],
} as const

describe('PartnerCard', () => {
  const mockOnEdit = jest.fn()
  const mockOnArchive = jest.fn()
  const mockOnCall = jest.fn()
  const mockOnEmail = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display partner information correctly', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onEdit={mockOnEdit}
        onArchive={mockOnArchive}
        onCall={mockOnCall}
        onEmail={mockOnEmail}
      />
    )

    expect(screen.getByText('Jean Dupont')).toBeInTheDocument()
    expect(screen.getByText('Cabinet Dupont')).toBeInTheDocument()
    expect(screen.getByText("Avocat d'affaires")).toBeInTheDocument()
    expect(screen.getByText('jean.dupont@example.com')).toBeInTheDocument()
    expect(screen.getByText('01 23 45 67 89')).toBeInTheDocument()
  })

  it('should display rating with stars', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onEdit={mockOnEdit}
        onArchive={mockOnArchive}
        onCall={mockOnCall}
        onEmail={mockOnEmail}
      />
    )

    // 4 étoiles pleines doivent être affichées
    const stars = screen.getAllByTestId('star-filled')
    expect(stars).toHaveLength(4)
  })

  it('should call onCall when phone number is clicked', async () => {
    const user = userEvent.setup()

    render(
      <PartnerCard
        partner={mockPartner}
        onEdit={mockOnEdit}
        onArchive={mockOnArchive}
        onCall={mockOnCall}
        onEmail={mockOnEmail}
      />
    )

    const phoneLink = screen.getByText('01 23 45 67 89')
    await user.click(phoneLink)

    expect(mockOnCall).toHaveBeenCalledWith('0123456789')
  })

  it('should call onEmail when email is clicked', async () => {
    const user = userEvent.setup()

    render(
      <PartnerCard
        partner={mockPartner}
        onEdit={mockOnEdit}
        onArchive={mockOnArchive}
        onCall={mockOnCall}
        onEmail={mockOnEmail}
      />
    )

    const emailLink = screen.getByText('jean.dupont@example.com')
    await user.click(emailLink)

    expect(mockOnEmail).toHaveBeenCalledWith('jean.dupont@example.com')
  })

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <PartnerCard
        partner={mockPartner}
        onEdit={mockOnEdit}
        onArchive={mockOnArchive}
        onCall={mockOnCall}
        onEmail={mockOnEmail}
      />
    )

    const editButton = screen.getByRole('button', { name: /modifier/i })
    await user.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith('1')
  })
})
