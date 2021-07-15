import axios from 'axios';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
const socket = io("http://localhost:8080/");
let callbacks = [];

socket.on("update", (res) => {
    // console.log("update recived")
    // console.log(callbacks)
    callbacks.forEach(({ callback }) => {
        // console.log(callback)
        // if (typeof callback === "function") 
        callback(res);
    });
})

export const update = (callback) => {
    // console.log("funtion added");
    callbacks.push({
        id: uuidv4(),
        callback
    })
    return callbacks[callbacks.length - 1].id;
}

export const removeUpdate = uid => {
    callbacks = callbacks.filter(({ id }) => (id !== uid));
}

export const isAllLightsOff = async () => {
    return axios.get("http://localhost:8080/isOneLightOn");
}

export const toggleAllLights = (value) => {
    if (value) {
        axios.get("http://localhost:8080/turnOnAllLights")
    } else {
        axios.get("http://localhost:8080/turnOffAllLights");
    }
    return true;
}

export const changeLights = async (lights, isGroup, color, sat, brightness) => {
    let newState = `0${color}0${sat}0${brightness}`;

    const res = await axios.post("http://localhost:8080/changeLights", { newState, lights, isGroup });
}