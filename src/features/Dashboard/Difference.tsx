import Icon from '../../components/icon';
import metricsWithZeroValues from '../../data/metrics/metricsWithZeroValues';
import forceNumberReturn from '../../utils/forceNumberReturn';
import { DashboardMetricProps } from '../_types';
import adjustValueOutput from '../DataOutputManagement/adjustValueOutput';

import calculateDifference from './calculateDifference';

export default function Difference({ metric }: DashboardMetricProps) {
  // Transform string to number if needed
  const currentValue = forceNumberReturn(metric.value);
  const previousValue = forceNumberReturn(metric.comparisonValue);

  // Calculate difference between values
  const difference = calculateDifference(currentValue, previousValue);

  // Transform difference to correct output
  const differenceResult = adjustValueOutput(metric, difference);

  if (!metricsWithZeroValues.includes(metric.id) && previousValue === 0) {
    return (
      <>
        <Icon iconId='AiOutlineStop' />
        {`No results registered last ${metric.comparisonType}`}
      </>
    );
  }

  if (!metricsWithZeroValues.includes(metric.id) && currentValue === 0) {
    return (
      <>
        <Icon iconId='AiOutlineStop' />
        {`No comparison possible`}
      </>
    );
  }

  if (currentValue > previousValue) {
    return (
      <>
        <Icon iconId='BsCaretUpFill' />
        {`${differenceResult} ${metric.unit} more than last ${metric.comparisonType}`}
      </>
    );
  }

  if (currentValue < previousValue) {
    return (
      <>
        <Icon iconId='BsCaretDownFill' />
        {`${differenceResult} ${metric.unit} less than last ${metric.comparisonType}`}
      </>
    );
  }

  return (
    <>
      <Icon iconId='TiEquals' />
      {`same as last ${metric.comparisonType}`}
    </>
  );
}
