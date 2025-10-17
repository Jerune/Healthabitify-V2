import { PropsWithChildren } from 'react';

import TimeSelectionModule from '@/features/TimesDatesModule/TimeSelectionModule';

import AppStateInit from '../../../components/InitializeApp';

export default function MetricsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <AppStateInit />
      <TimeSelectionModule showDateSpecifications={false} />
      {children}
    </>
  );
}
