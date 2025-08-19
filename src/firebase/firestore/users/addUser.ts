/* eslint-disable no-console */
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import type { User } from '../../../types'

async function addUser(userData: User) {
    try {
        const docRef = await setDoc(doc(db, 'users', userData.userId), {
            displayName: userData.displayName,
            email: userData.email,
        })
        console.log('Document written with: ', docRef)
    } catch (e) {
        console.error('Error adding document: ', e)
    }
}

export default addUser
