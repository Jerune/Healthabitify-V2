import { collection, query, where, getDocs } from 'firebase/firestore'
import { DatapointsReturn, Metric } from '../../../types'
import kebabcaseToCamelcase from '../../../utils/kebabcaseToCamelcase'
import { db } from '../../firebase'
import { Period } from '../../../features/_types'

export default async function getDatapointsForPeriod(
    allMetrics: Metric[],
    period: Period
): Promise<DatapointsReturn> {
    let dateTitle = ''
    if (period.month) {
        dateTitle = `Y${period.year}-M${period.month}`
    } else if (period.weekNumber) {
        dateTitle = `Y${period.year}-W${period.weekNumber}`
    } else if (!period.month && !period.weekNumber) {
        dateTitle = `Y${period.year}`
    }

    const metricsWithoutAutoSource = allMetrics.filter(
        (metric) => metric.source !== 'auto'
    )

    const allDatapointsForPeriod = await Promise.all(
        metricsWithoutAutoSource.map(async (metric) => {
            const metricName = kebabcaseToCamelcase(metric.id)
            const datapoints: (number | string)[] = []
            const collectionName = `data-points-${metric.source}`
            // Verification if request is for a week, month or year and adjustment of query
            let dbQuery = query(
                collection(db, collectionName),
                where('metric', '==', metric.id),
                where('year', '==', period.year)
            )
            if (period.month) {
                dbQuery = query(
                    collection(db, collectionName),
                    where('metric', '==', metric.id),
                    where('year', '==', period.year),
                    where('month', '==', period.month)
                )
            } else if (period.weekNumber) {
                dbQuery = query(
                    collection(db, collectionName),
                    where('metric', '==', metric.id),
                    where('year', '==', period.year),
                    where('weekNumber', '==', period.weekNumber)
                )
            }

            const querySnapshot = await getDocs(dbQuery)
            const docDates: string[] = []
            querySnapshot.forEach((doc) => {
                const { value, date } = doc.data()
                if (!docDates.includes(date)) {
                    docDates.push(date)
                    datapoints.push(value)
                }
            })
            // Return only last value of the week for weekly metrics
            if (metric.frequency === 'weekly') {
                const lastValue = datapoints.slice(-1)
                return {
                    [metricName]: lastValue,
                    type: metric.dataType,
                }
            }
            // Return all daily values for daily metrics
            return {
                [metricName]: datapoints,
                type: metric.dataType,
            }
        })
    )
    return {
        period: dateTitle,
        data: allDatapointsForPeriod,
    }
}
