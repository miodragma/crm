import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import Input from '../UI/Input/Input';

import { createCity } from './store/city-actions';

import classes from './City.module.scss';

const City = () => {

  const dispatch = useDispatch();

  const [city, setCity] = useState('');

  const onChangeValue = useCallback(value => {
    setCity(value.trim())
  }, []);

  const saveNewCity = () => {
    dispatch(createCity(city));
  };

  return (
    <div className={classes.settingsCard}>
      <h2>City</h2>
      <div className={classes.inputWrapper}>
        <label>Add New City</label>
        <div>
          <Input type='text' placeholder='Add New City' onChangeValue={onChangeValue} value={city}/>
          <button disabled={!city} onClick={saveNewCity}>Save</button>
        </div>
      </div>
    </div>
  );

};

export default City;
