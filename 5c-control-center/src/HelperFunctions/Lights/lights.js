import axios from 'axios';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
axios.defaults.baseURL = window.location.href.split(":")[2].slice(0,-1) === "8080" ? 'http://192.168.68.150:8080': 'http://localhost:8080'; 
const socket = io(axios.defaults.baseURL);
let callbacks = [];

socket.on("update", (res) => {
    callbacks.forEach(({ callback }) => {
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
    return axios.get(`/isOneLightOn`);
}

export const toggleAllLights = (value) => {
    if (value) {
        axios.get(`/turnOnAllLights`);
    } else {
        axios.get(`/turnOffAllLights`);
    }
    return true;
}

export const changeLights = async (lights, isGroup, color, sat, brightness) => {
    const newState = color === "white|warm" || color === "off" || color === "white|normal"? color: `0${color}0${sat}0${brightness}` ;
    return axios.post(`/changeLights`, {newState, lights, isGroup});
}