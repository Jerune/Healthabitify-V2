import { createSlice } from '@reduxjs/toolkit';

// Initial State

const activeUser = {
  email: '',
  userId: '',
  displayName: '',
  isLoggedIn: false,
  devices: {
    oura: {
      token: '',
      lastUpdated: '',
      refreshToken: '',
    },
    fitbit: {
      token: '',
      lastUpdated: '',
      refreshToken: '',
    },
    polar: {
      token: '',
      lastUpdated: '',
      refreshToken: '',
    },
  },
};

// Reducer

export const userSlice = createSlice({
  name: 'user',
  initialState: activeUser,
  reducers: {
    localSignIn: (state, action) => {
      const { email, userId } = action.payload;
      return {
        ...state,
        email,
        userId,
        isLoggedIn: true,
      };
    },
    localSignOut: () => {
      return { ...activeUser };
    },
    setDevices: (state, action) => {
      const { oura, fitbit, polar } = action.payload;
      return {
        ...state,
        devices: {
          oura: {
            token: oura.token,
            lastUpdated: oura.lastUpdated,
            refreshToken: oura.refreshToken,
          },
          fitbit: {
            token: fitbit.token,
            lastUpdated: fitbit.lastUpdated,
            refreshToken: fitbit.refreshToken,
          },
          polar: {
            token: polar.token,
            lastUpdated: polar.lastUpdated,
            refreshToken: polar.refreshToken,
          },
        },
      };
    },
    updateDeviceToken: (state, action) => {
      const { name, token } = action.payload;
      if (name === 'oura') {
        state.devices.oura.token = token;
      } else if (name === 'fitbit') {
        state.devices.fitbit.token = token;
      } else if (name === 'polar') {
        state.devices.polar.token = token;
      }
    },
    default: state => {
      return state;
    },
  },
});

export const { localSignIn, localSignOut, setDevices, updateDeviceToken } =
  userSlice.actions;
export default userSlice.reducer;
