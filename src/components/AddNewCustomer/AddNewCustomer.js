import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Input from '../UI/Input/Input';
import CityInput from '../UI/CityInput/CityInput';

import { dateToTimestamp, formatTime, getDateData, timestampToDate } from '../../utils/dateToTimestamp';
import { customerModalFormFields } from '../../config/customer-modal-form-fields';

import classes from './AddNewCustomer.module.scss';

const AddNewCustomer = props => {

  const { onSubmit, customer } = props;
  const { id: customerId } = customer;

  const { user: { fullName } } = useSelector(state => state.auth);
  const isLoader = useSelector(state => state.loader.isLoader);

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    telephone: '',
    email: '',
    isPaid: false,
    city: '',
    notes: [],
    remindOn: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [isChangeCustomerData, setIsChangeCustomerData] = useState(false);
  const [newNote, setNewNote] = useState(null);

  useEffect(() => {
    if (customer.id) {
      let remindOn = '';
      if (customer.remindOn) {
        const { year, month, day } = getDateData(+customer.remindOn);
        remindOn = `${year}-${month}-${("0" + day).slice(-2)}`
      }
      let notes = [...customer.notes];
      if (customer.notes.length) {
        notes = notes?.sort((a, b) => a.date < b.date ? -1 : 1);
      }
      setState({
        firstName: customer.firstName,
        lastName: customer.lastName,
        telephone: customer.telephone,
        email: customer.email,
        isPaid: customer.isPaid,
        city: customer.city,
        notes,
        remindOn
      })
    }
  }, [customer]);

  const onSubmitNewCustomerHandler = () => {
    let currState = { ...state };
    let currNotes = [...currState.notes];
    if (newNote && newNote?.value) {
      currNotes = [...currNotes, newNote];
      currState = { ...currState, notes: currNotes };
    }
    if (currState.remindOn) {
      currState = { ...currState, remindOn: dateToTimestamp(currState.remindOn) }
    }
    if (customerId) {
      onSubmit({ ...currState, id: customerId })
    } else {
      onSubmit(currState);
    }
  };

  const onChangeNewNoteValue = (e, index) => {
    setIsChangeCustomerData(true);
    const value = e.target.value;
    const newNoteState = { createdBy: fullName, date: Date.now(), value };
    setNewNote(newNoteState);
  }

  const onChangeValue = useCallback(e => {
    setIsChangeCustomerData(true);
    const value = e.target.value.trim();
    const name = e.target.name
    if (name === 'notes' && !customerId) {
      setState(prevState => ({
        ...prevState, [name]: [{
          createdBy: fullName,
          date: Date.now(),
          value
        }]
      }));
      return;
    }
    if (name === 'telephone') {
      setState(prevState => ({ ...prevState, [name]: value.replace(/[^\d.]/ig, "") }));
      return;
    }
    setState(prevState => ({ ...prevState, [name]: value }))
  }, [customerId, fullName]);

  const switchEditHandler = e => {
    setEditMode(e.target.checked);
  };

  let customerNotes;
  if (customerId) {
    const calcTime = date => timestampToDate(date) === timestampToDate(new Date().getTime());
    customerNotes = state?.notes?.map((note, i) => {
      const isToday = calcTime(note.date);
      const isDateTime = isToday && !calcTime(state?.notes[i - 1]?.date) ? 'Today' :
        timestampToDate(note.date) !== timestampToDate(state?.notes[i - 1]?.date) ? timestampToDate(note.date) : '';
      return (
        note && <div
          key={note.date}>
          {isDateTime && <p className={`${isDateTime ? classes.divider : ''}`}>{isDateTime}</p>}
          <div id={i === state?.notes.length - 1 ? 'newestElement' : note.date}>
            <p>{note.createdBy}</p>
            <p>{note.date ? `${formatTime(new Date(note.date))}` : ''}</p>
          </div>
          <p>{note.value}</p>
        </div>)
    });
    setTimeout(() => {
      const element = document.querySelector('#newestElement');
      if (element) {
        element.scrollIntoView({ block: "start", inline: "nearest", behavior: 'auto' });
      }
    }, 500);
  }

  const notes = <Fragment>
    <div className={classes.notesHeader}>
      <h3>Notes</h3>
    </div>
    <div>
      <div className={classes.notesContent}>{customerNotes}</div>
      <textarea className={classes.textareaNewNote} placeholder='Type here...' autoFocus={true}
                onChange={(e) => onChangeNewNoteValue(e)}
                value={newNote?.value}></textarea>
    </div>
  </Fragment>;

  const isDisabled = (!(state.firstName || state.lastName || state.telephone) || (customerId && !editMode && !isChangeCustomerData)) || isLoader;

  const customerFormFields = customerModalFormFields.map(field => {
    return (
      <div key={field.name} className={classes.inputWrapper}>
        <label>{field.label}</label>
        <Input disabled={!editMode && customerId} type={field.type} name={field.name} value={state[field.name]}
               placeholder={field.label}
               onChangeValue={onChangeValue}/>
      </div>)
  })

  const onChangeCityHandler = useCallback(value => {
    setIsChangeCustomerData(true);
    setState({ ...state, city: value });
  }, [state]);

  const onChangeIsPaidHandler = e => {
    setState({ ...state, isPaid: e.target.checked })
  }

  return (
    <div className={classes.addNewCustomerContent}>
      <div className={classes.modalHeaderContent}>
        <h2>Add new Customer</h2>
        {customerId && <div>
          <p>Edit</p>
          <label className={classes.switch}>
            <input onChange={switchEditHandler} type="checkbox"/>
            <span className={`${classes.slider} ${classes.round}`}></span>
          </label>
        </div>}
      </div>
      <form onSubmit={onSubmitNewCustomerHandler}>
        {customerFormFields}
        <CityInput disabled={!editMode && customerId} className={classes.inputWrapper} changeCity={onChangeCityHandler}
                   value={state.city}/>
        <div className={classes.isPaidContent}>
          <label className={`${classes.isPaidContainer} ${(!editMode && customerId) && classes.disabledSpan}`}>Is Paid
            <input disabled={!editMode && customerId} type='checkbox' checked={state.isPaid}
                   onChange={onChangeIsPaidHandler}/>
            <span className={`${classes.checkmark} ${(!editMode && customerId) && classes.disabledSpan}`}></span>
          </label>
        </div>
      </form>
      <div className={classes.noteAndSubmit}>
        <div className={customerId && classes.notesWrapper}>
          {!customerId ? <div className={classes.inputWrapper}>
            <label>Note</label>
            <textarea name='notes' onChange={onChangeValue}/>
          </div> : notes}
        </div>
        <button disabled={isDisabled} type='button'
                onClick={onSubmitNewCustomerHandler}>{customerId ? 'Save' : 'Create'}</button>
      </div>
    </div>
  )

};

export default AddNewCustomer;
