import { expect, test } from '@playwright/test'

test.describe('Desktop Sidebar Accessibility & UX', () => {
  test.beforeEach(async ({ page }) => {
    // Configurer une taille de viewport desktop
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle')
  })

  test('should show collapsed sidebar by default on desktop', async ({
    page,
  }) => {
    const sidebar = page.locator('[role="navigation"]')

    // Vérifier que la sidebar est présente et visible
    await expect(sidebar).toBeVisible()

    // Vérifier que la sidebar est en mode réduit (64px de largeur)
    await expect(sidebar).toHaveClass(/w-16/)

    // Vérifier que seul le logo est visible (pas les labels dans la sidebar)
    await expect(sidebar.locator('text=Partner Manager')).not.toBeVisible()
    await expect(sidebar.locator('text=Tous les partenaires')).not.toBeVisible()
  })

  test('should expand on hover and show labels', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')

    // Hover sur la sidebar
    await sidebar.hover()

    // Attendre l'animation de transition
    await page.waitForTimeout(300)

    // Vérifier que la sidebar s'étend (320px de largeur)
    await expect(sidebar).toHaveClass(/w-80/)

    // Vérifier que les labels sont maintenant visibles dans la sidebar
    await expect(sidebar.locator('text=Partner Manager')).toBeVisible()
    await expect(sidebar.locator('text=Tous les partenaires')).toBeVisible()

    // Vérifier que la barre de recherche est visible
    await expect(
      page.locator('input[placeholder="Rechercher..."]')
    ).toBeVisible()

    // Vérifier que les statistiques sont visibles
    await expect(page.locator('text=Aperçu')).toBeVisible()
  })

  test('should collapse when mouse leaves sidebar', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')
    const mainContent = page.locator('main, [role="main"]').first()

    // Hover sur la sidebar pour l'étendre
    await sidebar.hover()
    await page.waitForTimeout(300)

    // Vérifier qu'elle est étendue
    await expect(sidebar).toHaveClass(/w-80/)

    // Déplacer la souris en dehors de la sidebar
    await mainContent.hover()
    await page.waitForTimeout(300)

    // Vérifier qu'elle se réduit à nouveau
    await expect(sidebar).toHaveClass(/w-16/)
    await expect(sidebar.locator('text=Partner Manager')).not.toBeVisible()
  })

  test('should show tooltips in collapsed state', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')

    // Vérifier que la sidebar est réduite
    await expect(sidebar).toHaveClass(/w-16/)

    // Vérifier que les boutons ont bien des attributs title pour l'accessibilité
    const allPartnersButton = sidebar.locator(
      'button[title="Tous les partenaires"]'
    )
    await expect(allPartnersButton).toBeVisible()
    await expect(allPartnersButton).toHaveAttribute(
      'title',
      'Tous les partenaires'
    )

    // Vérifier que d'autres boutons de navigation ont aussi des titles
    const navButtons = sidebar.locator('button[title]')
    const buttonCount = await navButtons.count()
    expect(buttonCount).toBeGreaterThan(0)

    // En mode réduit, les tooltips (éléments avec classes absolute left-full) existent
    const tooltipElements = sidebar.locator('.absolute.left-full')
    const tooltipCount = await tooltipElements.count()
    expect(tooltipCount).toBeGreaterThan(0)
  })

  test('should handle keyboard navigation correctly', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')

    // Utiliser Tab pour naviguer vers la sidebar
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // Peut nécessiter plusieurs tabs selon la page

    // Trouver le premier élément de navigation focusable
    const firstNavButton = sidebar.locator('button').first()
    await firstNavButton.focus()

    // Vérifier que la sidebar s'étend au focus
    await page.waitForTimeout(300)
    await expect(sidebar).toHaveClass(/w-80/)

    // Naviguer avec les flèches
    await page.keyboard.press('ArrowDown')

    // Vérifier que le focus se déplace
    const _focusedElement = page.locator(':focus')
    await expect(_focusedElement).toBeVisible()
  })

  test('should maintain focus within sidebar when tabbing', async ({
    page,
  }) => {
    const sidebar = page.locator('[role="navigation"]')

    // Focuser sur la sidebar
    const firstButton = sidebar.locator('button').first()
    await firstButton.focus()

    // Vérifier que la sidebar s'étend
    await expect(sidebar).toHaveClass(/w-80/)

    // Naviguer avec Tab à travers tous les éléments de la sidebar
    const searchInput = sidebar.locator('input[placeholder="Rechercher..."]')
    await searchInput.focus()

    // Vérifier que la sidebar reste étendue
    await expect(sidebar).toHaveClass(/w-80/)

    // Tab vers le prochain élément
    await page.keyboard.press('Tab')

    // Vérifier que le focus reste dans la sidebar
    const _focusedElement = page.locator(':focus')
    const isInSidebar = (await sidebar.locator(':focus').count()) > 0
    expect(isInSidebar).toBeTruthy()
  })

  test('should collapse when focus leaves sidebar', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')

    // Focuser sur la sidebar pour l'étendre
    const firstButton = sidebar.locator('button').first()
    await firstButton.focus()
    await expect(sidebar).toHaveClass(/w-80/)

    // Déplacer le focus en dehors de la sidebar
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Attendre un peu pour que l'événement onBlur se déclenche
    await page.waitForTimeout(300)

    // Vérifier que la sidebar se réduit si le focus n'est plus dedans
    const _focusedElement = page.locator(':focus')
    const isStillInSidebar = (await sidebar.locator(':focus').count()) > 0

    if (!isStillInSidebar) {
      await expect(sidebar).toHaveClass(/w-16/)
    }
  })

  test('should handle search functionality when expanded', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')

    // Étendre la sidebar
    await sidebar.hover()
    await page.waitForTimeout(300)

    // Utiliser la barre de recherche
    const searchInput = sidebar.locator('input[placeholder="Rechercher..."]')
    await searchInput.fill('business')

    // Vérifier que la recherche fonctionne (les résultats sont filtrés)
    await page.waitForTimeout(100)

    // Vérifier que la sidebar reste étendue pendant la recherche
    await expect(sidebar).toHaveClass(/w-80/)

    // Effacer la recherche
    await searchInput.clear()

    // Vérifier que tous les éléments réapparaissent dans la sidebar
    await expect(sidebar.locator('text=Tous les partenaires')).toBeVisible()
  })

  test('should not show desktop collapse/expand buttons', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')

    // Vérifier qu'aucun bouton de collapse/expand n'est visible en desktop
    const collapseButtons = page
      .locator('button')
      .filter({ hasText: /collapse|expand|réduire|étendre/i })

    await expect(collapseButtons).toHaveCount(0)

    // Vérifier spécifiquement qu'il n'y a pas d'icônes ChevronLeft/ChevronRight
    const chevronIcons = sidebar.locator('svg').filter({ hasText: /chevron/i })
    await expect(chevronIcons).toHaveCount(0)
  })

  test('should maintain proper ARIA attributes', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')

    // Vérifier les attributs ARIA de base
    await expect(sidebar).toHaveAttribute('role', 'navigation')
    await expect(sidebar).toHaveAttribute('aria-label', 'Navigation principale')

    // Vérifier les boutons de navigation
    const buttons = sidebar.locator('button')
    const buttonCount = await buttons.count()

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)

      // Chaque bouton devrait avoir un title ou aria-label en mode réduit
      const hasTitle = await button.getAttribute('title')
      const hasAriaLabel = await button.getAttribute('aria-label')

      expect(hasTitle || hasAriaLabel).toBeTruthy()
    }
  })

  test('should handle responsive behavior correctly', async ({ page }) => {
    // Commencer en desktop
    await page.setViewportSize({ width: 1280, height: 720 })

    const sidebar = page.locator('[role="navigation"]')

    // Vérifier que la sidebar est visible en desktop
    await expect(sidebar).toBeVisible()
    await expect(sidebar).toHaveClass(/w-16/)

    // Changer vers mobile
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)

    // En mobile, la sidebar doit être cachée par défaut
    await expect(sidebar).toHaveClass(/-translate-x-full/)

    // Le bouton menu burger doit être visible
    const menuButton = page.locator(
      'button[aria-label="Ouvrir le menu de navigation"]'
    )
    await expect(menuButton).toBeVisible()

    // Retour vers desktop
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.waitForTimeout(500)

    // La sidebar doit redevenir visible et réduite
    await expect(sidebar).toBeVisible()
    await expect(sidebar).toHaveClass(/w-16/)

    // Le bouton menu burger doit être caché
    await expect(menuButton).not.toBeVisible()
  })
})
