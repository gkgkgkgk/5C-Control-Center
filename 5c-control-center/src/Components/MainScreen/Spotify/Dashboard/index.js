import SongSearcher from './songSearcher';
import Player from './player';
import SpotifyWebAPI from "spotify-web-api-node"; 
import Playlists from './playlists';
import {useState, useEffect} from "react";
const {spotify: {clientId}} = require('../../../../env/keys.json')
const spotifyApi = new SpotifyWebAPI({clientId})

const Dashboard = ({accessToken}) =>{

    const [ready,setReady]= useState(false);
    const [deviceId,setDeviceId] = useState(false); 

    useEffect(()=>{
        setReady(false);
        if(!accessToken) return; 
        spotifyApi.setAccessToken(accessToken);
        const [flag,device_id] = await getDeviceId(spotifyApi);
        if(flag) setDeviceId(device_id); 
        setReady(true);
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
            }}> 
                <div style = {{flexBasis: "80%"}}>
                    <SongSearcher spotifyApi={spotifyApi} device_id={deviceId}>
                        <Player spotifyApi={spotifyApi} ready={ready} device_id={deviceId}/>
                    </SongSearcher> 
                </div>
                <div style = {{flexBasis: "20%"}}><Playlists device_id={deviceId}spotifyApi={spotifyApi} ready={ready}/> </div>
            </div>
        </div>
    );

}

export default Dashboard;