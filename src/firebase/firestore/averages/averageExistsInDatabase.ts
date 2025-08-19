import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

async function averageExistsInDatabase(
    currentYear: number,
    dateType: string,
    dateTypeValue?: number
) {
    const dateTypeInitial = dateType.split('')[0].toUpperCase()
    let queryId = ''

    switch (dateType) {
        case 'year':
            queryId = `Y${currentYear}`
            break
        default:
            queryId = `Y${currentYear}-${dateTypeInitial}${dateTypeValue}`
            break
    }

    const docRef = doc(db, 'averages', queryId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return true
    }

    return false
}

export default averageExistsInDatabase
