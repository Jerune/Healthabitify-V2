import { addDoc, collection } from 'firebase/firestore';

import { Activity } from '../../../types';
import { db } from '../../firebase';
import { activityDoesNotExistAlready } from '../getDocs';

async function addActivities(activities: Activity[]) {
  const activitiesToAdd = activities.map(async activity => {
    const activityIsNew = await activityDoesNotExistAlready(activity);
    if (activityIsNew) {
      try {
        await addDoc(collection(db, 'activities'), {
          ...activity,
        });
        return 1;
      } catch (e) {
        console.error('Error adding document: ', e);
        return 0;
      }
    } else {
      return 0;
    }
  });

  const addedCounts = await Promise.all(activitiesToAdd);
  const amountOfActivities = addedCounts.reduce(
    (sum: number, count: number) => sum + count,
    0
  );

  return amountOfActivities;
}

export default addActivities;
