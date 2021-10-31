import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from '@mui/material/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Notification({ msg, severity }) {
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    setOpen(true);
  }, []);

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity}>
        {msg}
      </Alert>
    </Snackbar>
  );
}
export default Notification;
