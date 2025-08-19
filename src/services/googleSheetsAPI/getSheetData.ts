/* eslint-disable no-restricted-globals */
import { getDateTimeDataForDatapoints } from '../../utils/getDateTimeData'
import { DataPoint } from '../../types'
import addDatapoints from '../../firebase/firestore/data-points/addDatapoints'

async function getSheetData() {
    // Add Google Sheets API Access Token after 'Bearer'
    const auth = 'Bearer '
    const sheetId = '1hT_MjqAWAfv4yITnbw8O3jqN6QeDofQu5TWcjabigds'
    const tabIdRange = 'Weekly!A1:BA2'
    const responseValues = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabIdRange}?key=AIzaSyCA804z8krvmsG9lU6jo_uE-J_yDZugdBg`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: auth,
            },
        }
    )
    const valuesData = await responseValues.json()
    const rows = valuesData.values

    let datapoints: DataPoint[] = []
    // Iterate over each row
    rows.forEach((row: string[]) => {
        const metric: string = row[0]

        // Iterate over each column
        for (let i = 1; i < row.length; i += 1) {
            const date = `${rows[0][i]}`
            const value = row[i]
            const valueAsNumber = Number(value)

            const { weekNumber, month, year } =
                getDateTimeDataForDatapoints(date)
            if (
                Number(value) !== 0 &&
                value !== undefined &&
                value !== '' &&
                metric !== 'date'
            ) {
                const data = {
                    value: !isNaN(valueAsNumber) ? valueAsNumber : value,
                    metric,
                    userId: 'nbkxUOC66VVE7CbqhloaTQJKiRH3',
                    source: 'manual',
                    date,
                    weekNumber,
                    month,
                    year,
                }

                datapoints.push(data)
            }
        }
        // if (datapoints.length > 0) {
        //     addDatapoints(datapoints)
        // }
        // console.log(datapoints)
        datapoints = []
    })
}

export default getSheetData
