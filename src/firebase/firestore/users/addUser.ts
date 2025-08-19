import { doc, setDoc } from 'firebase/firestore';

import type { User } from '../../../types';
import { db } from '../../firebase';

async function addUser(userData: User) {
  try {
    const docRef = await setDoc(doc(db, 'users', userData.userId), {
      displayName: userData.displayName,
      email: userData.email,
    });
    console.log('Document written with: ', docRef);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export default addUser;
