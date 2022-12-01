import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Input from '../UI/Input/Input';

import { dateToTimestamp, formatTime, getDateData, timestampToDate } from '../../utils/dateToTimestamp';
import { customerModalFormFields } from '../../config/customer-modal-form-fields';

import addIconTransparent from '../../assets/add-transparent.png';

import classes from './AddNewCustomer.module.scss';

const AddNewCustomer = props => {

  const { onSubmit, customer } = props;
  const { id: customerId } = customer;

  const { user: { fullName } } = useSelector(state => state.auth);

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    telephone: '',
    email: '',
    notes: [],
    remindOn: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [isChangeCustomerData, setIsChangeCustomerData] = useState(false);
  const [noteToExpand, setNoteToExpand] = useState(null);

  useEffect(() => {
    if (customer.id) {
      let remindOn = '';
      if (customer.remindOn) {
        const { year, month, day } = getDateData(+customer.remindOn);
        remindOn = `${year}-${month}-${("0" + day).slice(-2)}`
      }
      setState({
        firstName: customer.firstName,
        lastName: customer.lastName,
        telephone: customer.telephone,
        email: customer.email,
        notes: customer.notes,
        remindOn
      })
    }
  }, [customer]);

  const onSubmitNewCustomerHandler = () => {
    let currState = { ...state };
    if (currState.remindOn) {
      currState = { ...state, remindOn: dateToTimestamp(currState.remindOn) }
    }
    if (customerId) {
      onSubmit({ ...currState, id: customerId })
    } else {
      onSubmit(currState);
    }
  };

  const onChangeNewNoteValue = (e, index) => {
    setIsChangeCustomerData(true);
    const value = e.target.value
    setState({
      ...state,
      notes: state.notes.map((note, i) => {
        if (i === index) {
          return { ...note, value }
        }
        return note;
      })
    })
  }

  const onChangeValue = useCallback(e => {
    setIsChangeCustomerData(true);
    const value = e.target.value;
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

  const expandCustomer = noteDate => {
    if (noteToExpand === noteDate) {
      setNoteToExpand(null);
      return;
    }
    setNoteToExpand(noteDate)
  };

  let customerNotes;
  if (customerId) {
    customerNotes = state?.notes?.map((note, i) => {
      return (
        note && <div
          key={note.date}
          className={`${classes.customerNoteContent} ${noteToExpand === note.date ? classes.expandedCustomer : ''}`}>
          <div onClick={() => expandCustomer(note.date)}><p>{note.createdBy}</p>
            <p>{note.date ? `${timestampToDate(note.date)} - ${formatTime(new Date(note.date))}` : ''}</p>
          </div>
          <textarea readOnly={customer.notes[i]?.date === note.date} onChange={(e) => onChangeNewNoteValue(e, i)}
                    value={note.value}></textarea>
        </div>)
    });
  }

  const addNewNoteHandler = () => {
    const newNoteState = [{ createdBy: fullName, date: Date.now(), value: '' }, ...state.notes]
    setState({ ...state, notes: newNoteState })
  };

  const notes = <div>
    <div className={classes.notesHeader}>
      <h3>Notes</h3>
      <img onClick={addNewNoteHandler} src={addIconTransparent} alt="add-icon"/>
    </div>
    {customerNotes}
  </div>;

  const isDisabled = (!(state.firstName || state.lastName || state.telephone) || (customerId && !editMode && !isChangeCustomerData));

  const customerFormFields = customerModalFormFields.map(field => <div key={field.name}
                                                                       className={classes.inputWrapper}>
    <label>{field.label}</label>
    <Input disabled={!editMode && customerId} type={field.type} name={field.name} value={state[field.name]}
           placeholder={field.label}
           onChangeValue={onChangeValue}/>
  </div>)

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
