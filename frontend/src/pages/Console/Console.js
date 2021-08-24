import React from 'react';
import ServerConsole from './ServerConsole/ServerConsole';
import Button from '@material-ui/core/Button';
import './Console.css';
import { useDispatch } from 'react-redux';
import { consoleCleared } from './consoleSlice';

export function Console() {
    const dispatch = useDispatch()
    
    return (
        <div>
          <ServerConsole /> 
          <Button id="clear-btn" variant="contained" color="primary" onClick={() => dispatch(consoleCleared())}>
            Clear Console
          </Button>
        </div>
    )
}


