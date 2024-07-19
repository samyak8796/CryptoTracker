import React from 'react';
import { CryptoState } from '../Context';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

const AlertNotification = () => {
  const { alert, setAlert } = CryptoState();

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ open: false });
  };

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={handleCloseAlert}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
    //   message={alert.message}
      // severity={alert.type}
    >
      <Alert
        onClose={handleCloseAlert}
        elevation={10}
        variant="filled"
        severity={alert.type}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertNotification;