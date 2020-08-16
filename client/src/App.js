import React, { useState } from 'react';
import './App.css';


import LocationSearch from './components/LocationSearch/LocationSearch'
import Holiday from './components/Holiday/Holiday'




const App = () => {
  
  const [ coord, setCoord ] = useState(null)
  const [ municipio, setMunicipio ] = useState(null)

  const getLocation = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        console.log(pos)
        setCoord({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      })
    }
  }

  const handleFormSubmit = (input) => (e) => {
    e.preventDefault()
    setMunicipio(input)
  }

  return (
    <div className="App">
      <LocationSearch coord={coord} municipio={municipio} handleFormSubmit={handleFormSubmit}/>
      <Holiday coord={coord} municipio={municipio} />
    </div>
  );
}

export default App;
