import React, { useState, useEffect } from 'react';


const Toggle = () => {
    const [toggle, setToggle] = useState(true);
    const [path, setPath] = useState("../assets/svg/lampOn.svg");

    const changeToggle = () => {
        setToggle(!toggle);
        setPath(toggle ? "../assets/svg/lampOn.svg" : "../assets/svg/lampOff.svg");
        console.log(path);
    }

    return (
        <div onClick={changeToggle}>
            <img height="100em" width="100em" src={path} ></img>
        </div>
    )
}

export default Toggle; 