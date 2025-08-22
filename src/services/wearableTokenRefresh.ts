export async function refreshFitbitToken(refreshToken: string) {
  const clientId = process.env.FITBIT_CLIENT_ID;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET;

  console.log(
    'Refreshing Fitbit token with client ID:',
    clientId ? 'present' : 'missing'
  );

  if (!clientId || !clientSecret) {
    throw new Error('Missing Fitbit client credentials');
  }

  const requestBody = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  console.log('Fitbit refresh request body:', requestBody.toString());
  console.log('Fitbit refresh token being sent:', refreshToken);

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

    console.log('Fitbit refresh response status:', response.status);
    console.log(
      'Fitbit refresh response headers:',
      Object.fromEntries(response.headers.entries())
    );

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
    console.log('=== FITBIT REFRESH RESPONSE ===');
    console.log('Full response data:', JSON.stringify(responseData, null, 2));
    console.log('Response keys:', Object.keys(responseData));
    console.log('Access token present:', !!responseData.access_token);
    console.log('Refresh token present:', !!responseData.refresh_token);
    console.log('Expires in present:', !!responseData.expires_in);
    console.log('Expires in value:', responseData.expires_in);
    console.log('User ID present:', !!responseData.user_id);
    console.log('User ID value:', responseData.user_id);
    console.log('=== END FITBIT RESPONSE ===');

    return responseData;
  } catch (error) {
    console.error('Fitbit refresh request failed:', error);
    throw error;
  }
}

export async function refreshOuraToken(refreshToken: string) {
  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;

  console.log(
    'Refreshing Oura token with client ID:',
    clientId ? 'present' : 'missing'
  );

  if (!clientId || !clientSecret) {
    throw new Error('Missing Oura client credentials');
  }

  const requestBody = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  console.log('Oura refresh request body:', requestBody.toString());
  console.log('Oura refresh token being sent:', refreshToken);

  try {
    const response = await fetch('https://api.ouraring.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: requestBody,
      cache: 'no-store',
    });

    console.log('Oura refresh response status:', response.status);
    console.log(
      'Oura refresh response headers:',
      Object.fromEntries(response.headers.entries())
    );

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
    console.log('=== OURA REFRESH RESPONSE ===');
    console.log('Full response data:', JSON.stringify(responseData, null, 2));
    console.log('Response keys:', Object.keys(responseData));
    console.log('Access token present:', !!responseData.access_token);
    console.log('Refresh token present:', !!responseData.refresh_token);
    console.log('Expires in present:', !!responseData.expires_in);
    console.log('Expires in value:', responseData.expires_in);
    console.log('Token type present:', !!responseData.token_type);
    console.log('Token type value:', responseData.token_type);
    console.log('Scope present:', !!responseData.scope);
    console.log('Scope value:', responseData.scope);
    console.log('=== END OURA RESPONSE ===');

    return responseData;
  } catch (error) {
    console.error('Oura refresh request failed:', error);
    throw error;
  }
}
