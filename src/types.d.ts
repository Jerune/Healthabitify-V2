// UserData from Auth
export type SignInData = {
  email: string | null;
  userId: string | null;
  errorMessage: string | null;
};

// Events
export type InputEvent = React.ChangeEvent<HTMLInputElement>;
export type SelectEvent = ChangeEventHandler<HTMLSelectElement>;
export type FormSubmit = FormEvent<HTMLFormElement>;

export type User = {
  userId: string;
  displayName: string;
  email: string;
};

export type Category = {
  order: number;
  id: string;
  name: string;
  iconName: string | unknown;
};

export type Wearable = {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  lastUpdated: string;
};

export type WearablesData = {
  fitbit: Wearable;
  oura: Wearable;
  polar: Wearable;
};

export type Metric = {
  [key: string]: number | string | boolean | object;
  order: number;
  id: string;
  name: string;
  active: boolean;
  onDashboard: boolean;
  source: string;
  dataType: string;
  unit: string;
  categoryId: string;
  categoryIcon: string;
  isFixed: boolean;
  frequency: string;
  goal: string;
  conditionsMode: string;
  good: {
    mode: string;
    value: string;
  };
  medium: {
    value1: string;
    value2: string;
  };
  bad: {
    mode: string;
    value: string;
  };
  decimals?: number;
};

export type LabtestMetric = {
  order: number;
  id: string;
  name: string;
  unit: string;
  categoryId: string;
  reference: string;
  decimals?: number;
};

export type MetricProps = {
  metric: Metric;
};

export type DataPoint = {
  value: string | number;
  metric: string;
  userId: string;
  source: string;
  date: string;
  weekNumber: number;
  month: number;
  year: number;
};

export type Activity = {
  userId: string;
  logId: number;
  date: string;
  weekNumber: number;
  month: number;
  year: number;
  activityTypeId: number;
  date: string;
  activityName: string;
  activeDuration: string;
  duration: string;
  calories: number;
  averageHeartRate: number;
  steps: number;
  cardioZone: number;
  fatBurnZone: number;
  peakZone: number;
};

// Fitbit Data

type HeartRateZoneData = {
  heartRateZones: ZoneData[];
};

type HeartRateZone = {
  minutes: number;
  caloriesOut: 56.29404;
  name: string;
  min: number;
  max: number;
};

type MinutesInHeartRateZone = {
  minutes: number;
  zoneName: string;
  order: number;
  type: string;
  minuteMultiplier: number;
};

type ZoneData = {
  name: string;
  minutes: number;
};

type ActivityData = {
  logId: number;
  activityTypeId: number;
  activityName: string;
  calories: number;
  distance: number;
  steps: number;
  speed: number;
  pace: number;
  averageHeartRate: number;
  duration: number;
  activeDuration: number;
  activityLevel: ZoneData[];
  distanceUnit: 'Kilometer';
  source: {
    type: 'tracker';
    name: 'Charge 6';
    id: '2150ADDD4442';
    url: 'https://www.fitbit.com/';
    trackerFeatures: ['DISTANCE', 'STEPS', 'CALORIES', 'HEARTRATE'];
  };
  logType: 'auto_detected' | 'tracker';
  manualValuesSpecified: {
    calories: false;
    distance: false;
    steps: false;
  };
  intervalWorkoutData: {
    intervalSummaries: [];
    numRepeats: 0;
  };
  heartRateZones: HeartRateZone[];
  activeZoneMinutes: {
    totalMinutes: number;
    minutesInHeartRateZones: MinutesInHeartRateZone[];
  };
  inProgress: false;
  caloriesLink: string;
  heartRateLink: string;
  tcxLink: string;
  lastModified: string;
  startTime: string;
  originalStartTime: string;
  originalDuration: number;
  elevationGain: number;
  hasActiveZoneMinutes: boolean;
  cl: 10.041035713255823;
};

export type FitbitData = {
  dateTime: string;
  value: string | HeartRateZoneData;
};

export type FitbitActivityData = {
  pagination: {
    afterDate: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    sort: 'desc' | 'asc';
  };
  activities: ActivityData[];
};

export type FitbitRawData = {
  [key: string]: FitbitData[];
};

// Oura Data

export type ReadinessContributors = {
  contributors: {
    activity_balance: number;
    body_temperature: number;
    hrv_balance: number;
    previous_day_activity: number;
    previous_night: number;
    recovery_index: number;
    resting_heart_rate: number;
    sleep_balance: number;
  };
  score: number;
  temperature_deviation: number;
  temperature_trend_deviation: number;
};

export type OuraRawData = {
  data:
    | OuraDailySummary[]
    | OuraVO2maxResponse[]
    | OuraCardiovascularAgeResponse[]
    | OuraSpo2Response[]
    | OuraStressResponse[];
  next_token: null | string;
};

export type OuraDailySummary = {
  id: string;
  average_breath: number;
  average_heart_rate: number;
  average_hrv: number;
  awake_time: number;
  bedtime_end: string;
  bedtime_start: string;
  day: string;
  deep_sleep_duration: number;
  efficiency: number;
  heart_rate: {
    interval: number;
    items: null | number[];
    timestamp: string;
  };
  hrv: {
    interval: number;
    items: null | number[];
    timestamp: string;
  };
  latency: number;
  light_sleep_duration: number;
  low_battery_alert: boolean;
  lowest_heart_rate: number;
  movement_30_sec: number;
  period: number;
  readiness: null;
  readiness_score_delta: null | ReadinessContributors;
  rem_sleep_duration: number;
  restless_periods: number;
  sleep_phase_5_min: number;
  sleep_score_delta: null | number;
  time_in_bed: number;
  total_sleep_duration: number;
  type: string;
};

export type OuraVO2maxResponse = {
  id: string;
  day: string;
  timestamp: string;
  vo2_max: number;
};

export type OuraCardiovascularAgeResponse = {
  day: string;
  vascular_age: number;
};

export type OuraSpo2Response = {
  id: string;
  day: string;
  spo2_percentage: {
    average: number;
  };
  breathing_disturbance_index: number;
};

export type OuraStressResponse = {
  id: string;
  day: string;
  stress_high: number;
  recovery_high: number;
  day_summary: string;
};

// getApiData

export type Endpoint = {
  url: string;
};

export type EndpointsDates = {
  start: string;
  end: string;
};

// Datapoints functions

export type DatapointsReturn = {
  period: string;
  data: DatapointsPerMetric[];
};

export type ManualDatapointReturn = {
  value: number | string;
  date: string;
  id: string;
};

// getDocs
export type DocumentsToKeep = {
  date: string;
  metric: string;
  value: string | number;
};

// Redux

export type CurrentDateTime = {
  currentDate: string;
  lastDayOfTheWeek: string;
  firstDayOfTheWeek: string;
  month: number;
  weekNumber: number;
  year: number;
};

export type Device = {
  [key: string]: {
    token: string;
    lastUpdated: string;
  };
};

// Authorization of APIs

export type AuthorizeApi = {
  url: string;
  id: string;
  scope: string;
  name: string;
};
