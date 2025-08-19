function forceNumberReturn(value: string | number) {
  if (value) {
    if (typeof value === 'number') {
      return value;
    }
    const valueHoursAsNumber = Number(value.split(':')[0]);
    const valueMinutesAsNumber = Number(value.split(':')[1]);
    const numberValue = valueHoursAsNumber + valueMinutesAsNumber / 60;

    return numberValue;
  }

  return 0;
}

export default forceNumberReturn;
