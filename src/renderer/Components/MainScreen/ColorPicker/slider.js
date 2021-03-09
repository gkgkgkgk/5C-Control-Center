import React, { useState, useEffect } from 'react';


const Slider = ({ drag = 1 }) => {
    const [mousePos, setMousePos] = useState({ x: null, y: null })
    const [startPos, setStartPos] = useState({ x: null, y: null })
    const [change, setChange] = useState(false);
    const [pos, setPos] = useState(179);
    const [lastPos, setLastPos] = useState(179);


    const updateMousePos = ev => {
        setMousePos({ x: ev.clientX, y: ev.clientY });
    };

    const updateMouseUp = ev => {
        setChange(false);
        setLastPos(pos);
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
                p -= 357;
            } else if (p < 0) {
                p += 357
            }

            setPos(p);
        }
    }, [mousePos])

    return (
        <div onMouseDown={mouseDown} style={{
            borderRadius: change ? '5px' : '50%',
            height: "100px",
            background: change ? `repeating-linear-gradient(
            90deg,
            rgba(255, 0, 0, 1) 0px,
            rgba(255, 154, 0, 1) 10%,
            rgba(208, 222, 33, 1) 20%,
            rgba(79, 220, 74, 1) 30%,
            rgba(63, 218, 216, 1) 40%,
            rgba(47, 201, 226, 1) 50%,
            rgba(28, 127, 238, 1) 60%,
            rgba(95, 21, 242, 1) 70%,
            rgba(186, 12, 248, 1) 80%,
            rgba(251, 7, 217, 1) 90%,
            rgba(255, 0, 0, 1) 100%` : 'black', userSelect: 'none',
            textAlign: 'center',
            marginLeft: change ? '-535px' : '-50px',
            left: '50%', position: 'fixed',
            width: change ? "1070px" : "100px",
            transition: 'borderRadius 0.2s, width 0.2s, margin-left 0.2s, height 0.2s, background 0.2s ease-in'
        }}>
            {pos}
        </div>
    )
}

export default Slider;