/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: NEXT_PUBLIC_API_URL should be set in Vercel environment variables
  // Default fallback for local development
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://loan-management-system-pxkz.onrender.com/api',
  },
}

module.exports = nextConfig

