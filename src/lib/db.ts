import { Pool, PoolClient } from 'pg'

interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl?: boolean
}

const getConfig = (): DatabaseConfig => {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'bondly',
    user: process.env.DB_USER || process.env.USER || 'fabien',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production',
  }
}

class Database {
  private pool: Pool | null = null

  private getPool(): Pool {
    if (!this.pool) {
      const config = getConfig()
      this.pool = new Pool({
        ...config,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })

      this.pool.on('error', (err: Error) => {
        console.error('Unexpected error on idle client', err)
      })
    }
    return this.pool
  }

  async query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[]
  ): Promise<T[]> {
    const pool = this.getPool()
    const client = await pool.connect()
    try {
      const result = await client.query(text, params)
      return result.rows
    } finally {
      client.release()
    }
  }

  async getClient(): Promise<PoolClient> {
    const pool = this.getPool()
    return await pool.connect()
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
    }
  }
}

export const db = new Database()
export default db
