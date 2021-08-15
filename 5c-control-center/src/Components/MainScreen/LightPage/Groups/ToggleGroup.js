import React,{useState, useEffect} from 'react';

const outerStyle = {
    width:"101px",
    height:"100%",
    background: "black",
    margin: "0",
    flex: "2 0 auto"
}

const centerBulb = {
    position:"relative",
    top:"50px",
    left:"25px",
    zIndex:"1",
}

const rightBulb = {
    position:"relative",
    top:"50px",
    left:"-10px",
    transform:"rotate(45deg)",
}

const leftBulb = {
    position:"relative",
    top:"-8px",
    left:"10px",
    transform:"rotate(-45deg)",
}



const ToggleGroup = ({swap, isGroup})=>{
    const [path, setPath] = useState(isGroup ?"../../../assets/svg/lampOn.svg":"../../../assets/svg/lampOff.svg")

    useEffect(()=>{setPath(!isGroup ?"../../../assets/svg/lampOff.svg":"../../../assets/svg/lampOn.svg"); console.log(`The Group is ${isGroup}`)},[isGroup]);
    return (
    <div onClick={swap} style={outerStyle}>
        <img src="../../../assets/svg/lampOn.svg" width="50" height="50" style={centerBulb}/>
        <img src={path} width="50" height="50" style={rightBulb}/>
        <img src={path} width="50" height="50" style={leftBulb}/>
    </div>  
)}

export default ToggleGroup; 