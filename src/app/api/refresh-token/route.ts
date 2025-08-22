import { NextRequest, NextResponse } from 'next/server';

import updateWearables from '@/firebase/firestore/wearables/updateWearables';
import {
  refreshFitbitToken,
  refreshOuraToken,
} from '@/services/wearableTokenRefresh';

export async function POST(request: NextRequest) {
  try {
    const { platform } = await request.json();
    console.log('Refresh token request for platform:', platform);

    if (!platform || (platform !== 'fitbit' && platform !== 'oura')) {
      console.log('Invalid platform:', platform);
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    // Get cookies
    const cookies = Object.fromEntries(
      (request.headers.get('cookie') || '')
        .split(';')
        .map(c => c.trim().split('='))
        .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
    );

    console.log('Available cookies:', Object.keys(cookies));
    console.log('Cookie header:', request.headers.get('cookie'));

    if (platform === 'fitbit') {
      const refreshToken = cookies['fitbit_refresh_token'];
      console.log('Fitbit refresh token present:', !!refreshToken);

      if (!refreshToken) {
        console.log('No Fitbit refresh token found in cookies');
        return NextResponse.json(
          { error: 'No refresh token available' },
          { status: 400 }
        );
      }

      const tokens = await refreshFitbitToken(refreshToken);

      // Update Firebase with new token and expiration date
      try {
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + tokens.expires_in * 1000);
        const tokenExpiresOn = expiresAt.toISOString().split('T')[0]; // YYYY-MM-DD

        await updateWearables('fitbit', 'token', tokens.access_token);
        await updateWearables('fitbit', 'tokenExpiresOn', tokenExpiresOn); // Store calculated date for validation
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
      console.log('Oura refresh token present:', !!refreshToken);

      if (!refreshToken) {
        console.log('No Oura refresh token found in cookies');
        return NextResponse.json(
          { error: 'No refresh token available' },
          { status: 400 }
        );
      }

      const tokens = await refreshOuraToken(refreshToken);

      // Update Firebase with new token and expiration date
      try {
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + tokens.expires_in * 1000);
        const tokenExpiresOn = expiresAt.toISOString().split('T')[0]; // YYYY-MM-DD

        await updateWearables('oura', 'token', tokens.access_token);
        await updateWearables('oura', 'tokenExpiresOn', tokenExpiresOn); // Store calculated date for validation
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
