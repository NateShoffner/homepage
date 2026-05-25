import { NextRequest, NextResponse } from 'next/server'

const REVALIDATE_SECONDS = 3600

export async function GET(request: NextRequest) {
  const usernames = request.nextUrl.searchParams
    .get('usernames')
    ?.split(',')
    .map((u) => u.trim())
    .filter(Boolean) ?? []

  if (usernames.length === 0) {
    return NextResponse.json([])
  }

  const headers: HeadersInit = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const results = await Promise.allSettled(
    usernames.map((username) =>
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
        { headers, next: { revalidate: REVALIDATE_SECONDS } }
      ).then((r) => (r.ok ? r.json() : []))
    )
  )

  const repos = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))

  return NextResponse.json(repos, {
    headers: { 'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate` },
  })
}
