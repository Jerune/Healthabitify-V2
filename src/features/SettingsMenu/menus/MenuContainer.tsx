import type { PropsWithChildren } from 'react';

function MenuContainer({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-row justify-start w-screen h-full'>
      {children}
    </div>
  );
}

export default MenuContainer;
