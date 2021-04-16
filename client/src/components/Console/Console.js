import React, { useEffect, useRef } from 'react';
import './Console.css';

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

function Console({ consoleOutputList }){

    return (
        <div className="console">
            {consoleOutputList.map((logs) => {
                return logs.map((log, i) => {
                    return <p key={i}>{ log }</p>
                })
            })}
             <AlwaysScrollToBottom />
        </div>
    )
}

export default Console;