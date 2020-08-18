import React, { useState, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import './locationSearch.css';

const LocationSearch = () => {
    const [ input, setInput ] = useState('');

    let history = useHistory();

    const handleInputChange = useCallback((e) => {
        setInput(e.target.value)
        
    }, [])

    const handleFormSubmit = useCallback((e) => {
        const inputWithoutSpaces = input.replace(' ', '_')
        history.push(`/${inputWithoutSpaces}`)
    }, [history, input])

    return(
        <>
            {/* <button onClick={getLocation}>Compartir tu ubicación</button> */}
            
            
            <form onSubmit={handleFormSubmit}>
                <input 
                    type="text" 
                    value={input} 
                    placeholder="¿Dónde estás?" 
                    onChange={handleInputChange}
                />
            </form> 

        </>
    )
}

export default LocationSearch