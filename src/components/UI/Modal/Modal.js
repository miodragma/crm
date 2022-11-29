import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.scss';

const Modal = props => <Fragment>
  {ReactDOM.createPortal(<div className={classes.modal}>{props.children}</div>, document.getElementById('overlay'))}
</Fragment>

export default Modal;
