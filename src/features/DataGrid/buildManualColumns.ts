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
    headerClass: 'ag-header-cell-custom',
    cellClass: 'ag-cell-custom',
    sortable: false,
    filter: false,
    resizable: true,
    editable: false,
    valueGetter: params => {
      const cellData = params.data[date];
      if (cellData && typeof cellData === 'object' && 'value' in cellData) {
        return cellData.value;
      }
      return cellData || '';
    },
    cellStyle: {
      textAlign: 'left',
    },
    headerStyle: {
      fontStyle: 'italic',
    },
  }));

  // Metric column definition
  const metricColumn: ColDef = {
    field: 'metric',
    headerName: 'Metric',
    headerClass: 'ag-header-cell-custom',
    cellClass: 'ag-cell-custom',
    sortable: false,
    filter: false,
    resizable: true,
    editable: false,
    flex: 2,
    cellStyle: {
      textAlign: 'left',
    },
    headerStyle: {
      fontStyle: 'italic',
    },
  };

  // Reference column for labs
  const referenceColumn: ColDef = {
    field: 'reference',
    headerName: 'Ref.',
    headerClass: 'ag-header-cell-custom',
    cellClass: 'ag-cell-custom',
    sortable: false,
    filter: false,
    minWidth: 160,
    resizable: true,
    editable: false,
    cellStyle: {
      textAlign: 'left',
    },
    headerStyle: {
      fontStyle: 'italic',
    },
  };

  if (labs) {
    return [metricColumn, referenceColumn, ...dateColumns];
  }

  return [metricColumn, ...dateColumns];
}

export default buildManualColumns;
