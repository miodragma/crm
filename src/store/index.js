import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../components/Auth/store/auth.slice';
import loaderSlice from '../components/UI/Toast/store/loader/loader-slice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    loader: loaderSlice.reducer,
  }
})

export default store;
