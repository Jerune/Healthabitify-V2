/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef } from 'ag-grid-community';

// AG Grid column definitions for mock data
const columnsMock: ColDef[] = [
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    sortable: false,
    filter: false,
  },
  {
    field: 'RHR',
    headerName: 'Average Resting Heart Rate (bpm)',
    width: 200,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      const { data } = params;
      if (!data || !data.RHR || !data.prevRHR) return params.value || '-';

      let backgroundColor = 'orange'; // default
      if (data.RHR < data.prevRHR) {
        backgroundColor = 'green';
      } else if (data.RHR > data.prevRHR) {
        backgroundColor = 'red';
      }

      return {
        value: params.value || '-',
        style: { backgroundColor },
      };
    },
  },
  {
    field: 'HRV',
    headerName: 'Average Resting Heart Rate Variability (ms)',
    width: 250,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      const { data } = params;
      if (!data || !data.HRV) return params.value || '-';

      const backgroundColor = Number(data.HRV) > 50 ? 'green' : 'red';
      return {
        value: params.value || '-',
        style: { backgroundColor },
      };
    },
  },
  {
    field: 'Blood',
    headerName: 'Blood Oxygen (SpO2) (%)',
    width: 180,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      const { data } = params;
      if (!data || !data.Blood) return params.value || '-';

      const backgroundColor = data.Blood > '96%' ? 'green' : 'red';
      return {
        value: params.value || '-',
        style: { backgroundColor },
      };
    },
  },
  {
    field: 'Resp',
    headerName: 'Respitory Rate (x/min)',
    width: 180,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      const { data } = params;
      if (!data || !data.Resp) return params.value || '-';

      const backgroundColor = Number(data.Resp) < 14.3 ? 'green' : 'red';
      return {
        value: params.value || '-',
        style: { backgroundColor },
      };
    },
  },
];

export default columnsMock;
