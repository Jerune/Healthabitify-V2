import { Params } from 'next/dist/server/request/params'

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  const path = params.path
  if (!path || !Array.isArray(path)) {
    return new Response('Invalid path parameter', { status: 400 })
  }
  
  const upstreamUrl = new URL(
    `https://api.fitbit.com/1/${path.join("/")}${
      new URL(req.url).search
    }`
  )

  // Read access token from cookie set during OAuth callback
  const cookieHeader = req.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map((c) => c.trim().split('='))
      .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
  ) as Record<string, string>
  const accessToken = cookies['fitbit_access_token']

  // Allow Authorization header as fallback for testing
  const headerAuth = req.headers.get('authorization')
  
  if (!accessToken && !headerAuth) {
    return new Response('No Fitbit access token found. Please authorize first.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: 'GET',
    headers: {
      Authorization: headerAuth || `Bearer ${accessToken}`,
      'Content-Type': req.headers.get('content-type') ?? 'application/json',
    },
    cache: 'no-store',
  })

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: {
      'content-type':
        upstreamResponse.headers.get('content-type') || 'application/json',
    },
  })
}


