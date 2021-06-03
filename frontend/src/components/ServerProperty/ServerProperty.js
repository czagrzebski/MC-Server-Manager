import React from 'react';
import './ServerProperty.css'

function ServerProperty({property, value, onPropertyChange}){
    
    const handleServerPropertyChange = (event) => {
        onPropertyChange(property, event.target.value)
    }
    
   

    return (
        <div className="server-property">
            <h3>{property}</h3>
            <input onChange={handleServerPropertyChange} value={value}></input>
        </div>
    )
}

export default ServerProperty;