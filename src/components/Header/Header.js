import { Fragment, useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as routeConstants from '../../route/RouteConstants';

import logoutIcon from '../../assets/logout.png';

import AuthContext from '../../authContext/auth-context';

import classes from './Header.module.scss';

const Header = () => {

  const { logout, isAdmin } = useContext(AuthContext);
  const { isLoader } = useSelector(state => state.loader);

  const onClickLogoutHandler = () => {
    logout();
  };

  return (
    <Fragment>
      <header className={classes.header}>
        <div>
          <NavLink
            className={classes.link}
            to={`/${routeConstants.HOME}`}
            activeClassName={classes.activeLink}>Home
          </NavLink>
          {isAdmin && <NavLink
            className={classes.link}
            to={`/${routeConstants.CREATE_USER}`}
            activeClassName={classes.activeLink}>Create user
          </NavLink>}
        </div>
        <div>
          <img onClick={onClickLogoutHandler} src={logoutIcon} alt="logout"/>
        </div>
      </header>
      {isLoader && <div className={classes.progressBar}>
        <div className={classes.progressBarValue}></div>
      </div>}
    </Fragment>
  )

};

export default Header;
