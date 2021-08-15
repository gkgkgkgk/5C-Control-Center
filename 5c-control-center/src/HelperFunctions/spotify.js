import {useEffect, useState, useRef } from 'react';
import axios from 'axios';
axios.defaults.baseURL = window.location.href.split(":")[2].includes("8080") ? 'http://192.168.68.150:8080': 'http://localhost:8080'; 
const {device_id} = require('../env/playlists.json'); 

export const useAuth = ()=>{
    const [accessToken,setAccessToken] = useState();
    const [refreshToken,setRefreshToken] = useState();
    const [expiresIn,setExpiresIn] = useState();
    const [loggedIn,setLoggedIn] = useState(false);

    const loginWithCode = async (code)=>{

        const {data: {accessToken:new_accessToken,refreshToken:new_refreshToken,expiresIn:new_expiresIn}} = await axios.post("/login",{code}).catch(
            err=>{
                window.location = '/';
            }
        ); 
        window.history.pushState({},null,"/"); 
        setAccessToken(new_accessToken);
        setRefreshToken(new_refreshToken);
        setExpiresIn(new_expiresIn);
        setLoggedIn(true);
        return true; 
        
    }

    useEffect(()=>{
        if (!refreshToken || !expiresIn) return; 
        const interval = setInterval(()=>{
            axios.post("/refresh",{refreshToken})
            .then( ({data: {accessToken:new_accessToken,expiresIn:new_expiresIn}})=>{
                setAccessToken(new_accessToken);
                setExpiresIn(new_expiresIn);
                console.log("refreshed")
            }). catch(err=>{
                window.location = "/"
            })
        },(expiresIn - 60)*1000);
        return ()=>clearInterval(interval); 
    },[expiresIn,refreshToken])
    return [accessToken,loginWithCode,loggedIn]; 
}


export const getDeviceId = async (spotifyApi)=>{
    const {body: {devices = []}} = await spotifyApi.getMyDevices(); 
    if (devices.length === 0) return [false,0]; 
    const flag = devices.reduce((acc,{id})=>acc || id === device_id,false);
    return [true,flag ? device_id : devices[0].id];



}
