import React, { useState } from 'react';

const AuthContext = React.createContext({
  isAuth: false,
  isAdmin: false,
  isSetData: false,
  login: ({ token, user }) => {
  },
  logout: () => {
  }
});

export const AuthContextProvider = props => {

  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSetData, setIsSetData] = useState(false);

  const userIsAuth = !!isAuth;
  const userIsAdmin = !!isAdmin;
  const userIsSetData = !!isSetData;

  const setAutoLogout = milliseconds => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  }

  const loginHandler = ({ token, user }) => {
    setIsAuth(true);
    setIsAdmin(user.isAdmin);
    setIsSetData(true);
    localStorage.setItem('token', token);
    const jwtPayload = JSON.parse(window.atob(token.split('.')[1]))
    const remainingMilliseconds = (jwtPayload.exp - jwtPayload.iat) * 1000;
    setAutoLogout(remainingMilliseconds);
  }

  const logoutHandler = () => {
    setIsAuth(false);
    setIsAdmin(false);
    setIsSetData(true);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  const contextValue = {
    isAuth: userIsAuth,
    isAdmin: userIsAdmin,
    isSetData: userIsSetData,
    login: loginHandler,
    logout: logoutHandler
  }

  return <AuthContext.Provider value={contextValue}>
    {props.children}
  </AuthContext.Provider>
};

export default AuthContext;
