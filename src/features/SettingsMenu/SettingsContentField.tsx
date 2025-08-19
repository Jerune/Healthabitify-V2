import type { PropsWithChildren } from 'react';

function SettingsContentField({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-col justify-start items-start h-vh pt-14 md:px-6 gap-6 md:max-w-5xl grow'>
      {children}
    </div>
  );
}

export default SettingsContentField;
