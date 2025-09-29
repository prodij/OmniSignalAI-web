/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer')

const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    }
    return config
  },
}

module.exports = withContentlayer(nextConfig)