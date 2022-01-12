import React, { useState, useEffect } from "react";
import api from "services/api";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNotification } from "components/NotificationProvider";

const useStyles = makeStyles((theme) => ({
  actionContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
}));

function EditUserModal({ open, handleClose, user, updateUsers }) {
  const [newUsername, setNewUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { createNotification } = useNotification();

  const classes = useStyles();

  const changeUsername = (event) => {
    //Do not behave like a normal form event
    event.preventDefault();

    api
      .put("/auth/username", {
        newUsername: newUsername, id: user.id
      })
      .then((response) => {
        createNotification(response.data);
        updateUsers();
      })
      .catch((err) => {
        if (err.response.data.errors) setError(err.response.data.errors[0].msg);
        else setError(err.response.data);
      });
  };

  const changePassword = (event) => {
    //Do not behave like a normal form event
    event.preventDefault();

    if (!handleConfirmPassword()) return;

    api
      .put("/auth/password", {
        password: password,
        id: user.id,
      })
      .then((response) => {
        createNotification(response.data);
      })
      .catch((err) => {
        if (err.response.data.errors) setError(err.response.data.errors[0].msg);
        else setError(err.response.data);
      });
  };

  const handleConfirmPassword = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const closeModal = () => {
    setNewUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle>Edit User ({user?.username})</DialogTitle>
      <form>
        <DialogContent>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            autoFocus
            color="info"
            margin="dense"
            id="username"
            label="Username"
            value={newUsername}
            fullWidth
            error={error}
            variant="outlined"
            required
            onChange={(event) => {
              setNewUsername(event.target.value);
            }}
          />
          <TextField
            color="info"
            margin="dense"
            id="password"
            label="Password"
            type="password"
            value={password}
            fullWidth
            error={error}
            variant="outlined"
            required
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <TextField
            color="info"
            margin="dense"
            id="confirmpassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            fullWidth
            error={error}
            variant="outlined"
            required
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
          />
        </DialogContent>
        <div className={classes.actionContainer}>
          <Button color="info" variant="contained" onClick={changeUsername}>
            Change Username
          </Button>
          <Button color="info" variant="contained" onClick={changePassword}>
            Change Password
          </Button>
        </div>
        <DialogActions>
          <Button color="info" onClick={closeModal}>
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditUserModal;
