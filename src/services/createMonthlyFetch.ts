import {
  getYesterdaysDateAsString,
  getSpecifiedDateAsString,
} from '../utils/getDatesAsString';
import { getDateTimeDateFromDateString } from '../utils/getDateTimeData';

function createMonthlyFetch(lastUpdated: string, source: string) {
  const yesterdayString = getYesterdaysDateAsString();
  const lastUpdatedAsDateTime = getDateTimeDateFromDateString(lastUpdated);
  const yesterdaysDateAsDateTime =
    getDateTimeDateFromDateString(yesterdayString);

  const dates = [];
  let firstDayOfTheMonth = lastUpdatedAsDateTime;

  while (
    firstDayOfTheMonth.month <= yesterdaysDateAsDateTime.month ||
    firstDayOfTheMonth.year < yesterdaysDateAsDateTime.year
  ) {
    // DateTimes
    const lastDayOfTheMonth = firstDayOfTheMonth.endOf('month');
    const firstDayOfTheMonthMinusOneDay = firstDayOfTheMonth.minus({
      days: 1,
    });
    // Strings
    const firstDayString = getSpecifiedDateAsString(firstDayOfTheMonth);
    const firstDayMinusOneDayString = getSpecifiedDateAsString(
      firstDayOfTheMonthMinusOneDay
    );
    const lastDayString = getSpecifiedDateAsString(lastDayOfTheMonth);

    if (
      firstDayOfTheMonth.month < yesterdaysDateAsDateTime.month ||
      firstDayOfTheMonth.year < yesterdaysDateAsDateTime.year
    ) {
      dates.push({
        start: source === 'fitbit' ? firstDayString : firstDayMinusOneDayString,
        end: lastDayString,
      });

      firstDayOfTheMonth = lastDayOfTheMonth.plus({ days: 1 });
    } else {
      dates.push({
        start: source === 'fitbit' ? firstDayString : firstDayMinusOneDayString,
        end: yesterdayString,
      });

      firstDayOfTheMonth = lastDayOfTheMonth.plus({ days: 1 });
    }
  }

  return dates;
}

export default createMonthlyFetch;
