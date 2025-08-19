import { DatapointsReturn } from '../../types';
import { Averages, AveragesReturn } from '../_types';

import calculateAmountAverage from './calculateAmountAverage';
import calculateAutoAverages from './calculateAutoAverages';
import calculateDurationAverage from './calculateDurationAverage';
import calculateTimeAverage from './calculateTimeAverage';

async function calculateAveragesForPeriod(
  periodData: DatapointsReturn
): Promise<AveragesReturn> {
  const { period, data } = periodData;
  const allAverages: Averages = {};

  data.forEach(metric => {
    const name = Object.keys(metric)[0];
    const { type } = metric;
    const values = metric[name];

    if (values.length > 0) {
      if (type === 'amount' || type === 'total-amount') {
        let average = 0;
        if (type === 'amount') {
          average = calculateAmountAverage(values as number[]);
        } else if (type === 'total-amount') {
          average = calculateAmountAverage(values as number[], true);
        }
        allAverages[name] = average;
      } else if (type === 'time') {
        const average = calculateTimeAverage(values as string[]);
        allAverages[name] = average;
      } else if (type === 'duration') {
        const average = calculateDurationAverage(values as string[]);
        allAverages[name] = average;
      }
    } else {
      allAverages[name] = 0;
    }
  });

  const additionalAutoAverages = calculateAutoAverages(allAverages);

  return {
    period,
    keys: { ...allAverages, ...additionalAutoAverages },
  };
}

export default calculateAveragesForPeriod;
