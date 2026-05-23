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
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_GIT_REVISION: gitRevision,
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
