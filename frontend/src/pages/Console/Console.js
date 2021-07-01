import React from 'react';
import ServerConsole from './ServerConsole/ServerConsole';
import useStore from '../../store';
import Button from '@material-ui/core/Button';
import './Console.css';

export function Console() {
    const clearConsole = useStore(state => state.clearConsole);
    
    return (
        <div>
          <ServerConsole /> 
          <Button id="clear-btn" variant="contained" color="primary" onClick={() => clearConsole()}>
              Clear Console
          </Button>
        </div>
    )
}


