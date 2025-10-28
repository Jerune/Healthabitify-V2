import { NextRequest, NextResponse } from 'next/server';

import getWearables from '@/firebase/firestore/wearables/getWearables';
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

    if (!platform || (platform !== 'fitbit' && platform !== 'oura')) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    // Get wearables data from database to get refresh tokens
    const wearablesData = await getWearables();
    if (wearablesData instanceof Error) {
      console.error('Failed to get wearables data:', wearablesData);
      return NextResponse.json(
        { error: 'Failed to get wearables data' },
        { status: 500 }
      );
    }

    if (platform === 'fitbit') {
      const refreshToken = wearablesData.fitbit?.refreshToken;

      if (!refreshToken) {
        return NextResponse.json(
          {
            error: 'No refresh token available',
            action: 'reauthorize',
            platform: 'fitbit',
            authUrl: '/api/fitbit/auth',
          },
          { status: 401 }
        );
      }

      try {
        const tokens = await refreshFitbitToken(refreshToken);

        // Update Firebase with new token
        try {
          await updateWearables('fitbit', 'token', tokens.access_token);

          // Also update the refresh token in the database
          if (tokens.refresh_token) {
            await updateWearables(
              'fitbit',
              'refreshToken',
              tokens.refresh_token
            );
          }
        } catch (error) {
          console.error('Failed to update Fitbit token in Firebase:', error);
        }

        // Create response with new tokens
        const response = NextResponse.json({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });

        // Update cookies with new tokens to keep them in sync
        if (tokens.access_token) {
          const isProd = process.env.NODE_ENV === 'production';
          response.cookies.set('fitbit_access_token', tokens.access_token, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            path: '/',
          });
        }

        if (tokens.refresh_token) {
          const isProd = process.env.NODE_ENV === 'production';
          response.cookies.set('fitbit_refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            path: '/',
          });
        }

        return response;
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
      const refreshToken = wearablesData.oura?.refreshToken;

      if (!refreshToken) {
        return NextResponse.json(
          {
            error: 'No refresh token available',
            action: 'reauthorize',
            platform: 'oura',
            authUrl: '/api/oura/auth',
          },
          { status: 401 }
        );
      }

      try {
        const tokens = await refreshOuraToken(refreshToken);

        // Update Firebase with new token
        try {
          await updateWearables('oura', 'token', tokens.access_token);

          // Also update the refresh token in the database
          if (tokens.refresh_token) {
            await updateWearables('oura', 'refreshToken', tokens.refresh_token);
          }
        } catch (error) {
          console.error('Failed to update Oura token in Firebase:', error);
        }

        // Create response with new tokens
        const response = NextResponse.json({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });

        // Update cookies with new tokens to keep them in sync
        if (tokens.access_token) {
          response.cookies.set('oura_access_token', tokens.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
          });
        }

        if (tokens.refresh_token) {
          response.cookies.set('oura_refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
          });
        }

        return response;
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
