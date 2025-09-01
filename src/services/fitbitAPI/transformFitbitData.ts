import { DataPoint, FitbitData, FitbitRawData } from '../../types';
import { getDateTimeDataForDatapoints } from '../../utils/getDateTimeData';
import matchServiceResourcesWithMetricNames from '../matchResources';

export default function transformFitbitData(fitbitData: FitbitRawData[]) {
  const source = 'fitbit';

  console.log(fitbitData);
  const datapointsToAdd = fitbitData.map(datapointsCollection => {
    const resourceNameFromAPI = Object.keys(datapointsCollection)[0];
    const metric = matchServiceResourcesWithMetricNames(
      source,
      resourceNameFromAPI
    );

    const newDataPoints: DataPoint[] = [];

    datapointsCollection[resourceNameFromAPI].forEach(
      (datapoint: FitbitData) => {
        const date = datapoint.dateTime;
        if (
          metric !== 'heartrate-zones' &&
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

        if (
          metric === 'heartrate-zones' &&
          typeof datapoint.value !== 'string'
        ) {
          datapoint.value.heartRateZones.forEach(heartRateZone => {
            if (heartRateZone.name !== 'Out of Range') {
              const metricName = `${heartRateZone.name
                .split(' ')
                .join('-')
                .toLowerCase()}-zone`;
              const value = heartRateZone.minutes;
              const { month, weekNumber, year } =
                getDateTimeDataForDatapoints(date);
              newDataPoints.push({
                userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
                value,
                date,
                source,
                metric: metricName,
                weekNumber,
                month,
                year,
              });
            }
          });
        }
      }
    );
    return newDataPoints;
  });

  return datapointsToAdd;
}
