import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Console, Settings, Home } from "./pages";

import api from "./utils/api";
import { socket, SocketContext } from "./utils/socket";

import "./App.css";
import NavDrawer from "./components/NavDrawer/NavDrawer";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch } from "react-redux";
import { consoleLogAdded } from "./app/slices/consoleSlice";
import { setServerStatus } from "./app/slices/minecraftServerSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
  },

  toolbar: theme.mixins.toolbar,
}));

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();

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
    return () => socket.close();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <div className={classes.root}>
          <NavDrawer />
          <div className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Redirect exact from="/" to="dashboard" />
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/console">
                <Console />
              </Route>
              <Route path="/dashboard">
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
