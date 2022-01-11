import React, { useState } from "react";
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
import { useNotification } from "components/NotificationProvider";

function CreateUserModal({ open, handleClose, updateUsers }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { createNotification } = useNotification();

  const createUser = (event) => {
    //Do not behave like a normal form event
    event.preventDefault();

    //Checks if passwords match
    if (!handleConfirmPassword()) return;

    //Add user to MCSM
    api
      .post("/auth/create", {
        username,
        password,
      })
      .then((response) => {
        createNotification(response.data);
        closeModal();
        updateUsers();
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
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle>Create User</DialogTitle>
      <form onSubmit={createUser}>
        <DialogContent>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            autoFocus
            color="info"
            margin="dense"
            id="username"
            label="Username"
            value={username}
            fullWidth
            error={error}
            variant="outlined"
            required
            onChange={(event) => {
              setUsername(event.target.value);
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
        <DialogActions>
          <Button color="info" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" color="info" onClick={createUser}>
            Create User
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateUserModal;
