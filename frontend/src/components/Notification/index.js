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
    <div>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={open} autoHideDuration={4000} key={Math.random()} onClose={handleClose}>
        <div>
          <Alert onClose={handleClose} severity={severity ? severity : "success"}>
            {msg}
          </Alert>
        </div>
      </Snackbar>
      
    </div>
  );
}
export default Notification;
