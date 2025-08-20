import metricsWithZeroValues from '../../data/metrics/metricsWithZeroValues';
import { Metric } from '../../types';
import kebabcaseToCamelcase from '../../utils/kebabcaseToCamelcase';
import type { AveragesData, YearlyRowData } from '../_types';
import adjustValueOutput from '../DataOutputManagement/adjustValueOutput';

function getYearlyRowData(
  activeMetrics: Metric[],
  allAverages: AveragesData
): YearlyRowData[] {
  const rows: YearlyRowData[] = [];

  const years = Object.keys(allAverages);
  years.forEach(year => {
    const activeYear = Number(year.split('Y')[1]);
    const dateTitle = `${activeYear}`;

    // Setting default row data
    const row: YearlyRowData = {
      year: activeYear,
      id: `${activeYear}`,
      date: dateTitle,
    };
    // Retrieving average data from every metric for that year
    activeMetrics.forEach(metric => {
      if (activeYear < 2021 && metricsWithZeroValues.includes(metric.id)) {
        // Don't create data from metrics without zero values
      } else {
        const yearString = year;
        const metricId = kebabcaseToCamelcase(metric.id);
        const metricAverageValueThisYear =
          allAverages[yearString].year?.[metricId];
        if (metricAverageValueThisYear !== undefined) {
          row[metricId] = adjustValueOutput(metric, metricAverageValueThisYear);
        }
        // Verify if previousYear is available
        const previousYear = activeYear - 1;
        let metricAverageValuePreviousPeriod: string | number | undefined = 0;
        const yearStringPrevious = `Y${previousYear}`;
        // Look for last real value to compare with
        if (allAverages[yearStringPrevious]) {
          metricAverageValuePreviousPeriod =
            allAverages[yearStringPrevious].year?.[metricId];
          // Passes 0 values if for a metric where 0 values should be ignored
          if (
            metricAverageValuePreviousPeriod === 0 &&
            !metricsWithZeroValues.includes(metric.id)
          ) {
            // Skip this value
          } else if (metricAverageValuePreviousPeriod !== undefined) {
            row[`prev${metricId}`] = adjustValueOutput(
              metric,
              metricAverageValuePreviousPeriod
            );
          }
        }
      }
    });

    rows.push(row);
  });

  const sortedRows = rows.sort((a, b) => {
    return Number(b.year) - Number(a.year); // Sort by year in descending order
  });
  return sortedRows;
}

export default getYearlyRowData;
