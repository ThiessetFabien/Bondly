import { expect, test } from '@playwright/test'

/**
 * Tests E2E de base pour l'application RPM-CL
 * Tests robustes qui s'adaptent à l'état actuel de l'application
 */

test.describe('Application RPM-CL', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test("devrait charger la page d'accueil", async ({ page }) => {
    // Vérifie que la page se charge avec un titre
    await expect(page).toHaveTitle(
      /Create Next App|RPM-CL|Relational Partner Manager/
    )

    // Vérifie la présence de contenu visible
    await expect(page.locator('body')).toBeVisible()

    // Vérifie qu'il y a du contenu textuel
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
    expect(bodyText!.trim()).not.toBe('')
  })

  test('devrait avoir une structure HTML valide', async ({ page }) => {
    // Vérifie la présence d'un titre
    const title = await page.title()
    expect(title).toBeTruthy()

    // Vérifie la présence d'un doctype
    const doctype = await page.evaluate(() => document.doctype?.name)
    expect(doctype).toBe('html')

    // Vérifie la présence de la balise html
    await expect(page.locator('html')).toBeVisible()
  })

  test('devrait être responsive', async ({ page }) => {
    // Test avec différentes tailles d'écran
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 }, // Tablet
      { width: 375, height: 667 }, // Mobile
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.reload()

      // Vérifie que la page est toujours visible
      await expect(page.locator('body')).toBeVisible()

      // Vérifie qu'il n'y a pas de débordement horizontal
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })

      // On accepte un petit débordement pour être moins strict
      expect(hasHorizontalScroll).toBe(false)
    }
  })

  test('devrait charger sans erreurs JavaScript critiques', async ({
    page,
  }) => {
    const jsErrors: string[] = []

    page.on('pageerror', exception => {
      jsErrors.push(exception.message)
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Filtre les erreurs non critiques
    const criticalErrors = jsErrors.filter(
      error =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('net::ERR_INTERNET_DISCONNECTED') &&
        !error.includes('Loading CSS chunk')
    )

    expect(criticalErrors).toHaveLength(0)
  })

  test('devrait avoir des métriques de performance acceptables', async ({
    page,
  }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Temps de chargement raisonnable (10 secondes max)
    expect(loadTime).toBeLessThan(10000)
  })

  test('devrait gérer les routes inexistantes', async ({ page }) => {
    // Teste une route qui n'existe pas
    const response = await page.goto('/route-inexistante')

    // Vérifie que l'erreur 404 est bien gérée
    expect(response?.status()).toBe(404)

    // Vérifie qu'il y a du contenu d'erreur
    await expect(page.locator('body')).toBeVisible()

    const errorText = await page.locator('body').textContent()
    expect(errorText).toContain('404')
  })

  test("devrait avoir un minimum d'accessibilité", async ({ page }) => {
    // Vérifie que la page a une langue définie
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBeTruthy()

    // Vérifie qu'il y a au moins un titre (h1-h6)
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingCount = await headings.count()
    expect(headingCount).toBeGreaterThan(0)
  })
})
