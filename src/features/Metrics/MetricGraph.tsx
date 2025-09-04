import { ResponsiveLine } from '@nivo/line';
import { DateTime } from 'luxon';

import { useAppSelector } from '../../redux/reduxHooks';
import { Metric } from '../../types';
import type { MonthlyRowData, WeeklyRowData, YearlyRowData } from '../_types';
import buildRows from '../DataGrid/buildRows';

import {
  getMonthlyChartData,
  getWeeklyChartData,
  getYearlyChartData,
} from './getChartData';

function MetricGraph({ metric }: { metric: Metric }) {
  const allAverages = useAppSelector(state => state.averages);
  const activeTimeView = useAppSelector(state => state.utils.activeTimeView);

  // Get row data based on active time view
  const rows = buildRows([metric], activeTimeView, allAverages);

  // Extract chart data based on time view
  let chartData;
  switch (activeTimeView) {
    case 'week':
      // Filter weekly data to only show weeks of the current year
      const currentYear = new Date().getFullYear();
      const filteredWeeklyRows = (rows as WeeklyRowData[]).filter(
        row => row.year === currentYear
      );
      chartData = getWeeklyChartData(filteredWeeklyRows, metric);
      break;
    case 'month':
      chartData = getMonthlyChartData(rows as MonthlyRowData[], metric);
      break;
    case 'year':
      chartData = getYearlyChartData(rows as YearlyRowData[], metric);
      break;
    default:
      const currentYearDefault = new Date().getFullYear();
      const filteredWeeklyRowsDefault = (rows as WeeklyRowData[]).filter(
        row => row.year === currentYearDefault
      );
      chartData = getWeeklyChartData(filteredWeeklyRowsDefault, metric);
  }

  // Don't render chart if no data
  if (chartData.data.length === 0) {
    return (
      <div className='w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-gray-600 mb-2'>
            No Data Available
          </h3>
          <p className='text-gray-500'>
            No {activeTimeView}ly data found for {metric.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className='w-full bg-white border border-gray-300'
      style={{ height: 'calc(100vh - 350px)' }}
    >
      <div className='h-full'>
        <ResponsiveLine
          data={[chartData]}
          margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
            nice: true,
          }}
          curve='monotoneX'
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            format: value => {
              if (activeTimeView === 'week') {
                const match = String(value).match(/\(([^)]+)\)/);
                if (match && match[1]) {
                  return match[1].split(' - ')[0];
                }
              }
              if (activeTimeView === 'month') {
                const dt = DateTime.fromFormat(String(value), 'MMMM yyyy');
                if (dt.isValid) {
                  return dt.toFormat('LLL yyyy');
                }
              }
              return String(value);
            },
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: value => {
              const num = Number(value);
              const unitLower = (metric.unit || '').toLowerCase();
              const isTimeLike =
                metric.dataType === 'time' ||
                metric.dataType === 'duration' ||
                unitLower === 'h' ||
                unitLower === 'hr' ||
                unitLower === 'hrs' ||
                unitLower === 'hour' ||
                unitLower === 'hours';
              if (isTimeLike) {
                const isNegative = num < 0;
                const abs = Math.abs(num);
                const hours = Math.floor(abs);
                let minutes = Math.round((abs - hours) * 60);
                let adjHours = hours;
                if (minutes === 60) {
                  adjHours += 1;
                  minutes = 0;
                }
                const hh = `${isNegative ? '-' : ''}${adjHours}`;
                const mm = String(minutes).padStart(2, '0');
                return `${hh}:${mm}h`;
              }
              if (metric.unit) {
                const decimals =
                  metric.decimals !== undefined
                    ? metric.decimals
                    : Number.isInteger(num)
                      ? 0
                      : 2;
                const formatted = num.toFixed(decimals);
                return `${formatted} ${metric.unit}`;
              }
              return String(num);
            },
          }}
          pointSize={12}
          pointColor='#3B82F6'
          pointBorderWidth={2}
          pointBorderColor='#ffffff'
          pointLabelYOffset={-12}
          enablePoints={true}
          enablePointLabel={false}
          useMesh={true}
          enableCrosshair={false}
          tooltip={({ point }) => (
            <div className='bg-white p-2 shadow-lg border border-gray-300 text-md'>
              {point.data.displayValue}
            </div>
          )}
          colors={['#3B82F6']}
          lineWidth={3}
          enableGridX={false}
          enableGridY={true}
          gridYValues={5}
          theme={{
            background: 'transparent',
            text: {
              fontSize: 12,
              fill: '#374151',
            },
            axis: {
              domain: {
                line: {
                  stroke: '#E5E7EB',
                  strokeWidth: 1,
                },
              },
              legend: {
                text: {
                  fontSize: 12,
                  fill: '#6B7280',
                },
              },
              ticks: {
                line: {
                  stroke: '#E5E7EB',
                  strokeWidth: 1,
                },
                text: {
                  fontSize: 11,
                  fill: '#6B7280',
                },
              },
            },
            grid: {
              line: {
                stroke: '#F3F4F6',
                strokeWidth: 1,
              },
            },
            crosshair: {
              line: {
                stroke: 'transparent',
                strokeWidth: 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default MetricGraph;
