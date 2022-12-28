import { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Input from '../UI/Input/Input';

import { customersActions } from './store/customers-slice';

import { dateToTimestamp, getDateData, timestampToDate } from '../../utils/dateToTimestamp';

import upIcon from '../../assets/up.png';
import downIcon from '../../assets/down.png';
import checkmark from '../../assets/checkmark.png';
import calendar from '../../assets/calendar.png';

import classes from './Customers.module.scss';
import CityInput from '../UI/CityInput/CityInput';
import Dropdown from '../UI/Dropdown/Dropdown';

export const initialState = {
  firstName: '',
  lastName: '',
  telephone: '',
  email: '',
  city: '',
  isPaid: '',
  remindOn: ''
}

const Customers = props => {

  const { customersData, customersPaging, typeSettings, editCustomer } = props;
  const [page, setPage] = useState(1);
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const debounceTimer = useRef(null);

  const onClickCustomerHandler = useCallback(customerId => {
    editCustomer({ customerId, typeSettings });
  }, [editCustomer, typeSettings])

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

  const currentCustomers = useMemo(() => customersData.customers.map((customer, i) => {
    return (
      <tr key={`${customer.id}${customer.remindOn}${customer.createdAt}${typeSettings}`}
          onClick={() => onClickCustomerHandler(customer.id)}>
        <td>{customer.firstName}</td>
        <td>{customer.lastName}</td>
        <td>{customer.telephone}</td>
        <td>{customer.email}</td>
        <td>{customer.city}</td>
        <td className={classes.checkmark}>{customer.isPaid && <img src={checkmark} alt="checkmark"/>}</td>
        {typeSettings === 'allCustomersSettings' && <td>{customer.remindOn && timestampToDate(customer.remindOn)}</td>}
        {typeSettings === 'potentialCustomersSettings' &&
          <td className={classes.checkmark}>{isContacted(customer) && <img src={checkmark} alt="checkmark"/>}</td>}
      </tr>
    )
  }), [customersData.customers, onClickCustomerHandler, typeSettings]);

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

  const getSuggestions = useCallback(({ target }) => {
    setPage(1)
    const name = target.name;
    const value = target.value.trim();

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

  const onChangeCityValue = useCallback(value => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      getSuggestions.bind(null, { target: { value, name: 'city' } }),
      400
    )
  }, [getSuggestions]);

  const onChangeSettingsValue = useCallback(e => {
    const event = { target: { value: e.target.value, name: e.target.name } }
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      getSuggestions.bind(null, event),
      400
    )
  }, [getSuggestions]);

  const onChangePaidValue = useCallback(value => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      getSuggestions.bind(null, { target: { value, name: 'isPaid' } }),
      400
    )
  }, [getSuggestions]);

  const resetSettingsHandler = () => {
    setPage(1);
    setState(initialState);
    dispatch(customersActions.resetCustomersSettings(typeSettings))
  }

  const convertDate = val => {
    const date = getDateData(val);
    return val ? `${date.day}-${date.month}-${date.year}` : ''
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
        <CityInput changeCity={onChangeCityValue} isLabel={false} className={classes.citiesSearch} value={state.city}/>
        <Dropdown onChangeValue={onChangePaidValue} currValue={state.isPaid}/>
        {typeSettings === 'allCustomersSettings' &&
          <div className={classes.calendarInputWrapper}>
            <Input readonly={true} value={convertDate(state.remindOn)} placeholder='Contact at'
                   type='text'/>
            <div>
              <img className={classes.calendarIcon} src={calendar} alt="calendar"/>
              <input onChange={onChangeSettingsValue} value={state.remindOn} name='remindOn'
                     type='date'/>
            </div>
          </div>
        }
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
              <th>City</th>
              <th>Paid</th>
              {typeSettings === 'allCustomersSettings' && <th>Contact at</th>}
              {typeSettings === 'potentialCustomersSettings' && <th>Contacted - today</th>}
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
