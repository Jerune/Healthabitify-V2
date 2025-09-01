import type { PropsWithChildren } from 'react';

function SettingsContentField({ children }: PropsWithChildren) {
  return (
    <section className='flex flex-col justify-start items-start h-full w-full md:px-6 gap-6 md:max-w-5xl grow'>
      {children}
    </section>
  );
}

export default SettingsContentField;
