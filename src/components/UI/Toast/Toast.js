import { toast, ToastContainer } from 'react-toastify';

import classes from './Toast.module.scss';

const Toast = () => {

  return (
    <ToastContainer
      className={classes.themeContainer}
      theme='colored'
      hideProgressBar='true'/>
  )
};

export const toastConfig = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 5000,
  pauseOnHover: false,
  pauseOnFocusLoss: false
}

export default Toast;
