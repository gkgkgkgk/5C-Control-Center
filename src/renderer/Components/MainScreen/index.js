import React, { useState, useEffect } from 'react';
import Groups from './Groups';

const MainScreen = ({ toggleView, timeoutTime = 100000 }) => {
    const [lastClick, setLastClick] = useState(false);

    const [active,setActive] = useState([]); 

    const updateClick = () => {
        setLastClick(true);
    }
    const timeoutFunction = () => {
        if (lastClick) {
            setLastClick(false);
            setTimeout(timeoutFunction, timeoutTime)
        } else
            toggleView();
    }

    useEffect(() => {
        setTimeout(timeoutFunction, timeoutTime);
        return function cleanup() {
            const killId = setTimeout(() => {
                for (let i = killId; i > 0; i--) clearInterval(i)
            }, 0)
        }
    }, [])

    return (
        <div onClick={updateClick}>
            <Groups active={active} setActive={setActive}/>
        </div>
    )
}

export default MainScreen