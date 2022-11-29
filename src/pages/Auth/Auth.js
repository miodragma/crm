import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AuthContext from '../../authContext/auth-context';
import AuthField from '../../components/Auth/AuthField';

import { userLogin, userSignup } from '../../components/Auth/store/auth-actions';
import { authActions } from '../../components/Auth/store/auth.slice';

import logo from '../../assets/logo.svg';

import classes from './Auth.module.scss';
import { authFieldsLoginConfig, authFieldsSignupConfig } from '../../config/auth-config';

const Auth = () => {

  const { login, logout } = useContext(AuthContext);
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const { errors, email, name, password, confirmPassword, noMatchPasswordMsg, showPleaseWaitMessage } = auth;

  const [signUpLoginButtonText, setSignUpLoginButtonText] = useState('Sign Up');

  const onSubmit = e => {
    e.preventDefault();
    dispatch(authActions.clearError());
    dispatch(authActions.onChangePleaseWaitMessage(true));
    if (signUpLoginButtonText !== 'Login') {
      dispatch(userLogin({
        email: email.value,
        password: password.value
      }))
        .then(res => {
          login(res.payload.user.token);
          dispatch(authActions.onChangePleaseWaitMessage(false));
          dispatch(authActions.clearState());
        })
        .catch(err => {
          logout();
          dispatch(authActions.onChangePleaseWaitMessage(false));
        })
    } else {
      dispatch(userSignup({
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        name: name.value
      }))
        .then(res => {
          onChangeSignUpLoginHandler()
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

  const onChangeSignUpLoginHandler = () => {
    dispatch(authActions.clearError());
    dispatch(authActions.clearState());
    dispatch(authActions.onChangePleaseWaitMessage(false));
    setSignUpLoginButtonText(prevState => {
      if (prevState === 'Sign Up') {
        return 'Login'
      } else {
        return 'Sign Up'
      }
    })
  };

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

        {signUpLoginButtonText !== 'Sign Up' && fieldsSignup}

        <button onClick={onChangeSignUpLoginHandler} className={classes.signUpLoginButton}
                type='button'>{signUpLoginButtonText}</button>
        {
          signUpLoginButtonText !== 'Login' ?
            <button
              disabled={email.isRequiredMessage || password.isRequiredMessage || !email.value || !password.value}
              type='submit'>Login
            </button> :
            <button
              disabled={email.isRequiredMessage || name.isRequiredMessage || password.isRequiredMessage || confirmPassword.isRequiredMessage || !email.value || !name.value || !password.value || !confirmPassword.value}
              type='submit'>Sign Up
            </button>
        }

      </form>
    </div>
  )
};

export default Auth;
