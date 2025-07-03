import { expect, test } from '@playwright/test'

/**
 * Tests E2E pour l'accessibilité
 * Vérifie la conformité aux standards d'accessibilité
 */

test.describe('Accessibilité', () => {
  test('devrait avoir des titres de page appropriés', async ({ page }) => {
    // Test de la page d'accueil
    await page.goto('/')
    await expect(page).toHaveTitle(
      /Create Next App|RPM-CL|Relational Partner Manager/
    )

    // Test de la page des partenaires (peut ne pas exister)
    const response = await page.goto('/partners')
    if (response && response.status() !== 404) {
      await expect(page).toHaveTitle(/\w+/)
    }
  })

  test('devrait avoir une navigation au clavier', async ({ page }) => {
    await page.goto('/')

    // Teste la navigation au clavier
    await page.keyboard.press('Tab')

    // Vérifie qu'un élément est focusé
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('devrait avoir des images avec alt text', async ({ page }) => {
    await page.goto('/')

    // Vérifie que toutes les images ont un attribut alt
    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      const altText = await image.getAttribute('alt')

      // Chaque image doit avoir un attribut alt (même vide pour les images décoratives)
      expect(altText).not.toBeNull()
    }
  })

  test('devrait avoir une structure de titres logique', async ({ page }) => {
    await page.goto('/')

    // Vérifie la présence d'un titre principal
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // Vérifie qu'il n'y a qu'un seul H1
    const h1Count = await h1.count()
    expect(h1Count).toBeLessThanOrEqual(1)
  })

  test('devrait avoir des liens descriptifs', async ({ page }) => {
    await page.goto('/')

    // Vérifie que les liens ont du texte ou des labels
    const links = page.locator('a')
    const linkCount = await links.count()

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i)
      const linkText = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      const title = await link.getAttribute('title')

      // Chaque lien doit avoir du texte, un aria-label ou un title
      expect(linkText || ariaLabel || title).toBeTruthy()
    }
  })

  test("devrait être compatible avec les lecteurs d'écran", async ({
    page,
  }) => {
    await page.goto('/')

    // Vérifie la présence de landmarks ARIA
    const main = page.locator('main, [role="main"]')
    await expect(main).toBeVisible()

    // Vérifie que les éléments interactifs ont des roles appropriés
    const buttons = page.locator('button, [role="button"]')
    const buttonCount = await buttons.count()

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const buttonText = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')

      // Chaque bouton doit avoir du texte ou un aria-label
      expect(buttonText || ariaLabel).toBeTruthy()
    }
  })
})
