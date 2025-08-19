import averageExistsInDatabase from '../../firebase/firestore/averages/averageExistsInDatabase'
import addDatapoints from '../../firebase/firestore/data-points/addDatapoints'
import updateDatapoints from '../../firebase/firestore/data-points/updateDatapoints'
import { getDateTimeDataForDatapoints } from '../../utils/getDateTimeData'
import { DatapointToEdit, Period } from '../_types'

async function updateManualDatapoints(
    potentialDatapoints: DatapointToEdit[],
    labs: boolean
) {
    const source = labs ? 'labs' : 'manual'

    // Amounts of datapoints
    let amountOfNewDatapoints = 0
    let amountOfUpdatedDatapoints = 0

    // List of periods to be updated in averages
    const weeks: Period[] = []
    const months: Period[] = []
    const years: Period[] = []

    const newPotentialDatapoints = potentialDatapoints.filter(
        (datapoint) => datapoint.id === 'new'
    )
    const existingDatapointsToChange = potentialDatapoints.filter(
        (datapoint) => datapoint.id !== 'new'
    )

    // Building new values as Datapoints and creating them in Firestore
    if (newPotentialDatapoints.length > 0) {
        const newDatapoints = newPotentialDatapoints.map((datapoint) => {
            const { date, value, metric } = datapoint
            const { month, weekNumber, year } =
                getDateTimeDataForDatapoints(date)

            // Only check periods for Manual datapoints, not labs
            if (!labs) {
                if (!weeks.some((object) => object.weekNumber === weekNumber)) {
                    weeks.push({ year, weekNumber })
                }

                if (!months.some((object) => object.month === month)) {
                    months.push({ year, month })
                }

                if (!years.some((object) => object.year === year)) {
                    years.push({ year })
                }
            }

            return {
                value,
                metric,
                userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
                source,
                date,
                weekNumber,
                month,
                year,
            }
        })
        amountOfNewDatapoints = await addDatapoints(newDatapoints)
    }

    // Updating existing values of Datapoints in Firestore
    if (existingDatapointsToChange.length > 0) {
        const datapointsToUpdate = existingDatapointsToChange.map(
            (datapoint) => {
                const { id, value, date } = datapoint
                const { month, weekNumber, year } =
                    getDateTimeDataForDatapoints(date)

                // Only check periods for Manual datapoints, not labs
                if (!labs) {
                    if (
                        !weeks.some(
                            (object) => object.weekNumber === weekNumber
                        )
                    ) {
                        weeks.push({ year, weekNumber })
                    }

                    if (!months.some((object) => object.month === month)) {
                        months.push({ year, month })
                    }

                    if (!years.some((object) => object.year === year)) {
                        years.push({ year })
                    }
                }
                return { id, value }
            }
        )

        amountOfUpdatedDatapoints = await updateDatapoints(
            datapointsToUpdate,
            source
        )
    }

    let totalAmountOfChangedDatapoints =
        amountOfNewDatapoints + amountOfUpdatedDatapoints

    if (!labs) {
        // Checking if periods are already active
        const activeWeeks = await Promise.all(
            weeks.map(async (weekdata) => {
                const doesExist = await averageExistsInDatabase(
                    weekdata.year,
                    'week',
                    weekdata.weekNumber
                )
                return { weekdata, doesExist }
            })
        )

        const activeMonths = await Promise.all(
            months.map(async (monthData) => {
                const doesExist = await averageExistsInDatabase(
                    monthData.year,
                    'month',
                    monthData.month
                )
                return { monthData, doesExist }
            })
        )

        const activeYears = await Promise.all(
            years.map(async (yearData) => {
                const doesExist = await averageExistsInDatabase(
                    yearData.year,
                    'year',
                    yearData.year
                )
                return { yearData, doesExist }
            })
        )

        const periods = [
            ...activeWeeks
                .filter((entry) => entry.doesExist)
                .map((entry) => entry.weekdata),
            ...activeMonths
                .filter((entry) => entry.doesExist)
                .map((entry) => entry.monthData),
            ...activeYears
                .filter((entry) => entry.doesExist)
                .map((entry) => entry.yearData),
        ]

        totalAmountOfChangedDatapoints =
            amountOfNewDatapoints + amountOfUpdatedDatapoints

        return {
            periods,
            totalAmountOfChangedDatapoints,
        }
    }

    return { totalAmountOfChangedDatapoints }
}

export default updateManualDatapoints
