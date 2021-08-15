import React, { useState, useEffect } from 'react';

const lampOnPath = "./assets/svg/lampOn.svg";
const lampOffPath = "./assets/svg/lampOff.svg";

const Toggle = ({ refrence, onChange, style, toggle }) => {
    // const [toggle, setToggle] = useState(inital);
    const [path, setPath] = useState(toggle ? lampOnPath : lampOffPath);

    const changeToggle = () => {
        onChange(!toggle);
        // setPath(!toggle ? lampOnPath : lampOffPath);
        // setToggle(!toggle);
        // console.log(path);
    }
    useEffect(() => {
        setPath(toggle ? lampOnPath : lampOffPath);
    }, [toggle])

    return (
        <div  className="toggle" style={style} >
            <img onClick={changeToggle} height="150em" src={path} ref={refrence}></img>
        </div>
    )
}

export default Toggle;