/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import { changeLoadingStatus } from '../redux/reducers/utilsReducer';
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';

export default function Loading() {
  const isLoading = useAppSelector(state => state.utils.isLoading);
  const loadingMessage = useAppSelector(state => state.utils.loadingMessage);
  const allAverages = useAppSelector(state => state.averages);
  const dispatch = useAppDispatch();

  // Keeps loader true until all averages have been calculated
  useEffect(() => {
    // Returns true whenever averages are loaded
    const yearsFromAverages = Object.keys(allAverages).length > 1;
    if (yearsFromAverages) {
      dispatch(changeLoadingStatus(false));
    }
  }, [allAverages]);

  if (isLoading) {
    return (
      <div className='w-full h-full flex justify-center items-center gap-6'>
        <div className='flex flex-col justify-center items-center'>
          <span className='loading loading-infinity h-20 w-20 block text-palette-600' />
          <h3>{loadingMessage}</h3>
        </div>
      </div>
    );
  }

  return null;
}
