import type { Settingslabel } from '../_types';

function SettingsLabel({ name, children }: Settingslabel) {
  return (
    <label htmlFor={name} className='text-md underline mb-1'>
      {children}
    </label>
  );
}

export default SettingsLabel;
