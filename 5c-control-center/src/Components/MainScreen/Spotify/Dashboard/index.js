import SongSearcher from './songSearcher';
import Player from './player';
import SpotifyWebAPI from "spotify-web-api-node"; 
import Playlists from './playlists';
import {useState, useEffect,useRef} from "react";
import {getDeviceId, transferDevice} from "../../../../HelperFunctions/spotify"; 
const {spotify: {clientId}} = require('../../../../env/keys.json')
const spotifyApi = new SpotifyWebAPI({clientId})

const Dashboard = ({accessToken}) =>{

    const [ready,setReady]= useState(false);
    const [correctDeviceId,setCorrectDeviceId] = useState(false); 
    const [current_device_id,set_current_device_id] = useState(false); 

    const transferDeviceId = async () => {
        set_current_device_id(await transferDevice(spotifyApi)); 
    }


    useEffect(()=>{
        setReady(false);
        if(!accessToken) return; 
        spotifyApi.setAccessToken(accessToken);
        (async ()=>{
            const [flag,device_id,is_active] = await getDeviceId(spotifyApi);
            if(flag) setCorrectDeviceId(device_id); 
            if(is_active) set_current_device_id(device_id); 
            setReady(true);
        })(); 
    },[accessToken]);

    return (
        <div style = {{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
        }}>
            <div style = {{
                display: 'flex',
                height: '100%',
            }}> 
                <div style = {{flexBasis: "80%"}}>
                    <SongSearcher current_device_id={current_device_id} transferDeviceId={transferDeviceId} spotifyApi={spotifyApi} correct_device_id={correctDeviceId} >
                        <Player transferDeviceId={transferDeviceId} spotifyApi={spotifyApi} ready={ready} correct_device_id={correctDeviceId} current_device_id={current_device_id} set_current_device_id={set_current_device_id}  />
                    </SongSearcher> 
                </div>
                <div style = {{flexBasis: "20%"}}><Playlists device_id={correctDeviceId}spotifyApi={spotifyApi} ready={ready}/> </div>
            </div>
        </div>
    );

}

export default Dashboard;