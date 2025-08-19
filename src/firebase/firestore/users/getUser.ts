/* eslint-disable no-console */
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

async function getUser(userID: string) {
    const docRef = doc(db, 'users', userID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        console.log('This user exists')
    } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
    }
}

export default getUser
