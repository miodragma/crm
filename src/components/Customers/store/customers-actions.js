import axiosConfig from '../../../axios/axiosConfig';

import { loaderActions } from '../../UI/Toast/store/loader/loader-slice';
import { customersActions } from './customers-slice';

export const createCustomer = data => {
  return async dispatch => {
    const onCreateCustomer = async () => {
      return axiosConfig.put('/customer/create', data);
    };

    try {
      const { data: customerData } = await onCreateCustomer();
      dispatch(loaderActions.showToast({ toastMessage: `Customer successfully created`, type: 'success' }));
      return dispatch(customersActions.createNewCustomer(customerData.customer));
    } catch (err) {
      console.log(err)
      throw err;
    }
  }
};

export const editCustomer = data => {
  return async dispatch => {
    const onEditCustomer = async () => {
      return axiosConfig.post('/customer/edit', data);
    };

    try {
      const { data: customerData } = await onEditCustomer();
      dispatch(loaderActions.showToast({ toastMessage: `Customer successfully updated`, type: 'success' }))
      return dispatch(customersActions.updateCustomer(customerData.customer));
    } catch (err) {
      console.log(err)
      throw err;
    }
  }
};

export const getAllCustomers = data => {
  return async dispatch => {
    dispatch(loaderActions.setLoaderData(true))
    const onGetAllCustomers = async () => {
      return axiosConfig.get('/customer/all-customers', { params: data });
    };

    try {
      const { data: customerData } = await onGetAllCustomers();
      dispatch(customersActions.setAllCustomers({
        customersData: {
          customers: customerData.customers.rows,
          total: customerData.customers.count
        },
        paging: customerData.paging
      }));
      dispatch(loaderActions.setLoaderData(false))
    } catch (err) {
      console.log(err)
      dispatch(loaderActions.setLoaderData(false))
      throw err;
    }
  }
};

export const getAllPotentialCustomers = data => {
  return async dispatch => {
    dispatch(loaderActions.setLoaderData(true))
    const onGetAllCustomers = async () => {
      return axiosConfig.get('/customer/all-customers', { params: data });
    };

    try {
      const { data: customerData } = await onGetAllCustomers();
      dispatch(customersActions.setPotentialCustomers({
        customersData: {
          customers: customerData.customers.rows,
          total: customerData.customers.count
        }, paging: customerData.paging
      }));
      dispatch(loaderActions.setLoaderData(false))
    } catch (err) {
      console.log(err);
      dispatch(loaderActions.setLoaderData(false))
      throw err;
    }
  }
};
