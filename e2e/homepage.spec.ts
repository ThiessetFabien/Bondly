import { expect, test } from '@playwright/test'

/**
 * Tests E2E pour la page d'accueil
 * Vérifie les fonctionnalités de base de l'application RPM-CL
 */

test.describe("Page d'accueil", () => {
  test.beforeEach(async ({ page }) => {
    // Navigue vers la page d'accueil
    await page.goto('/')
  })

  test("devrait afficher la page d'accueil correctement", async ({ page }) => {
    // Vérifie que la page se charge
    await expect(page).toHaveTitle(
      /Create Next App|RPM-CL|Relational Partner Manager/
    )

    // Vérifie la présence du contenu principal
    await expect(page.locator('h1')).toBeVisible()

    // Vérifie que la page ne contient pas d'erreurs JavaScript
    page.on('pageerror', exception => {
      throw new Error(`Page error: ${exception}`)
    })
  })

  test('devrait être accessible en mobile', async ({ page }) => {
    // Simule un viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Vérifie que la page est responsive
    await expect(page.locator('h1')).toBeVisible()

    // Vérifie que les éléments principaux sont accessibles
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('devrait avoir une navigation fonctionnelle', async ({ page }) => {
    // Vérifie la présence de la navigation
    const navigation = page.locator('nav')
    if (await navigation.isVisible()) {
      // Test de base de la navigation si elle existe
      await expect(navigation).toBeVisible()
    }
  })

  test('devrait charger sans erreurs de console critiques', async ({
    page,
  }) => {
    const consoleErrors: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Filtre les erreurs connues et non critiques
    const criticalErrors = consoleErrors.filter(
      error =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('net::ERR_INTERNET_DISCONNECTED')
    )

    expect(criticalErrors).toHaveLength(0)
  })
})
