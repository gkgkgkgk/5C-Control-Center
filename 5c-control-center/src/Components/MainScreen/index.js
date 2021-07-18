import React, { useState, useEffect, useRef } from 'react';
import ColorPicker from './ColorPicker';
import Groups from './Groups';
import { changeLights, update } from '../../HelperFunctions/Lights/lights';

const MainScreen = ({ toggleView, timeoutTime = 10000 }) => {
    // const [lastClick, setLastClick] = useState(false);
    let lastClick = useRef(false);
    const [isGroup, setIsGroup] = useState(true);
    const [active, setActive] = useState([]);
    const [hexColor, setHexColor] = useState('001');
    const [hexSat, setHexSat] = useState('3e8');
    const [hexBrightness, setHexBrightness] = useState('3e8');

    const updateClick = () => {
        // console.log("click has run")
        // setLastClick(true);
        lastClick.current = true;
        // console.log(lastClick);
    }
    const timeoutFunction = () => {
        // console.log(lastClick);
        if (lastClick.current) {
            // setLastClick(false);
            lastClick.current = false;
            setTimeout(timeoutFunction, timeoutTime)
        } else
            toggleView();
    }

    useEffect(() => {
        setTimeout(timeoutFunction, timeoutTime);
        window.addEventListener("mousemove", updateClick);
        window.addEventListener("touchmove", updateClick);
        return function cleanup() {
            const killId = setTimeout(() => {
                for (let i = killId; i > 0; i--) clearInterval(i)
            }, 0)
            window.removeEventListener("mousemove",updateClick); 
            window.removeEventListener("touchmove",updateClick); 
        }
    }, [])

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
        }
        // else
        //     changeLights(["Hallway light", "Living Room 1"], false, hexColor, hexSat, hexBrightness);
    }

    return (    
        //filter: 'blur(5px)'
        <div style={{ height: '100%', background: 'linear-gradient(45deg, #1870ed 0, #f18f88 100%)' }}>
            <ColorPicker colorVars={[hexColor, setHexColor]} satVars={[hexSat, setHexSat]} brightnessVars={[hexBrightness, setHexBrightness]} updateLights={updateLights} />
            <Groups active={active} isGroup={isGroup} setActive={setActive} setIsGroup={setIsGroup} />
        </div >
    )
}

export default MainScreen