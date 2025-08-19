import { DataPoint, OuraRawData } from '../../types'
import transformOuraData from './transformOuraData'

export default async function transformBatchedOuraData(
    ouraRawData: OuraRawData[]
): Promise<DataPoint[]> {
    const allDatapoints: DataPoint[] = []
    
    console.log('Processing batched Oura data:', {
        numberOfBatches: ouraRawData.length,
        batchTypes: ouraRawData.map(batch => typeof batch)
    })
    
    // Process each monthly batch individually
    for (let i = 0; i < ouraRawData.length; i++) {
        const batch = ouraRawData[i]
        
        if (batch === 'error') {
            console.error(`Batch ${i} returned error, skipping...`)
            continue
        }
        
        try {
            console.log(`Processing batch ${i + 1}/${ouraRawData.length}`)
            const batchDatapoints = await transformOuraData(batch)
            allDatapoints.push(...batchDatapoints)
            
            console.log(`Batch ${i + 1} processed successfully:`, {
                datapointsAdded: batchDatapoints.length,
                totalDatapointsSoFar: allDatapoints.length
            })
        } catch (error) {
            console.error(`Error processing batch ${i + 1}:`, error)
            continue
        }
    }
    
    console.log('Batched Oura data processing complete:', {
        totalBatches: ouraRawData.length,
        successfulBatches: allDatapoints.length > 0 ? 'all' : 'none',
        totalDatapoints: allDatapoints.length
    })
    
    return allDatapoints
}
