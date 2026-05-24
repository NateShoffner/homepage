import type { NextConfig } from 'next'
import { execSync } from 'child_process'
import path from 'path'

const gitRevision = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
})()

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/assets/files/:file*',
        headers: [{ key: 'Content-Disposition', value: 'attachment' }],
      },
    ]
  },
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_GIT_REVISION: gitRevision,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  sassOptions: {
    includePaths: [
      'src/assets/css',
      path.join(process.cwd(), 'node_modules'),
      path.join(process.cwd(), 'node_modules/bootstrap/scss'),
    ],
  },
}

export default nextConfig
