import { useState, useEffect,useRef } from 'react';
const {playlists} = require('../../../../env/playlists.json')

const Playlists = ({spotifyApi, ready, device_id}) => {

    const [playlistIcons,setPlaylistsIcons] = useState([]); 
    const [lastPos, setLastPos] = useState(0);
    const [scrolling, setScrolling] = useState(false);
    const scrollBar = useRef(null);
    const scrollingRef = useRef(scrolling);
    const lastPosRef = useRef(lastPos);

    const onClick = uri =>{
        if(!scrollingRef.current && !scrolling)
        spotifyApi.play({context_uri: uri,device_id}); 
    }
    const onMouseDown = e => {
        e.preventDefault();
        console.log("down")
        setScrolling(true);
        scrollingRef.current = true;
        setLastPos(e.clientY);
        lastPosRef.current = e.clientY
    }

    const onTouchStart = e =>{
        e.preventDefault();
        console.log("down")
        setScrolling(true);
        scrollingRef.current = true;
        setLastPos(e.touches[0].clientY);
        lastPosRef.current = e.touches[0].clientY
    }

    useEffect(() => {

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchend", onMouseUp);

        return function cleanup() {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchend", onMouseUp);
        }

    }, []);


    useEffect(() => {
        if (!ready) return; 
        (async() => {
            setPlaylistsIcons(await Promise.all(playlists.map(async id=>{
                const {body: {images: [{url: im} = {url:""}],name,uri}} = await spotifyApi.getPlaylist(id);
                return (<img style ={{border: "2px solid black", paddingBottom: "3px"}} height ={150} src={im} alt={name} key={id} onClick={()=>onClick(uri)}/>); 
            })));
        })();
    },[ready])

    const onMouseUp = e => {
        e.preventDefault();
        console.log("up")
        // console.log(scrolling);
        setScrolling(false);
        scrollingRef.current = false;
    }


    const onMouseMove = e => {
        // console.log(scrollingRef.current)
        if (scrollingRef.current) {
            scrollBar.current.scrollBy(0,-1 * (e.clientY - lastPosRef.current))
            setLastPos(e.clientY);
            lastPosRef.current = e.clientY;
        }
    }

    const onTouchMove = e => {
        if (scrollingRef.current) {
            scrollBar.current.scrollBy(0,-1 * (e.touches[0].clientY - lastPosRef.current))
            setLastPos(e.touches[0].clientY);
            lastPosRef.current = e.touches[0].clientY;
        }
    }

    return (
        <div style={{display: "flex", flexDirection: "column", overflowY: "hidden", overflowX:"hidden", height: "500px"}} onMouseDown={onMouseDown} onTouchStart={onTouchStart} ref={scrollBar} > 
            {playlistIcons}
        </div>
    )
}

export default Playlists; 