import type { Settingslabel } from '../_types';

function SettingsLabel({ name, children }: Settingslabel) {
  return (
    <label htmlFor={name} className='text-sm italic underline mb-1'>
      {children}
    </label>
  );
}

export default SettingsLabel;
