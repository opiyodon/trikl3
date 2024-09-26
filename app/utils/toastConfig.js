import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const isMobile = () => window.innerWidth <= 768;

export const toastConfig = {
  position: isMobile() ? toast.POSITION.BOTTOM_CENTER : toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  hideProgressBar: isMobile(),
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showToast = (message, type = 'default') => {
  switch (type) {
    case 'success':
      toast.success(message, toastConfig);
      break;
    case 'error':
      toast.error(message, toastConfig);
      break;
    case 'info':
      toast.info(message, toastConfig);
      break;
    case 'warning':
      toast.warning(message, toastConfig);
      break;
    default:
      toast(message, toastConfig);
  }
};
