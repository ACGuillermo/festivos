import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';

import LocationSearch from './components/LocationSearch/LocationSearch'
import Holiday from './components/Holiday/Holiday'

const App = () => {
  const [ theme, setTheme ] = useState(null)

  const handleChangeTheme = (e) => {
    const newColorScheme = e.matches ? "dark" : "light";
    setTheme(newColorScheme)
  }

  // Get browser theme (dark/light) and change web theme.
  useEffect(()=>{
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.style = 'background: black; color: whitesmoke;'
    }else{
      document.body.style = 'background: whitesmoke; color: black;'
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleChangeTheme)

    return window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change',handleChangeTheme)
  },[theme])


  return (
    <div className="App">
      <Router >
        <Switch >
          <Route path="/" exact>
            <LocationSearch />
          </Route>
          <Route path="/:municipio">
            <Holiday />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
