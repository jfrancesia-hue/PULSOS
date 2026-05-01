/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@pulso/ui', '@pulso/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pulso.ar' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
