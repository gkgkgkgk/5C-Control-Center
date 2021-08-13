import React, { useState, useEffect, useRef } from 'react';

const styleSheet = {
    circle:(color)=>({
        width: '50px',
        height: '50px',
        borderRadius: '50px',
        border: '2px solid black',
        backgroundColor: color
    })
}


const Modetoggle = ({warm,toggle,normal}) => {

    return (
        <div style = {{display: 'flex', marginTop:"50px"}}>
            <div style = {styleSheet.circle('orange')} onClick={warm} />
            <div style = {styleSheet.circle('green')} onClick={toggle} />
            <div style = {styleSheet.circle('white')} onClick={normal} />
        </div>
    )
}

export default Modetoggle;