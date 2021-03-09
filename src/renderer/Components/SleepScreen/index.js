import React, { useState, useRef, useEffect } from 'react';
import { remote } from 'electron';
const con = remote.getGlobal("console");
import { isAllLightsOff, toggleAllLights, update,removeUpdate } from '../../HelperFunctions/Lights/lights';
import Toggle from './toggle.js';
import Clock from './clock.js';


const SleepScreen = ({ toggleView }) => {

    const [state, setState] = useState(false);
    const [id,setId] = useState(null);  
    const toggleRef = useRef(null);


    const onUpdate = () => {
        console.log(!state)
        toggleAllLights(!state);
        setState(!state);
    }

    useEffect(()=>{
        setId(update(exStateUpdate)); 
        (async()=>{
            const data = await isAllLightsOff(); 
            setState(data.data)
        })()
        return function cleanup(){
            removeUpdate(id); 
        }
    },[]); 

    const exStateUpdate=(res)=>{
        // console.log(res)
        const val = res.reduce((acc,{on})=>{
            // console.log(on);
            // console.log(acc)
            return acc || on
        },false)
        // console.log("outside");
        // console.log(val); 
        // console.log(state);

        setState(val); 
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
                    toggle={state}
                />

            </div>
        </div>
    )
}


export default SleepScreen; 