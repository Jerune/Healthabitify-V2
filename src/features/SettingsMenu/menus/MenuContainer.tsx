import type { PropsWithChildren } from 'react';

function MenuContainer({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-row justify-start w-full h-full'>{children}</div>
  );
}

export default MenuContainer;
