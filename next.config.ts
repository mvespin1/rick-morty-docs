import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Permite que el build de producción se complete incluso con errores de ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permite que el build de producción se complete incluso con errores de TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
