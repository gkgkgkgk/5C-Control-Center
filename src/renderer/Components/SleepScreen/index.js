import React, { useState, useRef, useEffect } from 'react';
import { isAllLightsOff, toggleAllLights, update,removeUpdate } from '../../HelperFunctions/Lights/lights';
import Toggle from './toggle.js';
import Clock from './clock.js';


const SleepScreen = ({ toggleView }) => {

    const [state, setState] = useState(false);
    const [id,setId] = useState(null);  
    const toggleRef = useRef(null);


    const onUpdate = () => {
        toggleAllLights(!state);
        setState(!state);
    }

    useEffect(()=>{
        setId(update(exStateUpdate)); 
        window.addEventListener("click",changeView);
        (async()=>{
            const data = await isAllLightsOff(); 
            setState(data.data)
        })()
        return function cleanup(){
            removeUpdate(id); 
        }
    },[]); 

    const exStateUpdate=(res)=>{
        const val = res.reduce((acc,{on})=>{
            return acc || on
        },false)
        setState(val); 
    }

    const changeView = ({ target }) => {
        if (toggleRef.current != target)
            toggleView();
    }


    return (
        // <Clock />
        <div style={{ backgroundColor: "black", height: "100%", margin: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: "column"}}>
                <div style={{ height: '33%' }} />
                <Clock />
                <Toggle
                    refrence={toggleRef}
                    onChange={onUpdate}
                    style = {{textAlign:'center'}}
                    toggle={state}
                />
                <div style={{ height: '33%' }} />

            </div>
        </div>
    )
}


export default SleepScreen; 