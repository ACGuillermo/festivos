import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { DateTime } from 'luxon';

import Counter from './components/Counter'




const App = () => {
  const [ loading, setLoading ] = useState(true)
  const [ holiday, setHoliday ] = useState(false)
  const [ holidayDate, setHolidayDate ] = useState({})
  const [ untilHoliday, setUntilHoliday ] = useState(null)
  const [ nextDay, setNextDay ] = useState(false)
  const [ coord, setCoord ] = useState(null)
  const [ input, setInput ] = useState('')
  const [ municipio, setMunicipio ] = useState(null)


  const diffDates = (dateHoliday) =>{
    const dateNow =  DateTime.local();
    console.log(dateNow.toISO())
    const dateNextHoliday = DateTime.fromISO(dateHoliday);
    const dateNextDayAfterHoliday = DateTime.fromISO(dateNextHoliday.plus({days: 1}).toISODate())
    const diff = dateNextHoliday.diff(dateNow, ['months', 'days', 'hours', 'minutes','seconds'])
    const diffDayAfter = dateNextDayAfterHoliday.diff(dateNow, ['months', 'days', 'hours', 'minutes','seconds'])
    console.log(`minutes: ${diffDayAfter.minutes} secons: ${parseInt(diffDayAfter.seconds)}`)
    if (dateNow > dateNextHoliday && diff.hours > -24 && (diff.hours !== 0 && diff.minutes !== 0 && parseInt(diff.seconds) !== 0)){
      setHoliday(true)
      return diff
    }else if(diffDayAfter.hours === 0 && diffDayAfter.minutes === 0 && parseInt(diffDayAfter.seconds) === 0) {
      setHoliday(false)
      setNextDay(true)
      setLoading(true)
      return diff
    } else{
      setHoliday(false)
      return diff
    } 
  }

  const firstRender = useRef(true)

  useEffect(() => {
    if(!coord && !municipio) return
    (async() => {
     const res = await axios.post('http://localhost:1337', {
       date: DateTime.local().toISO(),
       municipio: municipio,
       coords: coord
     })
     setHolidayDate(res.data.festivo)
     console.log('fetching')
    })()
  }, [coord, municipio, nextDay])

  useEffect(() => {
    if(firstRender.current){
      firstRender.current = false
      return
    }else if(!holidayDate){
      return
    }
    setTimeout(() => {
      console.log(holidayDate)
      setUntilHoliday(diffDates(holidayDate))
      setLoading(false)
    }, 1000);

  }, [untilHoliday, holidayDate])

  const renderTime = () => {
    if(!holiday && !loading) return <p>Queda {untilHoliday.months} meses, {untilHoliday.days} días, {untilHoliday.hours} horas, {untilHoliday.minutes} minutos y {parseInt(untilHoliday.seconds)} segundos</p>
    else if(!loading) {
    return <p className="counter">Te quedan {23 + untilHoliday.hours} horas, {59 + untilHoliday.minutes} minutos y {60 + parseInt(untilHoliday.seconds)} segundos de felicidad...</p>
    }
  }

  const renderLocationSearch = () => {
    if(!coord && !municipio) return(
      <>
        {/* <button onClick={getLocation}>Compartir tu ubicación</button> */}
        <form onSubmit={handleFormSubmit}>
          <input type="text" value={input} placeholder="¿Dónde estás?" onChange={handleInputChange}/>
        </form>
      </>
    )
  }


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

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setMunicipio(input)
  }

  return (
    <div className="App">
      {renderLocationSearch()}
      {loading 
        ? (coord || municipio ? <h1>Puede..</h1> : null) 
        : <Counter holiday={holiday} renderTime={renderTime} />
      }
    </div>
  );
}

export default App;
