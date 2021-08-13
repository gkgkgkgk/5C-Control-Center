import React, { useState, useEffect } from 'react';
import SleepScreen from './Components/SleepScreen';
import MainScreen from './Components/MainScreen';
import { useAuth } from './HelperFunctions/spotify';
const App = () => {

  const [isSleep, setSleep] = useState(true);
  const [goToSpotify,setGoToSpotify] = useState(false);
  const [accessToken,loginWithCode,loggedIn] = useAuth();

  useEffect(() => {
    let timeout = false ; 
    if(window.location.href.includes("skipSpotify")) {
      (async ()=>{
        await loginWithCode(new URLSearchParams(window.location.search).get("code"));
        setGoToSpotify(true);
        setSleep(false); 
        timeout = setTimeout(() =>{setGoToSpotify(false)},1)
      })(); 
    }
    return () => {if(timeout !== false)clearTimeout(timeout);} 
  }, []);

  const toggleSleep = () => {
    setSleep(!isSleep);
  }


  return (
    <div style={{ height: "100vh", fontFamily: 'Poppins' }}>
      {isSleep ? <SleepScreen toggleView={toggleSleep} /> : <MainScreen toggleView={toggleSleep} spotifyStart={goToSpotify} spotifyAuth={[accessToken,loggedIn]}/>}
    </div>
  )
}

export default App;