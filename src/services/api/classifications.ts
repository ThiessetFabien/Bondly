import { db } from '@/lib/db'

// Types pour les classifications et résultats de base de données
export interface Classification {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

interface ClassificationRow {
  id: string
  name: string
  description?: string
  created_at: Date
  updated_at?: Date
  partner_count?: number | string
}

interface CountRow {
  count: string
}

/**
 * Service pour la gestion des classifications
 * Centralise toute la logique métier liée aux classifications
 */
export class ClassificationService {
  /**
   * Récupère toutes les classifications avec le nombre de partenaires associés
   */
  async getClassifications(): Promise<
    (Classification & { partnerCount: number })[]
  > {
    const query = `
      SELECT 
        c.id,
        c.name,
        '' as description,
        c.created_at,
        c.created_at as updated_at,
        COUNT(pc.partner_id) as partner_count
      FROM classifications c
      LEFT JOIN partner_classifications pc ON c.name = pc.classification_name
      GROUP BY c.id, c.name, c.created_at
      ORDER BY c.name ASC
    `

    try {
      const result = await db.query<ClassificationRow>(query)

      return result.map((row: ClassificationRow) => ({
        id: row.id,
        name: row.name,
        description: row.description || null,
        created_at: row.created_at.toISOString(),
        updated_at:
          row.updated_at?.toISOString() || row.created_at.toISOString(),
        partnerCount: parseInt(String(row.partner_count || '0')) || 0,
      }))
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des classifications:',
        error
      )
      throw new Error('Impossible de récupérer les classifications')
    }
  }

  /**
   * Récupère une classification par son ID
   */
  async getClassificationById(id: string): Promise<Classification | null> {
    const query = 'SELECT * FROM classifications WHERE id = $1'

    try {
      const result = await db.query<ClassificationRow>(query, [id])

      if (result.length === 0) {
        return null
      }

      const row = result[0]
      return {
        id: row.id,
        name: row.name,
        description: row.description || null,
        created_at: row.created_at.toISOString(),
        updated_at:
          row.updated_at?.toISOString() || row.created_at.toISOString(),
      }
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de la classification:',
        error
      )
      throw new Error('Impossible de récupérer la classification')
    }
  }

  /**
   * Récupère une classification par son nom
   */
  async getClassificationByName(name: string): Promise<Classification | null> {
    const query = 'SELECT * FROM classifications WHERE LOWER(name) = LOWER($1)'

    try {
      const result = await db.query<ClassificationRow>(query, [name])

      if (result.length === 0) {
        return null
      }

      const row = result[0]
      return {
        id: row.id,
        name: row.name,
        description: row.description || null,
        created_at: row.created_at.toISOString(),
        updated_at:
          row.updated_at?.toISOString() || row.created_at.toISOString(),
      }
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de la classification:',
        error
      )
      throw new Error('Impossible de récupérer la classification')
    }
  }

  /**
   * Crée une nouvelle classification
   */
  async createClassification(
    name: string,
    description?: string
  ): Promise<Classification> {
    const query = `
      INSERT INTO classifications (name, description)
      VALUES ($1, $2)
      RETURNING *
    `

    try {
      const result = await db.query<ClassificationRow>(query, [
        name,
        description || null,
      ])
      const row = result[0]

      return {
        id: row.id,
        name: row.name,
        description: row.description || null,
        created_at: row.created_at.toISOString(),
        updated_at:
          row.updated_at?.toISOString() || row.created_at.toISOString(),
      }
    } catch (error) {
      console.error('Erreur lors de la création de la classification:', error)
      throw new Error('Impossible de créer la classification')
    }
  }

  /**
   * Met à jour une classification
   */
  async updateClassification(
    id: string,
    name?: string,
    description?: string
  ): Promise<Classification | null> {
    const updates: string[] = []
    const values: (string | null)[] = []
    let paramIndex = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`)
      values.push(name)
      paramIndex++
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`)
      values.push(description)
      paramIndex++
    }

    if (updates.length === 0) {
      return await this.getClassificationById(id)
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    const query = `
      UPDATE classifications 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *
    `
    values.push(id)

    try {
      const result = await db.query<ClassificationRow>(query, values)

      if (result.length === 0) {
        return null
      }

      const row = result[0]
      return {
        id: row.id,
        name: row.name,
        description: row.description || null,
        created_at: row.created_at.toISOString(),
        updated_at:
          row.updated_at?.toISOString() || row.created_at.toISOString(),
      }
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de la classification:',
        error
      )
      throw new Error('Impossible de mettre à jour la classification')
    }
  }

  /**
   * Supprime une classification
   */
  async deleteClassification(id: string): Promise<boolean> {
    // Vérifier s'il y a des partenaires associés
    const checkQuery =
      'SELECT COUNT(*) as count FROM partner_classifications WHERE classification_id = $1'

    try {
      const checkResult = await db.query<CountRow>(checkQuery, [id])
      const count = parseInt(checkResult[0].count)

      if (count > 0) {
        throw new Error(
          'Impossible de supprimer une classification utilisée par des partenaires'
        )
      }

      const deleteQuery = 'DELETE FROM classifications WHERE id = $1'
      const result = await db.query<ClassificationRow>(deleteQuery, [id])

      return result.length > 0
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de la classification:',
        error
      )
      throw error instanceof Error
        ? error
        : new Error('Impossible de supprimer la classification')
    }
  }
}

// Instance singleton
export const classificationService = new ClassificationService()
