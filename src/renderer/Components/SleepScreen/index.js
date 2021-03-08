import React, { useState } from 'react';
import { remote } from 'electron';
const con = remote.getGlobal("console");
import { isAllLightsOff, toggleAllLights } from '../../HelperFunctions/Lights/lights';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import Clock from './clock.js';

const SleepScreen = ({toggleView}) => {

    const [state, setState] = useState(isAllLightsOff());
    const onUpdate = () => {
        toggleAllLights(!state);
        setState(!state);
    }

    const changeView = ({target})=>{

        console.log(target); 
        console.log(target.className.includes("react-toggle"))
        if(!target.className.includes("react-toggle")){
            toggleView(); 
        }


    }


    return (

        <div style={{ backgroundColor: "black", height: "100%", margin: 0, display: 'flex',justifyContent:'center'}} onClick={changeView}>
            <div style={{width:'33%'}}/>
            <div style={{ display: 'flex', flexDirection: "column" }}>
                <div style={{height:'33%'}} />
                <Clock />
                <Toggle
                    defaultChecked={state}
                    icons={false}
                    onChange={onUpdate}
                    
                />

            </div>
            <div style={{width:'33%'}} />
        </div>
    )
}


export default SleepScreen; 