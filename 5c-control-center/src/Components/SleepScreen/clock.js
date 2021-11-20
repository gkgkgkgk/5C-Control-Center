import React, { useState, useEffect, useRef } from 'react';
import {getWeather} from '../../HelperFunctions/weather'; 


const Clock = ({ textSize = 7, refreshRef }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString([],{hour: 'numeric', minute: '2-digit'}));
    const [weather,setWeather] = useState(0); 
    const lastUpdate = useRef(0); 
    const [lastUpdateStr,setLastUpdateStr] = useState(0); 

    const updateTime = () => {
        setTime(new Date().toLocaleTimeString([],{hour: 'numeric', minute: '2-digit'}));
        lastUpdate.current++; 
        const strTime = Math.floor(lastUpdate.current / 60); 
        setLastUpdateStr(strTime);
        if (strTime >= 60)
            updateWeather(); 
    }
    

    const updateWeather = async ()=>{
        const {data: {main : {temp}}} = await getWeather(); 
        setWeather(Math.round(((temp-273.15)*(1.8))+32)); 
        lastUpdate.current = 0;  
    }
    useEffect(() => {
        updateWeather();
        let interval = setInterval(updateTime, 1000);
        
        return function cleanup() {
            clearInterval(interval);
        }

    }, [])

    return (
        <div style={{ color: 'white', textAlign:'center'}}>
            <div style ={{fontSize: `${textSize}em`}}>{time} </div>
            <span ref={refreshRef} onClick={()=>updateWeather()} style = {{fontSize: `${textSize/2}em`}}>{weather}°F</span>
        </div>
    )
}

export default Clock; 
