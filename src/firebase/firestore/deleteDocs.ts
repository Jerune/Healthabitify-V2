import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

async function deleteDocsFromCollectionById(
    collectionName: string,
    listOfIds: string[]
) {
    listOfIds.forEach(async (documentId) => {
        try {
            await deleteDoc(doc(db, collectionName, documentId))
            console.log(
                `Document with id ${documentId} has been deleted from the ${collectionName} collection`
            )
        } catch (error) {
            console.log(error)
        }
    })
}

export default deleteDocsFromCollectionById
