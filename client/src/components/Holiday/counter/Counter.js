import React from 'react';
import './counter.css';

const Counter = ({holiday, untilHoliday}) => {
    const renderTime = () => {
        if(!holiday) return <p>Queda {untilHoliday.months} meses, {untilHoliday.days} días, {untilHoliday.hours} horas, {untilHoliday.minutes} minutos y {parseInt(untilHoliday.seconds)} segundos</p>
        else {
            return <p className="counter">Te quedan {23 + untilHoliday.hours} horas, {59 + untilHoliday.minutes} minutos y {60 + parseInt(untilHoliday.seconds)} segundos de felicidad...</p>
        }
      }
    return(
        <>
            <p className="si-no">{holiday ? 'SI 🥳🎉' : 'NO'}</p>
            {renderTime()}
        </>
    )
}

export default Counter