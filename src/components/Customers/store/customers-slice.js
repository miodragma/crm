import { createSlice } from '@reduxjs/toolkit';
import { dateToTimestamp } from '../../../utils/dateToTimestamp';

const customersSettings = {
  limit: 10,
  offset: 0,
  firstName: '',
  lastName: '',
  telephone: '',
  email: '',
  city: '',
  isPaid: 'all',
  remindOn: ''
}

const customersPaging = {
  currentPage: 1,
  lastPage: 1,
  total: 0
}

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    allCustomers: {
      customers: [],
      total: 0
    },
    allCustomersPaging: customersPaging,
    allCustomersSettings: customersSettings,
    potentialCustomers: {
      customers: [],
      total: 0
    },
    potentialCustomersPaging: customersPaging,
    potentialCustomersSettings: customersSettings,
  },
  reducers: {
    setAllCustomers(state, action) {
      state.allCustomers = action.payload.customersData;
      state.allCustomersPaging = action.payload.paging;
    },
    setPotentialCustomers(state, action) {
      state.potentialCustomers = action.payload.customersData;
      state.potentialCustomersPaging = action.payload.paging;
    },
    resetCustomersSettings(state, action) {
      state[action.payload] = customersSettings;
    },
    createNewCustomer(state, action) {
      if (action.payload.remindOn) {
        if (dateToTimestamp(new Date()) === dateToTimestamp(new Date(+action.payload.remindOn))) {
          state.potentialCustomers.customers = [action.payload, ...state.potentialCustomers.customers];
          state.potentialCustomers.total = state.potentialCustomers.total + 1;
        }
      }
      state.allCustomers.customers = [action.payload, ...state.allCustomers.customers];
      state.allCustomers.total = state.allCustomers.total + 1;
    },
    updateCustomer(state, action) {
      const findCustomerIndex = customers => customers.findIndex(customer => customer.id === action.payload.id);
      if (action.payload.remindOn) {
        const potentialCustomerIndex = findCustomerIndex(state.potentialCustomers.customers);
        if (dateToTimestamp(new Date()) === dateToTimestamp(new Date(+action.payload.remindOn))) {
          if (potentialCustomerIndex !== -1) {
            state.potentialCustomers.customers[potentialCustomerIndex] = action.payload;
          } else {
            state.potentialCustomers.customers = [action.payload, ...state.potentialCustomers.customers]
          }
        } else {
          if (potentialCustomerIndex !== -1) {
            state.potentialCustomers.customers = state.potentialCustomers.customers.filter(customer => customer.id !== action.payload.id);
            state.potentialCustomers.total = state.potentialCustomers.total - 1;
          }
        }
      }
      const allCustomerIndex = findCustomerIndex(state.allCustomers.customers);
      if (allCustomerIndex !== -1) {
        state.allCustomers.customers[allCustomerIndex] = action.payload;
      }
    },
    changePage(state, action) {
      state[action.payload.type].offset = action.payload.offset;
    },
    onChangeSettingsValue(state, action) {
      state[action.payload.type].offset = 0;
      state[action.payload.type][action.payload.key] = action.payload.value;
    }
  }
});

export const customersActions = customersSlice.actions;

export default customersSlice;
