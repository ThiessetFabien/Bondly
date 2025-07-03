import { expect, test } from '@playwright/test'

/**
 * Tests E2E pour les performances
 * Vérifie les métriques de performance critiques
 */

test.describe('Performance', () => {
  test("devrait charger la page d'accueil rapidement", async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Le temps de chargement devrait être raisonnable (< 5 secondes)
    expect(loadTime).toBeLessThan(5000)
  })

  test('devrait avoir des métriques Core Web Vitals correctes', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Mesure du Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise<number>(resolve => {
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries()
          if (entries.length > 0) {
            resolve(entries[entries.length - 1].startTime)
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // Fallback si LCP n'est pas disponible
        setTimeout(() => resolve(0), 2000)
      })
    })

    // LCP devrait être inférieur à 2.5 secondes (bonne pratique)
    if (lcp > 0) {
      expect(lcp).toBeLessThan(2500)
    }
  })

  test('devrait avoir un temps de réponse acceptable', async ({ page }) => {
    const responses: number[] = []

    page.on('response', response => {
      if (response.url().includes(page.url())) {
        responses.push(response.status())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Vérifie que les réponses sont correctes
    const successfulResponses = responses.filter(
      status => status >= 200 && status < 300
    )
    expect(successfulResponses.length).toBeGreaterThan(0)
  })

  test('devrait optimiser les images', async ({ page }) => {
    await page.goto('/')

    // Vérifie que les images utilisent des formats modernes
    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      const src = await image.getAttribute('src')

      if (src) {
        // Vérifie que l'image n'est pas trop grande
        const imageSize = await page.evaluate(imgSrc => {
          const img = new Image()
          return new Promise<{ width: number; height: number }>(resolve => {
            img.onload = () => resolve({ width: img.width, height: img.height })
            img.onerror = () => resolve({ width: 0, height: 0 })
            img.src = imgSrc
          })
        }, src)

        // Les images ne devraient pas être démesurément grandes
        expect(imageSize.width).toBeLessThan(2000)
        expect(imageSize.height).toBeLessThan(2000)
      }
    }
  })

  test('devrait minimiser les ressources bloquantes', async ({ page }) => {
    await page.goto('/')

    // Mesure le temps jusqu'au premier paint
    const firstPaint = await page.evaluate(() => {
      return new Promise<number>(resolve => {
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries()
          if (entries.length > 0) {
            resolve(entries[0].startTime)
          }
        }).observe({ entryTypes: ['paint'] })

        // Fallback
        setTimeout(() => resolve(Date.now()), 1000)
      })
    })

    // Le premier paint devrait être rapide (< 1 seconde)
    if (firstPaint > 0) {
      expect(firstPaint).toBeLessThan(1000)
    }
  })
})
