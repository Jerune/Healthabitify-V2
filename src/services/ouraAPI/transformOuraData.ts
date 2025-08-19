import { DataPoint, OuraDailySummary, OuraRawData } from '../../types'
import { getDateTimeDataForDatapoints } from '../../utils/getDateTimeData'
import matchServiceResourcesWithMetricNames from '../matchResources'

export default async function transformOuraData(
    ouraRawData: OuraRawData
): Promise<DataPoint[]> {
    const datapointsToAdd: DataPoint[] = []
    const source = 'oura'
    const longSleepData = ouraRawData.data.filter(
        (resource) => resource.type === 'long_sleep'
    )

    await longSleepData.forEach((dailySummary) => {
        Object.keys(dailySummary).forEach((key) => {
            const metric = matchServiceResourcesWithMetricNames(source, key)
            const dataValue = dailySummary[key as keyof OuraDailySummary]
            // Always have number or string value output (dailySummary has many other types)
            const value =
                typeof dataValue === 'number' ? dataValue : String(dataValue)
            if (metric !== 'unknown') {
                const date = dailySummary.day
                const { month, weekNumber, year } =
                    getDateTimeDataForDatapoints(date)

                const newDatapoint: DataPoint = {
                    userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
                    value,
                    date,
                    source,
                    metric,
                    weekNumber,
                    month,
                    year,
                }
                datapointsToAdd.push(newDatapoint)
            }
        })
    })
    return datapointsToAdd
}
