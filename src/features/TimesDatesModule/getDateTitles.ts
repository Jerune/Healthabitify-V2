import type { DateTitles, DateTimeData } from '../_types'

function getDateTitles(DateTimeData: DateTimeData): DateTitles {
    const { currentDate, firstDayOfTheWeek, lastDayOfTheWeek } = DateTimeData

    const week = `${firstDayOfTheWeek.toFormat(
        'd LLL, yyyy'
    )} - ${lastDayOfTheWeek.toFormat('d LLL, yyyy')}`
    const month = currentDate.toFormat('LLLL, y')
    const year = currentDate.toFormat('y')

    return {
        week,
        month,
        year,
    }
}

export default getDateTitles
