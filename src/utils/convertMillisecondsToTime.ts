function convertMillisecondsToTime(timeInMilliseconds: number) {
  const hours = Math.floor(timeInMilliseconds / 3600);
  const remainingMilliseconds = timeInMilliseconds - hours * 3600;
  const minutes = Math.round(remainingMilliseconds / 60);

  const hoursAsString = String(hours);
  const minutesAsString = String(minutes).padStart(2, '0');

  return `${hoursAsString}:${minutesAsString}`;
}

export default convertMillisecondsToTime;
