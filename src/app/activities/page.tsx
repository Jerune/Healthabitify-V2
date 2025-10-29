'use client';

import { useEffect, useState } from 'react';

import Loading from '../../components/Loading';
import { useAppSelector } from '../../redux/reduxHooks';
import { Activity } from '../../types';

export default function ActivitiesPage() {
  const activeTimeView = useAppSelector(state => state.utils.activeTimeView);
  const currentDateTime = useAppSelector(state => state.utils.currentDateTime);
  const { weekNumber, month, year } = currentDateTime;
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const hasSelectedPeriod = activeTimeView && weekNumber && month && year;

  useEffect(() => {
    if (hasSelectedPeriod) {
      // Get activities from DB
      setActivities([]);
    }
  }, [hasSelectedPeriod]);

  if (!activities) {
    return <Loading />;
  }

  if (activities.length < 1) {
    return (
      <section className='w-full pt-4 px-[5%] md:px-0 md:pt-16 flex flex-col justify-center md:justify-top items-center'>
        <h1 className='text-xl italic'>
          No activities are available for the chosen period.
        </h1>
      </section>
    );
  }

  return <div>page</div>;
}
