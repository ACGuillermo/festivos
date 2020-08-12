import React, { useState, useEffect } from 'react';
import './App.css';

const { DateTime } = require("luxon");

const diffDates = () =>{
  return DateTime.fromISO('2020-08-15').diff(DateTime.local(), ['months', 'days', 'hours', 'minutes','seconds'])
}

const App = () => {
  const [ holidayDates, setHolidayDates ] = useState([])
  const [ untilHoliday, setUntilHoliday ] = useState(diffDates())
  
  useEffect(() => {
    setTimeout(() => {
      setUntilHoliday(diffDates())
    }, 1000);

  }, [untilHoliday])


  return (
    <div className="App">
      {untilHoliday && `Queda ${untilHoliday.months} meses, ${untilHoliday.days} días, ${untilHoliday.hours} horas, ${untilHoliday.minutes} minutos y ${parseInt(untilHoliday.seconds)} segundos`}
    </div>
  );
}

export default App;
