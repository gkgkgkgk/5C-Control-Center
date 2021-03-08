import React, { useState, useEffect } from 'react';

const MainScreen = ({ toggleView, timeoutTime = 100000 }) => {
    const [lastClick, setLastClick] = useState(false);

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
            Main Screen
        </div>
    )
}

export default MainScreen