import { collection, query, where, getDocs } from 'firebase/firestore';

import { DatapointsForDataGrid } from '../../../features/_types';
import {
  CurrentDateTime,
  LabtestMetric,
  ManualDatapointReturn,
  Metric,
} from '../../../types';
import kebabcaseToCamelcase from '../../../utils/kebabcaseToCamelcase';
import { db } from '../../firebase';

async function getManualDatapointsByDate(
  currentDateTime: CurrentDateTime,
  metrics: (Metric | LabtestMetric)[],
  labs?: boolean
): Promise<DatapointsForDataGrid[]> {
  const { weekNumber, year } = currentDateTime;

  const allDatapointsForPeriod = await Promise.all(
    metrics.map(async metric => {
      const metricName = kebabcaseToCamelcase(metric.id);
      const datapoints: ManualDatapointReturn[] = [];
      let dbQuery = query(
        collection(db, 'data-points-manual'),
        where('metric', '==', metric.id),
        where('year', '==', year),
        where('weekNumber', '==', weekNumber)
      );

      if (labs) {
        dbQuery = query(
          collection(db, 'data-points-labs'),
          where('metric', '==', metric.id)
        );
      }

      const querySnapshot = await getDocs(dbQuery);
      const docDates: string[] = [];
      querySnapshot.forEach(doc => {
        const { id } = doc;
        const { value, date } = doc.data();
        if (!docDates.includes(date)) {
          docDates.push(date);
          datapoints.push({ value, date, id });
        }
      });

      if (labs && 'reference' in metric) {
        return {
          [metricName]: datapoints,
          reference: (metric as LabtestMetric).reference,
        } as DatapointsForDataGrid;
      }

      return {
        [metricName]: datapoints,
        type: (metric as Metric).dataType,
      } as DatapointsForDataGrid;
    })
  );

  return allDatapointsForPeriod;
}

export default getManualDatapointsByDate;
