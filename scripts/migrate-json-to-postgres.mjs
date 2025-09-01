#!/usr/bin/env node

/**
 * Script de migration des données JSON vers PostgreSQL (ESM)
 *
 * Usage: node scripts/migrate-json-to-postgres.mjs
 */

import fs from 'fs'
import path from 'path'
import pkg from 'pg'
import { fileURLToPath } from 'url'
const { Pool } = pkg

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configuration de la base de données avec variables d'environnement par défaut
const pool = new Pool({
  user: process.env.DB_USER || 'fabien',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bondly',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
})

async function migrateData() {
  try {
    console.log('🚀 Début de la migration des données JSON vers PostgreSQL...')

    // Chargement des données JSON
    const partnersPath = path.join(__dirname, '../src/data/partners.json')
    const partnersData = JSON.parse(fs.readFileSync(partnersPath, 'utf8'))

    console.log(`📊 ${partnersData.partners.length} partenaires à migrer`)

    // Connexion à la base
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Nettoyer les données existantes (pour permettre la re-migration)
      await client.query('DELETE FROM partner_classifications')
      await client.query('DELETE FROM partner_relations')
      await client.query('DELETE FROM partners WHERE email != $1', [
        'admin@bondly.fr',
      ])

      let imported = 0
      let skipped = 0

      for (const partner of partnersData.partners) {
        try {
          // Insérer le partenaire
          const insertPartner = `
            INSERT INTO partners (firstname, lastname, job, email, phone, company, rating, status, comment, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (email) DO UPDATE SET
              firstname = EXCLUDED.firstname,
              lastname = EXCLUDED.lastname,
              job = EXCLUDED.job,
              phone = EXCLUDED.phone,
              company = EXCLUDED.company,
              rating = EXCLUDED.rating,
              status = EXCLUDED.status,
              comment = EXCLUDED.comment,
              updated_at = EXCLUDED.updated_at
            RETURNING id`

          const partnerResult = await client.query(insertPartner, [
            partner.firstname || '',
            partner.lastname || '',
            partner.job || null,
            partner.email || null,
            partner.phone || null,
            partner.company || '',
            partner.rating || null,
            partner.status || 'active',
            partner.comment || null,
            partner.createdAt ? new Date(partner.createdAt) : new Date(),
            partner.updatedAt ? new Date(partner.updatedAt) : new Date(),
          ])

          const partnerId = partnerResult.rows[0].id

          // Insérer les classifications
          if (
            partner.classifications &&
            Array.isArray(partner.classifications)
          ) {
            for (const classification of partner.classifications) {
              await client.query(
                'INSERT INTO partner_classifications (partner_id, classification_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [partnerId, classification]
              )
            }
          }

          imported++
          console.log(
            `✅ ${partner.firstname} ${partner.lastname} (${partner.company})`
          )
        } catch (error) {
          console.log(
            `⚠️  Erreur pour ${partner.firstname} ${partner.lastname}: ${error.message}`
          )
          skipped++
        }
      }

      await client.query('COMMIT')
      console.log(`\n🎉 Migration terminée !`)
      console.log(`✅ ${imported} partenaires migrés`)
      console.log(`⚠️  ${skipped} partenaires ignorés`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Erreur de migration:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Exécution
migrateData()
