import type { PropsWithChildren } from 'react';

function MainContent({ children }: PropsWithChildren) {
  return (
    <main className='flex flex-col justify-start items-start w-full mb-8 px-4 md:px-8 grow bg-gray-50'>
      {children}
    </main>
  );
}

export default MainContent;
