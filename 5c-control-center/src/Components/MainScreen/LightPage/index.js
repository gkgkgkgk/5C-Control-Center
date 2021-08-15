import React, { useState, useEffect, useRef } from 'react';
import ColorPicker from './ColorPicker';
import Groups from './Groups';
import { changeLights, update } from '../../../HelperFunctions/Lights/lights';

const LightPage = ({setBackground}) => {
    // const [lastClick, setLastClick] = useState(false);
    
    const [isGroup, setIsGroup] = useState(true);
    const [active, setActive] = useState(["All"]);
    const [hexColor, setHexColor] = useState('001');
    const [hexSat, setHexSat] = useState('3e8');
    const [hexBrightness, setHexBrightness] = useState('3e8');

    useEffect(() => {setBackground('linear-gradient(45deg, #1870ed 0, #f18f88 100%)')},[])


    const updateLights = ({ type, value }) => {
        if (type === "color") {
            changeLights(active, isGroup, value, hexSat, hexBrightness);
            setHexColor(value);
        }
        else if (type === "brightness") {
            changeLights(active, isGroup, hexColor, hexSat, value);
            setHexBrightness(value);
        }
        else if (type === "sat") {
            changeLights(active, isGroup, hexColor, value, hexBrightness);
            setHexSat(value);
        } else if (type === "off"){
            changeLights(active, isGroup, "off");
        } else if (type === "white"){
            if(value === "warm")
                changeLights(active, isGroup, "white|warm");
            else
                changeLights(active, isGroup, "white|normal");
        }
    }

    return (    
        <div style={{ height: '100%' }}>
            <ColorPicker colorVars={[hexColor, setHexColor]} satVars={[hexSat, setHexSat]} brightnessVars={[hexBrightness, setHexBrightness]} updateLights={updateLights} warm={()=>updateLights({type:"white",value:"warm"})} toggle={()=>updateLights({type:"off",value:"off"})} normal={()=>updateLights({type:"white",value:"normal"})} />
            <Groups active={active} isGroup={isGroup} setActive={setActive} setIsGroup={setIsGroup} />
        </div >
    )
}

export default LightPage; 