import React from 'react';
import './ConsoleDashboard.css';
import Console from './Console/Console'
import useStore from '../../store';
import Button from '@material-ui/core/Button';


function ConsoleDashboard() {
    const consoleOutput = useStore(state => state.consoleOutput);
    const clearConsole = useStore(state => state.clearConsole);
    
    return (
        <div>
          <Console consoleOutputList={consoleOutput}/> 
          <Button className="consoleButton" variant="contained" color="primary" onClick={() => clearConsole()}>
              Clear Console
          </Button>
        </div>
    )
}

export default ConsoleDashboard;