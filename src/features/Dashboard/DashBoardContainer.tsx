import type { PropsWithChildren } from 'react';

function DashBoardContainer({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-wrap justify-center items-center py-10 px-8 gap-16 w-full '>
      {children}
    </div>
  );
}

export default DashBoardContainer;
