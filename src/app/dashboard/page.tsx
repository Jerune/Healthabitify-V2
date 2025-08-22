/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useEffect, useState } from 'react';

import Loading from '../../components/Loading';
import MainContent from '../../components/MainContent';
import { AveragesData, DashboardComparisonData } from '../../features/_types';
import DashBoardContainer from '../../features/Dashboard/DashBoardContainer';
import DashBoardMetricBlock from '../../features/Dashboard/DashBoardMetricBlock';
// import dashboardmetrics from '../data/dashboardmetricsMock'
import getComparisonStatus from '../../features/Dashboard/getComparisonStatus';
import { useAppSelector } from '../../redux/reduxHooks';
import kebabcaseToCamelcase from '../../utils/kebabcaseToCamelcase';

function Dashboard() {
  const allMetrics = useAppSelector(state => state.metrics);
  const allAverages: AveragesData = useAppSelector(state => state.averages);
  const currentDateTime = useAppSelector(state => state.utils.currentDateTime);
  const activeTimeView = useAppSelector(state => state.utils.activeTimeView);
  const isLoading = useAppSelector(state => state.utils.isLoading);
  const dashboardMetrics = allMetrics.filter(metric => metric.onDashboard);
  const { weekNumber, month, year } = currentDateTime;
  const [periodHasActiveData, setPeriodHasActiveData] = useState(false);

  // Verify if averages are available for the selected period
  useEffect(() => {
    if (allAverages[`Y${year}`]) {
      switch (activeTimeView) {
        case 'week':
          if (allAverages[`Y${year}`].weeks[`W${weekNumber}`]) {
            setPeriodHasActiveData(true);
          } else {
            setPeriodHasActiveData(false);
          }
          break;
        case 'month':
          if (allAverages[`Y${year}`].months[`M${month}`]) {
            setPeriodHasActiveData(true);
          } else {
            setPeriodHasActiveData(false);
          }
          break;
        case 'year':
          if (allAverages[`Y${year}`].year) {
            setPeriodHasActiveData(true);
          } else {
            setPeriodHasActiveData(false);
          }
          break;
        default:
          setPeriodHasActiveData(false);
      }
    }
  }, [allAverages, activeTimeView, currentDateTime]);

  if (isLoading) {
    return <Loading size={50} />;
  }

  if (!periodHasActiveData || !allAverages[`Y${year}`]) {
    return (
      <div className='w-full pt-4 px-[5%] md:px-0 md:pt-16 flex flex-col justify-center md:justify-top items-center'>
        <h3 className='text-xl italic'>
          No Data is yet available for the chosen period.
        </h3>
      </div>
    );
  }

  const dashboardBlocks = dashboardMetrics.map(metric => {
    const dbMetricId = kebabcaseToCamelcase(metric.id);
    const comparisonData: DashboardComparisonData = {
      value: 0,
      comparisonValue: 0,
      comparisonStatus: '',
      comparisonType: '',
    };
    if (activeTimeView === 'week') {
      comparisonData.comparisonType = 'week';
      if (allAverages[`Y${year}`].weeks[`W${weekNumber}`]) {
        comparisonData.value =
          allAverages[`Y${year}`].weeks[`W${weekNumber}`][dbMetricId];
        if (allAverages[`Y${year}`].weeks[`W${weekNumber - 1}`]) {
          comparisonData.comparisonValue =
            allAverages[`Y${year}`].weeks[`W${weekNumber - 1}`][dbMetricId];
        } else {
          comparisonData.comparisonValue =
            allAverages[`Y${year - 1}`].weeks.W52[dbMetricId];
        }
      }
    } else if (activeTimeView === 'month') {
      comparisonData.comparisonType = 'month';
      if (allAverages[`Y${year}`].months[`M${month}`]) {
        comparisonData.value =
          allAverages[`Y${year}`].months[`M${month}`][dbMetricId];
        if (allAverages[`Y${year}`].months[`M${month - 1}`]) {
          comparisonData.comparisonValue =
            allAverages[`Y${year}`].months[`M${month - 1}`][dbMetricId];
        } else {
          comparisonData.comparisonValue =
            allAverages[`Y${year - 1}`].months.M12[dbMetricId];
        }
      }
    } else if (activeTimeView === 'year') {
      comparisonData.comparisonType = 'year';
      if (allAverages[`Y${year}`] && allAverages[`Y${year}`].year) {
        comparisonData.value = allAverages[`Y${year}`]!.year![dbMetricId];
        if (allAverages[`Y${year - 1}`]) {
          comparisonData.comparisonValue =
            allAverages[`Y${year - 1}`]!.year![dbMetricId];
        } else {
          comparisonData.comparisonValue = 0;
        }
      }
    }
    const metricWithComparisonData = { ...metric, ...comparisonData };
    metricWithComparisonData.comparisonStatus = getComparisonStatus(
      metricWithComparisonData
    );

    return (
      <DashBoardMetricBlock
        metric={metricWithComparisonData}
        key={metric.name}
      />
    );
  });

  return (
    <MainContent>
      <DashBoardContainer>{dashboardBlocks}</DashBoardContainer>
    </MainContent>
  );
}

export default Dashboard;
