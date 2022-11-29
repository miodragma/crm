import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import classes from './Input.module.scss';

const Input = props => {

  const { type, onChangeValue, placeholder, onBlur, isErrorMessage = false, value } = props;

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.value = value ?? ''
  }, [value])

  const onChangeValueHandler = e => {
    onChangeValue(e.target.value);
  }

  const onBlurHandler = e => {
    onBlur(e.target.value);
  }

  return (
    <input
      ref={inputRef}
      className={`${classes.inputField} ${isErrorMessage ? classes.errorBorder : ''}`}
      onChange={onChangeValueHandler}
      onBlur={onBlurHandler}
      placeholder={placeholder}
      type={type}/>
  )

};

export default Input;

Input.propTypes = {
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  onChangeValue: PropTypes.func,
  onBlur: PropTypes.func,
  isErrorMessage: PropTypes.bool
}
