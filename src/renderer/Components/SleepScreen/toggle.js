import React, { useState, useRef } from 'react';


const Toggle = ({ ref, onChange }) => {
    const [toggle, setToggle] = useState(true);
    const [path, setPath] = useState("../assets/svg/lampOn.svg");

    const changeToggle = () => {
        setToggle(!toggle);
        setPath(toggle ? "../assets/svg/lampOn.svg" : "../assets/svg/lampOff.svg");
        console.log(path);
    }

    return (
        <div onClick={changeToggle} className="toggle" ref={ref}>
            <img height="100em" width="100em" src={path} ></img>
        </div>
    )
}

export default Toggle; 