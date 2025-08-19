/* eslint-disable no-console */
import { doc, setDoc } from 'firebase/firestore'
import { AveragesReturn } from '../../../features/_types'
import { db } from '../../firebase'

async function addAverages(periodData: AveragesReturn) {
    const { period, keys } = periodData

    try {
        await setDoc(doc(db, 'averages', period), {
            ...keys,
        })
        console.log(
            `Averages for ${period} have been added successfully to the averages collection`
        )
        // returns an 1 every time the function has run succesfully
        // to be able to count the total amount
        return 1
    } catch (error) {
        console.log(error)
    }

    return 0
}

export default addAverages
