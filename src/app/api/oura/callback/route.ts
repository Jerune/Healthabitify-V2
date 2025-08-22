import { NextResponse } from 'next/server';

import updateWearables from '@/firebase/firestore/wearables/updateWearables';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    return new NextResponse('Missing code or state', { status: 400 });
  }

  const cookies = Object.fromEntries(
    (req.headers.get('cookie') || '')
      .split(';')
      .map(c => c.trim().split('='))
      .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
  );

  if (cookies['oura_oauth_state'] !== state) {
    return new NextResponse('Invalid state', { status: 400 });
  }

  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;
  const redirectUri = process.env.OURA_REDIRECT_URI;
  const verifier = cookies['oura_pkce_verifier'];

  if (!clientId || !clientSecret || !redirectUri || !verifier) {
    return new NextResponse('Missing env or verifier', { status: 500 });
  }

  const tokenRes = await fetch('https://api.ouraring.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
    cache: 'no-store',
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    return new NextResponse(`Token error: ${errText}`, { status: 500 });
  }

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token as string;
  const refreshToken = tokenJson.refresh_token as string; // Check if Oura provides refresh tokens
  const expiresIn = tokenJson.expires_in as number;

  // Calculate expiration date in YYYY-MM-DD format
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
  const tokenExpiresOn = expiresAt.toISOString().split('T')[0]; // YYYY-MM-DD

  // Update Firebase wearables collection with new token and expiration
  try {
    await updateWearables('oura', 'token', accessToken);
    await updateWearables('oura', 'tokenExpiresOn', tokenExpiresOn);
  } catch (error) {
    console.error('Failed to update Oura access token:', error);
  }

  const res = NextResponse.redirect(new URL('/wearable-auth-success', req.url));

  // Calculate expiration time in seconds from now
  const expiresAtCookie = Math.floor(Date.now() / 1000) + expiresIn;

  res.cookies.set('oura_access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: expiresIn, // Use actual expiration from API
    path: '/',
  });

  // Store refresh token if available (Oura might not provide this)
  if (refreshToken) {
    res.cookies.set('oura_refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
  }

  // Store expiration timestamp for refresh logic
  res.cookies.set('oura_token_expires_at', expiresAtCookie.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });

  // Clean temp cookies
  res.cookies.set('oura_oauth_state', '', { maxAge: 0, path: '/' });
  res.cookies.set('oura_pkce_verifier', '', { maxAge: 0, path: '/' });

  return res;
}
