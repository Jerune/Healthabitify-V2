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
  const scope = url.searchParams.get('scope') || 'daily.read';

  const clientId = process.env.OURA_CLIENT_ID;
  const redirectUri = process.env.OURA_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new NextResponse('Missing OURA_CLIENT_ID or OURA_REDIRECT_URI', {
      status: 500,
    });
  }

  const state = base64UrlEncode(crypto.randomBytes(16));
  const { verifier, challenge } = generateVerifierAndChallenge();

  // Persist state and PKCE verifier briefly for the callback
  const res = NextResponse.redirect(
    `https://cloud.ouraring.com/oauth/authorize?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`
  );

  res.cookies.set('oura_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 10 * 60,
    path: '/',
  });

  res.cookies.set('oura_pkce_verifier', verifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 10 * 60,
    path: '/',
  });

  return res;
}
