import React, { useState, useEffect } from 'react';

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

const SongLocation = ({currentTime,totalTime})=>(
    <div style = {{width: "100%"}}>
        <div style = {styleSheet.outer}>
            <div style={styleSheet.inner(currentTime,totalTime)}/>
        </div>
    </div>
)

const Controls = ({play,skip,rewind, isPlay})=>(
    <div style = {{display: "flex",justifyContent: "center"}}>
        <img width={100} src="../../../assets/svg/rewind.svg" onClick={rewind} />
        <img width={100} src={isPlay ? "../../../assets/svg/pause.svg": "../../../assets/svg/play.svg"} onClick={play} />
        <img width={100} src="../../../assets/svg/skip.svg" onClick={skip} />
    </div>
)


const Player = ({spotifyApi, ready, correct_device_id: device_id, transferDeviceId, set_current_device_id, current_device_id})=>{
    const [currentSong,setCurrentSong] = useState(null); 
    const [currentAlbumCover,setCurrentAlbumCover] = useState(null); 
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState("00"); 
    const [currentSongDuration, setCurrentSongDuration] = useState("00");
    const [isPlay, setIsPlay] = useState(false);

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

    const intervalFunction = ()=>{
        spotifyApi.getMyCurrentPlaybackState().then((resp) =>{
            if(!resp?.body) return; 
            if(resp?.body?.device?.id !== device_id){
                setCurrentSong(null); 
                setCurrentSongDuration(0);
                setCurrentPlaybackTime(0); 
                setCurrentAlbumCover(null);
                setIsPlay(false);
                set_current_device_id(false); 
                return; 
            }
            setCurrentSong(resp?.body?.item?.name); 
            setCurrentSongDuration((resp?.body?.item?.duration_ms));
            setCurrentPlaybackTime((resp?.body?.progress_ms)); 
            setCurrentAlbumCover(resp.body?.item.album.images[0].url);
            setIsPlay(resp.body?.is_playing);
        })
        
    }

    
    useEffect(()=>{
        if(!ready) return; 
        intervalFunction(); 
        const interval = setInterval(intervalFunction,1000);
        return(()=>clearInterval(interval))
    },[ready]);

    const convertMsToString = time=>{
        const min = Math.floor(time/60000);
        const sec = (Math.floor((time/60000-min)*60) + "").padStart(2,"0");
        return `${min}:${sec}`; 
    }

    return(
    <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div>
            <p style={{textAlign:"center", fontSize: "40px"}}>{currentSong}</p>
            <div style = {{display: "flex", justifyContent: "center", alignItems: "center"}}><img width={200} src={currentAlbumCover} style ={{ border: "1px solid black"}}/></div>
            
            <div style ={{display:"flex", alignItems: "center", width: "100%"}}>
                <div>{convertMsToString(currentPlaybackTime)}</div>
                <SongLocation currentTime={currentPlaybackTime} totalTime={currentSongDuration} />
                <div>{convertMsToString(currentSongDuration)}</div>
            </div>
            <Controls play={play} skip={skip} rewind={rewind} isPlay={isPlay}/> 
        </div>
    </div>
    )
}

export default Player; 