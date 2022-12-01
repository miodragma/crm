import { Fragment, useContext } from 'react';

import Header from '../Header/Header';
import Toast from '../UI/Toast/Toast';

import AuthContext from '../../authContext/auth-context';

const Layout = props => {

  const { isAuth } = useContext(AuthContext);

  return (
    <Fragment>
      {isAuth && <Header/>}
      <main>
        {props.children}
      </main>
      <Toast/>
    </Fragment>
  )
}

export default Layout;
