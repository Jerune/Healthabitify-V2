'use client';

import { Provider as Redux } from 'react-redux';

import store from '../redux/store';

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Redux store={store}>{children}</Redux>;
}
