import React, { useEffect, useRef, useState } from 'react';
import './ServerConsole.css'
import api from '../../../utils/api';
import useStore from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { consoleLogAdded } from '../consoleSlice';


const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

function ServerConsole(){
    const [consoleInput, setConsoleInput] = useState('');
    const consoleLogs = useSelector(state => state.console.logs)
    const minecraftServerState = useStore(state => state.minecraftServerState);

    const dispatch = useDispatch();

    const handleInputChange = (event) => {
        setConsoleInput(event.target.value);
    }

    const handleEnterPress = (event) => {
        if (event.keyCode === 13) 
            sendCommand(consoleInput)
    }

    const sendCommand = (consoleInput) => {
        const command = JSON.stringify({"command": consoleInput});
        
        api.post('/server/command', command)
            .catch(err => console.log(err));
        
        dispatch(consoleLogAdded([":> " + consoleInput]));
        setConsoleInput('')
    }
    
    return (
        <div className="console">
            <div className="console-output" id="style-2">
              {consoleLogs.map((log, j) => {
                    return <p key={j}>{ log }</p>
                  }
                )
              } 
              <AlwaysScrollToBottom />
            </div>
            <input 
                disabled={minecraftServerState === "SERVER_RUNNING" ? false: true } 
                type="text" 
                id="console-input" 
                name="console-input"
                placeholder="Enter in a command" 
                onChange={handleInputChange} 
                onKeyDown={handleEnterPress} 
                value={consoleInput}>      
            </input>       
        </div>
    )
}

export default ServerConsole;