import React, { useState, useEffect } from 'react';
import MiniSlider from './minislider';
import Modetoggle from './modetoggle';
import Slider from './slider';

const ColorPicker = ({ change, colorVars, satVars, brightnessVars, updateLights,warm,toggle,normal }) => {


    return (
        <div style={{ display: 'flex', flexDirection: "column", height: '60%' }}>

            <div style={{ height: '200px', display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                {/* <div style={{ marginTop: '20px', width: '35%' }}></div> */}
                <div style={{  marginTop: '20px', width: '15%', textAlign: 'center' }}>
                    <MiniSlider type="sat" value={satVars[0]} setValue={satVars[1]} updateLights={updateLights}></MiniSlider>
                </div>
                <div style={{  marginTop: '20px', width: '180px' }}>
                    <Slider hexColor={colorVars[0]} setHexColor={colorVars[1]} updateLights={updateLights}></Slider>
                </div>
                <div style={{  marginTop: '20px', width: '15%', textAlign: 'center' }}>
                    <MiniSlider type="brightness" value={brightnessVars[0]} setValue={brightnessVars[1]} updateLights={updateLights}></MiniSlider>
                </div>
                {/* <div style={{  marginTop: '20px', width: '35%' }}></div> */}
            </div >
            <div style={{ /*height: '30%',*/ display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                <Modetoggle warm={warm} toggle={toggle} normal={normal}/>
            </div>
        </div >
    )
}

export default ColorPicker;