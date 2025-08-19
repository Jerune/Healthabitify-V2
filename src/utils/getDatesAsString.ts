import { DateTime } from 'luxon';

import { getDateTimeDateFromDateString } from './getDateTimeData';

export function getTodaysDateAsString() {
  const today = DateTime.now();
  const todayString = today.toFormat('yyyy-MM-dd');

  return todayString;
}

export function getYesterdaysDateAsString() {
  const today = DateTime.now();
  const yesterday = today.minus({ days: 1 });
  const yesterdayString = yesterday.toFormat('yyyy-MM-dd');

  return yesterdayString;
}

export function getDayBeforeAsString(date: string) {
  const valueAsDateTime = getDateTimeDateFromDateString(date);
  const dayBefore = valueAsDateTime.minus({ days: 1 });
  const dateAsString = dayBefore.toFormat('yyyy-MM-dd');

  return dateAsString;
}

export function getSpecifiedDateAsString(dateTime: DateTime) {
  const date = dateTime;
  const dateAsString = date.toFormat('yyyy-MM-dd');

  return dateAsString;
}

export function getAllWeekDaysAsStrings(firstDayOfTheWeek: string) {
  const weekDays = [];

  const originalDay = getDateTimeDateFromDateString(firstDayOfTheWeek);
  const originalWeekNumber = originalDay.weekNumber;

  let currentDay = originalDay;
  let currentWeeknumber = currentDay.weekNumber;

  while (originalWeekNumber === currentWeeknumber) {
    weekDays.push(currentDay.toFormat('yyyy-MM-dd'));
    currentDay = currentDay.plus({ days: 1 });
    currentWeeknumber = currentDay.weekNumber;
  }

  return weekDays;
}
