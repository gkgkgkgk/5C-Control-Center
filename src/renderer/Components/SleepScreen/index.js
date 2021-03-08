import React, { useState } from 'react';
import { remote } from 'electron';
const con = remote.getGlobal("console");
import { isAllLightsOff, toggleAllLights } from '../../HelperFunctions/Lights/lights';
import Toggle from './toggle.js';
import Clock from './clock.js';

const SleepScreen = ({toggleView}) => {

    const [state, setState] = useState(isAllLightsOff());
    const onUpdate = () => {
        toggleAllLights(!state);
        setState(!state);
    }

<<<<<<< Updated upstream
    const changeView = ({target})=>{

        console.log(target); 
        console.log(target.className.includes("react-toggle"))
        if(!target.className.includes("react-toggle")){
            toggleView(); 
        }


=======
    const changeView = (e) => {

        console.log(e);
>>>>>>> Stashed changes
    }


    return (

        <div style={{ backgroundColor: "black", height: "100%", margin: 0, display: 'flex', justifyContent: 'center' }} onClick={changeView}>
            <div style={{ display: 'flex', flexDirection: "column" }}>
                <div style={{ height: '33%' }} />
                <Clock />
                <Toggle
                    defaultChecked={state}
                    icons={false}
                    onChange={onUpdate}

                />

            </div>
        </div>
    )
}


export default SleepScreen; 