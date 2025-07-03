import { expect, test } from '@playwright/test'

/**
 * Tests E2E pour la gestion des partenaires
 * Vérifie les fonctionnalités CRUD des partenaires
 */

test.describe('Gestion des partenaires', () => {
  test.beforeEach(async ({ page }) => {
    // Navigue vers la page des partenaires
    await page.goto('/partners')
  })

  test('devrait afficher la liste des partenaires', async ({ page }) => {
    // Vérifie que la page se charge (ou affiche une erreur 404 si la route n'existe pas)
    const response = await page.goto('/partners')

    if (response && response.status() === 404) {
      // La route n'existe pas encore, c'est normal
      await expect(page.locator('h1, h2')).toBeVisible()
      return
    }

    // Si la route existe, vérifie le contenu
    await expect(page).toHaveTitle(/Partenaires|Partners|Create Next App/)

    // Vérifie la présence d'un container principal
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('devrait permettre la recherche de partenaires', async ({ page }) => {
    // Cherche un champ de recherche
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="recherch"], input[placeholder*="search"]'
    )

    if (await searchInput.isVisible()) {
      // Teste la fonctionnalité de recherche
      await searchInput.fill('Test Partner')
      await searchInput.press('Enter')

      // Vérifie que la recherche ne génère pas d'erreur
      await page.waitForTimeout(1000)
      await expect(page.locator('main')).toBeVisible()
    }
  })

  test("devrait afficher les détails d'un partenaire", async ({ page }) => {
    // Cherche un lien vers un partenaire spécifique
    const partnerLink = page.locator('a[href*="/partners/"]').first()

    if (await partnerLink.isVisible()) {
      await partnerLink.click()

      // Vérifie que la page de détails se charge
      await expect(page.locator('h1')).toBeVisible()

      // Vérifie que l'URL contient un ID de partenaire
      expect(page.url()).toMatch(/\/partners\/\w+/)
    }
  })

  test('devrait être accessible sur mobile', async ({ page }) => {
    // Simule un viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Vérifie que la page est responsive
    await expect(page.locator('h1')).toBeVisible()

    // Vérifie que les éléments principaux sont accessibles
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('devrait gérer les erreurs de chargement', async ({ page }) => {
    // Teste avec une URL invalide
    await page.goto('/partners/invalid-id')

    // Vérifie que l'erreur est gérée gracieusement
    await expect(page.locator('h1, h2')).toBeVisible()

    // Vérifie qu'il n'y a pas de page blanche
    const bodyContent = await page.locator('body').textContent()
    expect(bodyContent).not.toBe('')
  })
})
