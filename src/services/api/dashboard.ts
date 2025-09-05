import { db } from '@/lib/db'
import type { Partner } from '@/shared/types/Partner'

// Interface pour les résultats de base de données Partner
interface PartnerRow {
  id: string
  firstname: string
  lastname: string
  job: string
  email: string
  phone: string
  company: string
  rating: number
  status: 'active' | 'archived' | 'blacklisted'
  comment: string
  classifications: string[]
  created_at: string
  updated_at: string
}

// Interfaces pour les statistiques
interface TotalStatsRow {
  total?: string
}

interface ActiveStatsRow {
  active?: string
}

interface AverageStatsRow {
  average?: string
}

interface RecentStatsRow {
  recent?: string
}

interface ClassificationCountRow {
  name: string
  count: string
}

interface StatusDistributionRow {
  status: string
  count: string
}

interface RatingDistributionRow {
  rating: number
  count: string
}

interface MonthlyStatsRow {
  month: string
  count: string
}

/**
 * Service pour les statistiques du dashboard
 * Centralise toute la logique métier liée aux données du dashboard
 */
export class DashboardService {
  /**
   * Récupère les statistiques générales du dashboard
   */
  async getDashboardStats() {
    try {
      // Statistiques générales
      const totalPartnersQuery = `SELECT COUNT(*) as total FROM partners`
      const activePartnersQuery = `SELECT COUNT(*) as active FROM partners WHERE status = 'active'`
      const averageRatingQuery = `SELECT AVG(rating) as average FROM partners WHERE rating IS NOT NULL`
      const recentPartnersQuery = `SELECT COUNT(*) as recent FROM partners WHERE created_at >= NOW() - INTERVAL '30 days'`

      // Top classifications
      const topClassificationsQuery = `
        SELECT 
          c.name,
          COUNT(pc.partner_id) as count
        FROM classifications c
        LEFT JOIN partner_classifications pc ON c.id = pc.classification_id
        GROUP BY c.id, c.name
        ORDER BY count DESC
        LIMIT 5
      `

      // Répartition par statut
      const statusDistributionQuery = `
        SELECT 
          status,
          COUNT(*) as count
        FROM partners
        GROUP BY status
      `

      // Répartition par rating
      const ratingDistributionQuery = `
        SELECT 
          rating,
          COUNT(*) as count
        FROM partners
        WHERE rating IS NOT NULL
        GROUP BY rating
        ORDER BY rating ASC
      `

      const [
        totalResult,
        activeResult,
        averageResult,
        topClassificationsResult,
        statusDistributionResult,
        ratingDistributionResult,
        recentResult,
      ] = await Promise.all([
        db.query<TotalStatsRow>(totalPartnersQuery),
        db.query<ActiveStatsRow>(activePartnersQuery),
        db.query<AverageStatsRow>(averageRatingQuery),
        db.query<ClassificationCountRow>(topClassificationsQuery),
        db.query<StatusDistributionRow>(statusDistributionQuery),
        db.query<RatingDistributionRow>(ratingDistributionQuery),
        db.query<RecentStatsRow>(recentPartnersQuery),
      ])

      return {
        totalPartners: parseInt(totalResult[0]?.total || '0'),
        activePartners: parseInt(activeResult[0]?.active || '0'),
        averageRating: parseFloat(averageResult[0]?.average || '0'),
        recentPartners: parseInt(recentResult[0]?.recent || '0'),
        topClassifications: topClassificationsResult.map(
          (row: ClassificationCountRow) => ({
            name: row.name,
            count: parseInt(row.count),
          })
        ),
        statusDistribution: statusDistributionResult.map(
          (row: StatusDistributionRow) => ({
            status: row.status,
            count: parseInt(row.count),
          })
        ),
        ratingDistribution: ratingDistributionResult.map(
          (row: RatingDistributionRow) => ({
            rating: row.rating,
            count: parseInt(row.count),
          })
        ),
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw new Error(
        'Erreur lors de la récupération des statistiques du dashboard'
      )
    }
  }

  /**
   * Récupère les partenaires les mieux notés
   */
  async getTopRatedPartners(limit: number = 10): Promise<Partner[]> {
    const query = `
      SELECT 
        p.*,
        COALESCE(
          array_agg(
            DISTINCT c.name 
            ORDER BY c.name
          ) FILTER (WHERE c.name IS NOT NULL), 
          ARRAY[]::text[]
        ) as classifications
      FROM partners p
      LEFT JOIN partner_classifications pc ON p.id = pc.partner_id
      LEFT JOIN classifications c ON pc.classification_id = c.id
      WHERE p.rating IS NOT NULL
      GROUP BY p.id
      ORDER BY p.rating DESC, p.lastname ASC
      LIMIT $1
    `

    try {
      const result = await db.query<PartnerRow>(query, [limit])

      return result.map((row: PartnerRow) => ({
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        job: row.job,
        email: row.email,
        phone: row.phone,
        company: row.company,
        rating: row.rating,
        status: row.status,
        comment: row.comment || '',
        classifications: row.classifications || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des partenaires les mieux notés:',
        error
      )
      throw new Error(
        'Erreur lors de la récupération des partenaires les mieux notés'
      )
    }
  }

  /**
   * Récupère les partenaires récemment ajoutés
   */
  async getRecentPartners(limit: number = 10): Promise<Partner[]> {
    const query = `
      SELECT 
        p.*,
        COALESCE(
          array_agg(
            DISTINCT c.name 
            ORDER BY c.name
          ) FILTER (WHERE c.name IS NOT NULL), 
          ARRAY[]::text[]
        ) as classifications
      FROM partners p
      LEFT JOIN partner_classifications pc ON p.id = pc.partner_id
      LEFT JOIN classifications c ON pc.classification_id = c.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT $1
    `

    try {
      const result = await db.query<PartnerRow>(query, [limit])

      return result.map((row: PartnerRow) => ({
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        job: row.job,
        email: row.email,
        phone: row.phone,
        company: row.company,
        rating: row.rating,
        status: row.status,
        comment: row.comment || '',
        classifications: row.classifications || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des partenaires récents:',
        error
      )
      throw new Error('Erreur lors de la récupération des partenaires récents')
    }
  }

  /**
   * Récupère les statistiques d'évolution mensuelle
   */
  async getMonthlyGrowthStats() {
    const query = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM partners
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `

    try {
      const result = await db.query<MonthlyStatsRow>(query)

      return result.map((row: MonthlyStatsRow) => ({
        month: row.month,
        count: parseInt(row.count),
      }))
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques mensuelles:',
        error
      )
      throw new Error('Impossible de récupérer les statistiques mensuelles')
    }
  }
}

// Instance singleton
export const dashboardService = new DashboardService()
