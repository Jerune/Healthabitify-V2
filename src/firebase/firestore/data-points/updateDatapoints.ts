import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { DataPoint } from '../../../features/_types';
import { db } from '../../firebase';

async function updateDatapoints(
  datapoints: DataPoint[],
  source: string
): Promise<number> {
  const updateOperations = datapoints.map(async datapoint => {
    const { id, value } = datapoint;
    const docReference = doc(db, `data-points-${source}`, id);

    try {
      await updateDoc(docReference, {
        value,
        timestamp: serverTimestamp(),
      });
      console.log(`Document with id ${id} has been updated to ${value}`);
      return 1;
    } catch (error) {
      console.log(`Error while updating document in Firebase ${error}`);
      return 0;
    }
  });

  const updatedCounts = await Promise.all(updateOperations);
  const amountOfUpdatedDatapoints = updatedCounts.reduce<number>(
    (sum, count) => sum + count,
    0
  );

  return amountOfUpdatedDatapoints;
}

export default updateDatapoints;
