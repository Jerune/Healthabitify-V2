import { DateTime } from 'luxon'

export default function calculateDifferenceWithToday(
    date: string
): number | undefined {
    const today = DateTime.now()
    const dateFromParameter = DateTime.fromISO(date)
    const difference = today.diff(dateFromParameter, 'days')
    const differenceInDays = difference.toObject().days

    const differenceInDaysRounded =
        differenceInDays && Math.round(differenceInDays)

    return differenceInDaysRounded
}
