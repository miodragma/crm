import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import classes from './Backdrop.module.scss';

const Backdrop = props => {

  const { onClickBackdrop } = props;

  const onClickBackdropHandler = () => {
    onClickBackdrop()
  };

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <div onClick={onClickBackdropHandler} className={classes.backdrop}/>,
        document.getElementById('backdrop'))
      }
    </Fragment>
  )

};

export default Backdrop;
