import { ColDef, themeQuartz } from 'ag-grid-community';

export const gridTheme = themeQuartz.withParams({
  accentColor: '#181D1F',
  browserColorScheme: 'light',
  columnBorder: true,
  headerFontSize: 16,
  fontSize: 14,
  headerRowBorder: true,
  spacing: 12,
  wrapperBorder: false,
  cellTextColor: '#181D1F',
  headerTextColor: '#181D1F',
  headerBackgroundColor: 'lab(98.2596 -0.247031 -0.706708)',
});

export const defaultColDef: ColDef = {
  flex: 1,
};
