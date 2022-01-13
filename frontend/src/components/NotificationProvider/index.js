import React, { createContext, useState, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";

function SnackbarAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

export const NotificationContext = createContext();

/**
 * The provider for the Snackbar Notification
 */
export function NotificationProvider(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState(null);

  /**
   * Creates and displays a Snackbar Notification
   * @param {*} msg
   * @param {*} severity
   */
  const createNotification = (msg, severity) => {
    setMessage(msg);
    setSeverity(severity);
    setIsOpen(true);
  };

  const handleClose = (event, reason) => {
    //Disable Clickaway event
    if (reason === "clickaway") return;
    setIsOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ createNotification, isOpen }}>
      {isOpen ? (
        <div>
          <Snackbar
            key={new Date()} //This is a unique key that allows the component to return a new snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={isOpen}
            autoHideDuration={4000}
            onClose={handleClose}
          >
            <div>
              <SnackbarAlert
                onClose={handleClose}
                severity={severity ? severity : "success"}
              >
                {message}
              </SnackbarAlert>
            </div>
          </Snackbar>
        </div>
      ) : null}
      {props.children}
    </NotificationContext.Provider>
  );
}

/**
 * A hook for using the Notification Provider
 */
export function useNotification() {
  return useContext(NotificationContext);
}
