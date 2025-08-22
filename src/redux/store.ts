import { configureStore } from '@reduxjs/toolkit';

import averagesReducer from './reducers/averagesReducer';
import metricsReducer from './reducers/metricsReducer';
import usersReducer from './reducers/usersReducer';
import utilsReducer from './reducers/utilsReducer';

const isDevelopment = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: {
    user: usersReducer,
    metrics: metricsReducer,
    averages: averagesReducer,
    utils: utilsReducer,
  },
  devTools: isDevelopment,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: isDevelopment,
      immutableCheck: isDevelopment,
    }),
});

if (isDevelopment) {
  store.subscribe(() => console.log('Redux State:', store.getState()));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
