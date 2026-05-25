import { NextRequest, NextResponse } from 'next/server'

const CACHE_SECONDS = 3600

async function poll(owner: string, repo: string, headers: HeadersInit, maxAttempts = 5, delayMs = 2000): Promise<{ weeks: number[]; pending: boolean }> {
  for (let i = 0; i < maxAttempts; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, delayMs))

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
      { headers, cache: 'no-store' }
    )

    if (res.status === 202) continue
    if (!res.ok) return { weeks: [], pending: false }

    const data: { week: number; total: number }[] = await res.json()
    return { weeks: data.map((w) => w.total), pending: false }
  }

  return { weeks: [], pending: true }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const owner = searchParams.get('owner')
  const repo = searchParams.get('repo')

  if (!owner || !repo) {
    return NextResponse.json({ weeks: [], pending: false }, { status: 400 })
  }

  const headers: HeadersInit = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const result = await poll(owner, repo, headers)

  if (result.pending) {
    return NextResponse.json({ weeks: [], pending: true })
  }

  return NextResponse.json({ weeks: result.weeks, pending: false }, {
    headers: { 'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate` },
  })
}
