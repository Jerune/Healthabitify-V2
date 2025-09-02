import { PropsWithChildren } from 'react';

import TimeSelectionModule from '@/features/TimesDatesModule/TimeSelectionModule';

export default function MetricsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <TimeSelectionModule showDateSpecifications={false} />
      {children}
    </>
  );
}
