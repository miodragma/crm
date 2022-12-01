import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import AuthContext from '../../authContext/auth-context';
import AuthField from '../../components/Auth/AuthField';

import { authFieldsLoginConfig, authFieldsSignupConfig } from '../../config/auth-config';

import { userLogin, userSignup } from '../../components/Auth/store/auth-actions';
import { authActions } from '../../components/Auth/store/auth.slice';

import logo from '../../assets/logo-cropped.svg';

import classes from './Auth.module.scss';

const Auth = () => {

  const { login, logout } = useContext(AuthContext);
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const {
    errors,
    username,
    firstName,
    lastName,
    password,
    confirmPassword,
    noMatchPasswordMsg,
    showPleaseWaitMessage
  } = auth;

  const { pathname } = useLocation();

  const onSubmit = e => {
    e.preventDefault();
    dispatch(authActions.clearError());
    dispatch(authActions.onChangePleaseWaitMessage(true));
    if (pathname.includes('/login')) {
      dispatch(userLogin({
        username: username.value,
        password: password.value
      }))
        .then(res => {
          login({ token: res.payload.user.token, user: res.payload.user });
          dispatch(authActions.onChangePleaseWaitMessage(false));
          dispatch(authActions.clearState());
        })
        .catch(err => {
          logout();
          dispatch(authActions.onChangePleaseWaitMessage(false));
        })
    } else {
      dispatch(userSignup({
        password: password.value,
        confirmPassword: confirmPassword.value,
        username: username.value,
        firstName: firstName.value,
        lastName: lastName.value
      }))
        .then(res => {
          logout();
          dispatch(authActions.onChangePleaseWaitMessage(false));
          dispatch(authActions.clearState());
        })
        .catch(err => {
          logout();
          dispatch(authActions.onChangePleaseWaitMessage(false));
        })
    }
  }

  const apiErrors = errors?.map((error, index) => {
    return (
      <p key={index} className={classes.errorMessage}>{error.param ? `${error.param} : ` : ''} {error.message}</p>)
  })

  const fieldsConfig = config => config.map(field => {
    const type = field.keyType === 'password' || field.keyType === 'confirmPassword' ? auth[field.keyType].onEyePassword ? 'text' : 'password' : field.type;
    return (
      <div className={classes.inputWrapper} key={field.id}>
        <AuthField
          keyType={field.keyType}
          isEyeContent={field.isEyeContent}
          placeholder={field.placeholder}
          type={type}
          errorMessage={field.errorMessage}
          errorClass={classes.errorMessage}
        />
      </div>
    )
  })

  const fieldsLogin = fieldsConfig(authFieldsLoginConfig);
  const fieldsSignup = fieldsConfig(authFieldsSignupConfig);

  return (
    <div className={classes.loginWrapper}>
      <img src={logo} alt=""/>

      {apiErrors}
      {
        noMatchPasswordMsg &&
        <p className={classes.errorMessage}>Password not match. Please try again.</p>
      }
      {
        showPleaseWaitMessage && <p className={classes.pleaseWaitMessage}>Please wait...</p>
      }
      <form onSubmit={onSubmit}>

        {fieldsLogin}

        {pathname.includes('/create-user') && fieldsSignup}

        {
          pathname.includes('/login') ?
            <button
              disabled={username.isRequiredMessage || password.isRequiredMessage || !username.value || !password.value}
              type='submit'>Login
            </button> :
            <button
              disabled={
                username.isRequiredMessage || firstName.isRequiredMessage || lastName.isRequiredMessage || password.isRequiredMessage || confirmPassword.isRequiredMessage ||
                !username.value || !firstName.value || !lastName.value || !password.value || !confirmPassword.value
              }
              type='submit'>Create user
            </button>
        }

      </form>
    </div>
  )
};

export default Auth;
