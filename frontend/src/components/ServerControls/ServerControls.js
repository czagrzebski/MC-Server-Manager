import React from 'react';

import { green } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

import { withStyles } from '@material-ui/core/styles';
import api from '../../utils/api';
import useStore from '../../store';


import Button from '@material-ui/core/Button';

const ColorButton = withStyles((theme) => ({
    root: {
      color: 'white',
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[600],
      },
      marginRight: "10px",
      paddingLeft: "20px",
      paddingRight: "20px",
  
      
    },
  }))(Button);

function ServerControls() {

  const minecraftServerState = useStore(state => state.minecraftServerState);

  const startServer = () => {
      api.get('/server/start')
          .catch(err => console.log(err.response.data))
  }

  const killServer = () => {
      api.get('/server/kill')
        .catch(err => console.log(err))
  }

  const stopServer = () => {
    api.get('/server/stop')
      .catch(err => console.log(err))
  }

  return (
      <div>
          <ColorButton className="control-btn" variant="contained"  style={{display: minecraftServerState === "SERVER_STOPPED" ? 'inline-block': 'none'}}onClick={() => startServer()}>Start</ColorButton>
          <ColorButton className="control-btn" variant="contained" style={{backgroundColor: red[700], display: minecraftServerState === "SERVER_RUNNING"? 'inline-block': 'none' }}  onClick={() => stopServer()}>Stop</ColorButton>
          <ColorButton className="control-btn" variant="contained" style={{backgroundColor: red[900], display: minecraftServerState === "SERVER_STOPPED" ? 'none': 'inline-block'}} onClick={() => killServer()}>Kill</ColorButton>
      </div>
  )
}


export default ServerControls;