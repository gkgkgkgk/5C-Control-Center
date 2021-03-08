import React, { useState, useRef } from 'react';
import { remote } from 'electron';
const con = remote.getGlobal("console");
import { isAllLightsOff, toggleAllLights } from '../../HelperFunctions/Lights/lights';
import Toggle from './toggle.js';
import Clock from './clock.js';


const SleepScreen = ({ toggleView }) => {

    const [state, setState] = useState(isAllLightsOff());
    const toggleRef = useRef(null);
    const onUpdate = () => {
        toggleAllLights(!state);
        setState(!state);
    }

    const changeView = ({ target }) => {

        console.log(toggleRef);
        console.log(target);
        console.log(target.className.includes("toggle"))
        if (!target.className.includes("toggle")) {
            toggleView();
        }
    }




    return (

        <div style={{ backgroundColor: "black", height: "100%", margin: 0, display: 'flex', justifyContent: 'center' }} onClick={changeView}>
            <div style={{ display: 'flex', flexDirection: "column" }}>
                <div style={{ height: '33%' }} />
                <Clock />
                <Toggle
                    ref={toggleRef}
                />

            </div>
        </div>
    )
}


export default SleepScreen; 