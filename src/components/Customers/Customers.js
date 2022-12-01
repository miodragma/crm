import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Input from '../UI/Input/Input';

import { customersActions } from './store/customers.slice';

import { dateToTimestamp, getDateData, timestampToDate } from '../../utils/dateToTimestamp';

import upIcon from '../../assets/up.png';
import downIcon from '../../assets/down.png';
import checkmark from '../../assets/checkmark.png';

import classes from './Customers.module.scss';

export const initialState = {
  firstName: '',
  lastName: '',
  telephone: '',
  email: '',
  remindOn: ''
}

const Customers = props => {

  const { customersData, customersPaging, typeSettings, editCustomer } = props;
  const [page, setPage] = useState(1);
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const debounceTimer = useRef(null);

  const onClickCustomerHandler = customerId => {
    editCustomer({ customerId, typeSettings });
  }

  const isContacted = customer => {
    return customer.notes.some(note => {
      if (note && note.date) {
        const { year: noteYear, month: noteMonth, day: noteDay } = getDateData(note.date);
        const { year, month, day } = getDateData(new Date());
        return `${noteYear}-${noteMonth}-${noteDay}` === `${year}-${month}-${day}`;
      }
      return false;
    })
  };

  const currentCustomers = customersData.customers.map((customer, i) => {
    return (
      <tr key={`${customer.id}${customer.remindOn}${customer.createdAt}${typeSettings}`}
          onClick={() => onClickCustomerHandler(customer.id)}>
        <td>{customer.firstName}</td>
        <td>{customer.lastName}</td>
        <td>{customer.telephone}</td>
        <td>{customer.email}</td>
        {typeSettings === 'allCustomersSettings' && <td>{customer.remindOn && timestampToDate(customer.remindOn)}</td>}
        {typeSettings === 'potentialCustomersSettings' &&
          <td className={classes.checkmark}>{isContacted(customer) && <img src={checkmark} alt="checkmark"/>}</td>}
      </tr>
    )
  });

  const onChangePageHandler = e => {
    const newPage = e.target.value
    setPage(newPage);
    if (newPage) {
      if (+newPage <= customersPaging.lastPage) {
        if (+newPage > customersPaging.currentPage) {
          dispatch(customersActions.changePage({ type: typeSettings, offset: (+newPage - 1) * 10 }))
          return;
        }
        if (+newPage < customersPaging.currentPage) {
          dispatch(customersActions.changePage({ type: typeSettings, offset: (+newPage * 10) - 10 }))
        }
      } else {
        setPage(1);
        dispatch(customersActions.changePage({ type: typeSettings, offset: 0 }))
      }
    }
  }

  const buttonUpPageHandler = () => {
    if (+page < customersPaging.lastPage) {
      const newPage = +page + 1
      setPage(newPage);
      dispatch(customersActions.changePage({ type: typeSettings, offset: customersPaging.currentPage * 10 }))
    }
  };

  const buttonDownPageHandler = () => {
    if (+page > 1) {
      const newPage = +page - 1
      setPage(newPage);
      dispatch(customersActions.changePage({ type: typeSettings, offset: (newPage * 10) - 10 }))
    }
  };

  const getSuggestions = useCallback((e) => {
    setPage(1)
    const name = e.target.name;
    const value = e.target.value.trim();

    const data = {
      type: typeSettings,
      key: name,
      value
    }
    if (name === 'remindOn' && value) {
      data.value = dateToTimestamp(value)
    }
    setState(prevState => ({ ...prevState, [name]: value }))
    dispatch(customersActions.onChangeSettingsValue(data));
  }, [dispatch, typeSettings]);

  const onChangeSettingsValue = useCallback(e => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      getSuggestions.bind(null, e),
      400
    )
  }, [getSuggestions]);

  const resetSettingsHandler = () => {
    setPage(1);
    setState(initialState);
    dispatch(customersActions.resetCustomersSettings(typeSettings))
  }

  return (
    <div>
      <div className={classes.inputsContent}>
        <Input onChangeValue={onChangeSettingsValue} value={state.firstName} name='firstName' placeholder='First name'
               type='text'/>
        <Input onChangeValue={onChangeSettingsValue} value={state.lastName} name='lastName' placeholder='Last name'
               type='text'/>
        <Input onChangeValue={onChangeSettingsValue} value={state.telephone} name='telephone' placeholder='Telephone'
               type='text'/>
        <Input onChangeValue={onChangeSettingsValue} value={state.email} name='email' placeholder='Email' type='email'/>
        {typeSettings === 'allCustomersSettings' &&
          <Input onChangeValue={onChangeSettingsValue} value={state.remindOn} name='remindOn' placeholder='RemindOn'
                 type='date'/>}
      </div>
      <div className={classes.customersContentWrapper}>
        <div className={classes.customersContent}>
          <table>
            <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Telephone</th>
              <th>Email</th>
              {typeSettings === 'allCustomersSettings' && <th>Contact at</th>}
              {typeSettings === 'potentialCustomersSettings' && <th>Is he contacted</th>}
            </tr>
            </thead>
            <tbody>
            {currentCustomers}
            </tbody>
          </table>
        </div>
        <div className={classes.paginationContent}>
          <p>Total: {customersData.total}</p>
          <div>
            <div className={classes.pageableButtons}>
              <img
                className={(+page === customersPaging.lastPage || customersData.total === 0) ? classes.disablePageButton : ''}
                src={upIcon} alt="up"
                onClick={buttonUpPageHandler}/>
              <img className={+page === 1 ? classes.disablePageButton : ''} src={downIcon} alt="down"
                   onClick={buttonDownPageHandler}/>
            </div>
            <p>Page: </p>
            <input size='4' className={classes.pageInput} type="text" value={page} onChange={onChangePageHandler}/>
            <p> / {customersPaging.lastPage}</p>
          </div>
        </div>
      </div>
      <button onClick={resetSettingsHandler} className={classes.resetButton}>reset</button>
    </div>
  );

}

export default Customers;