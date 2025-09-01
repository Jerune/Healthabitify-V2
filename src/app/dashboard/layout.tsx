import AppStateInit from '@/components/InitializeApp';
import TimeSelectionModule from '@/features/TimesDatesModule/TimeSelectionModule';

import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import MainContent from '../../components/MainContent';
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppStateInit />
      <MainContent>
        <TimeSelectionModule />
        {children}
      </MainContent>
    </>
  );
}
