function convertMillisecondsToTime(timeInMilliseconds: number) {
  const hours = Math.floor(timeInMilliseconds / 3600);
  const remainingMilliseconds = timeInMilliseconds - hours * 3600;
  const minutes = Math.round(remainingMilliseconds / 60);

  const hoursAsString = String(hours);
  const minutesAsString = String(minutes).padStart(2, '0');

  return `${hoursAsString}:${minutesAsString}`;
}

function convertMillisecondsToDuration(milliseconds: number) {
  // Convert milliseconds to total minutes
  const totalMinutes = Math.floor(milliseconds / 60000); // 1 minute = 60,000 ms

  // Calculate hours and remaining minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format with leading zeros
  const formattedHours = String(hours);
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

function convertDateToMilliseconds(dateString: string) {
  return new Date(dateString).getTime();
}

export {
  convertDateToMilliseconds,
  convertMillisecondsToDuration,
  convertMillisecondsToTime,
};
