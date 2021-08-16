import React, { useState, useEffect, useRef } from 'react';
import ScrollText from 'react-scroll-text'
const styleSheet = {
    outer: {
        height:"5px", 
        width:"100%",
        border: "1px solid black",
        borderRadius: "2em ",
    },
    inner: (currentTime,totalTime)=>({
        position: "relative",
        top: "-6px",
        left: `${95*(currentTime/totalTime)}%`,
        width: "12px",
        height: "11px",
        borderRadius: "50%",
        border: "3px solid gray",
        backgroundColor: "white",
    })
}

const SongLocationAndControls = ({callback, spotifyApi})=>{
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0); 
    const [currentSongDuration, setCurrentSongDuration] = useState(0);
    const circleRef = useRef(0); 
    const barRef = useRef(0); 

    const onClick = ({clientX: mousePos})=>{
        const width = barRef.current.getBoundingClientRect().width;
        const currentPos = circleRef.current.getBoundingClientRect().x;
        const newSongSpot = ((currentPlaybackTime/currentSongDuration) + ((mousePos - currentPos) / width)) * currentSongDuration;
        spotifyApi.seek(Math.round(newSongSpot)); 
    }

    useEffect(() => {
        callback.current = (duration_ms,progress_ms)=>{
            setCurrentSongDuration(duration_ms);
            setCurrentPlaybackTime(progress_ms); 
        }
    },[])

    const convertMsToString = time=>{
        const min = Math.floor(time/60000);
        const sec = (Math.floor((time/60000-min)*60) + "").padStart(2,"0");
        return `${min}:${sec}`; 
    }

    return (
        <>
            <div>{convertMsToString(currentPlaybackTime)}</div>
            <SongLocation currentTime={currentPlaybackTime} totalTime={currentSongDuration} onClick={onClick} circleRef={circleRef} barRef={barRef}/>
            <div>{convertMsToString(currentSongDuration)}</div>
        </>
    )

}

const SongLocation = ({currentTime,totalTime,onClick, circleRef,barRef})=>(
    <div style = {{width: "100%"}}>
        <div style = {styleSheet.outer} onClick={onClick} ref={barRef}>
            <div style={styleSheet.inner(currentTime,totalTime)} ref={circleRef} />
        </div>
    </div>
)

const Controls = ({callback,spotifyApi,transferDeviceId,current_device_id,device_id})=>{
    const [isPlay, setIsPlay] = useState(false);
    const [shuffleState,setShuffle] = useState(false); 
    const [loopState,setLoop] = useState(false);

    useEffect(()=>{
        callback.current = (pState,sState = false,lState = false)=>{
            setIsPlay(pState);
            setShuffle(sState);
            setLoop(lState);
        }
    },[])


    const play = async ()=>{
        if(current_device_id === false) await transferDeviceId();
        if (isPlay)
            spotifyApi.pause({device_id});
        else
            spotifyApi.play({device_id});
    }

    const skip = async ()=>{
        if(current_device_id === false) await transferDeviceId();
        spotifyApi.skipToNext({device_id});
    }
    const rewind = async ()=>{
        if(current_device_id === false) await transferDeviceId();
        spotifyApi.skipToPrevious({device_id});
    }

    const loop = async ()=>{
        console.log("hello");
        if(current_device_id === false) await transferDeviceId();
        spotifyApi.setRepeat(!loopState ? 'context' : 'off',{device_id});
    }
    const shuffle = async ()=>{
        console.log("run");
        if(current_device_id === false) await transferDeviceId();
        spotifyApi.setShuffle(!shuffleState,{device_id});
    }

    return (
        <div style = {{display: "flex",justifyContent: "center"}}>
            <img width={100} src="../../../assets/svg/shuffle.svg" onClick={shuffle} />
            <img width={100} src="../../../assets/svg/rewind.svg" onClick={rewind} />
            <img width={100} src={isPlay ? "../../../assets/svg/pause.svg": "../../../assets/svg/play.svg"} onClick={play} />
            <img width={100} src="../../../assets/svg/skip.svg" onClick={skip} />
            <img width={100} src="../../../assets/svg/loop.svg" onClick={loop} />
            
        </div>
    )
}




const Player = ({spotifyApi, ready, correct_device_id: device_id, transferDeviceId, set_current_device_id, current_device_id,queue,resetFlag})=>{
    const [currentSong,setCurrentSong] = useState(null); 
    const [currentAlbumCover,setCurrentAlbumCover] = useState(null); 
    const playerCallback = useRef(console.log); 
    const controlsCallback = useRef(console.log); 
    const context = useRef(null); 
    
    const intervalFunction = ()=>{
        spotifyApi.getMyCurrentPlaybackState().then((resp) =>{

            

            if(!resp?.body) return; 
            if(resp?.body?.device?.id !== device_id){
                setCurrentSong(null); 
                playerCallback.current(0,0); 
                setCurrentAlbumCover(null);
                controlsCallback.current(false);
                set_current_device_id(false); 
                return; 
            }
            setCurrentSong(resp?.body?.item?.name);
            playerCallback.current(resp?.body?.item?.duration_ms,resp?.body?.progress_ms); 
            setCurrentAlbumCover(resp.body?.item.album.images[0].url);
            controlsCallback.current(resp.body?.is_playing,resp.body.shuffle_state,resp.body.repeat_state !== 'off');
            queue.current = queue.current.filter(({Name})=>Name !== resp?.body?.item?.name); 
            context.current = resp.body.context.uri; 
        })
        
    }

    
    useEffect(()=>{
        if(!ready) return; 
        intervalFunction(); 
        const interval = setInterval(intervalFunction,1000);
        return(()=>clearInterval(interval))
    },[ready]);

    

    return(
    <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div style = {{width: "100%"}}>

            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <ScrollText style={{ fontSize: "40px", width: "300px", textAlign: 'center'}}>{currentSong}</ScrollText >
            </div>
            
            <div style = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <img width={200} src={currentAlbumCover} style ={{ border: "1px solid black"}}/>
            </div>
            
            <div style ={{display:"flex", alignItems: "center", width: "100%"}}>
                <SongLocationAndControls callback={playerCallback} spotifyApi={spotifyApi}/>
            </div>
            <Controls callback={controlsCallback} transferDeviceId={transferDeviceId} spotifyApi={spotifyApi} current_device_id={current_device_id} device_id={device_id}/> 
        </div>
    </div>
    )
}

export default Player; 