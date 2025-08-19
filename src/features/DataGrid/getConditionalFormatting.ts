import { CellProps } from '@inovua/reactdatagrid-community/types';

import metricsWithStringOutput from '../../data/metrics/metricsWithStringOutput';
import metricsWithZeroValues from '../../data/metrics/metricsWithZeroValues';
import { Metric } from '../../types';
import kebabcaseToCamelcase from '../../utils/kebabcaseToCamelcase';

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

  if (conditionsMode === 'higher') {
    return (
      cellProps: CellProps,
      { data }: { data: Record<string, number | string> }
    ) => {
      cellProps.style = cellProps.style || {};
      const style = cellProps.style as React.CSSProperties;

      const dataForCurrentPeriod = !hasStringOutput
        ? Number(data[correctId])
        : data[correctId];
      const dataForPreviousPeriod = !hasStringOutput
        ? Number(data[`prev${correctId}`])
        : data[`prev${correctId}`];
      if (
        (dataForCurrentPeriod === 0 &&
          !metricsWithZeroValues.includes(metric.id)) ||
        (dataForCurrentPeriod === '0' &&
          !metricsWithZeroValues.includes(metric.id)) ||
        dataForCurrentPeriod === '00:00' ||
        dataForCurrentPeriod === '0:00'
      ) {
        style.background = backgroundColors.none;
        style.color = fontColors.none;
      } else if (dataForCurrentPeriod === '---') {
        style.background = backgroundColors.none;
      } else if (
        dataForCurrentPeriod === undefined ||
        (Number.isNaN(Number(dataForCurrentPeriod)) &&
          metricsWithZeroValues.includes(metric.id))
      ) {
        style.background = backgroundColors.none;
      } else if (dataForCurrentPeriod > dataForPreviousPeriod) {
        style.background = backgroundColors.good;
        style.color = fontColors.good;
      } else if (dataForCurrentPeriod === dataForPreviousPeriod) {
        style.background = backgroundColors.medium;
        style.color = fontColors.medium;
      } else if (dataForCurrentPeriod < dataForPreviousPeriod) {
        style.background = backgroundColors.bad;
        style.color = fontColors.bad;
      } else {
        style.background = backgroundColors.none;
      }
    };
  }
  if (conditionsMode === 'lower') {
    return (
      cellProps: CellProps,
      { data }: { data: Record<string, number | string> }
    ) => {
      cellProps.style = cellProps.style || {};
      const style = cellProps.style as React.CSSProperties;

      const dataForCurrentPeriod = !hasStringOutput
        ? Number(data[correctId])
        : data[correctId];
      const dataForPreviousPeriod = !hasStringOutput
        ? Number(data[`prev${correctId}`])
        : data[`prev${correctId}`];
      if (
        (dataForCurrentPeriod === 0 &&
          !metricsWithZeroValues.includes(metric.id)) ||
        (dataForCurrentPeriod === '0' &&
          !metricsWithZeroValues.includes(metric.id)) ||
        dataForCurrentPeriod === '00:00' ||
        dataForCurrentPeriod === '0:00'
      ) {
        style.background = backgroundColors.none;
        style.color = fontColors.none;
      } else if (dataForCurrentPeriod === '---') {
        style.background = backgroundColors.none;
      } else if (
        dataForCurrentPeriod === undefined ||
        (Number.isNaN(Number(dataForCurrentPeriod)) &&
          metricsWithZeroValues.includes(metric.id))
      ) {
        style.background = backgroundColors.none;
      } else if (dataForCurrentPeriod < dataForPreviousPeriod) {
        style.background = backgroundColors.good;
        style.color = fontColors.good;
      } else if (
        dataForCurrentPeriod === dataForPreviousPeriod &&
        !metricsWithZeroValues.includes(metric.id)
      ) {
        style.background = backgroundColors.medium;
        style.color = fontColors.medium;
      } else if (dataForCurrentPeriod > dataForPreviousPeriod) {
        style.background = backgroundColors.bad;
        style.color = fontColors.bad;
      } else {
        style.background = backgroundColors.none;
      }
    };
  }
  if (conditionsMode === 'range' && good.mode === 'more') {
    return (
      cellProps: CellProps,
      { data }: { data: Record<string, number | string> }
    ) => {
      cellProps.style = cellProps.style || {};
      const style = cellProps.style as React.CSSProperties;

      const dataForCurrentPeriod = !hasStringOutput
        ? Number(data[correctId])
        : data[correctId];
      const goodValue = !hasStringOutput ? Number(good.value) : good.value;
      const badValue = !hasStringOutput ? Number(bad.value) : bad.value;
      console.log(dataForCurrentPeriod);
      if (
        (dataForCurrentPeriod === 0 &&
          !metricsWithZeroValues.includes(metric.id)) ||
        (dataForCurrentPeriod === '0' &&
          !metricsWithZeroValues.includes(metric.id)) ||
        dataForCurrentPeriod === '00:00' ||
        dataForCurrentPeriod === '0:00'
      ) {
        style.background = backgroundColors.none;
        style.color = fontColors.none;
      } else if (dataForCurrentPeriod === '---') {
        style.background = backgroundColors.none;
      } else if (
        dataForCurrentPeriod === undefined ||
        (Number.isNaN(Number(dataForCurrentPeriod)) &&
          metricsWithZeroValues.includes(metric.id))
      ) {
        style.background = backgroundColors.none;
      } else if (dataForCurrentPeriod > goodValue) {
        style.background = backgroundColors.good;
        style.color = fontColors.good;
      } else if (dataForCurrentPeriod < badValue) {
        style.background = backgroundColors.bad;
        style.color = fontColors.bad;
      } else {
        style.background = backgroundColors.medium;
        style.color = fontColors.medium;
      }
    };
  }
  if (conditionsMode === 'range' && good.mode === 'less') {
    return (
      cellProps: CellProps,
      { data }: { data: Record<string, number | string> }
    ) => {
      cellProps.style = cellProps.style || {};
      const style = cellProps.style as React.CSSProperties;

      const dataForCurrentPeriod = data[correctId];
      if (
        (dataForCurrentPeriod === '0' &&
          !metricsWithZeroValues.includes(metric.id)) ||
        (dataForCurrentPeriod === 0 &&
          !metricsWithZeroValues.includes(metric.id)) ||
        dataForCurrentPeriod === '00:00'
      ) {
        style.background = backgroundColors.none;
        style.color = fontColors.none;
      } else if (dataForCurrentPeriod === '---') {
        style.background = backgroundColors.none;
      } else if (dataForCurrentPeriod < good.value) {
        style.background = backgroundColors.good;
        style.color = fontColors.good;
      } else if (dataForCurrentPeriod > bad.value) {
        style.background = backgroundColors.bad;
        style.color = fontColors.bad;
      } else {
        style.background = backgroundColors.medium;
        style.color = fontColors.medium;
      }
    };
  }

  return 'error';
}

export default getConditionalFormatting;
