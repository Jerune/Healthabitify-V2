import { useAppSelector } from '../../redux/reduxHooks';
import { Device } from '../../types';
import { AuthenticationButton, WearableCardProps } from '../_types';

import { FitbitButton, OuraButton } from './Wearables';

function WearableCard({ activeCategory }: WearableCardProps) {
  const devices: Device = useAppSelector(state => state.user.devices);
  const { id, name } = activeCategory;

  const authenticationButtons: AuthenticationButton = {
    oura: <OuraButton />,
    fitbit: <FitbitButton />,
  };

  if (id !== '') {
    return (
      <div className='w-full p-4 rounded-lg bg-white flex flex-col items-start justify-center text-sm shadow-lg gap-4'>
        <h3>{name}</h3>
        <div className='flex flex-row gap-4 w-full'>
          <label className='w-[15%]' id='token'>
            Access Token
          </label>
          <input className='w-[85%]' name='token' value={devices[id].token} />
        </div>
        <div className='flex flex-row gap-4 w-full'>
          <label className='w-[15%]' id='lastUpdated'>
            Last Updated
          </label>
          <input
            className='w-[85%]'
            name='lastUpdated'
            value={devices[id].lastUpdated}
          />
        </div>
        {authenticationButtons[id]}
      </div>
    );
  }

  return null;
}

export default WearableCard;
