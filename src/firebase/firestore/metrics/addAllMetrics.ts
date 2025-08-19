// Function to add new list of metrics to the database for a new user

import { doc, setDoc } from 'firebase/firestore'
import metricItems from '../../../data/metrics/metricsMock'
import { db } from '../../firebase'

async function addAllMetrics() {
    metricItems.forEach(async (metric) => {
        await setDoc(doc(db, 'metrics', metric.id), metric)
    })
}

export default addAllMetrics
