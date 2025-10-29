import { PropsWithChildren } from 'react';

import AppStateInit from '@/components/InitializeApp';
import TimeSelectionModule from '@/features/TimesDatesModule/TimeSelectionModule';

import MainContent from '../../components/MainContent';

export default function ActivitiesLayout({ children }: PropsWithChildren) {
  return (
    <>
      <AppStateInit />
      <TimeSelectionModule />
      <MainContent>{children}</MainContent>
    </>
  );
}
