import { db } from '@/lib/db'
import {
  handleDatabaseError,
  logOperation,
  validatePartnerInput,
} from '@/lib/mvp-helpers'
import type {
  CreatePartnerRequest,
  GetPartnersParams,
  PaginatedResponse,
  Partner,
  UpdatePartnerRequest,
} from '@/lib/types'

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

interface CountRow {
  total: string
}

/**
 * Service pour la gestion des partenaires
 * Centralise toute la logique métier liée aux partenaires
 */
export class PartnerService {
  /**
   * Récupère tous les partenaires avec filtres et pagination
   */
  async getPartners(
    params: GetPartnersParams = {}
  ): Promise<PaginatedResponse<Partner>> {
    const {
      page = 1,
      limit = 20,
      search = '',
      status,
      classification,
      sortBy = 'lastname',
      sortOrder = 'asc',
      job,
    } = params

    const offset = (page - 1) * limit
    const conditions: string[] = []
    const values: (string | number)[] = []
    let paramIndex = 1

    // Construction des conditions WHERE
    if (search) {
      conditions.push(`(
        LOWER(firstname) LIKE LOWER($${paramIndex}) OR 
        LOWER(lastname) LIKE LOWER($${paramIndex}) OR 
        LOWER(company) LIKE LOWER($${paramIndex}) OR 
        LOWER(job) LIKE LOWER($${paramIndex}) OR
        LOWER(email) LIKE LOWER($${paramIndex}) OR
        phone LIKE $${paramIndex}
      )`)
      values.push(`%${search}%`)
      paramIndex++
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`)
      values.push(status)
      paramIndex++
    }

    if (job) {
      conditions.push(`LOWER(job) LIKE LOWER($${paramIndex})`)
      values.push(`%${job}%`)
      paramIndex++
    }

    if (classification) {
      conditions.push(`EXISTS (
        SELECT 1 FROM partner_classifications pc 
        JOIN classifications c ON pc.classification_name = c.name 
        WHERE pc.partner_id = partners.id 
        AND LOWER(c.name) = LOWER($${paramIndex})
      )`)
      values.push(classification)
      paramIndex++
    }

    // Construction de la requête principale
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const orderClause = `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`

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
      LEFT JOIN classifications c ON pc.classification_name = c.name
      ${whereClause}
      GROUP BY p.id
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    values.push(limit, offset)

    try {
      // Requête pour les données
      const result = await db.query<PartnerRow>(query, values)

      // Requête pour le compte total
      const countQuery = `
        SELECT COUNT(DISTINCT p.id) as total
        FROM partners p
        LEFT JOIN partner_classifications pc ON p.id = pc.partner_id
        LEFT JOIN classifications c ON pc.classification_name = c.name
        ${whereClause}
      `

      const countResult = await db.query<CountRow>(
        countQuery,
        values.slice(0, -2)
      )
      const total = parseInt(countResult[0].total)

      const partners = result.map((row: PartnerRow) => ({
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        job: row.job,
        email: row.email,
        phone: row.phone,
        company: row.company,
        rating: row.rating,
        status: row.status,
        comment: row.comment,
        classifications: row.classifications || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))

      return {
        data: partners,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des partenaires:', error)
      throw new Error('Impossible de récupérer les partenaires')
    }
  }

  /**
   * Récupère un partenaire par son ID
   */
  async getPartnerById(id: string): Promise<Partner | null> {
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
      LEFT JOIN classifications c ON pc.classification_name = c.name
      WHERE p.id = $1
      GROUP BY p.id
    `

    try {
      const result = await db.query<PartnerRow>(query, [id])

      if (result.length === 0) {
        return null
      }

      const row = result[0]
      return {
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        job: row.job,
        email: row.email,
        phone: row.phone,
        company: row.company,
        rating: row.rating,
        status: row.status,
        comment: row.comment,
        classifications: row.classifications || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du partenaire:', error)
      throw new Error('Impossible de récupérer le partenaire')
    }
  }

  /**
   * Crée un nouveau partenaire
   */
  async createPartner(data: CreatePartnerRequest): Promise<Partner> {
    // Validation simple mais robuste
    const validationErrors = validatePartnerInput(data)
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`)
    }

    logOperation('CREATE_PARTNER', { company: data.company, email: data.email })

    const query = `
      INSERT INTO partners (firstname, lastname, job, email, phone, company, rating, comment, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
      RETURNING *
    `

    const values = [
      data.firstname.trim(),
      data.lastname.trim(),
      data.job?.trim() || null,
      data.email?.trim() || null,
      data.phone?.trim() || null,
      data.company.trim(),
      data.rating || 3,
      data.comment?.trim() || null,
    ]

    try {
      const result = await db.query<PartnerRow>(query, values)
      const partner = result[0]

      // Ajouter les classifications si spécifiées
      if (data.classifications && data.classifications.length > 0) {
        await this.updatePartnerClassifications(
          partner.id,
          data.classifications
        )
      }

      const createdPartner = await this.getPartnerById(partner.id)
      if (!createdPartner) {
        throw new Error('Impossible de récupérer le partenaire créé')
      }

      return createdPartner
    } catch (error) {
      logOperation('CREATE_PARTNER_ERROR', {
        error: error instanceof Error ? error.message : String(error),
      })
      const dbError = handleDatabaseError(error)
      throw new Error(dbError.error)
    }
  }

  /**
   * Met à jour un partenaire
   */
  async updatePartner(
    id: string,
    data: UpdatePartnerRequest
  ): Promise<Partner | null> {
    const updates: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    // Construction dynamique de la requête UPDATE
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'classifications' && value !== undefined) {
        updates.push(`${key} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    })

    if (updates.length === 0 && !data.classifications) {
      // Aucune mise à jour nécessaire
      return await this.getPartnerById(id)
    }

    try {
      // Mise à jour des champs principaux si nécessaire
      if (updates.length > 0) {
        updates.push(`updated_at = CURRENT_TIMESTAMP`)
        const updateQuery = `
          UPDATE partners 
          SET ${updates.join(', ')} 
          WHERE id = $${paramIndex}
          RETURNING *
        `
        values.push(id)

        await db.query<PartnerRow>(updateQuery, values)
      }

      // Mise à jour des classifications si spécifiées
      if (data.classifications !== undefined) {
        await this.updatePartnerClassifications(id, data.classifications)
      }

      // Récupérer le partenaire mis à jour
      return await this.getPartnerById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du partenaire:', error)
      throw new Error('Impossible de mettre à jour le partenaire')
    }
  }

  /**
   * Supprime un partenaire
   */
  async deletePartner(id: string): Promise<boolean> {
    const query = 'DELETE FROM partners WHERE id = $1'

    try {
      const result = await db.query<PartnerRow>(query, [id])
      return result.length > 0
    } catch (error) {
      console.error('Erreur lors de la suppression du partenaire:', error)
      throw new Error('Impossible de supprimer le partenaire')
    }
  }

  /**
   * Met à jour les classifications d'un partenaire
   * @private
   */
  private async updatePartnerClassifications(
    partnerId: string,
    classifications: string[]
  ): Promise<void> {
    try {
      // Supprimer les anciennes classifications
      await db.query<PartnerRow>(
        'DELETE FROM partner_classifications WHERE partner_id = $1',
        [partnerId]
      )

      // Ajouter les nouvelles classifications
      if (classifications.length > 0) {
        // Récupérer les IDs des classifications
        const classificationQuery = `
          SELECT id, name FROM classifications 
          WHERE name = ANY($1)
        `
        const classificationResult = await db.query<PartnerRow>(
          classificationQuery,
          [classifications]
        )

        // Insérer les nouvelles associations
        for (const classification of classificationResult) {
          await db.query<PartnerRow>(
            'INSERT INTO partner_classifications (partner_id, classification_id) VALUES ($1, $2)',
            [partnerId, classification.id]
          )
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des classifications:', error)
      throw new Error('Impossible de mettre à jour les classifications')
    }
  }
}

// Instance singleton
export const partnerService = new PartnerService()
