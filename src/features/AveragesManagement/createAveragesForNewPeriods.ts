import addAverages from '../../firebase/firestore/averages/addAverages'
import getDatapointsForPeriod from '../../firebase/firestore/data-points/getDatapointsForPeriod'
import { DatapointsReturn, Metric } from '../../types'
import { Period } from '../_types'
import calculateAveragesForPeriod from './calculateAveragesForPeriod'

async function createAveragesForNewPeriods(
    newPeriods: Period[],
    allMetrics: Metric[]
) {
    let amountOfNewAverages = 0

    await Promise.all(
        newPeriods.map(async (newPeriod) => {
            const datapoints: DatapointsReturn = await getDatapointsForPeriod(
                allMetrics,
                newPeriod
            )
            if (datapoints.data.length > 0) {
                const averages = await calculateAveragesForPeriod(datapoints)
                const newAverage = await addAverages(averages)
                amountOfNewAverages += newAverage
            }
        })
    )

    return amountOfNewAverages
}

export default createAveragesForNewPeriods
