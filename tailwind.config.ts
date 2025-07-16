import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

interface DaisyUIConfig extends Config {
  daisyui?: {
    themes?: any[]
    darkTheme?: string
    base?: boolean
    styled?: boolean
    utils?: boolean
    logs?: boolean
    rtl?: boolean
  }
}

const config: DaisyUIConfig = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/shadcn-ui/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/21dev-ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Assurer que les couleurs gray sont disponibles
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      // Espacements personnalisés pour l'éco-conception
      spacing: {
        'sidebar-compact': '4rem', // 64px - w-16
        'sidebar-expanded': '20rem', // 320px - w-80
        'touch-target': '44px', // Cible tactile minimum
        'touch-target-lg': '48px', // Cible tactile confortable
      },
      // Transitions optimisées
      transitionDuration: {
        '400': '400ms',
      },
      // Z-index système
      zIndex: {
        'nav-mobile': '1000', // Barre de navigation mobile
        overlay: '1001', // Overlay pour modal/sidebar
        sidebar: '1002', // Sidebar desktop
        tooltip: '1003', // Tooltips
        dropdown: '1004', // Dropdowns
        modal: '1005', // Modals et sidebar mobile
      },
      // Tailles d'écran optimisées
      screens: {
        xs: '475px',
      },
      // Bordures personnalisées
      borderRadius: {
        eco: '0.75rem', // 12px - plus doux que lg
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss-animate'),
    // Plugin personnalisé pour les composants éco-conçus (optimisé)
    plugin(function ({ addComponents, addUtilities, theme }) {
      addComponents({
        // === LAYOUTS ÉCO-CONÇUS ===
        '.flex-center': {
          '@apply flex items-center justify-center': {},
        },
        '.flex-start': {
          '@apply flex items-center justify-start': {},
        },
        '.flex-between': {
          '@apply flex items-center justify-between': {},
        },
        '.flex-col-center': {
          '@apply flex flex-col items-center justify-center': {},
        },

        // === SIDEBAR ÉCO-CONÇUE (Simplifié - voir sidebar.plugin.ts) ===
        '.sidebar-base': {
          '@apply h-full transition-all duration-300 ease-out': {},
        },

        // === BOUTONS ÉCO-CONÇUS ===
        '.btn-eco-base': {
          '@apply group relative transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring':
            {},
        },
        '.btn-eco-hover-subtle': {
          '@apply hover:scale-[1.01] active:scale-[0.99]': {},
        },
        '.btn-eco-hover-normal': {
          '@apply hover:scale-[1.02] active:scale-[0.98]': {},
        },
        '.btn-eco-hover-emphasis': {
          '@apply hover:scale-[1.05] active:scale-[0.95]': {},
        },
        '.btn-eco-active': {
          '@apply ring-1 ring-primary/20 shadow-sm': {},
        },

        // === CARTES ÉCO-CONÇUES ===
        '.card-eco-base': {
          '@apply bg-background border border-border rounded-xl shadow-sm': {},
        },
        '.card-eco-interactive': {
          '@apply bg-background border border-border rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200':
            {},
        },
        '.card-eco-elevated': {
          '@apply bg-background border border-border rounded-xl shadow-md': {},
        },

        // === INPUTS ÉCO-CONÇUS ===
        '.input-eco-base': {
          '@apply w-full border border-border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-border':
            {},
        },
        '.input-eco-search': {
          '@apply w-full pl-10 pr-4 py-2.5 bg-background/60 border border-border rounded-xl text-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all duration-200':
            {},
        },

        // === NAVIGATION ÉCO-CONÇUE ===
        '.nav-item': {
          '@apply flex items-center min-h-touch-target-lg w-full': {},
        },
        '.nav-icon-container': {
          '@apply flex items-center justify-center w-10 h-10 rounded-lg bg-background/30 group-hover:bg-accent/50 transition-colors duration-200 flex-shrink-0':
            {},
        },
        '.nav-icon': {
          '@apply h-5 w-5 flex-shrink-0 transition-colors duration-200': {},
        },
        '.nav-icon-active': {
          '@apply text-primary': {},
        },
        '.nav-icon-inactive': {
          '@apply text-muted-foreground group-hover:text-accent-foreground': {},
        },
        '.nav-label': {
          '@apply text-sm font-medium leading-normal transition-colors duration-200':
            {},
        },
        '.nav-label-active': {
          '@apply text-primary': {},
        },
        '.nav-label-inactive': {
          '@apply text-muted-foreground group-hover:text-accent-foreground': {},
        },
        '.nav-description': {
          '@apply text-xs text-muted-foreground/70 leading-normal mt-0.5 truncate':
            {},
        },

        // === TOOLTIPS ÉCO-CONÇUS ===
        '.tooltip-eco': {
          '@apply absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-tooltip shadow-xl border border-border':
            {},
        },
        '.tooltip-arrow': {
          '@apply absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover rotate-45 border-l border-b border-border':
            {},
        },

        // === MESSAGES D'ÉTAT ÉCO-CONÇUS ===
        '.message-center': {
          '@apply text-center py-6 px-4': {},
        },
        '.message-loading': {
          '@apply text-muted-foreground text-sm': {},
        },
        '.message-error': {
          '@apply text-destructive text-sm font-medium': {},
        },
        '.message-empty-title': {
          '@apply text-muted-foreground text-sm font-medium mb-2': {},
        },
        '.message-empty-subtitle': {
          '@apply text-muted-foreground/70 text-xs': {},
        },

        // === BADGES ÉCO-CONÇUS ===
        '.badge-eco-base': {
          '@apply inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors':
            {},
        },
        '.badge-eco-neutral': {
          '@apply badge-eco-base text-foreground bg-muted': {},
        },
        '.badge-eco-primary': {
          '@apply badge-eco-base text-primary bg-primary/10': {},
        },

        // === TYPOGRAPHIE ÉCO-CONÇUE ===
        '.text-title-primary': {
          '@apply font-semibold text-foreground text-sm tracking-tight truncate':
            {},
        },
        '.text-title-secondary': {
          '@apply text-xs text-muted-foreground truncate': {},
        },
        '.text-stats-title': {
          '@apply text-xs font-medium text-muted-foreground uppercase tracking-wider':
            {},
        },
        '.text-stats-label': {
          '@apply text-sm text-muted-foreground': {},
        },
        '.text-tooltip-title': {
          '@apply text-sm font-medium text-foreground mb-1': {},
        },
        '.text-tooltip-description': {
          '@apply text-xs text-muted-foreground/80 leading-tight': {},
        },

        // === LAYOUTS SPÉCIALISÉS ===
        '.layout-sidebar-base': {
          '@apply fixed top-0 left-0 h-full z-sidebar transition-all duration-300 ease-out':
            {},
        },
        '.layout-sidebar-desktop': {
          '@apply bg-background border-r border-border shadow-xl': {},
        },
        '.layout-sidebar-mobile': {
          '@apply bg-background shadow-2xl': {},
        },

        // === SIDEBAR STATES ===
        '.sidebar-expanded': {
          '@apply w-sidebar-expanded': {},
        },
        '.sidebar-compact': {
          '@apply w-sidebar-compact': {},
        },
        '.sidebar-gpu-accelerated': {
          'will-change': 'width, transform',
          transform: 'translateZ(0)',
        },

        // === ANIMATIONS ÉCO-CONÇUES ===
        '.animate-fade-in': {
          '@apply animate-in fade-in duration-300': {},
        },
        '.animate-scale-in': {
          '@apply animate-in zoom-in-95 duration-200': {},
        },
        '.animate-slide-in': {
          '@apply animate-in slide-in-from-left duration-300': {},
        },

        // === GRADIENT BACKGROUNDS ===
        '.bg-gradient-eco-muted': {
          '@apply bg-gradient-to-b from-muted/50 to-background': {},
        },
        '.bg-gradient-eco-subtle': {
          '@apply bg-gradient-to-r from-background to-muted/20': {},
        },

        // === OVERLAYS ===
        '.overlay-eco-mobile': {
          '@apply fixed inset-0 z-overlay bg-black/50 backdrop-blur-sm': {},
        },

        // === SEARCH SPÉCIALISÉ ===
        '.search-eco-container': {
          '@apply relative flex items-center': {},
        },
        '.search-eco-icon': {
          '@apply absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground':
            {},
        },
        '.search-eco-clear': {
          '@apply absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-accent-foreground transition-colors cursor-pointer':
            {},
        },

        // === STATS DISPLAY ===
        '.stats-eco-container': {
          '@apply mt-auto border-t border-border bg-gradient-eco-muted p-4': {},
        },
        '.stats-eco-title': {
          '@apply text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3':
            {},
        },
        '.stats-eco-content': {
          '@apply space-y-3': {},
        },
        '.stats-eco-item': {
          '@apply flex items-center justify-between': {},
        },
        '.stats-eco-label': {
          '@apply text-sm text-muted-foreground': {},
        },

        // === RESPONSIVE UTILITIES ===
        '.responsive-hide-mobile': {
          '@apply hidden md:block': {},
        },
        '.responsive-show-mobile': {
          '@apply block md:hidden': {},
        },
        '.responsive-sidebar-width': {
          '@apply w-sidebar-compact lg:w-sidebar-expanded': {},
        },
      })

      addUtilities({
        // === UTILITAIRES ÉCO-CONÇUS ===
        '.touch-target': {
          'min-height': theme('spacing.touch-target'),
          'min-width': theme('spacing.touch-target'),
        },
        '.touch-target-lg': {
          'min-height': theme('spacing.touch-target-lg'),
          'min-width': theme('spacing.touch-target-lg'),
        },

        // Scrollbar personnalisée éco-conçue
        '.scrollbar-eco': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('colors.muted.foreground')}30 transparent`,
        },
        '.scrollbar-eco::-webkit-scrollbar': {
          width: '6px',
        },
        '.scrollbar-eco::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '.scrollbar-eco::-webkit-scrollbar-thumb': {
          background: `${theme('colors.muted.foreground')}30`,
          'border-radius': '3px',
        },
        '.scrollbar-eco::-webkit-scrollbar-thumb:hover': {
          background: `${theme('colors.muted.foreground')}50`,
        },

        // Transitions éco-conçues
        '.transition-eco': {
          transition: 'all 200ms ease',
        },
        '.transition-eco-slow': {
          transition: 'all 300ms ease-out',
        },
      })
    }),
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#0066cc',
          secondary: '#6366f1',
          accent: '#f59e0b',
          neutral: '#374151',
          'base-100': '#ffffff',
          'base-200': '#f8fafc',
          'base-300': '#e2e8f0',
          info: '#0ea5e9',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        dark: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#fbbf24',
          neutral: '#1f2937',
          'base-100': '#111827',
          'base-200': '#1f2937',
          'base-300': '#374151',
          info: '#0ea5e9',
          success: '#10b981',
          warning: '#fbbf24',
          error: '#f87171',
        },
      },
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
  },
}

export default config
