import React from 'react';

import { green } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

import { withStyles } from '@material-ui/core/styles';
import api from '../../utils/api';
import useStore from '../../store';
import Notification from '../Notification/Notification';


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
  //For notification
  const [status, setStatusBase] = React.useState("");
  
  const minecraftServerState = useStore(state => state.minecraftServerState);

  const startServer = () => {
      api.get('/server/start')
          .then((response) => {
            setStatusBase({ msg: response.data, date: new Date(), severity: "success" });
          })
          .catch(err => {     
            if(err.response){ 
              setStatusBase({ msg: err.response.data, date: new Date(), severity: "error" });
            } 
          })
  }

  const killServer = () => {
      api.get('/server/kill')
        .then((response) => {
          setStatusBase({ msg: response.data, date: new Date(), severity: "success" });
        })
        .catch(err => {     
          if(err.response){ 
            setStatusBase({ msg: err.response.data, date: new Date(), severity: "error" });
          } 
        })
  }

  const stopServer = () => {
    api.get('/server/stop')
      .then((response) => {
        setStatusBase({ msg: response.data, date: new Date(), severity: "info" });
      })
      .catch(err => {     
        if(err.response){ 
          setStatusBase({ msg: err.response.data, date: new Date(), severity: "error" });
        } 
      })
  }

  return (
      <div>
          <ColorButton className="control-btn" variant="contained"  style={{display: minecraftServerState === "SERVER_STOPPED" ? 'inline-block': 'none'}}onClick={() => startServer()}>Start</ColorButton>
          <ColorButton className="control-btn" variant="contained" style={{backgroundColor: red[700], display: minecraftServerState === "SERVER_RUNNING"? 'inline-block': 'none' }}  onClick={() => stopServer()}>Stop</ColorButton>
          <ColorButton className="control-btn" variant="contained" style={{backgroundColor: red[900], display: minecraftServerState === "SERVER_STOPPED" ? 'none': 'inline-block'}} onClick={() => killServer()}>Kill</ColorButton>
          {status ? <Notification key={status.date} msg={status.msg} severity={status.severity}/> : null}
      </div>
  )
}


export default ServerControls;