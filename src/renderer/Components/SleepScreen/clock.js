import React, { useState,useEffect } from 'react';


const Clock = ({textSize=7}) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const updateTime=()=>{
        setTime(new Date().toLocaleTimeString()); 
        setTimeout(updateTime, 1000);
    }
    useEffect(()=>{setTimeout(updateTime, 1000);},[])
    return (
        <div style={{color:'white', fontSize:`${textSize}em`,}}>
            {time}
        </div>
    )
}

export default Clock; 