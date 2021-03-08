import {remote} from 'electron';
const con = remote.getGlobal("console"); 

export const isAllLightsOff = ()=>{
    con.log("some are on"); 
    return false; 
}

export const toggleAllLights = value=>{
    if (value){
        con.log("turning on all Lights");
    } else {
        con.log("turning off all Lights"); 
    }
    return true; 
}
