import React, { useState } from 'react';
import './Console.css';

function Console({ consoleOutputList }){

    return (
        <div className="console">
            {consoleOutputList.map((log, i) => {
                return <p key={i}>{ log }</p>
            })}
        </div>
    )
}

export default Console;