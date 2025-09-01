import { useAppSelector } from '../../redux/reduxHooks';
import { ActiveMetricsProps } from '../_types';

import MetricCard from './MetricCard';

function ActiveMetrics({ activeCategory }: ActiveMetricsProps) {
  const metrics = useAppSelector(state => state.metrics);

  const filteredMetrics = metrics.filter(
    metric => metric.categoryId === activeCategory.id
  );

  const sortedMetrics = filteredMetrics.sort((a, b) => {
    if (a.active > b.active) return -1;
    if (a.active < b.active) return 1;

    if (a.onDashboard > b.onDashboard) return -1;
    if (a.onDashboard < b.onDashboard) return 1;

    if (a.order < b.order) return -1;
    if (a.order > b.order) return 1;

    return 0;
  });

  const activeMetrics = sortedMetrics.map(metric => {
    return <MetricCard key={metric.id} metric={metric} />;
  });

  return <div className='w-full flex flex-col gap-4'>{activeMetrics}</div>;
}

export default ActiveMetrics;
