'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import MainContent from '../../../components/MainContent';
import getActiveMetrics from '../../../features/DataGrid/getActiveMetrics';
import MetricGraph from '../../../features/Metrics/MetricGraph';
import MetricsMenu from '../../../features/Metrics/MetricsMenu';
import { useAppSelector } from '../../../redux/reduxHooks';
import { Metric } from '../../../types';

function MetricsPage() {
  const { category } = useParams<{
    category: string[];
  }>();
  const activeCategory = category[0] || null;
  const activeMetricFromUrl = category[1] || null;
  const allMetrics = useAppSelector(state => state.metrics);

  const [activeMetrics, setActiveMetrics] = useState<Metric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const hasAnActiveMetric = selectedMetric;

  console.log(activeCategory, activeMetricFromUrl);

  useEffect(() => {
    if (activeCategory) {
      const metrics = getActiveMetrics(allMetrics, activeCategory);
      setActiveMetrics(metrics);
      if (activeMetricFromUrl) {
        const metric = metrics.filter(
          metricItem => metricItem.id === activeMetricFromUrl
        )[0];
        setSelectedMetric(metric);
      } else {
        setSelectedMetric(metrics[0]);
      }
    }
  }, [allMetrics, activeCategory, activeMetricFromUrl]);

  return (
    <>
      <MetricsMenu
        metrics={activeMetrics}
        activeMetric={selectedMetric as Metric}
      />
      <MainContent>
        {hasAnActiveMetric && (
          <section className='w-full flex'>
            <MetricGraph metric={selectedMetric} />
          </section>
        )}
      </MainContent>
    </>
  );
}

export default MetricsPage;
