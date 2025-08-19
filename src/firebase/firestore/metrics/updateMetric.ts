import { doc, updateDoc } from 'firebase/firestore';

import type { Metric } from '../../../types';
import { db } from '../../firebase';

async function updateMetric(metric: Metric) {
  const metricRef = doc(db, 'metrics', metric.id);
  const {
    order,
    name,
    active,
    onDashboard,
    source,
    dataType,
    unit,
    categoryId,
    categoryIcon,
    isFixed,
    frequency,
    goal,
    conditionsMode,
    good,
    medium,
    bad,
  } = metric;

  await updateDoc(metricRef, {
    order,
    name,
    active,
    onDashboard,
    source,
    dataType,
    unit,
    categoryId,
    categoryIcon,
    isFixed,
    frequency,
    goal,
    conditionsMode,
    good,
    medium,
    bad,
  });
}

export default updateMetric;
