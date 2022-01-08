import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { AddCircle, Edit, Delete } from "@mui/icons-material";
import api from "../../services/api";
import Notification from "../Notification/Notification";

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: "20px",
    marginTop: "10px",
    backgroundColor: theme.palette.primary.main,
  },
  titleBar: {
    paddingLeft: "20px",
    paddingTop: "5px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  tableContainer: {
    borderRadius: "20px",
  },
  table: {
    backgroundColor: theme.palette.primary.main,
  },
  actionButtonsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
}));

function CreateUserModal({ open, handleClose, updateUsers, pushNotification }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const createUser = (event) => {
    //Do not behave like a normal form event
    event.preventDefault();

    //Add user to MCSM
    api
      .post("/auth/create", {
        username,
        password,
      })
      .then((response) => {
        pushNotification(response.data, "success");
        closeModal();
        updateUsers();
      })
      .catch((err) => {
        if (err.response.data.errors) setError(err.response.data.errors[0].msg);
        else setError(error.response.data);
      });
  };

  const closeModal = () => {
    setUsername("");
    setPassword("");
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
            variant="standard"
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
            variant="standard"
            required
            onChange={(event) => {
              setPassword(event.target.value);
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

export function UserTable() {
  const [usersList, setUsersList] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState();

  const classes = useStyles();

  const handleCreateUserModalClose = () => {
    setShowCreateUserModal(false);
  };

  const handleCreateUserModalOpen = () => {
    setShowCreateUserModal(true);
  };

  const pushNotification = (msg, severity) => {
    setNotificationStatus({
      msg,
      key: new Date(),
      severity,
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    api.get("/users/all").then((response) => {
      setUsersList(response.data.users);
    });
  };

  const deleteUser = (username) => {
    api
      .delete("/auth/delete", {
        data: {
          username,
        },
      })
      .then((response) => {
        getUsers();
        pushNotification(response.data, "success");
      })
      .catch((err) => {
        pushNotification(err.response.data, "error");
      });
  };

  return (
    <div className={classes.container}>
      {/* Titlebar */}
      <div className={classes.titleBar}>
        <h3>Manage Users</h3>
        <Tooltip title="Create User">
          <IconButton
            style={{ marginLeft: "auto", marginRight: "25px" }}
            size="large"
            onClick={handleCreateUserModalOpen}
          >
            <AddCircle />
          </IconButton>
        </Tooltip>
      </div>
      <CreateUserModal
        open={showCreateUserModal}
        handleClose={handleCreateUserModalClose}
        updateUsers={getUsers}
        pushNotification={pushNotification}
      />
      {/* Table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          className={classes.table}
        >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList?.map((user) => (
              <TableRow
                key={user?.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user?.id}
                </TableCell>
                <TableCell>{user?.username}</TableCell>
                <TableCell>
                  <div className={classes.actionButtonsContainer}>
                    <Tooltip title="Edit User">
                      <IconButton size="large">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title="Delete User"
                      onClick={() => deleteUser(user.username)}
                    >
                      <IconButton size="large">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/*  Notification Component */}
      {notificationStatus ? (
        <div>
          <Notification
            key={notificationStatus.key}
            msg={notificationStatus.msg}
            severity={notificationStatus.severity}
          />
        </div>
      ) : null}
    </div>
  );
}
