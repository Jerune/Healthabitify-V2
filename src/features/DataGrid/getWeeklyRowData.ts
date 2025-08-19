import metricsWithZeroValues from '../../data/metrics/metricsWithZeroValues'
import { Metric } from '../../types'
import kebabcaseToCamelcase from '../../utils/kebabcaseToCamelcase'
import adjustValueOutput from '../DataOutputManagement/adjustValueOutput'
import { AveragesData, Row } from '../_types'

function getWeeklyRowData(activeMetrics: Metric[], allAverages: AveragesData) {
    const currentYear = Object.keys(allAverages)[0]
    const weeks = Object.keys(allAverages[currentYear].weeks)
    const rows: Row[] = []

    weeks.forEach((week) => {
        // Getting data from weeks to be used as title and calculation source
        const weekNumber = Number(week.split('W')[1])
        const dateTitle = `Week ${weekNumber}`
        // Setting default row data
        const row: Row = {
            cells: {},
            id: weekNumber,
            date: dateTitle,
        }
        // Retrieving average data from every metric for that week
        activeMetrics.forEach((metric) => {
            const metricId = kebabcaseToCamelcase(metric.id)
            const metricAverageValueThisWeek =
                allAverages[currentYear].weeks[week][metricId]
            row[metricId] = adjustValueOutput(
                metric,
                metricAverageValueThisWeek
            )

            let activeWeekNumber = weekNumber - 1
            let metricAverageValuePreviousPeriod: string | number = 0
            while (weeks.includes(`W${activeWeekNumber}`)) {
                metricAverageValuePreviousPeriod =
                    allAverages[currentYear].weeks[`W${activeWeekNumber}`][
                        metricId
                    ]
                if (
                    metricAverageValuePreviousPeriod === 0 &&
                    !metricsWithZeroValues.includes(metric.id)
                ) {
                    activeWeekNumber -= 1
                } else {
                    row[`prev${metricId}`] = adjustValueOutput(
                        metric,
                        metricAverageValuePreviousPeriod
                    )
                    break
                }
            }
        })

        rows.push(row)
    })

    // Reverse order of the rows to show last week at the top
    return rows.reverse()
}

export default getWeeklyRowData
