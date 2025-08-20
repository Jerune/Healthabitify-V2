import metricsWithStringOutput from '../../data/metrics/metricsWithStringOutput';
import metricsWithZeroValues from '../../data/metrics/metricsWithZeroValues';
import { Metric } from '../../types';
import kebabcaseToCamelcase from '../../utils/kebabcaseToCamelcase';

// AG Grid cell renderer function that returns cell styling
function getConditionalFormatting(metric: Metric) {
  const hasStringOutput = metricsWithStringOutput.includes(metric.id);
  const { id, conditionsMode, good, bad } = metric;
  const correctId = kebabcaseToCamelcase(id);

  const backgroundColors = {
    good: '#B7E2CD',
    medium: '#FDE5CE',
    bad: '#F4CCCD',
    none: 'white',
  };

  const fontColors = {
    good: 'black',
    medium: 'black',
    bad: 'black',
    none: 'white',
  };

  // Return a cell renderer function for AG Grid
  return (params: any) => {
    const { data } = params;
    if (!data) return params.value || '-';

    const dataForCurrentPeriod = !hasStringOutput
      ? Number(data[correctId])
      : data[correctId];
    const dataForPreviousPeriod = !hasStringOutput
      ? Number(data[`prev${correctId}`])
      : data[`prev${correctId}`];

    let backgroundColor = backgroundColors.none;
    let color = fontColors.none;

    if (conditionsMode === 'higher') {
      if (
        (dataForCurrentPeriod === 0 &&
          !metricsWithZeroValues.includes(metric.id)) ||
        (dataForCurrentPeriod === '0' &&
          !metricsWithZeroValues.includes(metric.id)) ||
        dataForCurrentPeriod === '00:00' ||
        dataForCurrentPeriod === '0:00'
      ) {
        backgroundColor = backgroundColors.none;
        color = fontColors.none;
      } else if (dataForCurrentPeriod === '---') {
        backgroundColor = backgroundColors.none;
      } else if (
        dataForCurrentPeriod === undefined ||
        (Number.isNaN(Number(dataForCurrentPeriod)) &&
          metricsWithZeroValues.includes(metric.id))
      ) {
        backgroundColor = backgroundColors.none;
      } else if (dataForCurrentPeriod > dataForPreviousPeriod) {
        backgroundColor = backgroundColors.good;
        color = fontColors.good;
      } else if (dataForCurrentPeriod === dataForPreviousPeriod) {
        backgroundColor = backgroundColors.medium;
        color = fontColors.medium;
      } else if (dataForCurrentPeriod < dataForPreviousPeriod) {
        backgroundColor = backgroundColors.bad;
        color = fontColors.bad;
      }
    } else if (conditionsMode === 'lower') {
      if (
        (dataForCurrentPeriod === 0 &&
          !metricsWithZeroValues.includes(metric.id)) ||
        (dataForCurrentPeriod === '0' &&
          !metricsWithZeroValues.includes(metric.id)) ||
        dataForCurrentPeriod === '00:00' ||
        dataForCurrentPeriod === '0:00'
      ) {
        backgroundColor = backgroundColors.none;
        color = fontColors.none;
      } else if (dataForCurrentPeriod === '---') {
        backgroundColor = backgroundColors.none;
      } else if (
        dataForCurrentPeriod === undefined ||
        (Number.isNaN(Number(dataForCurrentPeriod)) &&
          metricsWithZeroValues.includes(metric.id))
      ) {
        backgroundColor = backgroundColors.none;
      } else if (dataForCurrentPeriod < dataForPreviousPeriod) {
        backgroundColor = backgroundColors.good;
        color = fontColors.good;
      } else if (
        dataForCurrentPeriod === dataForPreviousPeriod &&
        !metricsWithZeroValues.includes(metric.id)
      ) {
        backgroundColor = backgroundColors.medium;
        color = fontColors.medium;
      } else if (dataForCurrentPeriod > dataForPreviousPeriod) {
        backgroundColor = backgroundColors.bad;
        color = fontColors.bad;
      }
    } else if (conditionsMode === 'range' && good.mode === 'more') {
      if (
        (dataForCurrentPeriod === 0 &&
          !metricsWithZeroValues.includes(metric.id)) ||
        (dataForCurrentPeriod === '0' &&
          !metricsWithZeroValues.includes(metric.id)) ||
        dataForCurrentPeriod === '00:00' ||
        dataForCurrentPeriod === '0:00'
      ) {
        backgroundColor = backgroundColors.none;
        color = fontColors.none;
      } else if (dataForCurrentPeriod === '---') {
        backgroundColor = backgroundColors.none;
      } else if (
        dataForCurrentPeriod === undefined ||
        (Number.isNaN(Number(dataForCurrentPeriod)) &&
          metricsWithZeroValues.includes(metric.id))
      ) {
        backgroundColor = backgroundColors.none;
      } else if (dataForCurrentPeriod > good.value) {
        backgroundColor = backgroundColors.good;
        color = fontColors.good;
      } else if (dataForCurrentPeriod < bad.value) {
        backgroundColor = backgroundColors.bad;
        color = fontColors.bad;
      } else {
        backgroundColor = backgroundColors.medium;
        color = fontColors.medium;
      }
    } else if (conditionsMode === 'range' && good.mode === 'less') {
      if (
        (dataForCurrentPeriod === '0' &&
          !metricsWithZeroValues.includes(metric.id)) ||
        (dataForCurrentPeriod === 0 &&
          !metricsWithZeroValues.includes(metric.id)) ||
        dataForCurrentPeriod === '00:00'
      ) {
        backgroundColor = backgroundColors.none;
        color = fontColors.none;
      } else if (dataForCurrentPeriod === '---') {
        backgroundColor = backgroundColors.none;
      } else if (dataForCurrentPeriod < good.value) {
        backgroundColor = backgroundColors.good;
        color = fontColors.good;
      } else if (dataForCurrentPeriod > bad.value) {
        backgroundColor = backgroundColors.bad;
        color = fontColors.bad;
      } else {
        backgroundColor = backgroundColors.medium;
        color = fontColors.medium;
      }
    }

    return {
      value: params.value || '-',
      style: { backgroundColor, color },
    };
  };
}

export default getConditionalFormatting;
