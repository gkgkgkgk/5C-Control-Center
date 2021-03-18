import {remote} from 'electron';
const con = remote.getGlobal("console"); 
import axios from 'axios'; 
import {io} from 'socket.io-client'; 
import {v4 as uuidv4} from 'uuid';
const socket = io("http://localhost:3000/"); 
let callbacks = []; 

socket.on("update",(res)=>{
    callbacks.forEach(callback=>{ 
        if (typeof callback === "function") 
            callback(res);
    }); 
})

export const update = (callback)=>{
    callbacks.push({
        id: uuidv4(),
        callback
    })
    return callbacks[callbacks.length-1].id; 
}

export const removeUpdate = uid=>{
    callbacks = callbacks.filter(({id})=>(id !== uid)); 
}

export const isAllLightsOff = async ()=>{
    return axios.get("http://localhost:3000/isOneLightOn"); 
}

export const toggleAllLights = (value)=>{
    if (value){
        con.log("turning on all Lights");
        axios.get("http://localhost:3000/turnOnAllLights")
    } else {
        con.log("turning off all Lights"); 
        axios.get("http://localhost:3000/turnOffAllLights"); 
    }
    return true; 
}

export const changeLights = async (lights, isGroup, newState)=>{
    console.log("hello"); 
    const res = await axios.post("http://localhost:3000/changeLights", {newState,lights,isGroup}); 
}
