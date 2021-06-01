import React, { useEffect, useRef, useState } from 'react';
import './Console.css';
import api from '../../../utils/api';
import useStore from '../../../store';

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

function Console(){
    const [consoleInput, setConsoleInput] = useState('');
    const consoleOutputList = useStore(state => state.consoleOutput)
    const addConsoleOutput = useStore(state => state.addConsoleOutput);


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
        
        //must be a nested array (this is how it is chunked from the server)
        addConsoleOutput([[":> " + consoleInput]]);
        setConsoleInput('')
    }

    return (
        <div className="console">
            <div className="console-output" id="style-2">
                {consoleOutputList.map((logs) => {
                    return logs.map((log, i) => {
                        return <p key={i}>{ log }</p>
                    })
                })}
                <AlwaysScrollToBottom />
            </div>
            <input type="text" id="console-input" name="console-input" placeholder="Enter in a command" onChange={handleInputChange} onKeyDown={handleEnterPress} value={consoleInput}></input>
        </div>
    )
}

export default Console;