export default function matchServiceResourcesWithMetricNames(
    source: string,
    resource: string
) {
    let dbMetricName = ''

    if (source === 'fitbit') {
        const shortenedResource = resource.split('-').slice(1, 2).join()
        switch (shortenedResource) {
            case 'activityCalories':
                dbMetricName = 'total-average-calorie-burn'
                break
            case 'steps':
                dbMetricName = 'steps'
                break
            case 'heart':
                dbMetricName = 'heartrate-zones'
                break
            case 'minutesSedentary':
                dbMetricName = 'minutes-sedentary'
                break
            case 'restingHeartRate':
                dbMetricName = 'daily-average-heart-rate'
                break
            default:
                dbMetricName = ''
        }
    } else if (source === 'oura') {
        switch (resource) {
            case 'average_breath':
                dbMetricName = 'respitory-rate'
                break
            case 'average_heart_rate':
                dbMetricName = 'average-resting-heart-rate'
                break
            case 'average_hrv':
                dbMetricName = 'average-resting-hrv'
                break
            case 'bedtime_end':
                dbMetricName = 'average-wake-up'
                break
            case 'bedtime_start':
                dbMetricName = 'average-time-to-bed'
                break
            case 'deep_sleep_duration':
                dbMetricName = 'amount-of-deep-sleep'
                break
            case 'rem_sleep_duration':
                dbMetricName = 'amount-of-rem-sleep'
                break
            case 'total_sleep_duration':
                dbMetricName = 'amount-of-sleep'
                break
            default:
                dbMetricName = 'unknown'
        }
    }
    return dbMetricName
}
