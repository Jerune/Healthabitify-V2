function calculateAmountAverage(values: number[], isTotalAmount?: boolean) {
  let total = 0;
  if (isTotalAmount) {
    if (values.length > 0) {
      values.forEach(value => {
        total += Number(value);
      });
    }
    return Math.floor(total);
  }
  let amountOfValues = 0;
  if (values.length > 0) {
    values.forEach(value => {
      total += Number(value);
      amountOfValues += 1;
    });
  }
  const average = Math.round((total / amountOfValues) * 100) / 100;

  return average;
}

export default calculateAmountAverage;
