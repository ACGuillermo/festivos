import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { DateTime } from 'luxon';


const diffDates = (dateHoliday) =>{
  const dateNow = DateTime.local();
  const dateNextHoliday = DateTime.fromISO(dateHoliday) ;
  const diff = dateNextHoliday.diff(dateNow, ['months', 'days', 'hours', 'minutes','seconds'])
  if(diff.days === 0 && diff.hours < 0 && diff.hours > -24) return 'ES FIESTA!!'
  else if(dateNow > dateNextHoliday) return 'Pasado'
  return diff
}

const App = () => {
  const [ loading, setLoading ] = useState(true)
  const [ holidayDate, setHolidayDate ] = useState({})
  const [ untilHoliday, setUntilHoliday ] = useState()

  useEffect(() => {
    axios.get('http://localhost:1337')
      .then((response) => {
        setHolidayDate(response.data)
      })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setUntilHoliday(diffDates(holidayDate.festivo))
      setLoading(false)
    }, 1000);

  }, [untilHoliday, holidayDate])

  const renderTime = () => {
    if(loading) return <h1>spinner</h1>
    return typeof(untilHoliday) === 'string' ? `${untilHoliday}` : `Queda ${untilHoliday.months} meses, ${untilHoliday.days} días, ${untilHoliday.hours} horas, ${untilHoliday.minutes} minutos y ${parseInt(untilHoliday.seconds)} segundos`
  }

  return (
    <div className="App">
      {renderTime()}
    </div>
  );
}

export default App;
