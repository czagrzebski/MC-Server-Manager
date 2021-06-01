import React, { useEffect, useState } from 'react';
import ServerControls from '../../components/ServerControls/ServerControls';
import api from '../../utils/api';
import useStore from '../../store';


function HomeDashboard(){
    const [serverState, setServerState] = useState("Stopped");

    useEffect(() => {  
        
        api.get('/server/state')
            .then(resp => handleServerState(resp["data"]))
            .catch(err => console.log(err));

        return(() => {
            unSubServerState() //Unsubscribe from server state updates (memory leak fix)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    //TODO: Implement a way to unsubscribe when the component is unmounted (optimizaiton) 
    const unSubServerState = useStore.subscribe(handleServerState, state => state.minecraftServerState);

    
    return (
        <div>
            <h1>{serverState}</h1>
            <ServerControls />
        </div>
    )
}

export default HomeDashboard;