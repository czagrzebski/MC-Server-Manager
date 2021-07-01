import React, { useEffect, useRef, useState } from 'react';
import './ServerConsole.css'
import api from '../../../utils/api';
import useStore from '../../../store';


const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

function ServerConsole(){
    const [consoleInput, setConsoleInput] = useState('');
    const consoleOutputList = useStore(state => state.consoleOutput)
    const addConsoleOutput = useStore(state => state.addConsoleOutput);
    const minecraftServerState = useStore(state => state.minecraftServerState);

    const handleInputChange = (event) => {
        setConsoleInput(event.target.value);
    }

    const handleEnterPress = (event) => {
        if (event.keyCode === 13) {
            sendCommand(consoleInput)
        }
    }

    const sendCommand = (consoleInput) => {
        const command = JSON.stringify({"command": consoleInput});
        api.post('/server/command', command)
            .catch(err => console.log(err));
        
        //must be a nested array (this is how it is chunked from the backend server)
        addConsoleOutput([[":> " + consoleInput]]);
        setConsoleInput('')
    }
    
// {backgroundColor: j % 2 === 0? '#383838' : '#3c3c3c'}
    return (
        <div className="console">
            <div className="console-output" id="style-2">
                {consoleOutputList.map((logs, j) => {
                    return (
                        <div key={j}> 
                            {logs.map((log, i) => {
                                return <p key={i}>{ log }</p>
                            })}
                        </div>
                    )
                }
                )
            }
                
                <AlwaysScrollToBottom />
            </div>
            <input disabled={minecraftServerState === "SERVER_RUNNING" ? false: true } type="text" id="console-input" name="console-input" placeholder="Enter in a command" onChange={handleInputChange} onKeyDown={handleEnterPress} value={consoleInput}></input>
           
        </div>
    )
}

export default ServerConsole;