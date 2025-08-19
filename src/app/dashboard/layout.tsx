import AppStateInit from '@/components/InitializeApp';
import TimeSelectionModule from '@/features/TimesDatesModule/TimeSelectionModule';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppStateInit />
      <TimeSelectionModule />
      {children}
    </>
  );
}
