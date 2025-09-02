import { Metric } from '../../types';
import kebabcaseToCamelcase from '../../utils/kebabcaseToCamelcase';
import type { MonthlyRowData, WeeklyRowData, YearlyRowData } from '../_types';

export interface ChartDataPoint {
  x: string; // Date label
  y: number; // Numeric value for chart positioning
  displayValue: string; // Original formatted value for tooltip
}

export interface ChartData {
  id: string;
  data: ChartDataPoint[];
}

/**
 * Converts a string or number value to a numeric value for chart positioning
 * Handles different data types like time (HH:MM), duration, and regular numbers
 */
function convertToNumericValue(
  value: string | number,
  _metric: Metric
): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    // Handle '---' or empty values
    if (value === '---' || value === '' || value === 'null') {
      return 0;
    }

    // Handle time format (HH:MM)
    if (value.includes(':') && value.split(':').length === 2) {
      const [hours, minutes] = value.split(':').map(Number);
      return hours + minutes / 60; // Convert to decimal hours
    }

    // Handle regular numbers
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? 0 : numericValue;
  }

  return 0;
}

/**
 * Extracts chart data from weekly row data
 */
export function getWeeklyChartData(
  rows: WeeklyRowData[],
  metric: Metric
): ChartData {
  const metricId = kebabcaseToCamelcase(metric.id);
  const data: ChartDataPoint[] = [];

  console.log('getWeeklyChartData Debug:', {
    rowsLength: rows.length,
    metricId,
    metricName: metric.name,
    firstRow: rows[0],
  });

  rows.forEach(row => {
    const value = row[metricId];
    if (value !== undefined && value !== '---' && value !== 'null') {
      data.push({
        x: row.date,
        y: convertToNumericValue(value, metric),
        displayValue: String(value),
      });
    }
  });

  console.log('getWeeklyChartData Result:', {
    dataLength: data.length,
    data,
  });

  return {
    id: metric.name,
    data: data.reverse(), // Show earliest data first
  };
}

/**
 * Extracts chart data from monthly row data
 */
export function getMonthlyChartData(
  rows: MonthlyRowData[],
  metric: Metric
): ChartData {
  const metricId = kebabcaseToCamelcase(metric.id);
  const data: ChartDataPoint[] = [];

  rows.forEach(row => {
    const value = row[metricId];
    if (value !== undefined && value !== '---' && value !== 'null') {
      data.push({
        x: row.date,
        y: convertToNumericValue(value, metric),
        displayValue: String(value),
      });
    }
  });

  return {
    id: metric.name,
    data: data.reverse(), // Show earliest data first
  };
}

/**
 * Extracts chart data from yearly row data
 */
export function getYearlyChartData(
  rows: YearlyRowData[],
  metric: Metric
): ChartData {
  const metricId = kebabcaseToCamelcase(metric.id);
  const data: ChartDataPoint[] = [];

  rows.forEach(row => {
    const value = row[metricId];
    if (value !== undefined && value !== '---' && value !== 'null') {
      data.push({
        x: row.date,
        y: convertToNumericValue(value, metric),
        displayValue: String(value),
      });
    }
  });

  return {
    id: metric.name,
    data: data.reverse(), // Show earliest data first
  };
}
