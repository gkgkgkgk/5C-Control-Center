import {useEffect, useState, useRef } from 'react';
import axios from 'axios';
axios.defaults.baseURL = window.location.href.split(":")[2].slice(0,-1) === "8080" ? 'http://192.168.68.150:8080': 'http://localhost:8080'; 


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
        console.log("logged in"); 
        return true; 


        // axios.post("/login",{code}) // ,accessToken,refershToken,expiresIn
        // .then(
        //     ({data: {accessToken:new_accessToken,refreshToken:new_refreshToken,expiresIn:new_expiresIn}})=>{
        //         window.history.pushState({},null,"/"); 
        //         setAccessToken(new_accessToken);
        //         setRefreshToken(new_refreshToken);
        //         setExpiresIn(new_expiresIn);
        //         setLoggedIn(true);
        //         console.log("logged in successfully");
        //     }
        // )
        // .catch(
        //     err=>{
        //         window.location = '/';
        //     }
        // ) 
        
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
