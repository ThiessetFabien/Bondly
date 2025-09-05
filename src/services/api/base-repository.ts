import { db } from '@/lib/db'

/**
 * Repository abstrait définissant les opérations CRUD de base
 * Respecte l'Interface Segregation Principle
 */
export abstract class BaseRepository<T, TCreate, TUpdate> {
  protected abstract tableName: string

  /**
   * Trouve un enregistrement par ID
   */
  abstract findById(id: string): Promise<T | null>

  /**
   * Trouve tous les enregistrements avec des critères optionnels
   */
  abstract findAll(criteria?: Record<string, unknown>): Promise<T[]>

  /**
   * Crée un nouvel enregistrement
   */
  abstract create(data: TCreate): Promise<T>

  /**
   * Met à jour un enregistrement existant
   */
  abstract update(id: string, data: TUpdate): Promise<T | null>

  /**
   * Supprime un enregistrement
   */
  abstract delete(id: string): Promise<boolean>

  /**
   * Compte le nombre total d'enregistrements
   */
  async count(whereClause = '', values: unknown[] = []): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`
    const result = await db.query<{ total: string }>(query, values)
    return parseInt(result[0]?.total || '0')
  }

  /**
   * Exécute une requête personnalisée
   */
  protected async executeQuery<TResult>(
    query: string,
    values: unknown[] = []
  ): Promise<TResult[]> {
    return db.query<TResult>(query, values)
  }
}

/**
 * Interface pour les repositories avec pagination
 */
export interface PaginatedRepository<T> {
  findWithPagination(
    page: number,
    limit: number,
    criteria?: Record<string, unknown>
  ): Promise<{ data: T[]; total: number }>
}

/**
 * Interface pour les repositories avec recherche
 */
export interface SearchableRepository<T> {
  search(term: string, fields: string[], limit?: number): Promise<T[]>
}
