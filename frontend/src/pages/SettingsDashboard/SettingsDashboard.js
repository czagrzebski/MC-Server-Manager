import React, { useEffect, useState } from 'react';
import './SettingsDashboard.css'
import ServerProperty from '../../components/ServerProperty/ServerProperty';
import api from '../../utils/api';


function SettingsDashboard(){
    const [serverProperties, setServerProperties] = useState({});


    useEffect(() => {
        api.get('/server/properties')
            .then(response => setServerProperties(JSON.parse(response.data)))
    
    }, [])



    const saveChanges = () => {
        api.post('/server/update/properties', serverProperties)
            .then(resp => {
                console.log(resp)
            })
            .catch(err => console.log(err))
    }

    const onPropertyChange = (property, value) => {
        setServerProperties(serverProperties => ({...serverProperties, [property]: value}))

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
          
        </div>
    )
}

export default SettingsDashboard;