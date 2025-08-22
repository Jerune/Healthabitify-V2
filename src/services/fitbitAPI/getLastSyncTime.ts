async function getLastSyncTime(token: string) {
  // API related Data
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    console.log(
      'Calling Fitbit devices API with token:',
      token ? 'present' : 'missing'
    );
    const response = await fetch('/api/fitbit/user/-/devices.json', headers);
    console.log('Fitbit devices API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fitbit devices API error:', errorText);
      return 'error';
    }

    const responseData = await response.json();
    console.log('Fitbit devices API response data:', responseData);

    if (responseData && responseData[0] && responseData[0].lastSyncTime) {
      const date = responseData[0].lastSyncTime.split('T').slice(0, 1).join();
      console.log('Extracted lastSyncTime:', date);
      return date;
    } else {
      console.error('No lastSyncTime found in response:', responseData);
      return 'error';
    }
  } catch (error) {
    console.error('Error calling Fitbit devices API:', error);
  }

  return 'error';
}

export default getLastSyncTime;
