import {
  DataPoint,
  FitbitActivityData,
  FitbitData,
  FitbitRawData,
  HeartRateZoneData,
  Vo2maxData,
} from '../../types';
import { getDateTimeDataForDatapoints } from '../../utils/getDateTimeData';
import matchServiceResourcesWithMetricNames from '../matchResources';

export default function transformFitbitData(
  fitbitData: (FitbitRawData | FitbitActivityData)[]
) {
  const source = 'fitbit';

  const fitbitDirectDatapoints = fitbitData.filter(
    datapointsCollection => Object.keys(datapointsCollection).length === 1
  ) as FitbitRawData[];

  const datapointsToAdd = fitbitDirectDatapoints.map(datapointsCollection => {
    const resourceNameFromAPI = Object.keys(datapointsCollection)[0];
    const metric = matchServiceResourcesWithMetricNames(
      source,
      resourceNameFromAPI
    );

    const newDataPoints: DataPoint[] = [];

    datapointsCollection[resourceNameFromAPI].forEach(
      (datapoint: FitbitData) => {
        const date = datapoint.dateTime;

        // Manage all datapoints from activities summary
        // Except heartrate zones and vo2max values
        if (
          metric !== 'heartrate-zones' &&
          metric !== 'cardioscore' &&
          typeof datapoint.value === 'string'
        ) {
          const { value } = datapoint;
          const { month, weekNumber, year } =
            getDateTimeDataForDatapoints(date);
          newDataPoints.push({
            userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
            value,
            date,
            source,
            metric,
            weekNumber,
            month,
            year,
          });
        }

        // Get lowest value of cardioscore (Vo2max)
        if (metric === 'vo2-max' && typeof datapoint.value !== 'string') {
          const { value } = datapoint;
          const { vo2Max } = value as Vo2maxData;
          const lowestValue = vo2Max.split('-')[0];
          const { month, weekNumber, year } =
            getDateTimeDataForDatapoints(date);
          newDataPoints.push({
            userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
            value: lowestValue,
            date,
            source,
            metric,
            weekNumber,
            month,
            year,
          });
        }

        // Get heartrate zones data
        if (
          metric === 'heartrate-zones' &&
          typeof datapoint.value !== 'string'
        ) {
          const metricNames = {
            activeZoneMinutes: 'active-zone-minutes',
            fatBurnActiveZoneMinutes: 'fat-burn-zone',
            cardioActiveZoneMinutes: 'cardio-zone',
            peakActiveZoneMinutes: 'peak-zone',
          };

          const { value } = datapoint;
          const heartRateZones = value as HeartRateZoneData;
          Object.entries(heartRateZones).forEach(heartRateZone => {
            const [name, minutes] = heartRateZone;
            const { month, weekNumber, year } =
              getDateTimeDataForDatapoints(date);
            newDataPoints.push({
              userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
              value: minutes,
              date,
              source,
              metric: metricNames[name as keyof typeof metricNames],
              weekNumber,
              month,
              year,
            });
          });
        }
      }
    );
    return newDataPoints;
  });

  return datapointsToAdd;
}
