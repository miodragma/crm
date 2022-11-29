import { Fragment } from 'react';

import Toast from '../UI/Toast/Toast';

const Layout = props => {

  return (
    <Fragment>
      <main>
        {props.children}
      </main>
      <Toast/>
    </Fragment>
  )
}

export default Layout;
