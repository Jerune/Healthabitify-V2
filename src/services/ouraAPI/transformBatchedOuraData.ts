import { DataPoint, OuraRawData } from '../../types';

import transformOuraData from './transformOuraData';

export default async function transformBatchedOuraData(
  ouraRawData: OuraRawData[]
): Promise<DataPoint[]> {
  const allDatapoints: DataPoint[] = [];

  // Process each monthly batch individually
  for (let i = 0; i < ouraRawData.length; i++) {
    const batch = ouraRawData[i];

    try {
      const batchDatapoints = await transformOuraData(batch);
      allDatapoints.push(...batchDatapoints);
    } catch (error) {
      console.error(`Error processing batch ${i + 1}:`, error);
      continue;
    }
  }

  return allDatapoints;
}
