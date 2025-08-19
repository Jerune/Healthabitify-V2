import { collection, addDoc } from 'firebase/firestore'
import { DateTime } from 'luxon'
import type { DataPoint } from '../../../types'
import { db } from '../../firebase'
import updateWearables from '../wearables/updateWearables'
import { getSpecifiedDateAsString } from '../../../utils/getDatesAsString'
import { documentDoesNotExistAlready } from '../getDocs'

async function addDatapoints(datapoints: DataPoint[]) {
    const { source } = datapoints[0]
    let highestDate: Date | null = null

    const newDatapoints = datapoints.filter((datapoint) => datapoint.value)
    const existingDatapoints = []

    newDatapoints.forEach((datapoint) => {
        const currentDate = new Date(datapoint.date)
        if (highestDate === null || currentDate > highestDate) {
            highestDate = currentDate
        }
    })

    const addOperations = newDatapoints.map(async (datapoint) => {
        const datapointIsNew = await documentDoesNotExistAlready(datapoint)
        if (datapointIsNew) {
            try {
                await addDoc(
                    collection(db, `data-points-${datapoint.source}`),
                    {
                        ...datapoint,
                    }
                )
                return 1
            } catch (e) {
                console.error('Error adding document: ', e)
                return 0
            }
        } else {
            existingDatapoints.push(datapoint)
            return 0
        }
    })

    const addedCounts = await Promise.all(addOperations)
    const amountOfDatapoints = addedCounts.reduce(
        (sum: number, count: number) => sum + count,
        0
    )

    if (highestDate && (source === 'fitbit' || source === 'oura')) {
        const highestDateAsDateTime = DateTime.fromJSDate(highestDate)
        const newLastUpdated = highestDateAsDateTime.plus({ days: 1 })
        const newLastUpdatedAsString = getSpecifiedDateAsString(newLastUpdated)

        updateWearables(source, 'lastUpdated', newLastUpdatedAsString)
    }

    return amountOfDatapoints
}

export default addDatapoints
