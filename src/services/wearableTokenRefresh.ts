export async function refreshFitbitToken(refreshToken: string) {
  const clientId = process.env.FITBIT_CLIENT_ID;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Fitbit client credentials');
  }

  const requestBody = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: requestBody,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        'Fitbit refresh failed with status:',
        response.status,
        'Error:',
        errorText
      );
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('Fitbit refresh request failed:', error);
    throw error;
  }
}

export async function refreshOuraToken(refreshToken: string) {
  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Oura client credentials');
  }

  const requestBody = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await fetch('https://api.ouraring.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: requestBody,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        'Oura refresh failed with status:',
        response.status,
        'Error:',
        errorText
      );
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('Oura refresh request failed:', error);
    throw error;
  }
}
