import { getDateTimeDateFromDateString } from '../../utils/getDateTimeData';

function calculateTimeAverage(values: string[]): string {
  const datesAsTimes = values.map(value => {
    const dateTimeInOriginalTimeZone = getDateTimeDateFromDateString(value);
    // keepLocalTime converst only TimeZone in case of values in different TimeZones
    const dateTimeInLocalTimeZone = dateTimeInOriginalTimeZone.setZone(
      'Europe/Paris',
      { keepLocalTime: true }
    );
    const localDateAsString = dateTimeInLocalTimeZone.toString();
    const time = new Date(localDateAsString).toLocaleTimeString('en', {
      timeStyle: 'short',
      hour12: false,
    });
    return time;
  });

  let totalMinutes = 0;
  let amountOfValues = 0;
  if (datesAsTimes.length > 0) {
    datesAsTimes.forEach(value => {
      let hours = Number(value.split(':')[0]);
      const minutes = Number(value.split(':')[1]);
      if (hours < 5) {
        hours += 24;
      }
      const amountOfMinutes = hours * 60 + minutes;
      totalMinutes += amountOfMinutes;
      amountOfValues += 1;
    });
  }

  const averageMinutes = totalMinutes / amountOfValues;
  const hours = String(Math.floor(averageMinutes / 60)).padStart(2, '0');
  const minutes = String(
    Math.floor(averageMinutes - Number(hours) * 60)
  ).padStart(2, '0');

  const average = `${hours}:${minutes}`;

  return average;
}

export default calculateTimeAverage;
