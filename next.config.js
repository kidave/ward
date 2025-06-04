/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [ 
      {
        protocol: 'https',
        hostname: 'gostxgfnoilfmybaohhx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],  
  // ... other config options
  }
}  

module.exports = nextConfig