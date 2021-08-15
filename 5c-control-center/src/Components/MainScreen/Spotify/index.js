import {useState,useEffect} from 'react';
import Dashboard from "./Dashboard";
const {spotify: {clientId}} = require('../../../env/keys.json');


const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${window.location.href}skipSpotify&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing%20app-remote-control`;
const Login = ()=>{
    return (
        <div style = {{width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
            <a style = {{alignSelf:"center"}} href={AUTH_URL}>Login to Spotify </a>
        </div>
    ); 
}

const Spotify = ({setBackground, spotifyAuth:[accessToken,loggedIn], spotifyStart=false})=>{

    useEffect(() => {
        setBackground('white');
        console.log(loggedIn,spotifyStart);
        console.log(accessToken);
    },[])

    return (loggedIn || spotifyStart ? <Dashboard accessToken={accessToken}/> : <Login />); 
}


export default Spotify; 