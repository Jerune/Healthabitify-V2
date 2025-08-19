/* eslint-disable no-await-in-loop */
import averageExistsInDatabase from '../../firebase/firestore/averages/averageExistsInDatabase'
import { Period } from '../_types'

async function getListWithNewPeriods(dateToCheckFor: Period) {
    const currentYear = dateToCheckFor.year
    const dateTypes = ['weekNumber', 'month', 'year']
    const newPeriods: Period[] = []

    // Checks if the averages for that year, month and week exist already
    const promises = dateTypes.map(async (dateType) => {
        let year = currentYear
        const dateTypeValue = dateToCheckFor[dateType as keyof Period]
        // Remove one year when checking year value as currentYear has not finished yet
        if (dateType === 'year') {
            year -= 1
        }
        const averageExistsAlready = await averageExistsInDatabase(
            year,
            dateType,
            dateTypeValue
        )
        // Add requestQuery in case period does not exist yet
        if (!averageExistsAlready) {
            let requestQuery =
                dateType === 'year'
                    ? { year }
                    : { year, [dateType]: dateTypeValue }
            newPeriods.push(requestQuery)
            // Check if prior months or weeks also do not exists yet
            if (dateTypeValue && dateType !== 'year' && year > 2018) {
                let previousValue = dateTypeValue - 1
                let moreNewPeriods = true
                // If they don't exist also add requestQueries for those periods
                while (moreNewPeriods && year > 2018) {
                    const previousAverageExistsAlready =
                        await averageExistsInDatabase(
                            year,
                            dateType,
                            previousValue
                        )
                    if (!previousAverageExistsAlready) {
                        requestQuery = {
                            year,
                            [dateType]: previousValue,
                        }
                        newPeriods.push(requestQuery)
                        // Deduct 1 from value to get previous month or week
                        if (previousValue > 1) {
                            previousValue -= 1
                        } else if (previousValue === 1) {
                            // Or set to month 12 or week 52 of last year in case first week or month of the year
                            if (dateType === 'month') {
                                previousValue = 12
                            } else if (dateType === 'week') {
                                previousValue = 52
                            }
                            year -= 1
                        }
                    } else {
                        // Abort if averages from period already exist & reset year
                        year = currentYear
                        moreNewPeriods = false
                    }
                }
            }
        }
    })

    // Wait for all promises to resolve and return
    await Promise.all(promises)
    return newPeriods
}

export default getListWithNewPeriods
