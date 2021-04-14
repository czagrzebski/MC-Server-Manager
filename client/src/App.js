import './App.css';
import React, { useEffect, useState } from 'react';
import socketio from 'socket.io-client';
import Console from './components/Console/Console';

const ENDPOINT = "http://localhost:3300";

function App() {

  const [consoleOutputList, setConsoleOutputList] = useState([]);

  useEffect(() => {
    const socket = socketio(ENDPOINT);

    socket.on('console', (data) => {
      setConsoleOutputList(consoleOutputList => [...consoleOutputList, data]);
    })

    return () => socket.disconnect(); 
    
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="controls">
          <button>Start Server</button>
          <button>Stop Server</button>
        </div>
        <Console consoleOutputList={consoleOutputList}/>
      </header>
    </div>
  );
}

export default App;
