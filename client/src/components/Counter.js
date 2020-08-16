import React from 'react';
import './counter.css';

const Counter = ({holiday, renderTime}) => {
    return(
        <>
            <p className="si-no">{holiday ? 'SI 🥳🎉' : 'NO'}</p>
            {renderTime()}
        </>
    )
}

export default Counter