import { Metric } from '../../types'
import kebabcaseToCamelcase from '../../utils/kebabcaseToCamelcase'
import getConditionalFormatting from './getConditionalFormatting'

async function buildColumns(activeMetrics: Metric[]) {
    const columns = await activeMetrics.map((metric) => {
        const { id, name } = metric
        const onRender = getConditionalFormatting(metric)
        const newId = kebabcaseToCamelcase(id)

        return {
            name: newId,
            id,
            header: name,
            headerProps: {
                style: {
                    color: '#1D3557',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                },
            },
            flex: 1,
            textAlign: 'center',
            maxWidth: 300,
            minWidth: 100,
            onRender,
        }
    })

    return [
        {
            name: 'date',
            id: 'date',
            header: 'Date',
            headerProps: {
                style: {
                    color: '#1D3557',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                },
            },
            maxWidth: 140,
        },
        ...columns,
    ]
}

export default buildColumns
