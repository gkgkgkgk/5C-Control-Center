import React, { useState, useEffect } from 'react';
import MiniSlider from './minislider';
import Modetoggle from './modetoggle';
import Slider from './slider';

const changeLights = (color, brightness, saturation) => {

}

const ColorPicker = () => {


    return (
        <div style={{ display: 'flex', flexDirection: "column", height: '75%' }}>

            <div style={{ height: '40%', display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                <div style={{ marginTop: '20px', width: '35%' }}></div>
                <div style={{ marginTop: '20px', width: '15%', textAlign: 'center' }}>
                    <MiniSlider change={changeLights}></MiniSlider>
                </div>
                <div style={{ marginTop: '20px', width: '20%' }}>
                    <Slider change={changeLights}></Slider>
                </div>
                <div style={{ marginTop: '20px', width: '15%', textAlign: 'center' }}>
                    <MiniSlider change={changeLights}></MiniSlider>
                </div>
                <div style={{ marginTop: '20px', width: '35%' }}></div>
            </div >
            <div style={{ height: '20%', display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                <Modetoggle></Modetoggle>
            </div>
        </div>
    )
}

export default ColorPicker;