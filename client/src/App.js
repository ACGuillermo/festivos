import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

import LocationSearch from './components/LocationSearch/LocationSearch'
import Holiday from './components/Holiday/Holiday'

const App = () => {
  
  const [ coord, setCoord ] = useState(null)
  const [ municipio, setMunicipio ] = useState(null)
  const [ theme, setTheme ] = useState(null)

  const handleChangeTheme = (e) => {
    const newColorScheme = e.matches ? "dark" : "light";
    setTheme(newColorScheme)
  }

  useEffect(()=>{
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.style = 'background: black; color: whitesmoke;'
    }else{
      document.body.style = 'background: whitesmoke; color: black;'
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleChangeTheme)

    return window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change',handleChangeTheme)
  },[theme])

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

  const handleFormSubmit = useCallback((input) => (e) => {
    e.preventDefault()
    setMunicipio(input)
  }, [])

  return (
    <div className="App">
      <LocationSearch coord={coord} municipio={municipio} handleFormSubmit={handleFormSubmit}/>
      <Holiday coord={coord} municipio={municipio} />
    </div>
  );
}

export default App;
