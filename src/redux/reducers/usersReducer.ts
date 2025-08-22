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
      tokenExpiresOn: '',
    },
    fitbit: {
      token: '',
      lastUpdated: '',
      tokenExpiresOn: '',
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
      const { oura, fitbit } = action.payload;
      return {
        ...state,
        devices: {
          oura: {
            token: oura.token,
            lastUpdated: oura.lastUpdated,
            tokenExpiresOn: oura.tokenExpiresOn,
          },
          fitbit: {
            token: fitbit.token,
            lastUpdated: fitbit.lastUpdated,
            tokenExpiresOn: fitbit.tokenExpiresOn,
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
