import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisation images automatique
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  // Compression maximale
  compress: true,
  // Tree shaking agressif
  experimental: {
    optimizePackageImports: ["@heroicons/react", "lucide-react"],
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  // Hybrid SSR/CSR pour performance
  hybridRendering: true,
};
export default nextConfig;
