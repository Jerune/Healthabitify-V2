import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default async function updateWearables(
    source: string,
    key: string,
    value: string
) {
    const metricRef = doc(db, 'wearables', source)

    await updateDoc(metricRef, {
        [key]: value,
    })
}
