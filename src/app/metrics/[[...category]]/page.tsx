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
  const { category } = useParams();
  const activeCategory = category ? category[0] : null;
  const allMetrics = useAppSelector(state => state.metrics);

  const [activeMetrics, setActiveMetrics] = useState<Metric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const hasAnActiveMetric = selectedMetric;

  console.log(activeCategory, allMetrics);

  useEffect(() => {
    if (activeCategory) {
      const metrics = getActiveMetrics(allMetrics, activeCategory);
      setActiveMetrics(metrics);
      setSelectedMetric(metrics[0]);
    }
  }, [allMetrics, activeCategory]);

  async function setMetrics(metricData: Metric) {
    const activeCat = activeMetrics.filter(
      metric => metric.id === metricData.id
    )[0];
    setSelectedMetric(activeCat);
  }

  return (
    <>
      <MetricsMenu
        metrics={activeMetrics}
        setMetric={setMetrics}
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
