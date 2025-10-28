async function getLastSyncTime(token: string) {
  // API related Data
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch('/api/fitbit/user/-/devices.json', headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fitbit devices API error:', errorText);
      return 'error';
    }

    const responseData = await response.json();

    if (responseData && responseData[0] && responseData[0].lastSyncTime) {
      const date = responseData[0].lastSyncTime.split('T').slice(0, 1).join();
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
