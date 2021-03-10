import React, { useState, useEffect } from 'react';
import MiniSlider from './minislider';
import Modetoggle from './modetoggle';
import Slider from './slider';


const ColorPicker = () => {


    return (
        <div style={{ display: 'flex', flexDirection: "column", height: '100%' }}>

            <div style={{ height: '40%', display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                <div style={{ marginTop: '20px', width: '35%' }}></div>
                <div style={{ marginTop: '20px', width: '15%', textAlign: 'center' }}>
                    <MiniSlider></MiniSlider>
                </div>
                <div style={{ marginTop: '20px', width: '20%' }}>
                    <Slider></Slider>
                </div>
                <div style={{ marginTop: '20px', width: '15%', textAlign: 'center' }}>
                    <MiniSlider></MiniSlider>
                </div>
                <div style={{ marginTop: '20px', width: '35%' }}></div>
            </div >
            <div style={{ height: '20%', display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                <Modetoggle></Modetoggle>
            </div>
            <div style={{ marginTop: '20px', height: '40%', borderStyle: 'solid' }}></div>
        </div>
    )
}

export default ColorPicker;