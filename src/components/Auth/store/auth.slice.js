import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    errors: [],
    signupUser: null,
    email: {},
    name: {},
    password: { onEyePassword: false },
    confirmPassword: { onEyePassword: false },
    noMatchPasswordMsg: false,
    showPleaseWaitMessage: false
  },
  reducers: {
    signup(state, action) {
      state.signupUser = action.payload
    },
    login(state, action) {
      state.user = action.payload.user;
    },
    error(state, action) {
      state.errors = action.payload
    },
    clearError(state, action) {
      state.errors = [];
    },
    clearState(state, action) {
      state.email = {};
      state.name = {};
      state.password = { onEyePassword: false };
      state.confirmPassword = { onEyePassword: false };
      state.noMatchPasswordMsg = false;
    },
    onChangeValue(state, action) {
      const { keyType, ...values } = { ...action.payload };
      state[action.payload.keyType] = values;
    },
    onChangeOnlyIsRequired(state, action) {
      state.password.isRequiredMessage = action.payload;
      state.confirmPassword.isRequiredMessage = action.payload;
      state.noMatchPasswordMsg = action.payload;
    },
    onChangePleaseWaitMessage(state, action) {
      state.showPleaseWaitMessage = action.payload;
    }
  }
});

export const authActions = authSlice.actions;

export default authSlice;
