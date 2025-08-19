import { CellProps } from '@inovua/reactdatagrid-community/types'

const columnsMock = [
    { name: 'date', header: 'Date' },
    {
        name: 'RHR',
        header: 'Average Resting Heart Rate (bpm)',
        onRender: (
            cellProps: CellProps,
            { data }: { data: Record<string, number | string> }
        ) => {
            cellProps.style = cellProps.style || {}
            const style = cellProps.style as React.CSSProperties

            if (data.RHR < data.prevRHR) {
                style.background = 'green'
            } else if (data.RHR > data.prevRHR) {
                style.background = 'red'
            } else {
                style.background = 'orange'
            }
        },
    },
    {
        name: 'HRV',
        header: 'Average Resting Heart Rate Variability (ms)',
        onRender: (
            cellProps: CellProps,
            { data }: { data: Record<string, number | string> }
        ) => {
            cellProps.style = cellProps.style || {}
            const style = cellProps.style as React.CSSProperties
            style.background = Number(data.HRV) > 50 ? 'green' : 'red'
        },
    },
    {
        name: 'Blood',
        header: 'Blood Oxygen (SpO2) (%)',
        onRender: (
            cellProps: CellProps,
            { data }: { data: Record<string, number | string> }
        ) => {
            cellProps.style = cellProps.style || {}
            const style = cellProps.style as React.CSSProperties

            style.background = data.Blood > '96%' ? 'green' : 'red'
        },
    },
    {
        name: 'Resp',
        header: 'Respitory Rate (x/min)',
        onRender: (
            cellProps: CellProps,
            { data }: { data: Record<string, number | string> }
        ) => {
            cellProps.style = cellProps.style || {}
            const style = cellProps.style as React.CSSProperties
            style.background = Number(data.Resp) < 14.3 ? 'green' : 'red'
        },
    },
]

export default columnsMock
