import React, { useEffect, useState, useContext } from 'react';
import ServerControls from '../../components/ServerControls/ServerControls';
import {socket, SocketContext} from '../../utils/socket';
import api from '../../utils/api';
import useStore from '../../store';


function HomeDashboard(){
    const [serverState, setServerState] = useState("Stopped");

    useEffect(() => {  
        
        api.get('/server/state')
            .then(resp => handleServerState(resp["data"]))
            .catch(err => console.log(err));

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

    //subscribe to minecraft server state updates 
    useStore.subscribe(handleServerState, state => state.minecraftServerState);
    
    return (
        <div>
            <h1>{serverState}</h1>
            <ServerControls />
        </div>
    )
}

export default HomeDashboard;