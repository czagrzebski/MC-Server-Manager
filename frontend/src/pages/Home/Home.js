import React, { useEffect, useState } from 'react';
import ServerControls from '../../components/ServerControls/ServerControls';
import api from '../../utils/api';
import useStore from '../../store';


export function Home(){
    const [serverState, setServerState] = useState("Stopped");

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

    useEffect(() => {  
        
        api.get('/server/state')
            .then(resp => handleServerState(resp["data"]))
            .catch(err => console.log(err));

            const unSubServerState = useStore.subscribe(handleServerState, state => state.minecraftServerState);
        // eslint-disable-next-line react-hooks/exhaustive-deps

        return(() => {
            unSubServerState()
        })
      }, []);

    return (
        <div>
            <h1>{serverState}</h1>
            <ServerControls />
        </div>
    )
}

