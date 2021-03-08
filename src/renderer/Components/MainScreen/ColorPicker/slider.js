import React, { useState, useEffect } from 'react';


const Slider = () => {
    const [mouseClick, setMouseClick] = useState(false);
    const [mousePos, setMousePos] = useState({ x: null, y: null })
    const [startPos, setStartPos] = useState({ x: null, y: null })
    const [change, setChange] = useState(false);
    const [pos, setPos] = useState(179);
    const [lastPos, setLastPos] = useState(179);


    const updateMousePos = ev => {
        setMousePos({ x: ev.clientX, y: ev.clientY });
    };


    useEffect(() => {
        window.addEventListener("mousemove", updateMousePos);
        return () => window.removeEventListener("mousemove", updateMousePos);
    }, []);

    const mouseDown = ev => {
        console.log(pos);
        setChange(true);
        setStartPos({ x: ev.clientX, y: ev.clientY });
    }

    const mouseUp = () => {
        setChange(false);
        setLastPos(pos)
        console.log(pos);
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
        <div onMouseDown={mouseDown} onMouseUp={mouseUp} style={{
            background: `repeating-linear-gradient(
            90deg,
            rgba(255, 0, 0, 1) ${pos * 3}px,
            rgba(255, 154, 0, 1) ${pos * 3 + 171}px,
            rgba(208, 222, 33, 1) ${pos * 3 + 271}px,
            rgba(79, 220, 74, 1) ${pos * 3 + 371}px,
            rgba(63, 218, 216, 1) ${pos * 3 + 471}px,
            rgba(47, 201, 226, 1) ${pos * 3 + 571}px,
            rgba(28, 127, 238, 1) ${pos * 3 + 671}px,
            rgba(95, 21, 242, 1) ${pos * 3 + 771}px,
            rgba(186, 12, 248, 1) ${pos * 3 + 871}px,
            rgba(251, 7, 217, 1) ${pos * 3 + 971}px,
            rgba(255, 0, 0, 1) ${pos * 3 + 1070}px)`, userSelect: 'none', textAlign: 'center', marginLeft: '-535px', left: '50%', position: 'fixed', backgroundColor: "red", width: "1070px"
        }}>
            {pos}
        </div>
    )
}

export default Slider;