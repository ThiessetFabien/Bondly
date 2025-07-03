import { defineConfig, devices } from '@playwright/test'

/**
 * Configuration Playwright simplifiée pour RPM-CL
 * Optimisée pour le développement et les tests locaux
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
  workers: process.env['CI'] ? 1 : 4,

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

  /* Configuration simplifiée pour les navigateurs disponibles */
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

    /* Tests sur mobile Chrome uniquement (plus stable) */
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],

  /* Serveur de développement pour les tests E2E */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env['CI'],
    timeout: 120 * 1000,
  },

  /* Dossiers et fichiers à ignorer */
  testIgnore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],

  /* Timeout global pour les tests */
  timeout: 30 * 1000,

  /* Attendre que les éléments soient prêts avant d'agir */
  expect: {
    timeout: 5000,
  },
})
