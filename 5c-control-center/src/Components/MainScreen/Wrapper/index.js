import {useState, useRef, useEffect } from 'react'; 
import Arrow from "./arrow"; 
const styleSheet = {
    container: {
        display: 'flex',
        height: '100%',
        width:"100%"
    },
    small: {
        flexBasis: '1%',
        alignSelf: 'center',
    },
    nested:{
        flexDirection: 'column',
    }
    
}


const Wrapper = ({children,style={}, globalStyle={}, state = {}, setState=console.log})=>{

    const onClick = (side)=>{
        if( !(side in state)) return; 
        setState(state[side]()); 
    }


    return (
        <div style={{...styleSheet.container, ...globalStyle}}>
            <Arrow style={styleSheet.small} direction={"left"} onClick = {()=>onClick("left")}/>
            <div style = {{...styleSheet.nested, ...styleSheet.container}}>
                <Arrow style={styleSheet.small} direction={"up"} onClick = {()=>onClick("up")}/>
                <div style ={{...style,height: "100%"}}>{children}</div>
                <Arrow style={styleSheet.small} direction={"down"} onClick = {()=>onClick("down")}/>
            </div>
            <Arrow style={styleSheet.small} onClick = {()=>onClick("right")}/>
        </div>
    )

}


export default Wrapper; 