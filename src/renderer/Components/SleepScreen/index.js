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

        console.log(toggleRef.current);
        console.log(target);
        if (toggleRef.current != target) {
            toggleView();
        }
    }




    return (

        <div style={{ backgroundColor: "black", height: "100%", margin: 0, display: 'flex', justifyContent: 'center' }} onClick={changeView}>
            <div style={{ display: 'flex', flexDirection: "column"}}>
                <div style={{ height: '33%' }} />
                <Clock />
                <Toggle
                    refrence={toggleRef}
                    onChange={onUpdate}
                    style = {{textAlign:'center'}}
                />

            </div>
        </div>
    )
}


export default SleepScreen; 