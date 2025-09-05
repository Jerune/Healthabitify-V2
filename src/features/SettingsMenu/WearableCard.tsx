import { useAppSelector } from '../../redux/reduxHooks';
import { Device } from '../../types';
import { AuthenticationButton, WearableCardProps } from '../_types';

import { FitbitButton, OuraButton, PolarButton } from './Wearables';

function WearableCard({ activeCategory }: WearableCardProps) {
  const devices: Device = useAppSelector(state => state.user.devices);
  const { id, name } = activeCategory;

  const authenticationButtons: AuthenticationButton = {
    oura: <OuraButton />,
    fitbit: <FitbitButton />,
    polar: <PolarButton />,
  };

  if (id === '') {
    return null;
  }

  return (
    <div className='w-full p-4 rounded-lg bg-white flex flex-col items-start justify-center text-sm shadow-lg gap-4'>
      <h2 className='text-xl'>{name}</h2>
      <div className='flex flex-row gap-4 w-full'>
        <span className='w-[15%]'>Access Token</span>
        <span className='w-[85%] overflow-hidden text-ellipsis'>
          {devices[id].token}
        </span>
      </div>
      <div className='flex flex-row gap-4 w-full'>
        <span className='w-[15%]'>Last Updated</span>
        <span className='w-[85%] overflow-hidden text-ellipsis'>
          {devices[id].lastUpdated}
        </span>
      </div>
      {authenticationButtons[id]}
    </div>
  );
}

export default WearableCard;
