import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { consoleLogAdded } from "app/slices/consoleSlice";
import { setServerStatus } from "app/slices/minecraftServerSlice";

import { Console, Settings, Overview, Login } from "pages";

import api from "services/api";
import { socket } from "services/socket";

import NavDrawer from "components/NavDrawer";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    background: theme.palette.primary.dark,
    padding: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
}));

function Dashboard() {
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    socket.on("console", (data) => {
      dispatch(consoleLogAdded(data));
    });

    socket.on("state", (data) => {
      dispatch(setServerStatus(data));
    });

    api
      .get("/server/state")
      .then((resp) => dispatch(setServerStatus(resp["data"])))
      .catch((err) => console.log(`Failed to fetch mc server state: ${err}`));

    //Cleanup Socket
    return () => {
      socket.off("console");
      socket.off("state");
    };
  }, []);

  return (
    <div className={classes.root}>
      <NavDrawer />
      <div className={classes.content}>
        <div className={classes.toolbar} />
        <Routes>
          <Route path="/settings" element={<Settings />} />
          <Route path="/console" element={<Console />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard/overview" />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
