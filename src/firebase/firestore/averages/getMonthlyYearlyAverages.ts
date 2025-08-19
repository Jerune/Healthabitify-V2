import { doc, getDoc } from 'firebase/firestore';

import { db } from '../../firebase';

async function getMonthlyYearlyAverages(
  currentYear: number,
  latestMonth?: number
) {
  const docRef = latestMonth
    ? doc(db, 'averages', `Y${currentYear}-M${latestMonth}`)
    : doc(db, 'averages', `Y${currentYear}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return 'error';
}

export default getMonthlyYearlyAverages;
