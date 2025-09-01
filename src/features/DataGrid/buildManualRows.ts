import type { AGGridRow, DatapointsForDataGrid } from '../_types';

function buildManualRows(
  datapoints: DatapointsForDataGrid[],
  dates: string[]
): AGGridRow[] {
  const rows: AGGridRow[] = [];

  datapoints.forEach((metricObject, index: number) => {
    const metricId = Object.keys(metricObject)[0];
    const weeklyData = metricObject[metricId];
    const { reference } = metricObject;
    const metricName = metricId.split(/(?=[A-Z])/).join(' ');

    // Create base row with metric and reference
    const row: AGGridRow = {
      id: index.toString(),
      metric: metricName,
    };

    // Add reference if it exists (for labs)
    if (reference) {
      row.reference = reference;
    }

    // Initialize all date fields with empty values
    dates.forEach(date => {
      row[date] = '';
    });

    // Fill in actual data where it exists
    dates.forEach(date => {
      for (let i = 0; i < weeklyData.length; i += 1) {
        if (weeklyData[i].date === date) {
          row[date] = {
            value: weeklyData[i].value,
            id: weeklyData[i].id,
          };
        }
      }
    });

    rows.push(row);
  });

  // Sort rows by ID
  const sortedRows = rows.sort((a, b) => Number(a.id) - Number(b.id));
  return sortedRows;
}

export default buildManualRows;
