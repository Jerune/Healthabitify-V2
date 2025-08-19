/* eslint-disable no-console */
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { DataPoint, DocumentsToKeep } from '../../types'

async function getDocsFromCollectionBasedOnString(
    dataCollection: string,
    queryString: string
) {
    const querySnapshot = await getDocs(collection(db, dataCollection))

    const documents: number | string[] = []
    const regex = new RegExp(queryString)

    querySnapshot.forEach((document) => {
        const { id } = document
        if (regex.test(id)) {
            documents.push(document.id)
        }
    })

    return documents
}

async function getAllDocsFromCollection(collectionName: string) {
    const querySnapshot = await getDocs(collection(db, collectionName))

    const documentsToKeep: DocumentsToKeep[] = []
    const documentIdsToDelete: string[] = []

    querySnapshot.forEach((document) => {
        const { metric, date, value } = document.data()
        const { id } = document

        if (
            documentsToKeep.some(
                (object) =>
                    object.metric === metric &&
                    object.date === date &&
                    object.value === value
            )
        ) {
            documentIdsToDelete.push(id)
        } else {
            documentsToKeep.push({ metric, date, value })
        }
    })

    return documentIdsToDelete
}

async function documentDoesNotExistAlready(datapoint: DataPoint) {
    const collectionName = `data-points-${datapoint.source}`
    const q = query(
        collection(db, collectionName),
        where('metric', '==', datapoint.metric),
        where('date', '==', datapoint.date)
    )

    const existingDocuments = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        existingDocuments.push(doc.data())
    })

    if (existingDocuments.length > 0) {
        return false
    }

    return true
}

export {
    getDocsFromCollectionBasedOnString,
    getAllDocsFromCollection,
    documentDoesNotExistAlready,
}
