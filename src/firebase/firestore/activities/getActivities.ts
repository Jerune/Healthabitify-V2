import { collection, getDocs, query, where } from 'firebase/firestore';

import { ActiveTimeView, Activity } from '../../../types';
import { db } from '../../firebase';

async function getActivities(
  activeTimeView: ActiveTimeView,
  dates: { month: number; weekNumber: number; year: number }
) {
  let searchQuery = 0;
  let queryCollection = '';

  switch (activeTimeView) {
    case 'month':
      searchQuery = dates.month;
      queryCollection = activeTimeView;
      break;
    case 'week':
      searchQuery = dates.weekNumber;
      queryCollection = 'weekNumber';
      break;
    case 'year':
      searchQuery = dates.year;
      queryCollection = activeTimeView;
      break;
    default:
      searchQuery = dates.weekNumber;
      queryCollection = 'weekNumber';
  }

  const q = query(
    collection(db, 'activities'),
    where(queryCollection, '==', searchQuery)
  );

  const activities: Activity[] = [];
  const activitiesResponse = await getDocs(q);
  activitiesResponse.forEach(doc => {
    activities.push(doc.data() as Activity);
  });

  return activities;
}

export default getActivities;
