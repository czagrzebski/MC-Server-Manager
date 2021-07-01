import React, { useEffect, useState } from 'react';
import './Settings.css'
import ServerProperty from '../../components/ServerProperty/ServerProperty';
import api from '../../utils/api';
import Notification from '../../components/Notification/Notification';


export function Settings() {
    const [serverProperties, setServerProperties] = useState({});
    const [status, setStatusBase] = React.useState("");

    useEffect(() => {
        api.get('/server/properties')
            .then(response => {
                setServerProperties(JSON.parse(response.data))
            })
            .catch(err => {
                if (err.response) {
                    setStatusBase({
                        msg: err.response.data,
                        date: new Date(),
                        severity: "success"
                    });
                }
            })
    }, [])

    const saveChanges = () => {
        api.post('/server/update/properties', serverProperties)
            .then(response => {
                setStatusBase({
                    msg: response.data,
                    date: new Date(),
                    severity: "success"
                });
            })
            .catch(err => {
                if (err.response) {
                    setStatusBase({
                        msg: err.response.data,
                        date: new Date(),
                        severity: "error"
                    });
                }
            })
    }

    const onPropertyChange = (property, value) => {
        setServerProperties(serverProperties => ({
            ...serverProperties,
            [property]: value
        }))
    }

    return(
        <div>
            <h1>Settings</h1>
            <button onClick={() => saveChanges()}>Save Settings</button>
            <div className="grid-container">
                {Object.keys(serverProperties).map((property, key) => {
                    return <ServerProperty key={key} property={property} value={serverProperties[property]} onPropertyChange={onPropertyChange} />
                })}  
            </div>
            {status ? <Notification key={status.date} msg={status.msg} severity={status.severity}/> : null}
        </div>
    )
}
