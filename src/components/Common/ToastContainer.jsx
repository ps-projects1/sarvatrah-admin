// components/Common/ToastContainer.js
import { Toaster } from 'react-hot-toast';

const ToastContainer = () => (
  <Toaster
    position="top-center"
    reverseOrder={false}
    toastOptions={{
      duration: 5000,
      style: {
        fontSize: '14px',
        maxWidth: '500px',
        padding: '10px 15px',
      },
    }}
  />
);

export default ToastContainer;