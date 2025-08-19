import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

async function getWeeklyAverages(currentYear: number, latestWeek: number) {
    const docRef = doc(db, 'averages', `Y${currentYear}-W${latestWeek}`)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return docSnap.data()
    }

    return 'error'
}

export default getWeeklyAverages
