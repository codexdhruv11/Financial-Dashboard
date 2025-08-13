/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable any experimental features if needed
  },
  images: {
    domains: [],
    remotePatterns: []
  },
  webpack: (config) => {
    // Add any custom webpack configurations here
    return config
  }
}

module.exports = nextConfig
