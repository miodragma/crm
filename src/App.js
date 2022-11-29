import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Layout from './components/Layout/Layout';

import Routes from './route/Route';

import AuthContext from './authContext/auth-context';
import axiosConfig from './axios/axiosConfig';

import { getUser } from './components/Auth/store/auth-actions';
import { authActions } from './components/Auth/store/auth.slice';

const App = () => {

  const dispatch = useDispatch();
  const { login, logout } = useContext(AuthContext);

  useEffect(() => {
    axiosConfig.interceptors.response.use(response => {
      return response;
    }, err => {
      if (err.response.status === 401) {
        logout()
      }
      return Promise.reject(err);
    });
    dispatch(authActions.onChangePleaseWaitMessage(true));
    dispatch(getUser())
      .then(res => {
        login(res.payload.user.token);
        dispatch(authActions.onChangePleaseWaitMessage(false));
      })
      .catch(err => {
        dispatch(authActions.onChangePleaseWaitMessage(false));
        logout()
      })
  }, [])

  return (
    <Layout>
      <Routes/>
    </Layout>
  );
}

export default App;
