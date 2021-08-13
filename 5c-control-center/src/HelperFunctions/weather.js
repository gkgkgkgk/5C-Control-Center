import axios from 'axios';
const keys = require("../env/keys.json");

const path = `https://api.openweathermap.org/data/2.5/weather?zip=10003&appid=${keys.weather}`;


export const getWeather = async () => {
    const d = await axios.get(path);
    return d;
};

