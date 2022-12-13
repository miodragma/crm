import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Customers from '../../components/Customers/Customers';
import Modal from '../../components/UI/Modal/Modal';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import AddNewCustomer from '../../components/AddNewCustomer/AddNewCustomer';

import {
  createCustomer,
  editCustomer,
  getAllCustomers,
  getAllPotentialCustomers
} from '../../components/Customers/store/customers-actions';
import { fetchAllCities } from '../../components/City/store/city-actions';

import addIcon from '../../assets/add.png';

import { dateToTimestamp } from '../../utils/dateToTimestamp';

import classes from './Home.module.scss';
import { customersActions } from '../../components/Customers/store/customers-slice';

let isMounted = false;

const Home = () => {

  const [addNewCustomerModal, setAddNewCustomerModal] = useState(false);
  const [customer, setCustomer] = useState({});
  const customers = useSelector(state => state.customers);
  const { allCustomersSettings, potentialCustomersSettings } = customers;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isMounted) {
      dispatch(fetchAllCities());
      isMounted = true;
    }
  }, []);

  useEffect(() => {
    dispatch(getAllCustomers(allCustomersSettings))

    return () => {
      dispatch(customersActions.resetCustomersSettings('allCustomersSettings'))
      dispatch(customersActions.resetCustomersSettings('potentialCustomersSettings'))
    }
  }, [allCustomersSettings, dispatch])

  useEffect(() => {

    // console.log(dateToTimestamp(date))
    dispatch(getAllPotentialCustomers({ ...potentialCustomersSettings, remindOn: dateToTimestamp(new Date()) }))
  }, [potentialCustomersSettings, dispatch])

  const onAddNewCustomerHandler = () => {
    setAddNewCustomerModal(true);
  }

  const onBackdropDismiss = useCallback(() => {
    setAddNewCustomerModal(false);
    setCustomer({});
  }, []);

  const onSubmitNewCustomerHandler = useCallback(data => {
    if (!data.id) {
      dispatch(createCustomer(data)).then(_ => onBackdropDismiss())
    } else {
      dispatch(editCustomer(data)).then(_ => onBackdropDismiss())
    }
  }, [dispatch, onBackdropDismiss]);

  const onEditCustomerHandler = useCallback(customerData => {
    if (customerData.typeSettings === 'allCustomersSettings') {
      const customerToEdit = customers.allCustomers.customers.find(customer => customer.id === customerData.customerId);
      setCustomer(customerToEdit);
      setAddNewCustomerModal(true);
    } else {
      const customerToEdit = customers.potentialCustomers.customers.find(customer => customer.id === customerData.customerId);
      setCustomer(customerToEdit);
      setAddNewCustomerModal(true);
    }
  }, [customers.allCustomers, customers.potentialCustomers]);

  return (
    <div className={classes.home}>
      <div>
        <div className={classes.customersHeading}>
          <h1>Customers</h1>
          <img onClick={onAddNewCustomerHandler} src={addIcon} alt="add"/>
        </div>
        <Customers
          editCustomer={onEditCustomerHandler}
          customersData={customers.allCustomers}
          customersPaging={customers.allCustomersPaging}
          typeSettings='allCustomersSettings'/>
      </div>
      <div>
        <div className={classes.potentialCustomersHeader}>
          <h1>Potential Customers</h1><sup>Today</sup>
        </div>
        <Customers
          editCustomer={onEditCustomerHandler}
          customersData={customers.potentialCustomers}
          customersPaging={customers.potentialCustomersPaging}
          typeSettings='potentialCustomersSettings'/>
      </div>
      {addNewCustomerModal && <Backdrop onClickBackdrop={onBackdropDismiss}/>}
      {addNewCustomerModal &&
        <Modal>{<AddNewCustomer customer={customer} onSubmit={onSubmitNewCustomerHandler}/>}</Modal>}
    </div>
  )
};

export default Home;
