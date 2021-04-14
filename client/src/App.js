import './App.css';
import React, { useEffect, useState } from 'react';
import socketio from 'socket.io-client';
import Console from './components/Console/Console';
import Navigation from './components/Navigation/Navigation';

const ENDPOINT = "http://localhost:3300";

let socket;

const sendServerCommand = (message) =>{
    socket.emit('command', message);
}

function App() {

  const [consoleOutputList, setConsoleOutputList] = useState([]);
  const [serverState, setServerState] = useState('Stopped');

  useEffect(() => {
    socket = socketio(ENDPOINT);
    
    socket.on('state', (state) => {
      setServerState(state);
    });

    socket.on('console', (data) => {
      setConsoleOutputList(consoleOutputList => [...consoleOutputList, data]);
    });


    return () => socket.disconnect(); 
    
  }, []);

  return (
    <div className="App">
      <Navigation />
      <h2>{serverState}</h2>

      
        <div className="controls">
          <button onClick={() => sendServerCommand('start')}>Start Server</button>
          <button className="red" onClick={() => sendServerCommand('stop')}>Stop Server</button>
          <button className="blue" onClick={() => setConsoleOutputList([])}>Clear Console</button>
        </div>
        <Console consoleOutputList={consoleOutputList}/>

    </div>
  );
}

export default App;
