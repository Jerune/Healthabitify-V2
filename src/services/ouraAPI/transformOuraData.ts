import {
  DataPoint,
  OuraCardiovascularAgeResponse,
  OuraDailySummary,
  OuraRawData,
  OuraSpo2Response,
  OuraVO2maxResponse,
} from '../../types';
import { getDateTimeDataForDatapoints } from '../../utils/getDateTimeData';
import matchServiceResourcesWithMetricNames from '../matchResources';

export default async function transformOuraData(
  ouraRawData: OuraRawData
): Promise<DataPoint[]> {
  const datapointsToAdd: DataPoint[] = [];
  const source = 'oura';

  console.log(ouraRawData);

  // Handle different Oura response types
  ouraRawData.data.forEach(resource => {
    // Handle OuraDailySummary (sleep data)
    if ('type' in resource && resource.type === 'long_sleep') {
      const dailySummary = resource as OuraDailySummary;
      Object.keys(dailySummary).forEach(key => {
        const metric = matchServiceResourcesWithMetricNames(source, key);
        const dataValue = dailySummary[key as keyof OuraDailySummary];

        // Skip if metric is unknown or if the value is not a number/string
        if (
          metric === 'unknown' ||
          (typeof dataValue !== 'number' && typeof dataValue !== 'string')
        ) {
          return;
        }

        // Always have number or string value output
        const value =
          typeof dataValue === 'number' ? dataValue : String(dataValue);
        const date = dailySummary.day;
        const { month, weekNumber, year } = getDateTimeDataForDatapoints(date);

        const newDatapoint: DataPoint = {
          userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
          value,
          date,
          source,
          metric,
          weekNumber,
          month,
          year,
        };
        datapointsToAdd.push(newDatapoint);
      });
    }

    // Handle OuraVO2maxResponse
    else if ('vo2_max' in resource) {
      const vo2Data = resource as OuraVO2maxResponse;
      const metric = matchServiceResourcesWithMetricNames(source, 'vo2_max');
      if (metric !== 'unknown') {
        const date = vo2Data.day;
        const { month, weekNumber, year } = getDateTimeDataForDatapoints(date);

        const newDatapoint: DataPoint = {
          userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
          value: vo2Data.vo2_max,
          date,
          source,
          metric,
          weekNumber,
          month,
          year,
        };
        datapointsToAdd.push(newDatapoint);
      }
    }

    // Handle OuraCardiovascularAgeResponse
    else if ('vascular_age' in resource) {
      const cardioData = resource as OuraCardiovascularAgeResponse;
      const metric = matchServiceResourcesWithMetricNames(
        source,
        'vascular_age'
      );
      if (metric !== 'unknown') {
        const date = cardioData.day;
        const { month, weekNumber, year } = getDateTimeDataForDatapoints(date);

        const newDatapoint: DataPoint = {
          userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
          value: cardioData.vascular_age,
          date,
          source,
          metric,
          weekNumber,
          month,
          year,
        };
        datapointsToAdd.push(newDatapoint);
      }
    }

    // Handle OuraSpo2Response
    else if ('spo2_percentage' in resource) {
      const spo2Data = resource as OuraSpo2Response;
      const metric = matchServiceResourcesWithMetricNames(
        source,
        'spo2_percentage'
      );
      if (metric !== 'unknown') {
        const date = spo2Data.day;
        const { month, weekNumber, year } = getDateTimeDataForDatapoints(date);

        // Handle spo2_percentage which has an average property
        const value = spo2Data.spo2_percentage.average;

        const newDatapoint: DataPoint = {
          userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
          value,
          date,
          source,
          metric,
          weekNumber,
          month,
          year,
        };
        datapointsToAdd.push(newDatapoint);
      }
    }
  });

  return datapointsToAdd;
}
