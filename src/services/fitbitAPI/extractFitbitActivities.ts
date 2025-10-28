import { Activity, FitbitActivityData, FitbitRawData } from '../../types';
import { convertMillisecondsToDuration } from '../../utils/convertMillisecondsToTime';
import { getDateTimeDataForDatapoints } from '../../utils/getDateTimeData';
// import { getDateTimeDataForDatapoints } from '../../utils/getDateTimeData';

export default function extractFitbitActivities(
  fitbitData: (FitbitRawData | FitbitActivityData)[]
) {
  const fitbitActivitiesData = fitbitData.filter(
    datapointsCollection =>
      Object.keys(datapointsCollection).length === 2 &&
      Object.keys(datapointsCollection)[1] === 'activities'
  ) as FitbitActivityData[];

  const fitbitActivitiesList = fitbitActivitiesData[0].activities;

  const activitiesToAdd: Activity[] = [];

  fitbitActivitiesList.forEach(activity => {
    // Activities that last more than 20 minutes only
    if (
      (activity.duration >= 900000 && activity.activityTypeId !== 90013) ||
      (activity.duration >= 1800000 && activity.activityTypeId === 90013)
    ) {
      const {
        logId,
        startTime,
        activityTypeId,
        activityName,
        activeDuration,
        duration,
        calories,
        averageHeartRate,
        steps,
        heartRateZones,
        activeZoneMinutes,
      } = activity;

      const { month, weekNumber, year } =
        getDateTimeDataForDatapoints(startTime);

      if (activeZoneMinutes.totalMinutes >= 5) {
        activitiesToAdd.push({
          userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
          logId,
          activityTypeId,
          date: activity.startTime.split('T')[0],
          activityName,
          activeDuration: convertMillisecondsToDuration(activeDuration),
          duration: convertMillisecondsToDuration(duration),
          calories,
          averageHeartRate,
          steps,
          weekNumber,
          month,
          year,
          cardioZone: heartRateZones.filter(
            heartrateZone => heartrateZone.name === 'Cardio'
          )[0].minutes,
          fatBurnZone: heartRateZones.filter(
            heartrateZone => heartrateZone.name === 'Fat Burn'
          )[0].minutes,
          peakZone: heartRateZones.filter(
            heartrateZone => heartrateZone.name === 'Peak'
          )[0].minutes,
        });
      }
    }
  });

  return activitiesToAdd;
}
