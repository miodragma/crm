import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../components/Auth/store/auth-slice';
import loaderSlice from '../components/UI/Toast/store/loader/loader-slice';
import customersSlice from '../components/Customers/store/customers-slice';
import citySlice from '../components/City/store/city-slice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    loader: loaderSlice.reducer,
    customers: customersSlice.reducer,
    city: citySlice.reducer
  }
})

export default store;
