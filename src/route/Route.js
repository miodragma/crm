import React, { Suspense, useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AuthContext from '../authContext/auth-context';

import * as routeConstants from './RouteConstants';

const Auth = React.lazy(() => import('../pages/Auth/Auth'));
const Settings = React.lazy(() => import('../pages/Settings/Settings'));
const Home = React.lazy(() => import('../pages/Home/Home'));

const Routes = () => {

  const { isAuth, isAdmin, isSetData } = useContext(AuthContext);

  return (
    <Suspense fallback={<div/>}>{
      isSetData && <Switch>
        <Route path='/' exact>
          <Redirect to={`/${routeConstants.HOME}`}/>
        </Route>

        {
          !isAuth && <Route path={`/${routeConstants.LOGIN}`} component={Auth}/>
        }

        <Route path={`/${routeConstants.HOME}`}>
          {isAuth && <Home/>}
          {!isAuth && <Redirect to={`/${routeConstants.LOGIN}`}/>}
        </Route>

        <Route path={`/${routeConstants.SETTINGS}`} exact>
          {isAuth && isAdmin && <Settings/>}
          {isAuth && !isAdmin && <Redirect to={`/${routeConstants.HOME}`}/>}
          {!isAuth && <Redirect to={`/${routeConstants.LOGIN}`}/>}
        </Route>

        <Route path={`/${routeConstants.SETTINGS}/${routeConstants.CREATE_USER}`}>
          {isAuth && isAdmin && <Auth/>}
          {isAuth && !isAdmin && <Redirect to={`/${routeConstants.HOME}`}/>}
          {!isAuth && <Redirect to={`/${routeConstants.LOGIN}`}/>}
        </Route>


        <Route path='*'>
          <Redirect to='/'/>
        </Route>
      </Switch>
    }
    </Suspense>
  )
};

export default Routes;
