import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (!code || !state) {
    return new NextResponse('Missing code or state', { status: 400 })
  }

  const cookies = Object.fromEntries(
    (req.headers.get('cookie') || '')
      .split(';')
      .map((c) => c.trim().split('='))
      .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
  )

  if (cookies['fitbit_oauth_state'] !== state) {
    return new NextResponse('Invalid state', { status: 400 })
  }

  const clientId = process.env.FITBIT_CLIENT_ID
  const clientSecret = process.env.FITBIT_CLIENT_SECRET
  const redirectUri = process.env.FITBIT_REDIRECT_URI
  const verifier = cookies['fitbit_pkce_verifier']

  if (!clientId || !clientSecret || !redirectUri || !verifier) {
    return new NextResponse('Missing env or verifier', { status: 500 })
  }

  // Exchange authorization code for tokens using PKCE
  const tokenRes = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
    cache: 'no-store',
  })

  if (!tokenRes.ok) {
    const errText = await tokenRes.text()
    return new NextResponse(`Token error: ${errText}`, { status: 500 })
  }

  const tokenJson = await tokenRes.json()
  const accessToken = tokenJson.access_token as string
  const refreshToken = tokenJson.refresh_token as string
  const userId = tokenJson.user_id as string

  const res = NextResponse.redirect(new URL('/', req.url))
  
  // Store tokens in httpOnly cookies
  const isProd = process.env.NODE_ENV === 'production' || (process.env.FITBIT_REDIRECT_URI || '').startsWith('https://')
  
  res.cookies.set('fitbit_access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  
  res.cookies.set('fitbit_refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })
  
  res.cookies.set('fitbit_user_id', userId, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })

  // Clean temp cookies
  res.cookies.set('fitbit_oauth_state', '', { maxAge: 0, path: '/' })
  res.cookies.set('fitbit_pkce_verifier', '', { maxAge: 0, path: '/' })

  return res
}
