import React, { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';
import Groups from './Groups';

const MainScreen = ({ toggleView, timeoutTime = 10000 }) => {
    // const [lastClick, setLastClick] = useState(false);
    let lastClick = false; 
    const [isGroup,setIsGroup]= useState(true);
    const [active,setActive] = useState([]); 

    const updateClick = () => {
        console.log("click has run")
        // setLastClick(true);
        lastClick = true;
        console.log(lastClick); 
    }
    const timeoutFunction = () => {
        console.log(lastClick); 
        if (lastClick) {
            // setLastClick(false);
            lastClick = false;
            setTimeout(timeoutFunction, timeoutTime)
        } else
            toggleView();
    }

    useEffect(() => {
        setTimeout(timeoutFunction, timeoutTime);
        window.addEventListener("click",updateClick);
        return function cleanup() {
            const killId = setTimeout(() => {
                for (let i = killId; i > 0; i--) clearInterval(i)
            }, 0)
        }
    }, [])

    return (
        //filter: 'blur(5px)'
        <div  style={{ height: '100%', background: 'linear-gradient(45deg, #1870ed 0, #f18f88 100%)' }}>
            <ColorPicker />
            <Groups active={active} isGroup={isGroup} setActive={setActive} setIsGroup={setIsGroup}/>
      </div>
    )
}

export default MainScreen