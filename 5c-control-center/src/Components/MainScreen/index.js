import React, { useState, useEffect, useRef } from 'react';
import LightPage from "./LightPage"; 
import Spotify from './Spotify';
import Wrapper  from "./Wrapper";

const spotifyState = {
    page: <Spotify />,
    right:()=> lightPageState
}

const lightPageState = {
    page: <LightPage />,
    left:()=> spotifyState
}


const MainPage = ({ toggleView, timeoutTime = 10000 })=>{
    const lastClick = useRef(false);
    const [currentPage, setCurrentPage] = useState(lightPageState);

    const updateClick = () => {
        lastClick.current = true;
    }
    const timeoutFunction = () => {
        if (lastClick.current) {
            lastClick.current = false;
        } else
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
    }, [])


    return (
        <Wrapper state={currentPage} setState={setCurrentPage}>
            {currentPage.page}
        </Wrapper>
    )
}


export default MainPage;