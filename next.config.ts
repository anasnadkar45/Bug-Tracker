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
    ];
  },
};

export default nextConfig;