import { Metric } from '../../types'

function getActiveMetrics(allMetrics: Metric[], category: string) {
    const activeMetrics = allMetrics.filter(
        (metric) => metric.active && metric.categoryId === category
    )

    return activeMetrics
}

export default getActiveMetrics
