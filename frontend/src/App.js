import './App.css';
import React, { useEffect } from 'react';
import {socket, SocketContext } from './utils/socket';
import { Console, Settings, Home} from './pages'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavDrawer from './components/NavDrawer/NavDrawer'
import { makeStyles } from '@material-ui/core/styles';
import useStore from './store'
import api from './utils/api';


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
  const setMinecraftServerState = useStore(state => state.setMinecraftServerState);
  
  
  useEffect(() => {

    socket.on('console', (data) => {
      addConsoleOutput(data);
    }); 

    socket.on('state', (data) => {
      setMinecraftServerState(data);
    });

    api.get('/server/state')
      .then(resp => setMinecraftServerState(resp["data"]))
      .catch(err => console.log(`Failed to fetch mc server state: ${err}`))

    //Cleanup Socket
    return(() => socket.close());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <SocketContext.Provider value={socket}>
    <Router>
      <div className={classes.root}>
          <NavDrawer />
          <div className={classes.content}>
            <div className={classes.toolbar} />
              <Switch>
                  <Route path="/settings">
                    <Settings />
                  </Route>
                  <Route path="/console">
                    <Console />
                  </Route>
                  <Route path="/">
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
