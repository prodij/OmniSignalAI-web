/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Removed standalone output to fix Vercel build trace stack overflow
  // Docker builds can use standard output

  // Exclude problematic patterns from build tracing to prevent stack overflow
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild',
        'node_modules/webpack',
        'node_modules/terser',
      ],
    },
  },

  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com', 'localhost', 'omnisignalai.com'],
  },
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin())
    config.infrastructureLogging = {
      level: 'error',
    }
    return config
  },
}

class VeliteWebpackPlugin {
  static started = false
  constructor(/** @type {import('velite').Options} */ options = {}) {
    this.options = options
  }
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // executed three times in nextjs
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return
      VeliteWebpackPlugin.started = true
      const dev = compiler.options.mode === 'development'
      this.options.watch = this.options.watch ?? dev
      this.options.clean = this.options.clean ?? !dev
      // Dynamic import for ESM module
      const { build } = await import('velite')
      await build(this.options) // start velite
    })
  }
}

module.exports = nextConfig