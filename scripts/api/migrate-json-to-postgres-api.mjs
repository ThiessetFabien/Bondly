/**
 * Script de migration des données JSON vers PostgreSQL (complément Sqitch)
 * Execute après: sqitch deploy
 * Usage: node scripts/migrate-json-to-postgres-api.mjs
 */

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import pkg from 'pg'
const { Client } = pkg
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

// Importer les données JSON
import partnersData from '../src/data/partners.json' with { type: 'json' }
import metadataJson from '../src/data/metadata.json' with { type: 'json' }

async function migrateData() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'bondly',
    user: process.env.DB_USER || process.env.USER || 'fabien',
    password: process.env.DB_PASSWORD || '',
  })

  try {
    console.log('🔌 Connexion à la base de données...')
    await client.connect()
    console.log('✅ Connecté à PostgreSQL')

    // Vérifier que Sqitch a été exécuté
    console.log('🔍 Vérification du déploiement Sqitch...')
    try {
      const sqitchCheck = await client.query(
        'SELECT * FROM sqitch.changes ORDER BY committed_at DESC LIMIT 1'
      )
      if (sqitchCheck.rows.length === 0) {
        throw new Error('Aucune migration Sqitch trouvée')
      }
      console.log(
        `✅ Dernière migration Sqitch: ${sqitchCheck.rows[0].change_id}`
      )
    } catch (error) {
      console.error("❌ Sqitch non déployé. Exécutez d'abord: sqitch deploy")
      process.exit(1)
    }

    // Nettoyer seulement les données des partenaires (les classifications de base sont déjà en place)
    console.log('🗑️  Suppression des données de partenaires existantes...')
    await client.query(
      'DELETE FROM partner_classifications WHERE partner_id IN (SELECT id FROM partners)'
    )
    await client.query('DELETE FROM partner_relations')
    await client.query(
      'DELETE FROM partners WHERE id NOT IN (SELECT uuid_nil())'
    )

    // Ajouter les classifications depuis les données JSON
    console.log('📋 Ajout des classifications depuis les données...')
    const allClassifications = new Set()

    // Classifications depuis les partenaires
    partnersData.partners.forEach(partner => {
      if (partner.classifications) {
        partner.classifications.forEach(classification => {
          allClassifications.add(classification.toLowerCase())
        })
      }
    })

    // Insérer les nouvelles classifications (ON CONFLICT DO NOTHING pour éviter les doublons)
    for (const classification of allClassifications) {
      await client.query(
        'INSERT INTO classifications (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [classification]
      )
    }
    console.log(`✅ ${allClassifications.size} classifications traitées`)

    // Migrer les partenaires
    console.log('👥 Migration des partenaires...')
    let successCount = 0
    let errorCount = 0

    for (const partner of partnersData.partners) {
      try {
        // Insérer le partenaire
        const partnerResult = await client.query(
          `
          INSERT INTO partners (
            firstname, lastname, job, email, phone, company, 
            rating, status, comment, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id
        `,
          [
            partner.firstname,
            partner.lastname,
            partner.job,
            partner.email || null,
            partner.phone || null,
            partner.company,
            partner.rating || null,
            partner.status || 'active',
            partner.comment || null,
            partner.createdAt || new Date().toISOString(),
            partner.updatedAt || new Date().toISOString(),
          ]
        )

        const partnerId = partnerResult.rows[0].id

        // Insérer les classifications du partenaire
        if (partner.classifications && partner.classifications.length > 0) {
          for (const classification of partner.classifications) {
            await client.query(
              `
              INSERT INTO partner_classifications (partner_id, classification_name)
              VALUES ($1, $2)
            `,
              [partnerId, classification.toLowerCase()]
            )
          }
        }

        successCount++
        console.log(`✅ ${partner.firstname} ${partner.lastname}`)
      } catch (error) {
        errorCount++
        console.error(
          `❌ Erreur pour ${partner.firstname} ${partner.lastname}:`,
          error.message
        )
      }
    }

    // Afficher les statistiques finales
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM partners) as total_partners,
        (SELECT COUNT(*) FROM classifications) as total_classifications,
        (SELECT COUNT(*) FROM partner_classifications) as total_associations
    `)

    console.log('\n📊 Statistiques de migration:')
    console.log(`   • Partenaires migrés: ${successCount}`)
    console.log(`   • Erreurs: ${errorCount}`)
    console.log(
      `   • Total partenaires en base: ${stats.rows[0].total_partners}`
    )
    console.log(
      `   • Total classifications: ${stats.rows[0].total_classifications}`
    )
    console.log(`   • Total associations: ${stats.rows[0].total_associations}`)

    if (errorCount === 0) {
      console.log('\n🎉 Migration terminée avec succès!')
    } else {
      console.log(`\n⚠️  Migration terminée avec ${errorCount} erreur(s)`)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Vérifier que la base de données est accessible
async function checkDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'bondly',
    user: process.env.DB_USER || process.env.USER || 'fabien',
    password: process.env.DB_PASSWORD || '',
  })

  try {
    await client.connect()

    // Vérifier que les tables existent
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('partners', 'classifications', 'partner_classifications')
    `)

    if (result.rows.length < 3) {
      throw new Error(
        "Les tables ne sont pas créées. Exécutez d'abord les migrations Sqitch."
      )
    }

    console.log('✅ Base de données accessible et tables présentes')
    await client.end()
    return true
  } catch (error) {
    console.error('❌ Problème avec la base de données:', error.message)
    console.log('\n💡 Assurez-vous que:')
    console.log('   • PostgreSQL est démarré')
    console.log("   • Les variables d'environnement sont correctes")
    console.log('   • Les migrations Sqitch ont été exécutées')
    await client.end()
    return false
  }
}

// Exécution principale
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Démarrage de la migration JSON vers PostgreSQL\n')

  const dbOk = await checkDatabase()
  if (dbOk) {
    await migrateData()
  } else {
    process.exit(1)
  }
}
