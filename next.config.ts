/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    staticPageGenerationTimeout: 60,
  },
  async rewrites() {
    return [
      {
        source: '/mytasks',
        destination: '/api/fallback', // Fallback route if `/mytasks` fails to build
      },
      {
        source: '/dashboard',
        destination: '/api/fallback', // Fallback route if `/dashboard` fails to build
      },
      {
        source: '/tasks',
        destination: '/api/fallback', // Fallback route if `/mytasks` fails to build
      },
      {
        source: '/profile',
        destination: '/api/fallback', // Fallback route if `/dashboard` fails to build
      },
    ];
  },
};

export default nextConfig;