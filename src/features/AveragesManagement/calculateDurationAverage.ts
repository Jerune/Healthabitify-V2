function calculateDurationAverage(values: string[]): string {
  const valuesInMinutes = values.map(value => {
    const hoursAndMinutesSeperated = value.split(':');
    const hours = parseInt(hoursAndMinutesSeperated[0], 10);
    const minutes = parseInt(hoursAndMinutesSeperated[1], 10);
    return hours * 60 + minutes;
  });

  let total = 0;
  let amountOfValues = 0;
  if (valuesInMinutes.length > 0) {
    valuesInMinutes.forEach(value => {
      total += value;
      amountOfValues += 1;
    });
  }
  const average = total / amountOfValues;
  const hours = Math.floor(average / 60);
  const minutes = Math.floor(average - hours * 60);

  const hoursString = String(hours).padStart(2, '0');
  const minutesString = String(minutes).padStart(2, '0');

  const averageFormattedString = `${hoursString}:${minutesString}`;

  return averageFormattedString;
}

export default calculateDurationAverage;
