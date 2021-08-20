import React, { useState, useEffect } from 'react';
import SleepScreen from './Components/SleepScreen';
import MainScreen from './Components/MainScreen';
import { useAuth } from './HelperFunctions/spotify';
const App = () => {

  const [isSleep, setSleep] = useState(true);
  const [goToSpotify,setGoToSpotify] = useState(false);
  const [accessToken,loginWithCode,loggedIn] = useAuth();

  useEffect(() => {
    let timeout = false; // puts timeout to the correct scope;  
    if(window.location.href.includes("skipSpotify")) {  // if the user just logged into spotify 
      (async ()=>{
        await loginWithCode(new URLSearchParams(window.location.search).get("code")); // authenticate the user
        setGoToSpotify(true); // set the flag to true making us skip to the spotify screen
        setSleep(false); // set the sleep flag to false not putting us in the sleep mode
        timeout = setTimeout(() =>{setGoToSpotify(false)},1); // sets everthing back to normal for next time 
      })(); 
    }
    return () => {if(timeout !== false)clearTimeout(timeout);} 
  }, []);

  const toggleSleep = () => {
    setSleep(!isSleep);
  }


  return (
    <div style={{ height: "100vh", fontFamily: 'Poppins',overflow: "hidden" }}>
      {isSleep ? <SleepScreen toggleView={toggleSleep} /> : <MainScreen toggleView={toggleSleep} spotifyStart={goToSpotify} spotifyAuth={[accessToken,loggedIn]}/>}
    </div>
  )
}

export default App;