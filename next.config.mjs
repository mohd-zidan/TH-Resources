import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore cloudflare-specific modules during server-side builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'cloudflare:sockets': false,
      }

      // Also add to externals to prevent bundling
      config.externals = config.externals || []
      config.externals.push('cloudflare:sockets')
    }
    return config
  },

  // Fix the turbopack deprecation warning
  turbopack: true,
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
