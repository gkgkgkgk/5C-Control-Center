import React, { useState, useEffect, useRef } from 'react';
import LightPage from "./LightPage"; 
import Spotify from './Spotify';
import Wrapper  from "./Wrapper";




const MainPage = ({ toggleView, timeoutTime = 10000 })=>{

    const [background, setBackground] = useState("white");
    const spotifyState = {
        page: <Spotify setBackground={setBackground}/>,
        right:()=> lightPageState
    }
    
    const lightPageState = {
        page: <LightPage setBackground={setBackground}/>,
        left:()=> spotifyState
    }
    const [currentPage, setCurrentPage] = useState(lightPageState);
    
    const lastClick = useRef(false);

    const updateClick = () => {
        lastClick.current = true;
    }
    const timeoutFunction = () => {
        if (lastClick.current)
            lastClick.current = false;
        else
            toggleView();
    }

    useEffect(() => {
        const interval = setInterval(timeoutFunction, timeoutTime);
        window.addEventListener("mousemove", updateClick);
        window.addEventListener("touchmove", updateClick);
        return function cleanup() {
            clearInterval(interval);
            window.removeEventListener("mousemove",updateClick); 
            window.removeEventListener("touchmove",updateClick); 
        }
    }, []);


    return (
        <Wrapper state={currentPage} setState={setCurrentPage} globalStyle={{background}}>
            {currentPage.page}
        </Wrapper>
    )
}


export default MainPage;