import React, { useState, useEffect, useRef } from 'react';
import gradient from 'tinygradient';

const g = gradient(['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']).rgb(358);

const Slider = ({ startColor = 179 }) => {
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
        console.log(pos);
        setChange(true);
        setStartPos({ x: ev.clientX, y: ev.clientY });
    }

    useEffect(() => {
        if (change) {
            let d = mousePos.x - startPos.x;
            let p = lastPos + Math.round(d / 3);

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
        <div>
            <div onMouseDown={mouseDown} style={{
                margin: '20px',
                borderRadius: change ? '5px' : '50%',
                height: "100px",
                background: change ? `repeating-linear-gradient(
                90deg,
                #ff0000 ${pos * 3 - 535}px,
                #ff00ff ${pos * 3 - 356}px,
                #0000ff ${pos * 3 - 178}px,
                #00ffff ${pos * 3}px,
                #00ff00 ${pos * 3 + 178}px,
                #ffff00 ${pos * 3 + 356}px,
                #ff0000 ${pos * 3 + 535}px` : color, userSelect: 'none',
                textAlign: 'center',
                marginLeft: change ? '-535px' : '-50px',
                left: '50%', position: 'fixed',
                width: change ? "1071px" : "100px",
                transition: 'borderRadius 0.2s, width 2s, height 0.2s, background 0.2s ease-in'
            }}>
                <img src="../assets/svg/arrow.svg" style={{ marginLeft: '-1.5em', left: '50%', top: '-25px', height: '3em', transform: 'rotate(180deg)', position: 'absolute', display: change ? 'block' : 'none' }}></img>
                <img src="../assets/svg/arrow.svg" style={{ marginLeft: '-1.5em', left: '50%', bottom: '-25px', height: '3em', position: 'absolute', display: change ? 'block' : 'none' }}></img>
            </div>
        </div>
    )
}

export default Slider;