import React, { useState,useEffect } from 'react';


const Clock = ({textSize=7}) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [timeoutV,setTimeoutV] = useState(null); 
    const updateTime=()=>{
        setTime(new Date().toLocaleTimeString()); 
        setTimeoutV(setTimeout(updateTime, 1000));
    }
    useEffect(()=>{
        
        setTimeoutV(setTimeout(updateTime, 1000));
        return function cleanup(){
            const killId = setTimeout(()=>{
                for(let i = killId; i>0; i--) clearInterval(i)
            },0)
        }
    
    },[])
    return (
        <div style={{color:'white', fontSize:`${textSize}em`,}}>
            {time}
        </div>
    )
}

export default Clock; 