import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-input-slider';

const Minislider = ({ type, value, setValue, updateLights, height = 180, initialBrightness = 100, width = 30}) => {
    //initialBrightness = value;
    const [state, setState] = useState({ y: initialBrightness });
    let yVal = {};


    const onMouseUp = () => {
        updateLights({ type, value: yVal?.y?.toString(16)?.padStart(3, '0') });
    }

    const onChange = val => {
        yVal = val;
        setState(val);
    }

    return (
        <div>
            <Slider styles={{ thumb: {width: 3*width/4, height: 3*width/4}, track: { width, height: height, backgroundColor: 'white', backgroundColor: 'rgba(255,255,255,0.5)' }, active: { backgroundColor: 'rgba(0,0,255,1.0)', backgroundColor: 'white' } }} axis="y" yreverse ymin={0} ymax={1000} y={state.y} onChange={onChange} onDragEnd={onMouseUp} />
        </div>
    )
}

export default Minislider;