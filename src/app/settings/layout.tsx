import AppStateInit from '../../components/InitializeApp';
import MainContent from '../../components/MainContent';
export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppStateInit />
      <MainContent>{children}</MainContent>
    </>
  );
}
