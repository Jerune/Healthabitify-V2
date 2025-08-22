import { collection, getDocs } from 'firebase/firestore';

import type { Wearable } from '../../../types';
import { db } from '../../firebase';

async function getWearables() {
  try {
    const querySnapshot = await getDocs(collection(db, 'wearables'));
    const wearablesList: Wearable[] = [];
    querySnapshot.forEach(doc => {
      const { userId, token, lastUpdated, tokenExpiresOn } = doc.data();
      const data: Wearable = {
        id: doc.id,
        userId,
        token,
        lastUpdated,
        tokenExpiresOn: tokenExpiresOn || '', // Default to empty string if not present
      };
      wearablesList.push(data);
    });

    return {
      fitbit: wearablesList[0],
      oura: wearablesList[1],
    };
  } catch (error) {
    return error;
  }
}

export default getWearables;
