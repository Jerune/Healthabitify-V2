export default function matchServiceResourcesWithMetricNames(
  source: string,
  resource: string
) {
  let dbMetricName = '';

  if (source === 'fitbit') {
    const shortenedResource = resource.includes('activities')
      ? resource.split('-').slice(1, 2).join()
      : resource;

    switch (shortenedResource) {
      case 'activityCalories':
        dbMetricName = 'total-average-calorie-burn';
        break;
      case 'steps':
        dbMetricName = 'steps';
        break;
      case 'active':
        dbMetricName = 'heartrate-zones';
        break;
      case 'minutesSedentary':
        dbMetricName = 'minutes-sedentary';
        break;
      case 'restingHeartRate':
        dbMetricName = 'daily-average-heart-rate';
        break;
      case 'cardioScore':
        dbMetricName = 'vo2-max';
        break;
      default:
        dbMetricName = '';
    }
  } else if (source === 'oura') {
    switch (resource) {
      case 'average_breath':
        dbMetricName = 'respitory-rate';
        break;
      case 'average_heart_rate':
        dbMetricName = 'average-resting-heart-rate';
        break;
      case 'average_hrv':
        dbMetricName = 'average-resting-hrv';
        break;
      case 'bedtime_end':
        dbMetricName = 'average-wake-up';
        break;
      case 'bedtime_start':
        dbMetricName = 'average-time-to-bed';
        break;
      case 'deep_sleep_duration':
        dbMetricName = 'amount-of-deep-sleep';
        break;
      case 'rem_sleep_duration':
        dbMetricName = 'amount-of-rem-sleep';
        break;
      case 'total_sleep_duration':
        dbMetricName = 'amount-of-sleep';
        break;
      case 'spo2_percentage':
        dbMetricName = 'blood-oxygen';
        break;
      case 'vascular_age':
        dbMetricName = 'cardiovascular-age';
        break;
      case 'stress_high':
        dbMetricName = 'stress-minutes';
        break;
      case 'recovery_high':
        dbMetricName = 'recovery-minutes';
        break;
      default:
        dbMetricName = 'unknown';
    }
  }
  return dbMetricName;
}
