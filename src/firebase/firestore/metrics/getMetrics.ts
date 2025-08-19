import { collection, getDocs } from 'firebase/firestore';

import type { Metric } from '../../../types';
import { db } from '../../firebase';

async function getMetrics() {
  try {
    const querySnapshot = await getDocs(collection(db, 'metrics'));
    const metricsList: Metric[] = [];
    querySnapshot.forEach(doc => {
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
        decimals,
      } = doc.data();
      const data: Metric = {
        id: doc.id,
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
        decimals,
      };
      metricsList.push(data);
    });

    return metricsList;
  } catch (error) {
    return error;
  }
}

export default getMetrics;
