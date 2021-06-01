import React from 'react';
import Console from './Console/Console'
import useStore from '../../store';
import Button from '@material-ui/core/Button';
import './ConsoleDashboard.css';

function ConsoleDashboard() {
    const clearConsole = useStore(state => state.clearConsole);
    
    return (
        <div>
          <Console /> 
          <Button id="clear-btn" variant="contained" color="primary" onClick={() => clearConsole()}>
              Clear Console
          </Button>
        </div>
    )
}

export default ConsoleDashboard;