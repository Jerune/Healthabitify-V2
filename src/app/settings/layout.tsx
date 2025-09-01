import MainContent from '../../components/MainContent';
export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainContent>{children}</MainContent>;
}
