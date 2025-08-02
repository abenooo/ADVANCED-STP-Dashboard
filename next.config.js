/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better production performance
  experimental: {
    serverComponentsExternalPackages: ['resend'],
  },
  
  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Headers for better CORS and security in production
  async headers() {
    return [
      {
        // Apply headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie'
          },
        ]
      },
      {
        // Security headers for all pages
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Redirects for better SEO and user experience
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'token',
            value: undefined
          }
        ]
      }
    ]
  },

  // Image optimization settings
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Webpack configuration for better production builds
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
    }
    
    return config
  },

  // Output configuration for static exports if needed
  output: 'standalone',

  // Disable powered by header for security
  poweredByHeader: false,

  // Compression for better performance
  compress: true,

  // Generate source maps in production for debugging
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
