import React, { useEffect } from 'react';
import ServerControls from '../../components/ServerControls/ServerControls';
import api from '../../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { setServerStatus } from '../../app/minecraftServerSlice';


export function Home(){
    const serverState = useSelector(state => state.minecraftServer.status);
    const dispatch = useDispatch()

    const renderServerState = (serverState) => {
        switch(serverState){
            case "SERVER_STARTING":
                return ("Starting")
            case "SERVER_RUNNING":
                return ("Running")
            default:
                return("Stopped");
        }
    }

    useEffect(() => {  
        api.get('/server/state')
            .then(resp => dispatch(setServerStatus(resp["data"])))
            .catch(err => console.log(err));
      }, [dispatch]);

    return (
        <div>
            <h1>{renderServerState(serverState)}</h1>
            <ServerControls />
        </div>
    )
}

