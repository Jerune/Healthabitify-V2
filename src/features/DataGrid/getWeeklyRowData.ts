import { DateTime } from 'luxon';

import metricsWithZeroValues from '../../data/metrics/metricsWithZeroValues';
import { Metric } from '../../types';
import kebabcaseToCamelcase from '../../utils/kebabcaseToCamelcase';
import type { AveragesData, WeeklyRowData } from '../_types';
import adjustValueOutput from '../DataOutputManagement/adjustValueOutput';

function getWeeklyRowData(
  activeMetrics: Metric[],
  allAverages: AveragesData
): WeeklyRowData[] {
  const rows: WeeklyRowData[] = [];

  const years = Object.keys(allAverages);
  years.forEach(year => {
    const activeYear = Number(year.split('Y')[1]);
    const weeks = Object.keys(allAverages[year].weeks);
    weeks.forEach(week => {
      const weekNumber = Number(week.split('W')[1]);
      const weekStartDate = DateTime.fromISO(`${activeYear}-01-01`).plus({
        weeks: weekNumber - 1,
      });
      const weekEndDate = weekStartDate.plus({ days: 6 });
      const dateTitle = `Week ${weekNumber} (${weekStartDate.toFormat(
        'MMM d'
      )} - ${weekEndDate.toFormat('MMM d, yyyy')})`;

      // Setting default row data
      const row: WeeklyRowData = {
        year: activeYear,
        weekNumber,
        id: `${activeYear}-${weekNumber}`,
        date: dateTitle,
      };
      // Retrieving average data from every metric for that week
      activeMetrics.forEach(metric => {
        if (activeYear < 2021 && metricsWithZeroValues.includes(metric.id)) {
          // Don't create data from metrics without zero values
        } else {
          let yearString = year;
          const metricId = kebabcaseToCamelcase(metric.id);
          const metricAverageValueThisWeek =
            allAverages[yearString].weeks[week][metricId];
          row[metricId] = adjustValueOutput(metric, metricAverageValueThisWeek);
          // Verify if previousWeek is week 52 and
          // changing year and week if this is the case
          let previousWeek = weekNumber - 1;
          let metricAverageValuePreviousPeriod: string | number = 0;
          let availableWeeks = weeks;
          if (previousWeek === 0) {
            yearString = `Y${activeYear - 1}`;
            // Verify if previous year is available
            if (allAverages[yearString]) {
              // Gathering weeks from previous year
              availableWeeks = Object.keys(allAverages[yearString].weeks);
              previousWeek = 52;
            }
          }
          // Look for last real value to compare with
          while (availableWeeks.includes(`W${previousWeek}`)) {
            metricAverageValuePreviousPeriod =
              allAverages[yearString].weeks[`W${previousWeek}`][metricId];
            // Passes 0 values if for a metric where 0 values should be ignored
            if (
              metricAverageValuePreviousPeriod === 0 &&
              !metricsWithZeroValues.includes(metric.id)
            ) {
              previousWeek -= 1;
              // Writes prev comparison data whenever last real value is found
            } else {
              row[`prev${metricId}`] = adjustValueOutput(
                metric,
                metricAverageValuePreviousPeriod
              );
              break;
            }
          }
        }
      });

      rows.push(row);
    });
  });

  const sortedRows = rows.sort((a, b) => {
    if (a.year !== b.year) {
      return Number(b.year) - Number(a.year); // Sort by year in descending order
    }
    return Number(b.weekNumber) - Number(a.weekNumber); // Sort by week in descending order within the same year
  });
  return sortedRows;
}

export default getWeeklyRowData;
