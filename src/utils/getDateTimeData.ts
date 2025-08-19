import { DateTime } from 'luxon'

function getDateTimeDataForDatapoints(date: string) {
    const currentDate = DateTime.fromISO(date)
    const { month, weekNumber, year } = currentDate

    return { month, weekNumber, year }
}

function getDateTimeDateFromDateString(date: string) {
    const dateTimeDate = DateTime.fromISO(date, {
        setZone: true,
    })

    return dateTimeDate
}

function getDateTimeDataForPreviousPeriod(date: string) {
    const lastUpdatedDate = getDateTimeDateFromDateString(date)
    const sameDayLastWeek = lastUpdatedDate.minus({ weeks: 1 })
    const sameDayLastMonth = lastUpdatedDate.minus({ month: 1 })

    const { weekNumber } = sameDayLastWeek
    const { month } = sameDayLastMonth
    const { year } = sameDayLastWeek

    return { weekNumber, month, year }
}

function getShortDate(date: string): string{
    const DateTimeDate = getDateTimeDateFromDateString(date)
    const shortDate = DateTimeDate.toFormat('EEE. d LLL.')

    return shortDate
}

export {
    getDateTimeDateFromDateString,
    getDateTimeDataForDatapoints,
    getDateTimeDataForPreviousPeriod,
    getShortDate,
}
