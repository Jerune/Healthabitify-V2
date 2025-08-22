import { NextRequest, NextResponse } from 'next/server';

import updateWearables from '@/firebase/firestore/wearables/updateWearables';
import {
  isTokenExpiringSoon,
  refreshFitbitToken,
  refreshOuraToken,
} from '@/services/tokenRefresh';

export async function POST(request: NextRequest) {
  try {
    const { platform } = await request.json();

    if (!platform || (platform !== 'fitbit' && platform !== 'oura')) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    // Get cookies
    const cookies = Object.fromEntries(
      (request.headers.get('cookie') || '')
        .split(';')
        .map(c => c.trim().split('='))
        .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
    );

    if (platform === 'fitbit') {
      const refreshToken = cookies['fitbit_refresh_token'];
      const expiresAt = parseInt(cookies['fitbit_token_expires_at'] || '0');

      if (!refreshToken) {
        return NextResponse.json(
          { error: 'No refresh token available' },
          { status: 400 }
        );
      }

      // Check if token expires in less than 1 week
      if (!isTokenExpiringSoon(expiresAt, 7 * 24 * 60)) {
        // 7 days in minutes
        return NextResponse.json({ message: 'Token not expiring soon' });
      }

      const tokens = await refreshFitbitToken(refreshToken);

      // Update Firebase with new token and expiration date
      try {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);
        const tokenExpiresOn = expiresAt.toISOString().split('T')[0]; // YYYY-MM-DD

        await updateWearables('fitbit', 'token', tokens.access_token);
        await updateWearables('fitbit', 'tokenExpiresOn', tokenExpiresOn);
      } catch (error) {
        console.error('Failed to update Fitbit token in Firebase:', error);
      }

      // Return new tokens and expiration info
      return NextResponse.json({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
      });
    } else if (platform === 'oura') {
      const refreshToken = cookies['oura_refresh_token'];
      const expiresAt = parseInt(cookies['oura_token_expires_at'] || '0');

      if (!refreshToken) {
        return NextResponse.json(
          { error: 'No refresh token available' },
          { status: 400 }
        );
      }

      // Check if token expires in less than 1 week
      if (!isTokenExpiringSoon(expiresAt, 7 * 24 * 60)) {
        // 7 days in minutes
        return NextResponse.json({ message: 'Token not expiring soon' });
      }

      const tokens = await refreshOuraToken(refreshToken);

      // Update Firebase with new token and expiration date
      try {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);
        const tokenExpiresOn = expiresAt.toISOString().split('T')[0]; // YYYY-MM-DD

        await updateWearables('oura', 'token', tokens.access_token);
        await updateWearables('oura', 'tokenExpiresOn', tokenExpiresOn);
      } catch (error) {
        console.error('Failed to update Oura token in Firebase:', error);
      }

      // Return new tokens and expiration info
      return NextResponse.json({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
      });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
