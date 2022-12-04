import { useHistory } from 'react-router-dom';

import * as routeConstants from '../../route/RouteConstants';

import City from '../../components/City/City';

import classes from './Settings.module.scss';

const Settings = () => {

  const history = useHistory();

  const onClickToCreateUser = () => {
    history.push(`/${routeConstants.SETTINGS}/${routeConstants.CREATE_USER}`);
  }

  return (
    <div className={classes.settingsContent}>
      <div className={classes.settingsHeader}>
        <h1>Settings</h1>
        <button onClick={onClickToCreateUser}>Create User</button>
      </div>
      <City/>
    </div>
  )
}

export default Settings;
