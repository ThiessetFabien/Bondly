import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Docker config
  output: 'standalone',

  // Docker optimisations
  experimental: {
    // Reduce bundle size
    optimizePackageImports: ['lucide-react'],
  },

  // Image optimisations
  images: {
    unoptimized: false,
  },
}

export default nextConfig
