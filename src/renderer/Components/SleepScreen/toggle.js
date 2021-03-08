import React, { useState, useRef } from 'react';


const Toggle = ({ refrence, onChange }) => {
    const [toggle, setToggle] = useState(true);
    const [path, setPath] = useState("../assets/svg/lampOn.svg");

    const changeToggle = () => {
        onChange(!toggle);
        setPath(!toggle ? "../assets/svg/lampOn.svg" : "../assets/svg/lampOff.svg");
        setToggle(!toggle);
        console.log(path);
    }

    return (
        <div onClick={changeToggle} className="toggle" >
            <img height="100em" width="100em" src={path} ref={refrence}></img>
        </div>
    )
}

export default Toggle; 