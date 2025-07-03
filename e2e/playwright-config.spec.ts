import { expect, test } from '@playwright/test'

/**
 * Tests E2E pour valider la configuration Playwright
 * Vérifie que l'environnement de test est correctement configuré
 */

test.describe('Configuration Playwright', () => {
  test("devrait avoir accès aux variables d'environnement", async ({
    page,
  }) => {
    // Test simple pour vérifier que Playwright fonctionne
    await page.goto('/')

    // Vérifie que l'URL de base est correcte
    expect(page.url()).toContain('localhost:3000')
  })

  test('devrait pouvoir capturer des screenshots', async ({ page }) => {
    await page.goto('/')

    // Capture un screenshot pour vérifier la fonctionnalité
    const screenshot = await page.screenshot()
    expect(screenshot).toBeTruthy()
    expect(screenshot.length).toBeGreaterThan(0)
  })

  test('devrait pouvoir exécuter du JavaScript', async ({ page }) => {
    await page.goto('/')

    // Teste l'exécution de JavaScript
    const title = await page.evaluate(() => document.title)
    expect(title).toBeTruthy()
  })

  test('devrait gérer les timeouts correctement', async ({ page }) => {
    await page.goto('/')

    // Teste un timeout court
    await page.waitForTimeout(100)

    // Vérifie que la page est toujours accessible
    await expect(page.locator('body')).toBeVisible()
  })

  test('devrait supporter les différents navigateurs', async ({
    browserName,
  }) => {
    // Vérifie que le navigateur est correctement identifié
    expect(['chromium', 'firefox', 'webkit']).toContain(browserName)
  })

  test('devrait avoir une configuration mobile', async ({ page, isMobile }) => {
    await page.goto('/')

    if (isMobile) {
      // Test spécifique mobile
      const viewport = page.viewportSize()
      expect(viewport?.width).toBeLessThan(800)
    }

    // Vérifie que la page fonctionne indépendamment du device
    await expect(page.locator('body')).toBeVisible()
  })
})
