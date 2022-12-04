import { createSlice } from '@reduxjs/toolkit';

const citySlice = createSlice({
  name: 'city',
  initialState: {
    cities: []
  },
  reducers: {
    setAllCities(state, action) {
      state.cities = action.payload;
    },
    createNewCity(state, action) {
      state.cities = [action.payload, ...state.cities];
    }
  }
});

export const cityActions = citySlice.actions;

export default citySlice;
