import React, { useState, useEffect } from 'react';


const Toggle = ({ refrence, onChange, style, toggle }) => {
    // const [toggle, setToggle] = useState(inital);
    const [path, setPath] = useState(toggle ? "../assets/svg/lampOn.svg" : "../assets/svg/lampOff.svg");

    const changeToggle = () => {
        onChange(!toggle);
        // setPath(!toggle ? "../assets/svg/lampOn.svg" : "../assets/svg/lampOff.svg");
        // setToggle(!toggle);
        // console.log(path);
    }
    useEffect(() => {
        setPath(toggle ? "../assets/svg/lampOn.svg" : "../assets/svg/lampOff.svg");
    }, [toggle])

    return (
        <div onClick={changeToggle} className="toggle" style={style} >
            <img height="100em" width="100em" src={path} ref={refrence}></img>
        </div>
    )
}

export default Toggle;