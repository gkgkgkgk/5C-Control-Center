import React, { useState, useEffect, useRef } from 'react';
import gradient from 'tinygradient';

const g = gradient(['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']).rgb(358);

const Slider = ({ hexColor, setHexColor, updateLights, startColor = 179, width = 714, cpp = 2 }) => {
    //startColor = g[parseInt('0x' + hexColor, 16)];

    const [mousePos, setMousePos] = useState({ x: null, y: null })
    const [startPos, setStartPos] = useState({ x: null, y: null })
    const [change, setChange] = useState(false);
    const [pos, setPos] = useState(startColor);
    const [lastPos, setLastPos] = useState(startColor);
    const [color, setColor] = useState(g[startColor]);

    const posRef = React.useRef(pos);
    const sliderRef = useRef(); 

    const updateMousePos = ev => {
        //console.log("mouse move"); 
        setMousePos({ x: ev.clientX, y: ev.clientY });
    }

    const updateTouchPos = ev =>{
        ev.preventDefault(); 
        setMousePos({ x: ev.touches[0].clientX, y: ev.touches[0].clientY });
    }

    const updateMouseUp = ev => {

        if (posRef.current > 357) {
            posRef.current -= (358);
        } else if (posRef.current < 0) {
            posRef.current += (358);
        }

        setLastPos(posRef.current);
        setColor(g[posRef.current]);
        setChange(false);
        //setHexColor(posRef.current.toString(16).padStart(3, '0'));
        updateLights({ type: "color", value: posRef.current.toString(16).padStart(3, '0') });
    }

    useEffect(() => {
        window.addEventListener("touchmove", updateTouchPos);
        window.addEventListener("mousemove", updateMousePos);

        return () => { window.removeEventListener("touchmove", updateTouchPos);window.removeEventListener("mousemove", updateMousePos); /*window.removeEventListener("mouseup", updateMouseUp);*/ };
    }, []);

    const mouseDown = ev => {
        ev.preventDefault();
        console.log("mouse down");
        setChange(true);
        setMousePos({ x: ev.clientX, y: ev.clientY });
    }

    const touchStart = ev =>{
        ev.preventDefault(); 
        setChange(true); 
        setStartPos({ x: ev?.touches?.[0]?.clientX, y: ev?.touches?.[0]?.clientY });
    }

    useEffect(() => {
        if (change) {
            let d = mousePos.x - startPos.x;
            let p = lastPos + Math.round(d / cpp);

            if (p > 357) {
                p -= (358);
            } else if (p < 0) {
                p += (358);
            }

            setColor(g[p]);
            setPos(p);
            posRef.current = p;
        }
    }, [mousePos])

    return (
        <div className='sliderbody' style={{ width: '100%', height: '100%' }}>
            <div ref={sliderRef} onMouseDown={mouseDown} onMouseUp={updateMouseUp} onTouchStart={touchStart} onTouchEnd={updateMouseUp} style={{
                boxShadow: '0 0 5px 5px rgba(0,0,0,0.3)',
                borderRadius: change ? '5px' : '50%',
                height: change ? "200px" : "180px",
                background: change ? `repeating-linear-gradient(
                90deg,
                #ff0000 ${pos * cpp - (cpp * 357 / 2)}px,
                #ff00ff ${pos * cpp - (cpp * 357 / 3)}px,
                #0000ff ${pos * cpp - (cpp * 357 / 6)}px,
                #00ffff ${pos * cpp}px,
                #00ff00 ${pos * cpp + (cpp * 357 / 6)}px,
                #ffff00 ${pos * cpp + (cpp * 357 / 3)}px,
                #ff0000 ${pos * cpp + (cpp * 357 / 2)}px` : color, userSelect: 'none',
                textAlign: 'center',
                position: 'fixed',
                left: '50%',
                marginLeft: change ? `-${width / 2}px` : '-90px',
                width: change ? width : "180px", zIndex: 100,
                transition: 'borderRadius 0.2s, width 0.2s, margin-left 0.2s, height 0.2s, background 0.2s ease-in'
            }}>
                <img src="../assets/svg/arrow.svg" style={{ pointerEvents: 'none', marginLeft: '-1.5em', left: '50%', top: '-25px', height: '3em', transform: 'rotate(180deg)', position: 'absolute', display: change ? 'block' : 'none' }}></img>
                <img src="../assets/svg/arrow.svg" style={{ pointerEvents: 'none', marginLeft: '-1.5em', left: '50%', bottom: '-25px', height: '3em', position: 'absolute', display: change ? 'block' : 'none' }}></img>
            </div >
        </div >
    )
}

export default Slider;