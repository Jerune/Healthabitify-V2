/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types'
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks'
import {
    toggleManualDataGrid,
} from '../../redux/reducers/utilsReducer'
import SettingsButton from '../SettingsMenu/SettingsButton'
import Loading from '../../components/Loading'
import getManualDatapointsByDate from '../../firebase/firestore/data-points/getManualDatapointsByDate'
import buildManualColumns from '../DataGrid/buildManualColumns'
import { getAllWeekDaysAsStrings } from '../../utils/getDatesAsString'
import buildManualRows from '../DataGrid/buildManualRows'
import updateManualDatapoints from './updateManualDatapoints'
import createAveragesForNewPeriods from '../AveragesManagement/createAveragesForNewPeriods'
import { initAverages } from '../../redux/reducers/averagesReducer'
import buildAverages from '../AveragesManagement/buildAverages'
import { getDateTimeDataForPreviousPeriod } from '../../utils/getDateTimeData'
import labTestMetrics from '../../data/labTestMetrics'
import { Column, DatapointToEdit, ManualDataProps, Row } from '../_types'
import { LabtestMetric, Metric } from '../../types'
import { toast } from 'react-toastify'

function ManualDataGrid({ labs }: ManualDataProps) {
    const dispatch = useAppDispatch()
    const allMetrics = useAppSelector((state) => state.metrics)
    const deviceData = useAppSelector((state) => state.user.devices)
    const isLoading = useAppSelector((state) => state.utils.isLoading)
    const currentDateTime = useAppSelector(
        (state) => state.utils.currentDateTime
    )
    const lastUpdated =
        deviceData.fitbit.lastUpdated > deviceData.oura.lastUpdated
            ? deviceData.oura.lastUpdated
            : deviceData.fitbit.lastUpdated
    const [activeColumns, setActiveColumns] = useState<Column[]>([])
    const [activeRows, setActiveRows] = useState<Row[]>([])
    const [editForm, setEditForm] = useState(false)
    const [datapointsToEdit, setDatapointsToEdit] = useState<DatapointToEdit[]>(
        []
    )

    const labDates = [
        '2018-07-04',
        '2018-12-27',
        '2019-06-27',
        '2019-12-23',
        '2020-07-31',
        '2021-01-09',
        '2021-07-21',
        '2021-12-09',
        '2022-09-05',
        '2023-02-13',
        '2023-11-07',
    ]

    useEffect(() => {
        async function setDataGrid() {
            if (currentDateTime.currentDate) {
                let activeMetrics: Metric[] | LabtestMetric[] = []
                let dates = []

                // Set labs data whenever labs props is active
                if (labs) {
                    dates = labDates
                    activeMetrics = labTestMetrics
                } else {
                    // Set manual data metrics whenever labs is not active
                    activeMetrics = allMetrics.filter(
                        (metric) => metric.source === 'manual'
                    )
                    dates = getAllWeekDaysAsStrings(
                        currentDateTime.firstDayOfTheWeek
                    )
                }

                const columns = await buildManualColumns(dates, labs)
                setActiveColumns(columns)
                const datapoints = await getManualDatapointsByDate(
                    currentDateTime,
                    activeMetrics,
                    labs
                )
                const rows = buildManualRows(datapoints, dates)
                setActiveRows(rows)
            }
        }
        if (!isLoading) {
            setDataGrid()
        }
    }, [currentDateTime])

    useEffect(() => {
        async function updateLabData() {
            setDatapointsToEdit([])
            const { totalAmountOfChangedDatapoints } =
                await updateManualDatapoints(datapointsToEdit, true)
            toast.success(`${totalAmountOfChangedDatapoints} new lab results have been added`)
            dispatch(toggleManualDataGrid())
        }

        async function updateExistingAverages() {
            // Reset datapoints to edit
            setDatapointsToEdit([])
            // Return periods whenever data of already calculated averages have been updated
            const { periods, totalAmountOfChangedDatapoints } =
                await updateManualDatapoints(datapointsToEdit, false)
                toast.success(

                        `${totalAmountOfChangedDatapoints} new ${
                            totalAmountOfChangedDatapoints === 1
                                ? 'datapoint has'
                                : 'datapoints have'
                        } been added/changed`
                )
            // Update averages for already existing periods
            if (periods && periods.length > 0) {
                const amountOfNewAverages = await createAveragesForNewPeriods(
                    periods,
                    allMetrics
                )
                // Make sure datapoints message is run before message about averages

                        toast.success(
                            
                                `${amountOfNewAverages} new ${
                                    amountOfNewAverages === 1
                                        ? 'average has'
                                        : 'averages have'
                                } been calculated`
           
                        )

                const datesToCheckFor =
                    getDateTimeDataForPreviousPeriod(lastUpdated)
                if (datesToCheckFor) {
                    setTimeout(async () => {
                        const averageStoreData = await buildAverages(
                            datesToCheckFor
                        )
                        dispatch(initAverages(averageStoreData))
                    }, 2000)
                }
            }
            dispatch(toggleManualDataGrid())
        }

        if (!editForm && datapointsToEdit.length > 0 && !labs) {
            updateExistingAverages()
        } else if (!editForm && datapointsToEdit.length > 0 && labs) {
            updateLabData()
        }
    }, [editForm])

    const onEditComplete = useCallback(
        ({ value, columnId, rowId }: TypeEditInfo) => {
            const data = [...activeRows]
            const id = data[rowId as any].cells[columnId]
            const metricName = data[rowId as any].metric
            const metric = metricName
                ? metricName.split(' ').join('-').toLowerCase()
                : ''

            if (value) {
                data[rowId as any][columnId] = value
            }

            setDatapointsToEdit((prevState) => {
                const idToChange = id || 'new'
                return [
                    ...prevState,
                    { date: columnId, id: idToChange, value, metric },
                ]
            })
            setActiveRows(data)
        },
        [activeRows]
    )

    if (isLoading) {
        return <Loading size={50} />
    }

    return (
        <div className='h-full w-full flex flex-col'>
            <ReactDataGrid
                idProperty="id"
                columns={activeColumns}
                dataSource={activeRows}
                activateRowOnFocus={false}
                showActiveRowIndicator={false}
                showHoverRows={false}
                showColumnMenuTool={false}
                showColumnMenuFilterOptions={false}
                showColumnMenuGroupOptions={false}
                sortable={false}
                resizable={false}
                editable={editForm}
                onEditComplete={onEditComplete}
                className='flex-1'
            />
            <div className="md:sticky p-2 h-16 w-full bottom-0 flex flex-row gap-4 justify-between bg-white">
                <SettingsButton
                    type="button"
                    active={!editForm}
                    text="Edit"
                    onClick={() => setEditForm(true)}
                />
                <SettingsButton
                    type="submit"
                    active={editForm}
                    text="Save"
                    onClick={() => setEditForm(false)}
                />
            </div>
        </div>
    )
}

ManualDataGrid.defaultProps = {
    labs: false,
}

export default ManualDataGrid
