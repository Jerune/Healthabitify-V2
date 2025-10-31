'use client';

import { useCallback, useEffect, useState } from 'react';

import Loading from '../../components/Loading';
import ActivityCard from '../../features/Activities/ActivityCard';
import DashBoardContainer from '../../features/Dashboard/DashBoardContainer';
import getActivities from '../../firebase/firestore/activities/getActivities';
import { useAppSelector } from '../../redux/reduxHooks';
import { Activity } from '../../types';
import { convertDateToMilliseconds } from '../../utils/convertMillisecondsToTime';

export default function ActivitiesPage() {
  const currentDateTime = useAppSelector(state => state.utils.currentDateTime);
  const activeTimeView = useAppSelector(state => state.utils.activeTimeView);
  const { weekNumber, month, year } = currentDateTime;
  const hasActivePeriod = activeTimeView && weekNumber && month && year;
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  const handleActivities = useCallback(async () => {
    setIsLoading(true);
    const newActivities = await getActivities(activeTimeView, {
      weekNumber,
      month,
      year,
    });
    const sortedActivities = newActivities.sort(
      (a, b) =>
        convertDateToMilliseconds(a.date) - convertDateToMilliseconds(b.date)
    );
    setActivities(sortedActivities);
    setIsLoading(false);
  }, [activeTimeView, weekNumber, month, year, setActivities]);

  useEffect(() => {
    if (activeTimeView && weekNumber && month && year) {
      handleActivities();
    }
  }, [handleActivities, activeTimeView, weekNumber, month, year]);

  if (isLoading) {
    return <Loading />;
  }

  if (!hasActivePeriod || activities.length < 1) {
    return (
      <section className='w-full pt-4 px-[5%] md:px-0 md:pt-16 flex flex-col justify-center md:justify-top items-center'>
        <h1 className='text-xl italic'>
          No activities are available for the chosen period.
        </h1>
      </section>
    );
  }

  const activityCards = activities.map(activity => (
    <ActivityCard key={activity.logId} {...activity} />
  ));

  return <DashBoardContainer>{activityCards}</DashBoardContainer>;
}
