import React, { useState } from 'react';
import './locationSearch.css';

const LocationSearch = ({coord, municipio, handleFormSubmit}) => {
    const [ input, setInput ] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }
    return(
        <>
            {/* <button onClick={getLocation}>Compartir tu ubicación</button> */}
            {!coord && !municipio 
            
                ?<form onSubmit={handleFormSubmit(input)}>
                    <input type="text" value={input} placeholder="¿Dónde estás?" onChange={handleInputChange}/>
                </form>

                : null 
            }
        </>
    )
}

export default LocationSearch