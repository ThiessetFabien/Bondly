import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Docker config
  output: 'standalone',

  // Performance optimisations (conformité specs)
  experimental: {
    // Tree shaking agressif
    optimizePackageImports: ['lucide-react'],
    // Support pour les imports dynamiques
    turbo: {
      resolveAlias: {
        '@': './src',
      },
    },
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
