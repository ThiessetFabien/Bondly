/**
 * Query Builder pour construire des requêtes SQL dynamiques
 * Respecte le principe SRP en séparant la logique de construction de requêtes
 */
export class QueryBuilder {
  private conditions: string[] = []
  private values: (string | number)[] = []
  private paramIndex = 1

  /**
   * Ajoute une condition de recherche textuelle
   */
  addSearchCondition(search: string, fields: string[]): this {
    if (!search) return this

    const searchConditions = fields
      .map(field => `LOWER(${field}) LIKE LOWER($${this.paramIndex})`)
      .join(' OR ')

    this.conditions.push(`(${searchConditions})`)
    this.values.push(`%${search}%`)
    this.paramIndex++

    return this
  }

  /**
   * Ajoute une condition d'égalité
   */
  addEqualCondition(field: string, value: string | number): this {
    if (value === undefined || value === null) return this

    this.conditions.push(`${field} = $${this.paramIndex}`)
    this.values.push(value)
    this.paramIndex++

    return this
  }

  /**
   * Ajoute une condition LIKE
   */
  addLikeCondition(field: string, value: string): this {
    if (!value) return this

    this.conditions.push(`LOWER(${field}) LIKE LOWER($${this.paramIndex})`)
    this.values.push(`%${value}%`)
    this.paramIndex++

    return this
  }

  /**
   * Ajoute une condition EXISTS pour les classifications
   */
  addClassificationCondition(classification: string): this {
    if (!classification) return this

    this.conditions.push(`EXISTS (
      SELECT 1 FROM partner_classifications pc 
      JOIN classifications c ON pc.classification_name = c.name 
      WHERE pc.partner_id = partners.id 
      AND LOWER(c.name) = LOWER($${this.paramIndex})
    )`)
    this.values.push(classification)
    this.paramIndex++

    return this
  }

  /**
   * Construit la clause WHERE
   */
  buildWhereClause(): string {
    return this.conditions.length > 0
      ? `WHERE ${this.conditions.join(' AND ')}`
      : ''
  }

  /**
   * Retourne les valeurs des paramètres
   */
  getValues(): (string | number)[] {
    return this.values
  }

  /**
   * Retourne l'index actuel des paramètres
   */
  getCurrentParamIndex(): number {
    return this.paramIndex
  }

  /**
   * Ajoute des valeurs supplémentaires (pour limit/offset)
   */
  addValues(...values: (string | number)[]): void {
    this.values.push(...values)
  }
}
