import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import classes from './CityInput.module.scss';

const CityInput = props => {

  const { className, changeCity, disabled, value, isLabel = true } = props;

  const cities = useSelector(state => state.city.cities);

  const [city, setCity] = useState('');
  const isChangeValue = useRef(false);

  let autocompleteCities = [];
  let findSimilarCities = city && cities.filter(currCity => currCity.value.toLowerCase().includes(city.toLowerCase().trim()));

  const onchangeCityValueHandler = e => {
    isChangeValue.current = true;
    const value = e.target.value;
    const cityValue = cities.find(city => city.value.toLowerCase() === value.toLocaleString().trim())?.value;

    setCity(value);
    isLabel && changeCity(value);
    if (!!cityValue) {
      setCity(cityValue);
      changeCity(value);
      findSimilarCities = [];
      isChangeValue.current = false;
    }
    if (!value.trim() && !isLabel) {
      changeCity(value);
    }
  };

  if (findSimilarCities.length && isChangeValue.current) {
    autocompleteCities = findSimilarCities.map(city => <p onClick={() => onClickAutocomplete(city)}
                                                          key={city.createdAt}>{city.value}</p>);
  }

  const onClickAutocomplete = city => {
    isChangeValue.current = false;
    setCity(city.value)
    changeCity(city.value);
    autocompleteCities = [];
    findSimilarCities = [];
  };

  return (

    <div className={`${classes.cityInputContent} ${className}`}>
      {isLabel && <label>City</label>}
      <input disabled={disabled} className={classes.inputField} placeholder='City' onChange={onchangeCityValueHandler}
             value={isLabel ? (city || value) : city}/>
      {autocompleteCities.length > 0 && isChangeValue.current &&
        <div className={classes.autocompleteContent}>{autocompleteCities}</div>}
    </div>
  )

};

export default CityInput;
