import { Metric } from '../../types'

function addDecimals(metric: Metric, value: number | string) {
    const { decimals } = metric
    if (!value) {
        return 0
    }

    if (typeof value === 'string') {
        return value
    }

    if (decimals && decimals >= 1) {
        return value.toFixed(decimals)
    }

    return Math.round(value)
}

export default addDecimals
