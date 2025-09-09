'use client';

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import Loading from '../../components/Loading';
import { labDates } from '../../data/labTestDates';
import labTestMetrics from '../../data/labTestMetrics';
import getManualDatapointsByDate from '../../firebase/firestore/data-points/getManualDatapointsByDate';
import { initAverages } from '../../redux/reducers/averagesReducer';
import { toggleManualDataGrid } from '../../redux/reducers/utilsReducer';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks';
import { LabtestMetric, Metric } from '../../types';
import { getAllWeekDaysAsStrings } from '../../utils/getDatesAsString';
import { getDateTimeDataForPreviousPeriod } from '../../utils/getDateTimeData';
import type { DatapointToEdit, ManualDataProps } from '../_types';
import buildAverages from '../AveragesManagement/buildAverages';
import createAveragesForNewPeriods from '../AveragesManagement/createAveragesForNewPeriods';
import buildManualColumns from '../DataGrid/buildManualColumns';
import buildManualRows from '../DataGrid/buildManualRows';
import SettingsButton from '../SettingsMenu/SettingsButton';

import { defaultColDef, gridTheme } from './theme';
import updateManualDatapoints from './updateManualDatapoints';

ModuleRegistry.registerModules([AllCommunityModule]);

function ManualDataGrid({ labs = false }: ManualDataProps) {
  const dispatch = useAppDispatch();
  const allMetrics = useAppSelector(state => state.metrics);
  const deviceData = useAppSelector(state => state.user.devices);
  const isLoading = useAppSelector(state => state.utils.isLoading);
  const currentDateTime = useAppSelector(state => state.utils.currentDateTime);
  const lastUpdated =
    deviceData.fitbit.lastUpdated > deviceData.oura.lastUpdated
      ? deviceData.oura.lastUpdated
      : deviceData.fitbit.lastUpdated;

  const [activeColumns, setActiveColumns] = useState<ColDef[]>([]);
  const [activeRows, setActiveRows] = useState<any[]>([]);
  const [editForm, setEditForm] = useState(false);
  const [datapointsToEdit, setDatapointsToEdit] = useState<DatapointToEdit[]>(
    []
  );

  const gridRef = useRef<AgGridReact>(null);

  // Update column definitions when editForm changes
  const columnDefs = useMemo<ColDef[]>(() => {
    return activeColumns.map(col => ({
      ...col,
      editable: editForm,
      cellEditor: editForm ? 'agTextCellEditor' : undefined,
    }));
  }, [activeColumns, editForm]);

  useEffect(() => {
    async function setDataGrid() {
      if (currentDateTime.currentDate) {
        let activeMetrics: Metric[] | LabtestMetric[] = [];
        let dates = [];

        // Set labs data whenever labs props is active
        if (labs) {
          dates = labDates;
          activeMetrics = labTestMetrics;
        } else {
          // Set manual data metrics whenever labs is not active
          activeMetrics = allMetrics.filter(
            metric => metric.source === 'manual'
          );
          dates = getAllWeekDaysAsStrings(currentDateTime.firstDayOfTheWeek);
        }

        const columns = await buildManualColumns(dates, labs);
        setActiveColumns(columns);
        const datapoints = await getManualDatapointsByDate(
          currentDateTime,
          activeMetrics,
          labs
        );
        const rows = buildManualRows(datapoints, dates);
        setActiveRows(rows);
      }
    }
    if (!isLoading) {
      setDataGrid();
    }
  }, [currentDateTime, isLoading, labs]);

  useEffect(() => {
    async function updateLabData() {
      setDatapointsToEdit([]);
      const { totalAmountOfChangedDatapoints } = await updateManualDatapoints(
        datapointsToEdit,
        true
      );
      toast.success(
        `${totalAmountOfChangedDatapoints} new lab results have been added`
      );
      dispatch(toggleManualDataGrid());
    }

    async function updateExistingAverages() {
      // Reset datapoints to edit
      setDatapointsToEdit([]);
      // Return periods whenever data of already calculated averages have been updated
      const { periods, totalAmountOfChangedDatapoints } =
        await updateManualDatapoints(datapointsToEdit, false);
      toast.success(
        `${totalAmountOfChangedDatapoints} new ${
          totalAmountOfChangedDatapoints === 1
            ? 'datapoint has'
            : 'datapoints have'
        } been added/changed`
      );
      // Update averages for already existing periods
      if (periods && periods.length > 0) {
        const amountOfNewAverages = await createAveragesForNewPeriods(
          periods,
          allMetrics
        );
        // Make sure datapoints message is run before message about averages

        toast.success(
          `${amountOfNewAverages} new ${
            amountOfNewAverages === 1 ? 'average has' : 'averages have'
          } been calculated`
        );

        const datesToCheckFor = getDateTimeDataForPreviousPeriod(lastUpdated);
        if (datesToCheckFor) {
          setTimeout(async () => {
            const averageStoreData = await buildAverages(datesToCheckFor);
            dispatch(initAverages(averageStoreData));
          }, 2000);
        }
      }
      dispatch(toggleManualDataGrid());
    }

    if (!editForm && datapointsToEdit.length > 0 && !labs) {
      updateExistingAverages();
    } else if (!editForm && datapointsToEdit.length > 0 && labs) {
      updateLabData();
    }
  }, [editForm, datapointsToEdit, labs, lastUpdated, allMetrics, dispatch]);

  const onCellValueChanged = useCallback((params: any) => {
    const { colDef, newValue, data } = params;
    const columnId = colDef.field;
    const cellData = data[columnId];
    const datapointId =
      cellData && typeof cellData === 'object' ? cellData.id : null;
    const metricName = data.metric;
    const metric = metricName
      ? metricName.split(' ').join('-').toLowerCase()
      : '';

    if (newValue !== undefined && newValue !== null && newValue !== '') {
      setDatapointsToEdit(prevState => {
        const idToChange = datapointId || 'new';
        return [
          ...prevState,
          { date: columnId, id: idToChange, value: newValue, metric },
        ];
      });
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='h-full w-full flex flex-col justify-between'>
      {columnDefs.length === 0 ? (
        <div className='p-4 text-center text-gray-500'>
          No data available. Columns: {activeColumns.length}, Rows:{' '}
          {activeRows.length}
        </div>
      ) : (
        <div className='h-full w-full'>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            rowData={activeRows}
            theme={gridTheme}
            defaultColDef={defaultColDef}
            onCellValueChanged={onCellValueChanged}
            suppressCellFocus={!editForm}
            suppressRowHoverHighlight={true}
            enableCellTextSelection={editForm}
          />
        </div>
      )}
      <div className='p-2 h-16 w-full bottom-0 flex flex-row gap-4 justify-between bg-white'>
        <SettingsButton
          type='button'
          active={!editForm}
          text='Edit'
          onClick={() => setEditForm(true)}
        />
        <SettingsButton
          type='submit'
          active={editForm}
          text='Save'
          onClick={() => setEditForm(false)}
        />
      </div>
    </div>
  );
}

export default ManualDataGrid;
