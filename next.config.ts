import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Docker config
  output: 'standalone',

  // Performance optimisations (conformité specs)
  experimental: {
    // Tree shaking agressif
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Optimisation pour les composants sidebar
    // optimizeCss: true, // Désactivé temporairement pour éviter l'erreur critters
    // Parallel des builds pour une compilation plus rapide
    cpus: Math.max(1, (require('os').cpus().length || 1) - 1),
  },

  // Configuration Turbopack (stable)
  turbopack: {
    resolveAlias: {
      '@': './src',
      '@/components': './src/components',
      '@/ui': './src/components/ui',
      '@/layout': './src/components/layout',
      '@/features': './src/features',
      '@/shared': './src/shared',
      '@/hooks': './src/hooks',
      '@/lib': './src/lib',
      '@/store': './src/store',
      '@/services': './src/services',
      '@/types': './src/types',
      '@/utils': './src/shared/utils',
      '@/assets': './public',
    },
  },

  // Configuration Webpack pour optimisations sidebar
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimisation pour la sidebar en production
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            // Chunk séparé pour les composants sidebar
            sidebar: {
              name: 'sidebar',
              test: /[\\/]src[\\/]features[\\/]sidebar[\\/]/,
              chunks: 'all',
              priority: 20,
            },
            // Optimisation pour Framer Motion
            animations: {
              name: 'animations',
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              chunks: 'all',
              priority: 15,
            },
          },
        },
      }
    }
    return config
  },

  // Image optimisations (éco-conception)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 an
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression maximale
  compress: true,

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
