function getSourceData(source: string) {
  let baseUrl = '';
  let resources: string[] = [];

  switch (source) {
    case 'oura':
      baseUrl = 'https://api.ouraring.com';
      resources = [
        'sleep',
        'daily_stress',
        'daily_cardiovascular_age',
        'daily_spo2',
      ];
      break;
    case 'fitbit':
      baseUrl = 'https://api.fitbit.com/1/user/-/activities';
      resources = [
        'activityCalories',
        'steps',
        'minutesSedentary',
        'active-zone-minutes',
        'restingHeartRate',
        'cardioscore',
        'list',
      ];
      break;
    default:
      baseUrl = '';
      resources = [];
  }

  return { baseUrl, resources };
}

export default getSourceData;
