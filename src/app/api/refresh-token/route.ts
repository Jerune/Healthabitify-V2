import { NextRequest, NextResponse } from 'next/server';

import updateWearables from '@/firebase/firestore/wearables/updateWearables';
import {
  refreshFitbitToken,
  refreshOuraToken,
} from '@/services/wearableTokenRefresh';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables first
    const fitbitClientId = process.env.FITBIT_CLIENT_ID;
    const fitbitClientSecret = process.env.FITBIT_CLIENT_SECRET;
    const ouraClientId = process.env.OURA_CLIENT_ID;
    const ouraClientSecret = process.env.OURA_CLIENT_SECRET;

    console.log('Environment variables check:', {
      fitbitClientId: fitbitClientId ? 'present' : 'missing',
      fitbitClientSecret: fitbitClientSecret ? 'present' : 'missing',
      ouraClientId: ouraClientId ? 'present' : 'missing',
      ouraClientSecret: ouraClientSecret ? 'present' : 'missing',
    });

    // Validate required environment variables
    if (
      !fitbitClientId ||
      !fitbitClientSecret ||
      !ouraClientId ||
      !ouraClientSecret
    ) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

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
      console.log(
        'Fitbit refresh token value:',
        refreshToken ? refreshToken.substring(0, 20) + '...' : 'missing'
      );
      console.log(
        'Fitbit refresh token length:',
        refreshToken ? refreshToken.length : 0
      );
      console.log('Fitbit refresh token full value:', refreshToken);

      if (!refreshToken) {
        console.log('No Fitbit refresh token found in cookies');
        return NextResponse.json(
          { error: 'No refresh token available' },
          { status: 400 }
        );
      }

      try {
        console.log('Calling refreshFitbitToken...');
        const tokens = await refreshFitbitToken(refreshToken);
        console.log('Fitbit token refresh successful, tokens received:', {
          access_token: tokens.access_token ? 'present' : 'missing',
          refresh_token: tokens.refresh_token ? 'present' : 'missing',
          expires_in: tokens.expires_in || 'missing',
        });

        // Update Firebase with new token and expiration date
        try {
          const expiresAt = new Date();
          expiresAt.setTime(expiresAt.getTime() + tokens.expires_in * 1000);
          const tokenExpiresOn = expiresAt.toISOString().split('T')[0]; // YYYY-MM-DD

          console.log(
            'Updating Firebase with new Fitbit token, expires on:',
            tokenExpiresOn
          );
          await updateWearables('fitbit', 'token', tokens.access_token);
          await updateWearables('fitbit', 'tokenExpiresOn', tokenExpiresOn);
          console.log('Firebase update successful');
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
      } catch (refreshError) {
        console.error('Fitbit token refresh failed:', refreshError);
        const errorMessage =
          refreshError instanceof Error
            ? refreshError.message
            : 'Unknown error';
        return NextResponse.json(
          { error: `Fitbit token refresh failed: ${errorMessage}` },
          { status: 500 }
        );
      }
    } else if (platform === 'oura') {
      const refreshToken = cookies['oura_refresh_token'];
      console.log('Oura refresh token present:', !!refreshToken);
      console.log(
        'Oura refresh token value:',
        refreshToken ? refreshToken.substring(0, 20) + '...' : 'missing'
      );
      console.log(
        'Oura refresh token length:',
        refreshToken ? refreshToken.length : 0
      );
      console.log('Oura refresh token full value:', refreshToken);

      if (!refreshToken) {
        console.log('No Oura refresh token found in cookies');
        return NextResponse.json(
          { error: 'No refresh token available' },
          { status: 400 }
        );
      }

      try {
        console.log('Calling refreshOuraToken...');
        const tokens = await refreshOuraToken(refreshToken);
        console.log('Oura token refresh successful, tokens received:', {
          access_token: tokens.access_token ? 'present' : 'missing',
          refresh_token: tokens.refresh_token ? 'present' : 'missing',
          expires_in: tokens.expires_in || 'missing',
        });

        // Update Firebase with new token and expiration date
        try {
          const expiresAt = new Date();
          expiresAt.setTime(expiresAt.getTime() + tokens.expires_in * 1000);
          const tokenExpiresOn = expiresAt.toISOString().split('T')[0]; // YYYY-MM-DD

          console.log(
            'Updating Firebase with new Oura token, expires on:',
            tokenExpiresOn
          );
          await updateWearables('oura', 'token', tokens.access_token);
          await updateWearables('oura', 'tokenExpiresOn', tokenExpiresOn);
          console.log('Firebase update successful');
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
      } catch (refreshError) {
        console.error('Oura token refresh failed:', refreshError);
        const errorMessage =
          refreshError instanceof Error
            ? refreshError.message
            : 'Unknown error';
        return NextResponse.json(
          { error: `Oura token refresh failed: ${errorMessage}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to refresh token: ${errorMessage}` },
      { status: 500 }
    );
  }
}
