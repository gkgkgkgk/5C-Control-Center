import React, { useEffect, useState, useRef } from 'react'
import Card from "./card";
import ToggleGroup from "./ToggleGroup";
const devices = require("../../../../env/devices.json"/*"../../../env/devices.json"*/).device_keys.length % 2 !== 0 ? [...(require("../../../../env/devices.json").device_keys), { Name: "", id: null, key: null }] : require("../../../../env/devices.json").device_keys;
const groups = require("../../../../env/groups.json"/*"../../../env/groups.json"*/).groups.length % 2 !== 0 ? [...(require("../../../../env/groups.json").groups), { Name: "", members: [] }] : require("../../../../env/groups.json").groups;

const Groups = ({ active, setActive, isGroup, setIsGroup }) => {

    const [scrolling, setScrolling] = useState(false);
    const [lastPos, setLastPos] = useState(0);
    const scrollBarTop = useRef(null);
    const scrollBarBot = useRef(null);

    const scrollingRef = useRef(scrolling);
    const lastPosRef = useRef(lastPos);

    const updateList = (Name) => {
        if (Name === "") return;
        if (!active.reduce((acc, name) => acc || (name === Name), false))
            setActive([...active, Name]);
        else
            setActive(active.filter((name) => Name !== name));
    }


    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        return function cleanup() {
            window.removeEventListener("mouseup", onMouseUp);
        }
    }, [])

    useEffect(() => {

        window.addEventListener("mousemove", onMouseMove);
        return function cleanup() {
            window.removeEventListener("mousemove", onMouseMove);
        }

    }, []);

    const onMouseDown = e => {
        e.preventDefault();
        // console.log("down")
        setScrolling(true);
        scrollingRef.current = true;
        setLastPos(e.clientX);
        lastPosRef.current = e.clientX
    }

    const onMouseUp = e => {
        e.preventDefault();
        // console.log("up")
        // console.log(scrolling);
        setScrolling(false);
        scrollingRef.current = false;
    }
    const onMouseMove = e => {
        // console.log(scrollingRef.current)
        if (scrollingRef.current) {
            scrollBarTop.current.scrollBy(-1 * (e.clientX - lastPosRef.current), 0)
            scrollBarBot.current.scrollBy(-1 * (e.clientX - lastPosRef.current), 0)
            setLastPos(e.clientX);
            lastPosRef.current = e.clientX;
        }
    }

    const swap = () => { setIsGroup(!isGroup); setActive([]); }

    const buildCheckbox = ({ Name }) => (
        <Card Name={Name} checked={() => (active.reduce((acc, name) => acc || (name === Name), false))} onClick={updateList} />
    );
    const calculateWidth = ()=>(isGroup ? (groups.length / 2 ) * 240 : (devices.length / 2 ) * 240) +110; 
    const formattedWidth = ()=> calculateWidth() > 960 ? "100%": calculateWidth() + "px";

    return (

        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems:"center",
            
        }}>
            <div style={{
            display: "flex",
            overflow: 'hidden',
            height:"200px",
            width: formattedWidth(),
            
        }}>
            <ToggleGroup swap={swap} isGroup={isGroup} />
            <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%",}}>
                <div style={{ display: "flex", fontSize: "1em", overflowX: 'hidden', overflowY: "hidden", width: "100%", height:"50%" }} onMouseDown={onMouseDown} ref={scrollBarTop}>
                    {isGroup ? groups.filter((_, i) => i % 2 === 0).map(buildCheckbox) : devices.filter((_, i) => i % 2 === 0).map(buildCheckbox)}
                </div>
                <div style={{ display: "flex", fontSize: "1em", overflowX: 'hidden', overflowY: "hidden", width: "100%",height:"50%" }} onMouseDown={onMouseDown} ref={scrollBarBot}>
                    {isGroup ? groups.filter((_, i) => i % 2 !== 0).map(buildCheckbox) : devices.filter((_, i) => i % 2 !== 0).map(buildCheckbox)}
                </div>
            </div>
        </div>
        </div>
        
        
    )
}

export default Groups;