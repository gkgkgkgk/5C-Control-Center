import React, { useState, useEffect, useRef } from 'react';
import gradient from 'tinygradient';
import Minislider from './minislider';

const g = gradient(['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']).rgb(358);

const Slider = ({ startColor = 179, width = 714, cpp = 2 }) => {
    const [mousePos, setMousePos] = useState({ x: null, y: null })
    const [startPos, setStartPos] = useState({ x: null, y: null })
    const [change, setChange] = useState(false);
    const [pos, setPos] = useState(startColor);
    const [lastPos, setLastPos] = useState(startColor);
    const [color, setColor] = useState(g[startColor]);

    const posRef = React.useRef(pos);

    const updateMousePos = ev => {
        setMousePos({ x: ev.clientX, y: ev.clientY });
    };

    const updateMouseUp = ev => {
        console.log(posRef.current);
        setLastPos(posRef.current);
        setChange(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", updateMousePos);
        window.addEventListener("mouseup", updateMouseUp);

        return () => { window.removeEventListener("mousemove", updateMousePos); window.removeEventListener("mouseup", updateMouseUp); };
    }, []);

    const mouseDown = ev => {
        ev.preventDefault();
        console.log(pos);
        setChange(true);
        setStartPos({ x: ev.clientX, y: ev.clientY });
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
            <div onMouseDown={mouseDown} style={{
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