import { expect, test } from '@playwright/test'

test.describe('Menu burger mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Le bouton menu burger doit être visible sur mobile', async ({
    page,
  }) => {
    // Simuler une viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Vérifier que le bouton burger est visible
    const burgerButton = page.locator(
      'button[aria-label="Ouvrir le menu de navigation"]'
    )
    await expect(burgerButton).toBeVisible()
  })

  test('Le bouton menu burger doit être caché sur desktop', async ({
    page,
  }) => {
    // Simuler une viewport desktop
    await page.setViewportSize({ width: 1024, height: 768 })

    // Vérifier que le bouton burger est caché
    const burgerButton = page.locator(
      'button[aria-label="Ouvrir le menu de navigation"]'
    )
    await expect(burgerButton).not.toBeVisible()
  })

  test('Cliquer sur le menu burger doit ouvrir la sidebar mobile', async ({
    page,
  }) => {
    // Simuler une viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Vérifier que la sidebar est initialement fermée (translate-x-full = hors écran)
    const sidebar = page.locator(
      '[role="navigation"][aria-label="Navigation principale"]'
    )
    await expect(sidebar).toHaveClass(/-translate-x-full/)

    // Cliquer sur le bouton burger
    const burgerButton = page.locator(
      'button[aria-label="Ouvrir le menu de navigation"]'
    )
    await burgerButton.click()

    // Vérifier que la sidebar est maintenant ouverte (translate-x-0 = visible)
    await expect(sidebar).toHaveClass(/translate-x-0/)

    // Vérifier que l'overlay est visible
    const overlay = page.locator(
      'div[aria-label="Fermer le menu de navigation"]'
    )
    await expect(overlay).toBeVisible()
  })

  test("Cliquer sur l'overlay doit fermer la sidebar mobile", async ({
    page,
  }) => {
    // Simuler une viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Ouvrir le menu
    const burgerButton = page.locator(
      'button[aria-label="Ouvrir le menu de navigation"]'
    )
    await burgerButton.click()

    // Attendre que l'overlay soit visible
    const overlay = page.locator(
      'div[aria-label="Fermer le menu de navigation"]'
    )
    await expect(overlay).toBeVisible()

    // Cliquer sur l'overlay dans une zone qui n'est pas occupée par la sidebar (côté droit)
    await page.click('body', { position: { x: 350, y: 300 } })

    // Vérifier que la sidebar est fermée
    const sidebar = page.locator(
      '[role="navigation"][aria-label="Navigation principale"]'
    )
    await expect(sidebar).toHaveClass(/-translate-x-full/)
  })

  test('Presser Échap doit fermer la sidebar mobile', async ({ page }) => {
    // Simuler une viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Ouvrir le menu
    const burgerButton = page.locator(
      'button[aria-label="Ouvrir le menu de navigation"]'
    )
    await burgerButton.click()

    // Vérifier que la sidebar est ouverte
    const sidebar = page.locator(
      '[role="navigation"][aria-label="Navigation principale"]'
    )
    await expect(sidebar).toHaveClass(/translate-x-0/)

    // Presser Échap
    await page.keyboard.press('Escape')

    // Vérifier que la sidebar est fermée
    await expect(sidebar).toHaveClass(/-translate-x-full/)
  })

  test('Le bouton burger devient X quand ouvert et ferme le menu', async ({
    page,
  }) => {
    // Simuler une viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Localiser le bouton burger
    const burgerButton = page.locator(
      'button[aria-label="Ouvrir le menu de navigation"]'
    )

    // Vérifier que l'icône Menu est présente au début (classe lucide-menu)
    await expect(burgerButton.locator('.lucide-menu')).toBeVisible()

    // Ouvrir le menu
    await burgerButton.click()

    // Vérifier que le bouton est maintenant un X et que l'aria-label a changé
    const closeButton = page.locator(
      'button[aria-label="Fermer le menu de navigation"]'
    )
    await expect(closeButton.locator('.lucide-x')).toBeVisible()

    // Cliquer sur le bouton X pour fermer
    await closeButton.click()

    // Vérifier que la sidebar est fermée
    const sidebar = page.locator(
      '[role="navigation"][aria-label="Navigation principale"]'
    )
    await expect(sidebar).toHaveClass(/-translate-x-full/)

    // Vérifier que le bouton est redevenu un burger
    await expect(burgerButton.locator('.lucide-menu')).toBeVisible()
  })

  test('La sidebar doit se fermer automatiquement lors du redimensionnement vers desktop', async ({
    page,
  }) => {
    // Simuler une viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Ouvrir le menu
    const burgerButton = page.locator(
      'button[aria-label="Ouvrir le menu de navigation"]'
    )
    await burgerButton.click()

    // Vérifier que la sidebar est ouverte
    const sidebar = page.locator(
      '[role="navigation"][aria-label="Navigation principale"]'
    )
    await expect(sidebar).toHaveClass(/translate-x-0/)

    // Redimensionner vers desktop
    await page.setViewportSize({ width: 1024, height: 768 })

    // Attendre le debounce du viewport + l'effet de redux (100ms + marges)
    await page.waitForTimeout(300)

    // La sidebar doit maintenant être en mode compact en desktop (largeur 64px)
    await expect(sidebar).toHaveClass(/w-16/)
    await expect(sidebar).toHaveClass(/lg:translate-x-0/)
  })
})
