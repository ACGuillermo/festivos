import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { DateTime } from 'luxon';

import Counter from './counter/Counter'
import Loading from './Loading/Loading'

const Holiday = () => {
    const [ loading, setLoading ] = useState(true)
    const [ holiday, setHoliday ] = useState(false)
    const [ nextDay, setNextDay ] = useState(false)
    const [ holidayDate, setHolidayDate ] = useState({})
    const [ untilHoliday, setUntilHoliday ] = useState(null)

    let { municipio } = useParams();

    const checkTodayIsHoliday = (diffDayAfterHoliday) => {
        return diffDayAfterHoliday.months === 0 
            && diffDayAfterHoliday.days === 0 
            && diffDayAfterHoliday.hours === 0 
            && diffDayAfterHoliday.minutes === 0 
            && parseInt(diffDayAfterHoliday.seconds) === 0
      }
    
    const checkTodayIsAfterHoliday = (dateNow, dateNextHoliday, diff) => {
        return dateNow > dateNextHoliday 
            && diff.hours > -24 
            && (diff.hours !== 0 
                && diff.minutes !== 0 
                && parseInt(diff.seconds) !== 0)
    }

    const diffDates = (dateNow, dateNextHoliday, dateNextDayAfterHoliday) => {
        // Diff between now & next holiday - now & day after next holiday
        const diff = dateNextHoliday.diff(dateNow, ['months', 'days', 'hours', 'minutes','seconds'])
        const diffDayAfterHoliday = dateNextDayAfterHoliday.diff(dateNow, ['months', 'days', 'hours', 'minutes','seconds'])

        // Check if today is holiday
        if (checkTodayIsAfterHoliday(dateNow, dateNextHoliday, diff)){
            setHoliday(true)
            return diff
        // Check if today is next day after holiday
        }else if(checkTodayIsHoliday(diffDayAfterHoliday)) {
            setHoliday(false)
            // nexDay = true to fetch new holiday date
            setNextDay(true)
            setLoading(true)
            return diff
        // Past
        } else{
            setHoliday(false)
            return diff
        } 
    }

    const diffNowNextHoliday = (dateHoliday) =>{
        // Dates Now - Next holiday - Day after next holiday
        const dateNow =  DateTime.local();
        const dateNextHoliday = DateTime.fromISO(dateHoliday);
        const dateNextDayAfterHoliday = DateTime.fromISO(dateNextHoliday.plus({days: 1}).toISODate())

        return diffDates(dateNow, dateNextHoliday, dateNextDayAfterHoliday)
    
    }

    // Fetch next holiday date. Only when coord or municipio is set and when nextDay changes
    useEffect(() => {
        (async() => {
        const res = await axios.post('http://localhost:1337', {
        date: DateTime.local().toISO(),
        municipio: municipio.replace('_', ' '),
        // coords: coord
        })
        setHolidayDate(res.data.festivo)
        console.log('fetching')
        })()
    }, [ municipio, nextDay])

    const firstRender = useRef(true)
  
    // Time until next holiday || Time left holiday
    useEffect(() => {
        if(firstRender.current){
            firstRender.current = false
            return
        }else if(!holidayDate){
            return
        }
        setTimeout(() => {
            setUntilHoliday(diffNowNextHoliday(holidayDate))
            setLoading(false)
        }, 1000);

    }, [untilHoliday, holidayDate])


    return(
        <>
            {loading 
                ? <Loading />
                : <Counter holiday={holiday} loading={loading} untilHoliday={untilHoliday} />
            }
        </>
    )
}

export default Holiday