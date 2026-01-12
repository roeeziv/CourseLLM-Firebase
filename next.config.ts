import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    console.log("⚡ Proxy rewrites are loading...");
    return [
      // 🟢 1. NEW RULE: Fixes the 404 from your screenshot
      {
        source: '/identitytoolkit.googleapis.com/:path*',
        destination: 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/:path*',
      },
      // 🟢 2. Standard Auth Rules (Keep these)
      {
        source: '/identitytoolkit/:path*',
        destination: 'http://127.0.0.1:9099/identitytoolkit/:path*',
      },
      {
        source: '/securetoken/:path*',
        destination: 'http://127.0.0.1:9099/securetoken/:path*',
      },
      {
        source: '/emulator/:path*',
        destination: 'http://127.0.0.1:9099/emulator/:path*',
      },
      {
        source: '/__/auth/:path*',
        destination: 'http://127.0.0.1:9099/__/auth/:path*',
      },
    ];
  },

  // ... keep your other settings (reactStrictMode, typescript, etc.) ...
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
    ],
  },
};

export default nextConfig;