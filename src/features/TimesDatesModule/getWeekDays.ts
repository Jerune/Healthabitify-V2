import { DateTime } from 'luxon';

async function getWeekDays(currentDate: DateTime) {
  const firstDayOfTheWeek = currentDate.startOf('week');
  const lastDayOfTheWeek = currentDate.endOf('week');

  return {
    firstDayOfTheWeek,
    lastDayOfTheWeek,
  };
}

export default getWeekDays;
