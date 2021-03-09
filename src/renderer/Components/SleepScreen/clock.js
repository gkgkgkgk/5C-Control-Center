import React, { useState, useEffect } from 'react';
import {getWeather} from '../../HelperFunctions/weather'; 


const Clock = ({ textSize = 7 }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [weather,setWeather] = useState(5); 

    const updateTime = () => {
        setTime(new Date().toLocaleTimeString());
        setTimeout(updateTime, 1000)
    }

    const updateWeather = async ()=>{
        const w = await getWeather(); 
        setWeather(w); 
        setTimeout(updateWeather, 10800000)
    }
    useEffect(() => {

        setTimeout(updateTime, 1000);
        updateWeather(); 
        
        return function cleanup() {
            const killId = setTimeout(() => {
                for (let i = killId; i > 0; i--) clearInterval(i)
            }, 0)
        }

    }, [])

    return (
        <div style={{ color: 'white', textAlign:'center'}}>
            <div style ={{fontSize: `${textSize}em`}}>{time} </div>
            <br />
            It is {weather} degrees in New York City
        </div>
    )
}

export default Clock; 