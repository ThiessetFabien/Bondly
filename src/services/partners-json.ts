/**
 * Service Partners JSON - VERSION SIMPLIFIÉE
 * Service de base pour les partenaires sans dépendances complexes
 */

import type { Partner } from '../shared/types'

// Service minimal pour l'instant
export const PARTNER_CARDS_DATA: readonly Partner[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    description: 'Notaire expérimentée spécialisée en immobilier',
    email: 'marie.dubois@notaire.fr',
    phone: '+33 1 23 45 67 89',
    website: 'https://notaire-dubois.fr',
    address: '123 Rue de la République, 75001 Paris',
    classifications: ['legal', 'real-estate'],
    isActive: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Jean Martin',
    description: 'Expert comptable pour PME et indépendants',
    email: 'jean.martin@expert-comptable.fr',
    phone: '+33 1 98 76 54 32',
    website: 'https://martin-comptable.fr',
    address: '456 Avenue des Champs, 75008 Paris',
    classifications: ['finance', 'business'],
    isActive: true,
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2024-05-15T11:45:00Z',
  },
] as const

// API simple pour compatibilité
export const getPartners = () => PARTNER_CARDS_DATA
export const getPartnerById = (id: string) =>
  PARTNER_CARDS_DATA.find(p => p.id === id)
export const getPartnersByClassification = (classification: string) =>
  PARTNER_CARDS_DATA.filter(p => p.classifications.includes(classification))
