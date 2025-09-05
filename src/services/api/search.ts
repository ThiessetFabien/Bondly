import { db } from '@/lib/db'
import type { Partner, PartnerStatus } from '@/shared/types/Partner'

// Interface pour les résultats de base de données
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

/**
 * Service pour la recherche globale
 * Centralise toute la logique métier liée à la recherche
 */
export class SearchService {
  /**
   * Effectue une recherche globale dans les partenaires
   */
  async globalSearch(
    query: string,
    limit: number = 20
  ): Promise<{
    partners: Partner[]
    total: number
  }> {
    if (!query.trim()) {
      return { partners: [], total: 0 }
    }

    const searchQuery = `
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
      WHERE 
        p.status = 'active' AND
        (
          LOWER(p.firstname) LIKE LOWER($1) OR
          LOWER(p.lastname) LIKE LOWER($1) OR
          LOWER(p.job) LIKE LOWER($1) OR
          LOWER(p.company) LIKE LOWER($1) OR
          LOWER(p.email) LIKE LOWER($1) OR
          EXISTS (
            SELECT 1 FROM classifications c2
            JOIN partner_classifications pc2 ON c2.id = pc2.classification_id
            WHERE pc2.partner_id = p.id AND LOWER(c2.name) LIKE LOWER($1)
          )
        )
      GROUP BY p.id
      ORDER BY 
        CASE 
          WHEN LOWER(p.lastname) LIKE LOWER($2) THEN 1
          WHEN LOWER(p.firstname) LIKE LOWER($2) THEN 2
          WHEN LOWER(p.company) LIKE LOWER($2) THEN 3
          ELSE 4
        END,
        p.rating DESC NULLS LAST,
        p.lastname ASC
      LIMIT $3
    `

    const searchTerm = `%${query}%`
    const exactSearchTerm = `${query}%`

    try {
      const searchResult = await db.query<PartnerRow>(searchQuery, [
        searchTerm,
        exactSearchTerm,
        limit,
      ])

      const partners = searchResult.map((row: PartnerRow) => ({
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        job: row.job,
        email: row.email,
        phone: row.phone,
        company: row.company,
        rating: row.rating,
        status: row.status as PartnerStatus,
        comment: row.comment || '',
        classifications: row.classifications || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))

      // Compter le total sans limite
      const countQuery = `
        SELECT COUNT(DISTINCT p.id) as total
        FROM partners p
        LEFT JOIN partner_classifications pc ON p.id = pc.partner_id
        LEFT JOIN classifications c ON pc.classification_id = c.id
        WHERE 
          p.status = 'active' AND
          (
            LOWER(p.firstname) LIKE LOWER($1) OR
            LOWER(p.lastname) LIKE LOWER($1) OR
            LOWER(p.job) LIKE LOWER($1) OR
            LOWER(p.company) LIKE LOWER($1) OR
            LOWER(p.email) LIKE LOWER($1) OR
            EXISTS (
              SELECT 1 FROM classifications c2
              JOIN partner_classifications pc2 ON c2.id = pc2.classification_id
              WHERE pc2.partner_id = p.id AND LOWER(c2.name) LIKE LOWER($1)
            )
          )
      `

      const countResult = await db.query<{ total: string }>(countQuery, [
        searchTerm,
      ])
      const total = parseInt(countResult[0]?.total || '0')

      return { partners, total }
    } catch (error) {
      console.error('Erreur lors de la recherche globale:', error)
      throw new Error('Erreur lors de la recherche')
    }
  }

  /**
   * Recherche par profession/métier
   */
  async searchByProfession(
    profession: string,
    limit: number = 20
  ): Promise<{
    partners: Partner[]
    total: number
  }> {
    if (!profession.trim()) {
      return { partners: [], total: 0 }
    }

    const searchQuery = `
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
      WHERE 
        p.status = 'active' AND
        LOWER(p.job) LIKE LOWER($1)
      GROUP BY p.id
      ORDER BY p.rating DESC NULLS LAST, p.lastname ASC
      LIMIT $2
    `

    const searchTerm = `%${profession}%`

    try {
      const searchResult = await db.query<PartnerRow>(searchQuery, [
        searchTerm,
        limit,
      ])

      const partners = searchResult.map((row: PartnerRow) => ({
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        job: row.job,
        email: row.email,
        phone: row.phone,
        company: row.company,
        rating: row.rating,
        status: row.status as PartnerStatus,
        comment: row.comment || '',
        classifications: row.classifications || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))

      // Compter le total
      const countQuery = `
        SELECT COUNT(*) as total
        FROM partners p
        WHERE p.status = 'active' AND LOWER(p.job) LIKE LOWER($1)
      `

      const countResult = await db.query<{ total: string }>(countQuery, [
        searchTerm,
      ])
      const total = parseInt(countResult[0]?.total || '0')

      return { partners, total }
    } catch (error) {
      console.error('Erreur lors de la recherche par profession:', error)
      throw new Error('Erreur lors de la recherche par profession')
    }
  }

  /**
   * Suggestions de recherche basées sur les termes populaires
   */
  async getSearchSuggestions(
    query: string,
    limit: number = 5
  ): Promise<{
    professions: string[]
    companies: string[]
    classifications: string[]
  }> {
    if (!query.trim()) {
      return { professions: [], companies: [], classifications: [] }
    }

    const searchTerm = `%${query}%`

    try {
      // Suggestions de professions
      const professionsQuery = `
        SELECT DISTINCT job
        FROM partners
        WHERE status = 'active' AND LOWER(job) LIKE LOWER($1)
        ORDER BY job
        LIMIT $2
      `

      // Suggestions de sociétés
      const companiesQuery = `
        SELECT DISTINCT company
        FROM partners
        WHERE status = 'active' AND LOWER(company) LIKE LOWER($1)
        ORDER BY company
        LIMIT $2
      `

      // Suggestions de classifications
      const classificationsQuery = `
        SELECT DISTINCT name
        FROM classifications
        WHERE LOWER(name) LIKE LOWER($1)
        ORDER BY name
        LIMIT $2
      `

      const [professionsResult, companiesResult, classificationsResult] =
        await Promise.all([
          db.query<{ job: string }>(professionsQuery, [searchTerm, limit]),
          db.query<{ company: string }>(companiesQuery, [searchTerm, limit]),
          db.query<{ name: string }>(classificationsQuery, [searchTerm, limit]),
        ])

      return {
        professions: professionsResult.map((row: { job: string }) => row.job),
        companies: companiesResult.map(
          (row: { company: string }) => row.company
        ),
        classifications: classificationsResult.map(
          (row: { name: string }) => row.name
        ),
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error)
      throw new Error('Erreur lors de la récupération des suggestions')
    }
  }

  /**
   * Récupère les métiers les plus populaires
   */
  async getPopularProfessions(
    limit: number = 10
  ): Promise<Array<{ job: string; count: number }>> {
    const query = `
      SELECT job, COUNT(*) as count
      FROM partners
      WHERE status = 'active' AND job IS NOT NULL AND job != ''
      GROUP BY job
      ORDER BY count DESC, job ASC
      LIMIT $1
    `

    try {
      const result = await db.query<{ job: string; count: string }>(query, [
        limit,
      ])

      return result.map((row: { job: string; count: string }) => ({
        job: row.job,
        count: parseInt(row.count),
      }))
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des professions populaires:',
        error
      )
      throw new Error(
        'Erreur lors de la récupération des professions populaires'
      )
    }
  }
}

// Instance singleton
export const searchService = new SearchService()
