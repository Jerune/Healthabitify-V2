import crypto from 'node:crypto';

import { NextResponse } from 'next/server';

function base64UrlEncode(buffer: Buffer) {
  return buffer
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateVerifierAndChallenge() {
  const verifier = base64UrlEncode(crypto.randomBytes(32));
  const challenge = base64UrlEncode(
    crypto.createHash('sha256').update(verifier).digest()
  );
  return { verifier, challenge };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope =
    url.searchParams.get('scope') ||
    'activity heartrate nutrition sleep profile devices';

  const clientId = process.env.FITBIT_CLIENT_ID;
  const redirectUri = process.env.FITBIT_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new NextResponse('Missing FITBIT_CLIENT_ID or FITBIT_REDIRECT_URI', {
      status: 500,
    });
  }

  const state = base64UrlEncode(crypto.randomBytes(16));
  const { verifier, challenge } = generateVerifierAndChallenge();

  // Build Fitbit authorization URL with PKCE
  const authUrl = new URL('https://www.fitbit.com/oauth2/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('code_challenge', challenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);

  const res = NextResponse.redirect(authUrl.toString());

  // Store PKCE verifier and state in cookies for callback
  const isProd =
    process.env.NODE_ENV === 'production' || redirectUri.startsWith('https://');

  res.cookies.set('fitbit_oauth_state', state, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 10 * 60, // 10 minutes
    path: '/',
  });

  res.cookies.set('fitbit_pkce_verifier', verifier, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 10 * 60, // 10 minutes
    path: '/',
  });

  return res;
}
