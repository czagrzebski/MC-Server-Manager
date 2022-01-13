import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { IconButton, Tooltip } from "@mui/material";

import { AddCircle } from "@mui/icons-material";
import api from "services/api";
import CreateUserModal from "./CreateUserModal";

import UserTable from "./UserTable";

import { useNotification } from "components/NotificationProvider";

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

export default function UserManagement() {
  const [usersList, setUsersList] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const { createNotification } = useNotification();

  const classes = useStyles();

  const handleCreateUserModalClose = () => {
    setShowCreateUserModal(false);
  };

  const handleCreateUserModalOpen = () => {
    setShowCreateUserModal(true);
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
        createNotification(response.data);
        getUsers();
      })
      .catch((err) => {
        createNotification(err.response.data, "error");
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
      />
      
      {/* Table */}
      <UserTable usersList={usersList} deleteUser={deleteUser} updateUsers={getUsers}/>
      {/*  Notification Component */}
    </div>
  );
}
