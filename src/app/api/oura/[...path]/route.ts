export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const upstreamUrl = new URL(
    `https://api.ouraring.com/v2/${params.path.join("/")}${
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
  const accessToken = cookies['oura_access_token']

  const headerAuth = req.headers.get('authorization')
  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: 'GET',
    headers: {
      Authorization: headerAuth || (accessToken ? `Bearer ${accessToken}` : ''),
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


