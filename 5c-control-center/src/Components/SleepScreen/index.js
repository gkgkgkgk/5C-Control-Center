import React, { useState, useRef, useEffect } from 'react';
import { isAllLightsOff, toggleAllLights, update, removeUpdate } from '../../HelperFunctions/Lights/lights';
import Toggle from './toggle.js';
import Clock from './clock.js';


const SleepScreen = ({ toggleView }) => {

    const [state, setState] = useState(false);
    const id = useRef(null);
    const toggleRef = useRef(null);
    const refreshRef = useRef(null);


    const onUpdate = () => {
        toggleAllLights(!state);
        setState(!state);
    }

    useEffect(() => {
        // console.log("use effect for sleep screen is running")
        id.current = update(exStateUpdate);
        window.addEventListener("click", changeView);
        (async () => {
            const data = await isAllLightsOff();
            setState(data.data)
        })()
        return function cleanup() {
            removeUpdate(id.current);
            window.removeEventListener("click", changeView);
        }
    }, []);

    const exStateUpdate = async res => {
        const data = await isAllLightsOff();
        setState(data.data)
    }

    const changeView = ({ target }) => {
        if (toggleRef.current != target && refreshRef.current != target) 
            toggleView();
    }


    return (
        // <Clock />
        <div style={{ backgroundColor: "black", height: "100%", margin: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: "column" }}>
                <div style={{ height: '33%' }} />
                <Clock refreshRef={refreshRef}/>
                <Toggle
                    refrence={toggleRef}
                    onChange={onUpdate}
                    style={{ textAlign: 'center' }}
                    toggle={state}
                />
                <div style={{ height: '33%' }} />

            </div>
        </div>
    )
}


export default SleepScreen;