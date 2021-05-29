import React, { useEffect, useState, useContext } from 'react';
import ServerControls from '../../components/ServerControls/ServerControls';
import {SocketContext} from '../../utils/socket';
import api from '../../utils/api';


function HomeDashboard(){
    const [serverState, setServerState] = useState("Stopped");
    const socket = useContext(SocketContext);
    
    useEffect(() => {  
        
        api.get('/server/state')
            .then(resp => handleServerState(resp["data"]))
            .catch(err => console.log(err));

        socket.on('state', (data) => {
          handleServerState(data);
        });   
        
        return () => {
          //unbind event listeners when component is unmounted
          socket.off('state')
        }
      }, []);


    const handleServerState = (state) => {
        switch(state){
            case "SERVER_STARTING":
                setServerState("Starting")
                break;
            case "SERVER_RUNNING":
                setServerState("Running")
                break;
            case "SERVER_STOPPED":
                setServerState("Stopped")
                break;
            default:
                setServerState("Stopped");
        }
    }
    
    return (
        <div>
            <h1>{serverState}</h1>
            <ServerControls />
        </div>
    )
}

export default HomeDashboard;