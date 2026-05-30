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
  serverExternalPackages: ['@react-pdf/renderer'],
  async redirects() {
    return [
      { source: '/resume', destination: '/work/resume', permanent: true },
      { source: '/resume/view', destination: '/work/resume', permanent: true },
      { source: '/resume/view/print', destination: '/work/resume/print', permanent: true },
      { source: '/resume/pdf', destination: '/work/resume/pdf', permanent: true },
      { source: '/certifications', destination: '/work/certifications', permanent: true },
    ]
  },
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
    silenceDeprecations: ['import', 'mixed-decls', 'color-functions', 'global-builtin'],
  },
}

export default nextConfig
