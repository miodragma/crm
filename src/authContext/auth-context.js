import React, { useState } from 'react';

const AuthContext = React.createContext({
  isAuth: false,
  login: (token) => {
  },
  logout: () => {
  }
});

export const AuthContextProvider = props => {

  const [isAuth, setIsAuth] = useState(false);

  const userIsAuth = !!isAuth;

  const setAutoLogout = milliseconds => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  }

  const loginHandler = (token) => {
    setIsAuth(true);
    localStorage.setItem('token', token);
    const jwtPayload = JSON.parse(window.atob(token.split('.')[1]))
    const remainingMilliseconds = (jwtPayload.exp - jwtPayload.iat) * 1000;
    setAutoLogout(remainingMilliseconds);
  }

  const logoutHandler = () => {
    setIsAuth(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  const contextValue = {
    isAuth: userIsAuth,
    login: loginHandler,
    logout: logoutHandler
  }

  return <AuthContext.Provider value={contextValue}>
    {props.children}
  </AuthContext.Provider>
};

export default AuthContext;
