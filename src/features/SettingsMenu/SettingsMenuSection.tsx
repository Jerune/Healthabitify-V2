import type { PropsWithChildren } from 'react';

function SettingsMenuSection({ children }: PropsWithChildren) {
  return (
    <section className='flex flex-col justify-start items-center gap-4 h-vh pt-14 md:px-6 md:w-auto'>
      {children}
    </section>
  );
}

export default SettingsMenuSection;
