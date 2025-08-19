function calculateDifference(value: number, comparisonValue: number): number {
  if (value === undefined || comparisonValue === undefined) {
    return 0;
  }

  const difference =
    value > comparisonValue ? value - comparisonValue : comparisonValue - value;

  return difference;
}

export default calculateDifference;
