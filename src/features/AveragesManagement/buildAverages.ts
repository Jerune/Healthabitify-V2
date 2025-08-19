import getMonthlyYearlyAverages from '../../firebase/firestore/averages/getMonthlyYearlyAverages';
import getWeeklyAverages from '../../firebase/firestore/averages/getWeeklyAverages';
import { Averages, AveragesData, PeriodForAverage } from '../_types';

async function buildAverages({ weekNumber, month, year }: PeriodForAverage) {
  const availableDatesInAverages: AveragesData = {};

  // Get all averages from months and weeks for a certain year
  // Maximum set to 2019 as first data is from 2019
  let currentYear = year;
  let latestMonth = month;
  let latestWeekNumber = weekNumber;
  while (currentYear >= 2019) {
    availableDatesInAverages[`Y${currentYear}`] = {
      months: {},
      weeks: {},
    };

    const monthlyPromises = [];
    const weeklyPromises = [];

    while (latestMonth > 0) {
      monthlyPromises.push(getMonthlyYearlyAverages(currentYear, latestMonth));
      latestMonth -= 1;
    }

    while (latestWeekNumber > 0) {
      weeklyPromises.push(getWeeklyAverages(currentYear, latestWeekNumber));
      latestWeekNumber -= 1;
    }

    const [monthlyAverages, weeklyAverages] = await Promise.all([
      Promise.all(monthlyPromises),
      Promise.all(weeklyPromises),
    ]);

    const sortedMonthlyAverages = monthlyAverages.reverse();
    const sortedWeeklyAverages = weeklyAverages.reverse();

    for (let i = 0; i < sortedMonthlyAverages.length; i += 1) {
      if (typeof sortedMonthlyAverages[i] !== 'string') {
        availableDatesInAverages[`Y${currentYear}`].months[`M${i + 1}`] =
          sortedMonthlyAverages[i] as Averages;
      }
    }

    for (let i = 0; i < sortedWeeklyAverages.length; i += 1) {
      if (typeof sortedWeeklyAverages[i] !== 'string') {
        availableDatesInAverages[`Y${currentYear}`].weeks[`W${i + 1}`] =
          sortedWeeklyAverages[i] as Averages;
      }
    }

    const yearlyAverage = await getMonthlyYearlyAverages(currentYear);
    if (yearlyAverage !== 'error') {
      availableDatesInAverages[`Y${currentYear}`].year = yearlyAverage;
    }

    currentYear -= 1;
    latestMonth = 12;
    latestWeekNumber = 52;
  }

  return availableDatesInAverages;
}

export default buildAverages;
