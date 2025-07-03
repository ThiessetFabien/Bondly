import { defineConfig, devices } from '@playwright/test'

/**
 * Configuration Playwright pour RPM-CL (Partner Relationship Management)
 * Tests E2E selon les spécifications du projet
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* Exécuter les tests en parallèle */
  fullyParallel: true,

  /* Échec du build sur CI si test.only est laissé accidentellement */
  forbidOnly: !!process.env['CI'],

  /* Retry sur CI uniquement */
  retries: process.env['CI'] ? 2 : 0,

  /* Pas de tests parallèles sur CI */
  workers: process.env['CI'] ? 1 : undefined,

  /* Reporter pour les résultats de tests */
  reporter: process.env['CI'] ? 'github' : 'html',

  /* Configuration globale pour tous les projets */
  use: {
    /* URL de base pour les actions comme `await page.goto('/')` */
    baseURL: process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000',

    /* Collecte de traces en cas d'échec pour debugging */
    trace: 'on-first-retry',

    /* Captures d'écran en cas d'échec */
    screenshot: 'only-on-failure',

    /* Enregistrement vidéo en cas d'échec */
    video: 'retain-on-failure',

    /* Timeout global pour les actions */
    actionTimeout: 10000,

    /* Headers personnalisés pour tous les tests */
    extraHTTPHeaders: {
      'Accept-Language': 'fr-FR,fr;q=0.9',
    },
  },

  /* Configuration des projets pour différents navigateurs */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    /* Tests sur mobile (conformément aux specs mobile-first) */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
      },
    },

    /* Tests sur tablette pour responsive design */
    {
      name: 'Tablet',
      use: {
        ...devices['iPad Pro'],
      },
    },
  ],

  /* Serveur de développement pour les tests E2E */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env['CI'],
    timeout: 120 * 1000, // 2 minutes
  },

  /* Dossiers et fichiers à ignorer */
  testIgnore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],

  /* Timeout global pour les tests */
  timeout: 30 * 1000, // 30 secondes

  /* Attendre que les éléments soient prêts avant d'agir */
  expect: {
    timeout: 5000,
  },
})
