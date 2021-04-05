import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-input-slider';

const Minislider = ({ height = 180, initialBrightness = 100 }) => {

    const [state, setState] = useState({ y: initialBrightness });

    useEffect(() => {

    }, [state])


    return (
        <div>
            <Slider styles={{ track: { height: height, backgroundColor: 'white', backgroundColor: 'rgba(255,255,255,0.5)' }, active: { backgroundColor: 'rgba(0,0,255,1.0)', backgroundColor: 'white' } }} axis="y" yreverse ymin={0} ymax={100} y={state.y} onChange={setState} />
        </div>
    )
}

export default Minislider;