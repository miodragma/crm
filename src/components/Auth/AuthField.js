import { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../UI/Input/Input';

import eye from '../../assets/eye.png';
import eyeInvisible from '../../assets/eye-invisible.png';

import { validateEmail } from '../../utils/validateEmail';

import { authActions } from './store/auth.slice';

import classes from './AuthField.module.scss';

const AuthField = props => {

  const {
    placeholder,
    isEyeContent,
    type,
    errorMessage,
    errorClass,
    keyType
  } = props;

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const { value, isRequiredMessage } = auth[keyType];

  const matchPassword = useCallback(value => {
    const password = keyType === 'password' ? value : auth.password.value;
    const confirmPassword = keyType === 'confirmPassword' ? value : auth.confirmPassword.value;
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        dispatch(authActions.onChangeOnlyIsRequired(true));
      } else {
        dispatch(authActions.onChangeOnlyIsRequired(false));
      }
    }
  }, [auth.confirmPassword.value, auth.password.value, dispatch, keyType]);

  const onChangeValueHandler = useCallback(value => {
    let trimValue = value.trim();
    let isRequiredMessage = !trimValue;

    if (keyType === 'email') {
      trimValue = trimValue.toLowerCase();
      isRequiredMessage = !(validateEmail(trimValue) && !!trimValue);
    }
    if (keyType === 'password' || keyType === 'confirmPassword') {
      dispatch(authActions.onChangeValue({
        keyType,
        value: trimValue,
        isRequiredMessage,
        onEyePassword: auth[keyType].onEyePassword
      }));
      matchPassword(trimValue)
    } else {
      dispatch(authActions.onChangeValue({ keyType, value: trimValue, isRequiredMessage }));
    }
  }, [auth, dispatch, keyType, matchPassword]);

  const onClickEyePasswordIconHandler = () => {
    dispatch(authActions.onChangeValue({
      keyType,
      value,
      isRequiredMessage,
      onEyePassword: !auth[keyType].onEyePassword
    }));
  }

  let eyeContent;

  if (isEyeContent) {
    eyeContent = auth[keyType].onEyePassword ?
      <img className={`${classes.eyePasswordIcon} disableSelection`} src={eye} alt=""
           onClick={onClickEyePasswordIconHandler}/>
      :
      <img className={`${classes.eyePasswordIcon} disableSelection`} src={eyeInvisible} alt=""
           onClick={onClickEyePasswordIconHandler}/>
  }

  return (
    <Fragment>
      <Input
        value={value}
        isErrorMessage={isRequiredMessage}
        onBlur={onChangeValueHandler}
        type={type}
        placeholder={placeholder}
        onChangeValue={onChangeValueHandler}/>

      {eyeContent}

      {isRequiredMessage && <p className={errorClass}>{errorMessage}</p>}
    </Fragment>
  );

};

export default AuthField;
