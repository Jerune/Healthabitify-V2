import { ColDef } from 'ag-grid-community';

import { getShortDate } from '../../utils/getDateTimeData';

async function buildManualColumns(
  dates: string[],
  labs?: boolean
): Promise<ColDef[]> {
  // Convert dates to AG Grid column definitions
  const dateColumns: ColDef[] = dates.map(date => ({
    field: date,
    headerName: getShortDate(date),
    width: 120,
    minWidth: 120,
    maxWidth: 300,
    headerClass: 'ag-header-cell-custom',
    cellClass: 'ag-cell-custom',
    sortable: false,
    filter: false,
    resizable: true,
    editable: false, // Will be controlled by editForm state
    cellStyle: {
      textAlign: 'center',
      color: '#1D3557',
    },
    headerStyle: {
      color: '#1D3557',
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontSize: '1.1em',
      textAlign: 'center',
    },
  }));

  // Metric column definition
  const metricColumn: ColDef = {
    field: 'metric',
    headerName: 'Metric',
    width: 200,
    minWidth: 200,
    maxWidth: 300,
    headerClass: 'ag-header-cell-custom',
    cellClass: 'ag-cell-custom',
    sortable: false,
    filter: false,
    resizable: true,
    editable: false,
    cellStyle: {
      textAlign: 'center',
      color: '#1D3557',
      fontWeight: 'bold',
    },
    headerStyle: {
      color: '#1D3557',
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontSize: '1.1em',
      textAlign: 'center',
    },
  };

  // Reference column for labs
  const referenceColumn: ColDef = {
    field: 'reference',
    headerName: 'Ref.',
    width: 80,
    minWidth: 50,
    maxWidth: 100,
    headerClass: 'ag-header-cell-custom',
    cellClass: 'ag-cell-custom',
    sortable: false,
    filter: false,
    resizable: true,
    editable: false,
    cellStyle: {
      textAlign: 'center',
      color: '#1D3557',
      fontStyle: 'italic',
      fontWeight: 'bold',
    },
    headerStyle: {
      color: '#1D3557',
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontSize: '1.1em',
      textAlign: 'center',
    },
  };

  if (labs) {
    return [metricColumn, referenceColumn, ...dateColumns];
  }

  return [metricColumn, ...dateColumns];
}

export default buildManualColumns;
