import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import type { Wearable } from '../../../types'

async function getWearables() {
    try {
        const querySnapshot = await getDocs(collection(db, 'wearables'))
        const wearablesList: Wearable[] = []
        querySnapshot.forEach((doc) => {
            const { userId, token, lastUpdated } = doc.data()
            const data: Wearable = {
                id: doc.id,
                userId,
                token,
                lastUpdated,
            }
            wearablesList.push(data)
        })

        return {
            fitbit: wearablesList[0],
            oura: wearablesList[1],
        }
    } catch (error) {
        return error
    }
}

export default getWearables
