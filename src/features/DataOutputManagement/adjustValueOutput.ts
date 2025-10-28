import metricsInMilliseconds from '../../data/metrics/metricsInMilliseconds';
import metricsWithZeroValues from '../../data/metrics/metricsWithZeroValues';
import { Metric } from '../../types';
import { convertMillisecondsToTime } from '../../utils/convertMillisecondsToTime';
import forceNumberReturn from '../../utils/forceNumberReturn';

import addDecimals from './addDecimals';

export default function adjustValueOutput(
  metric: Metric,
  value: number | string
): string {
  // Return string value in case value is 0 or 00:00:00
  if (
    (!metricsWithZeroValues.includes(metric.id) && value === 0) ||
    value === '0' ||
    value === undefined
  ) {
    return '---';
  }

  // Change to h:mm format as string in case id is part sleepMetricIdsWithMilliseconds
  if (metricsInMilliseconds.includes(metric.id)) {
    return convertMillisecondsToTime(Number(value));
  }

  // Change to hours or minutes format as string in case of time or duration
  if (metric.dataType === 'time' || metric.dataType === 'duration') {
    const amountOfMinutes = forceNumberReturn(value) * 60;
    const hours = Math.floor(amountOfMinutes / 60);
    const minutes = Math.round(amountOfMinutes - hours * 60);
    const hoursAsString = String(hours).padStart(2, '0');
    const minutesAsString = String(minutes).padStart(2, '0');

    return `${hoursAsString}:${minutesAsString}`;
  }

  if (metric === null) {
    return 'null';
  }

  // Adapt to output & Change to String without any adjustments
  const adaptedValue = addDecimals(metric, value);
  return adaptedValue.toString();
}
