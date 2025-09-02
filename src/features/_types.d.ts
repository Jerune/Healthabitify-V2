import { DateTime } from 'luxon';
import type { PropsWithChildren, ReactNode } from 'react';

import { Metric } from '../types';

// AveragesManagement

export type Averages = {
  [key: string]: number | string;
};

export type AveragesData = {
  [key: string]: {
    months: { [key: string]: Averages };
    weeks: { [key: string]: Averages };
    year?: Averages;
  };
};

export type AveragesReturn = {
  period: string;
  keys: Averages;
};

export type Period = {
  year: number;
  month?: number;
  weekNumber?: number;
};

export type PeriodForAverage = {
  year: number;
  weekNumber: number;
  month: number;
};

export type PeriodData = {
  period: string;
  data: DataValuesPerMetric[];
};

export type DatapointsPerMetric = {
  [key: string]: number[] | string[];
  type: string;
};

export type MetricValues = {
  name: string;
  values: number[];
};

// Dashboard

export type DashboardComparisonData = {
  value: number | string;
  comparisonValue: number | string;
  comparisonStatus: string;
  comparisonType: string;
};

export type MetricDashboardData = {
  metric: Metric;
};

type MetricPropertiesForDashboard = {
  value: number | string;
  comparisonValue: number | string;
  comparisonStatus: string;
  comparisonType: string;
};

export type DashboardMetric = MetricPropertiesForDashboard & Metric;

export type DashboardMetricProps = {
  metric: DashboardMetric;
};

export type DashboardDataProps = {
  children: PropsWithChildren;
  data: MetricDashboardData;
};

// Metrics Page

export type MetricsMenuProps = {
  metrics: Metric[];
  setMetric: (metricId: Metric) => Promise<void>;
  activeMetric: Metric;
};

// Data Grid - AG Grid compatible types
export type DataPoint = {
  date?: string;
  id: string;
  value: string | number;
};

export type DatapointsForDataGrid = {
  [key: string]: DataPoint[];
  type?: string;
  reference?: string;
};

// AG Grid row data types
export type AGGridRow = {
  id: string;
  metric: string;
  reference?: string;
  [key: string]:
    | string
    | number
    | undefined
    | { value: string | number; id: string | null };
};

export type MonthlyRowData = {
  year: number;
  month: number;
  id: string;
  date: string;
  [key: string]: string | number;
};

export type WeeklyRowData = {
  year: number;
  weekNumber: number;
  id: string;
  date: string;
  [key: string]: string | number;
};

export type YearlyRowData = {
  year: number;
  id: string;
  date: string;
  [key: string]: string | number;
};

// ManualDataGrid

export type ManualDataProps = {
  labs?: boolean;
};

export type DatapointToEdit = {
  date: string;
  id: string;
  value: string | number;
  metric: string;
};

// SettingsMenu

export type ActiveCategory = {
  id: string;
  name: string;
  iconName: string;
};

export type ActiveMetricsProps = {
  activeCategory: ActiveCategory;
};

export type SettingsCategoryProps = {
  detailView: string;
  setMetrics: function;
  setWearables?: function;
  activeCategory: ActiveCategory;
  hideMenuCategories?: boolean;
  setHideMenuCategories?: function;
};

export type Settingsbutton = {
  type: string;
  active: boolean;
  text: string;
  onClick?: () => void;
};

export type Settingslabel = {
  name: string;
  children: ReactNode;
};

export type SettingsViewProps = {
  setDetailView: function;
};

export type WearableCardProps = {
  activeCategory: ActiveCategory;
};

export type AuthenticationButton = {
  [key: string]: JSX.Element;
};

// TimesDatesModule

export type TabListProps = {
  tabs?: {
    name: string;
    function: () => void;
  }[];
  showDateSpecifications?: boolean;
  showDateTimeTabs?: boolean;
};

export type DateTimeData = {
  currentDate: DateTime;
  weekNumber: number;
  month: number;
  year: number;
  firstDayOfTheWeek: DateTime;
  lastDayOfTheWeek: DateTime;
};

export type DateTitles = {
  week: string;
  month: string;
  year: string;
};
