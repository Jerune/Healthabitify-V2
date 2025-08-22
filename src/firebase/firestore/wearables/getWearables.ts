import { collection, getDocs } from 'firebase/firestore';

import type { Wearable, WearablesData } from '../../../types';
import { db } from '../../firebase';

async function getWearables(): Promise<WearablesData | Error> {
  try {
    const querySnapshot = await getDocs(collection(db, 'wearables'));
    const wearablesList: Wearable[] = [];
    querySnapshot.forEach(doc => {
      const { userId, token, refreshToken, lastUpdated } = doc.data();
      const data: Wearable = {
        id: doc.id,
        userId,
        token,
        refreshToken,
        lastUpdated,
      };
      wearablesList.push(data);
    });

    return {
      fitbit: wearablesList[0],
      oura: wearablesList[1],
    };
  } catch (error) {
    return error instanceof Error ? error : new Error('Unknown error');
  }
}

export default getWearables;
