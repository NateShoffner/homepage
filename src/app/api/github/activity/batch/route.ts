import { NextRequest, NextResponse } from 'next/server'

const CACHE_SECONDS = 3600
const WEEKS = 8
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

async function fetchCommitWeeks(owner: string, repo: string, headers: HeadersInit): Promise<number[]> {
  const since = new Date(Date.now() - WEEKS * WEEK_MS).toISOString()
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?since=${since}&per_page=100`,
    { headers, next: { revalidate: CACHE_SECONDS } }
  )

  if (!res.ok) return []

  const commits: { commit: { author: { date: string } } }[] = await res.json()
  const buckets = Array<number>(WEEKS).fill(0)
  const now = Date.now()

  for (const c of commits) {
    const age = now - new Date(c.commit.author.date).getTime()
    const weekIndex = Math.floor(age / WEEK_MS)
    if (weekIndex >= 0 && weekIndex < WEEKS) {
      buckets[WEEKS - 1 - weekIndex]++
    }
  }

  return buckets
}

export async function GET(request: NextRequest) {
  const reposParam = request.nextUrl.searchParams.get('repos')
  if (!reposParam) return NextResponse.json({})

  const repoPaths = reposParam.split(',').map((r) => r.trim()).filter((r) => r.includes('/'))
  if (repoPaths.length === 0) return NextResponse.json({})

  const headers: HeadersInit = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const results = await Promise.allSettled(
    repoPaths.map(async (path) => {
      const [owner, repo] = path.split('/')
      const weeks = await fetchCommitWeeks(owner, repo, headers)
      return { path, weeks }
    })
  )

  const data: Record<string, number[]> = {}
  for (const result of results) {
    if (result.status === 'fulfilled') {
      data[result.value.path] = result.value.weeks
    }
  }

  return NextResponse.json(data, {
    headers: { 'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate` },
  })
}
