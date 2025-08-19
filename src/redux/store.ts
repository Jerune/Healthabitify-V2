import { configureStore } from '@reduxjs/toolkit';

import averagesReducer from './reducers/averagesReducer';
import metricsReducer from './reducers/metricsReducer';
import usersReducer from './reducers/usersReducer';
import utilsReducer from './reducers/utilsReducer';

const store = configureStore({
  reducer: {
    user: usersReducer,
    metrics: metricsReducer,
    utils: utilsReducer,
    averages: averagesReducer,
  },
});

store.subscribe(() => console.log('Redux State:', store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
