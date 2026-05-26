import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = (() => {
  const domain = process.env.CF_ACCESS_TEAM_DOMAIN
  return domain
    ? createRemoteJWKSet(new URL(`https://${domain}/cdn-cgi/access/certs`))
    : null
})()

export async function middleware(req: NextRequest) {
  if (process.env.CF_ACCESS_BYPASS === 'true') return NextResponse.next()

  const aud = process.env.CF_ACCESS_AUD
  if (!JWKS || !aud) {
    return new NextResponse('Auth misconfigured', { status: 500 })
  }

  const token = req.headers.get('CF-Access-JWT-Assertion')
  const loginUrl = `https://${process.env.CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/login/${req.nextUrl.hostname}?redirect_url=${encodeURIComponent(req.url)}`

  if (!token) {
    return NextResponse.redirect(loginUrl)
  }

  try {
    await jwtVerify(token, JWKS, { audience: aud })
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/resume/:path*'],
}
