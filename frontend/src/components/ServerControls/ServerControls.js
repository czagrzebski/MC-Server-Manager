import React from 'react';

import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import api from '../../utils/api';


import Button from '@material-ui/core/Button';

const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(green[500]),
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[600],
      },
 
    },
  }))(Button);

function ServerControls() {

    const startServer = () => {
        api.get('/server/start')
            .catch(err => console.log)
    }

    const killServer = () => {
        api.get('/server/kill')
          .catch(err => console.log)
    }

    return (
        <div>
            <ColorButton className="controlButton" variant="contained" onClick={() => startServer()}>Start</ColorButton>
            <ColorButton className="controlButton" variant="contained" onClick={() => killServer()}>Stop</ColorButton>
            <ColorButton className="controlButton" variant="contained" onClick={() => killServer()}>Kill</ColorButton>
        </div>
    )
}


export default ServerControls;