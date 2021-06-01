import './App.css';
import React, { useEffect } from 'react';
import {socket, SocketContext } from './utils/socket';
import ConsoleDashboard from './pages/ConsoleDashboard/ConsoleDashboard';
import HomeDashboard from './pages/HomeDashboard/HomeDashboard';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavDrawer from './components/NavDrawer/NavDrawer'
import { makeStyles } from '@material-ui/core/styles';
import useStore from './store'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },

  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
  },

  toolbar: theme.mixins.toolbar
}));


function App() {
  const classes = useStyles();
  const addConsoleOutput = useStore(state => state.addConsoleOutput);

  useEffect(() => {
    socket.on('console', (data) => {
      addConsoleOutput(data);
    }); 

    //Cleanup Socket
    return(() => socket.close());
  }, [])


  return (
    <SocketContext.Provider value={socket}>
    <Router>
      <div className={classes.root}>
     
          <NavDrawer />
          <div className={classes.content}>
            <div className={classes.toolbar} />
              <Switch>
                  <Route path="/console">
                    <ConsoleDashboard />
                  </Route>
                  <Route path="/">
                    <HomeDashboard />
                  </Route>
              </Switch>
              </div>
    </div>
    </Router>
    </SocketContext.Provider>
  
  );
}

export default App;