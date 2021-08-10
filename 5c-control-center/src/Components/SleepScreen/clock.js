import React, { useState, useEffect } from 'react';
import {getWeather} from '../../HelperFunctions/weather'; 


const Clock = ({ textSize = 7 }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString([],{hour: 'numeric', minute: '2-digit'}));
    const [weather,setWeather] = useState(0); 

    const updateTime = () => setTime(new Date().toLocaleTimeString([],{hour: 'numeric', minute: '2-digit'}));
    

    const updateWeather = async ()=>{
        const w = await getWeather(); 
        console.log(w); 
        setWeather(Math.round(((w.data.main.temp-273.15)*(1.8))+32)); 
    }
    useEffect(() => {
        updateWeather();
        let interval1 = setInterval(updateTime, 1000);
        let interval2 = setInterval(updateWeather, 10800000); 
        
        return function cleanup() {
            clearInterval(interval1);
            clearInterval(interval2);
        }

    }, [])

    return (
        <div style={{ color: 'white', textAlign:'center'}}>
            <div style ={{fontSize: `${textSize}em`}}>{time} </div>
            <br />
            It is {weather}°F in New York City
        </div>
    )
}

export default Clock; 