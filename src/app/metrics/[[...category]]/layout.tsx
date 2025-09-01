import { PropsWithChildren } from 'react';

import TimeSelectionModule from '@/features/TimesDatesModule/TimeSelectionModule';

import MainContent from '../../../components/MainContent';
export default function MetricsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <TimeSelectionModule showDateSpecifications={false} />
      <MainContent>{children}</MainContent>
    </>
  );
}
