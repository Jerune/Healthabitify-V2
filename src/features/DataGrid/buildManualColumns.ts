import { getShortDate } from "../../utils/getDateTimeData"

async function buildManualColumns(dates: string[], labs?: boolean) {
    const columns = dates.map((date) => {
        return {
            id: date,
            name: date,
            header: getShortDate(date),
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
            minWidth: 120,
        }
    })

    const metricColumn = {
        name: 'metric',
        id: 'metric',
        header: 'Metric',
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
        minWidth: 200,
    }

    const referenceColumn = {
        name: 'reference',
        id: 'reference',
        header: 'Ref.',
        headerProps: {
            style: {
                color: '#1D3557',
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: '1.1em',
            },
        },
        style: {
            fontStyle: 'italic',
            fontWeight: 'bold',
        },
        textAlign: 'center',
        maxWidth: 100,
        minWidth: 50,
    }

    if (labs) {
        return [metricColumn, referenceColumn, ...columns]
    }

    return [metricColumn, ...columns]
}

export default buildManualColumns
