import { db } from './db'
import type {
  CreatePartnerRequest,
  DashboardStats,
  Partner,
  PartnerClassification,
  UpdatePartnerRequest,
} from './types'

export class PartnerService {
  /**
   * Récupère tous les partenaires avec filtres et paginat    const stat = stats[0]
    return {
      totalPartners: parseInt(stat?.total_partners || '0'),
      activePartners: parseInt(stat?.active_partners || '0'),
      averageRating: parseFloat(stat?.average_rating || '0'),
      recentPartners: recentPartners.length,
      topClassifications: classificationStats.map(item => ({
        name: item.name,
        count: parseInt(item.count)
      })),
      statusDistribution: statusStats.map(item => ({
        status: item.status,
        count: parseInt(item.count)
      })),
      ratingDistribution: ratingStats.map(item => ({
        rating: parseFloat(item.rating),
        count: parseInt(item.count)
      }))
    } getPartners(
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
    const values: unknown[] = []
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
      conditions.push(`LOWER(job) = LOWER($${paramIndex})`)
      values.push(job)
      paramIndex++
    }

    if (classification) {
      conditions.push(`id IN (
        SELECT partner_id FROM partner_classifications 
        WHERE LOWER(classification_name) = LOWER($${paramIndex})
      )`)
      values.push(classification)
      paramIndex++
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Validation du tri
    const validSortFields = [
      'firstname',
      'lastname',
      'company',
      'rating',
      'created_at',
      'updated_at',
    ]
    const actualSortBy = validSortFields.includes(sortBy) ? sortBy : 'lastname'
    const actualSortOrder = sortOrder === 'desc' ? 'DESC' : 'ASC'

    // Requête pour compter le total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM partners 
      ${whereClause}
    `
    const countResult = await db.query<{ total: string }>(countQuery, values)
    const total = parseInt(countResult[0]?.total || '0')

    // Requête principale avec pagination
    const query = `
      SELECT 
        id, firstname, lastname, job, email, phone, company, 
        rating, status, comment, created_at, updated_at
      FROM partners 
      ${whereClause}
      ORDER BY ${actualSortBy} ${actualSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    values.push(limit, offset)
    const partners = await db.query<Partner>(query, values)

    // Récupérer les classifications pour chaque partenaire
    const partnersWithClassifications =
      await this.addClassificationsToPartners(partners)

    return {
      data: partnersWithClassifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Récupère un partenaire par ID
   */
  async getPartnerById(id: string): Promise<Partner | null> {
    const query = `
      SELECT 
        id, firstname, lastname, job, email, phone, company, 
        rating, status, comment, created_at, updated_at
      FROM partners 
      WHERE id = $1
    `
    const partners = await db.query<Partner>(query, [id])

    if (partners.length === 0) return null

    const [partnerWithClassifications] =
      await this.addClassificationsToPartners([partners[0]])
    return partnerWithClassifications
  }

  /**
   * Crée un nouveau partenaire
   */
  async createPartner(data: CreatePartnerRequest): Promise<Partner> {
    const query = `
      INSERT INTO partners (firstname, lastname, job, email, phone, company, rating, comment)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, firstname, lastname, job, email, phone, company, rating, status, comment, created_at, updated_at
    `

    const values = [
      data.firstname,
      data.lastname,
      data.job,
      data.email || null,
      data.phone || null,
      data.company,
      data.rating || null,
      data.comment || null,
    ]

    const partners = await db.query<Partner>(query, values)
    const partner = partners[0]

    // Ajouter les classifications si présentes
    if (data.classifications && data.classifications.length > 0) {
      await this.updatePartnerClassifications(partner.id, data.classifications)
    }

    const [partnerWithClassifications] =
      await this.addClassificationsToPartners([partner])
    return partnerWithClassifications
  }

  /**
   * Met à jour un partenaire
   */
  async updatePartner(
    id: string,
    data: UpdatePartnerRequest
  ): Promise<Partner | null> {
    const fields: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    // Construction de la requête UPDATE dynamique
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'classifications' && value !== undefined) {
        fields.push(`${key} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    })

    if (fields.length === 0 && !data.classifications) {
      throw new Error('Aucune donnée à mettre à jour')
    }

    if (fields.length > 0) {
      const query = `
        UPDATE partners 
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramIndex}
        RETURNING id, firstname, lastname, job, email, phone, company, rating, status, comment, created_at, updated_at
      `
      values.push(id)

      const partners = await db.query<Partner>(query, values)
      if (partners.length === 0) return null
    }

    // Mettre à jour les classifications si présentes
    if (data.classifications !== undefined) {
      await this.updatePartnerClassifications(id, data.classifications)
    }

    return await this.getPartnerById(id)
  }

  /**
   * Supprime un partenaire (soft delete en archive)
   */
  async deletePartner(id: string): Promise<boolean> {
    const query = `
      UPDATE partners 
      SET status = 'archived', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `
    const result = await db.query(query, [id])
    return result.length > 0
  }

  /**
   * Récupère les statistiques du dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    // Stats générales
    const statsQuery = `
      SELECT 
        COUNT(*) as total_partners,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_partners,
        COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_partners,
        COUNT(CASE WHEN status = 'blacklisted' THEN 1 END) as blacklisted_partners,
        ROUND(AVG(rating), 2) as average_rating
      FROM partners
    `
    const stats = await db.query<{
      total_partners: string
      active_partners: string
      archived_partners: string
      blacklisted_partners: string
      average_rating: string
    }>(statsQuery)

    // Répartition par classification
    const classificationQuery = `
      SELECT 
        pc.classification_name,
        COUNT(*) as count
      FROM partner_classifications pc
      JOIN partners p ON p.id = pc.partner_id
      WHERE p.status = 'active'
      GROUP BY pc.classification_name
      ORDER BY count DESC
    `
    const classificationStats = await db.query<{
      classification_name: string
      count: string
    }>(classificationQuery)

    // Partenaires récents
    const recentQuery = `
      SELECT 
        id, firstname, lastname, job, company, rating, status, created_at, updated_at
      FROM partners
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT 5
    `
    const recentPartners = await db.query<Partner>(recentQuery)

    const stat = stats[0]
    return {
      totalPartners: parseInt(stat?.total_partners || '0'),
      activePartners: parseInt(stat?.active_partners || '0'),
      averageRating: parseFloat(stat?.average_rating || '0'),
      recentPartners: recentPartners.length,
      topClassifications: classificationStats.map(item => ({
        name: item.classification_name,
        count: parseInt(item.count),
      })),
      statusDistribution: [
        { status: 'active', count: parseInt(stat?.active_partners || '0') },
        { status: 'archived', count: parseInt(stat?.archived_partners || '0') },
        {
          status: 'blacklisted',
          count: parseInt(stat?.blacklisted_partners || '0'),
        },
      ],
      ratingDistribution: [], // TODO: Implémenter si nécessaire
    }
  }

  /**
   * Ajoute les classifications aux partenaires
   */
  private async addClassificationsToPartners(
    partners: Partner[]
  ): Promise<Partner[]> {
    if (partners.length === 0) return partners

    const partnerIds = partners.map(p => p.id)
    const placeholders = partnerIds
      .map((_, index) => `$${index + 1}`)
      .join(', ')

    const query = `
      SELECT partner_id, classification_name
      FROM partner_classifications
      WHERE partner_id IN (${placeholders})
    `

    const classifications = await db.query<{
      partner_id: string
      classification_name: string
    }>(query, partnerIds)

    const classificationsByPartner = classifications.reduce(
      (acc, item) => {
        if (!acc[item.partner_id]) acc[item.partner_id] = []
        acc[item.partner_id].push(item.classification_name)
        return acc
      },
      {} as Record<string, string[]>
    )

    return partners.map(partner => ({
      ...partner,
      classifications: classificationsByPartner[partner.id] || [],
    }))
  }

  /**
   * Met à jour les classifications d'un partenaire
   */
  private async updatePartnerClassifications(
    partnerId: string,
    classifications: string[]
  ): Promise<void> {
    // Supprimer les anciennes classifications
    await db.query(
      'DELETE FROM partner_classifications WHERE partner_id = $1',
      [partnerId]
    )

    // Ajouter les nouvelles classifications
    if (classifications.length > 0) {
      const values = classifications
        .map((classification, index) => `($1, $${index + 2})`)
        .join(', ')

      const query = `
        INSERT INTO partner_classifications (partner_id, classification_name)
        VALUES ${values}
      `

      await db.query(query, [partnerId, ...classifications])
    }
  }
}

export class ClassificationService {
  /**
   * Récupère toutes les classifications
   */
  async getClassifications(): Promise<PartnerClassification[]> {
    const query = `
      SELECT id, name, created_at
      FROM classifications
      ORDER BY name ASC
    `
    return await db.query<PartnerClassification>(query)
  }

  /**
   * Récupère les classifications utilisées par les partenaires
   */
  async getUsedClassifications(): Promise<
    Array<PartnerClassification & { count: number }>
  > {
    const query = `
      SELECT 
        c.id,
        c.name,
        c.created_at,
        COUNT(pc.partner_id) as count
      FROM classifications c
      LEFT JOIN partner_classifications pc ON pc.classification_name = c.name
      GROUP BY c.id, c.name, c.created_at
      HAVING COUNT(pc.partner_id) > 0
      ORDER BY count DESC, c.name ASC
    `
    const result = await db.query<PartnerClassification & { count: string }>(
      query
    )
    return result.map(item => ({
      ...item,
      count: parseInt(item.count),
    }))
  }

  /**
   * Crée une nouvelle classification
   */
  async createClassification(name: string): Promise<PartnerClassification> {
    const query = `
      INSERT INTO classifications (name)
      VALUES ($1)
      RETURNING id, name, created_at
    `
    const result = await db.query<PartnerClassification>(query, [name])
    return result[0]
  }

  /**
   * Recherche dans les classifications
   */
  async searchClassifications(
    search: string
  ): Promise<PartnerClassification[]> {
    const query = `
      SELECT id, name, created_at
      FROM classifications
      WHERE LOWER(name) LIKE LOWER($1)
      ORDER BY name ASC
    `
    return await db.query<PartnerClassification>(query, [`%${search}%`])
  }
}

export const partnerService = new PartnerService()
export const classificationService = new ClassificationService()
