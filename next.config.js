/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Enable standalone output for Docker
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com', 'localhost', 'omnisignalai.com'],
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    }
    return config
  },
}

module.exports = nextConfig