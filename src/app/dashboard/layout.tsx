import { PropsWithChildren } from 'react';

import AppStateInit from '@/components/InitializeApp';
import TimeSelectionModule from '@/features/TimesDatesModule/TimeSelectionModule';

import MainContent from '../../components/MainContent';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <>
      <AppStateInit />
      <TimeSelectionModule />
      <MainContent>{children}</MainContent>
    </>
  );
}
