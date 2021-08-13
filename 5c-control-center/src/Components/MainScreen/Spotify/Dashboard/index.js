import SongSearcher from './songSearcher';
import Player from './player';
import SpotifyWebAPI from "spotify-web-api-node"; 
import Playlists from './playlists';
import {useState, useEffect} from "react";
const {spotify: {clientId}} = require('../../../../env/keys.json')
const spotifyApi = new SpotifyWebAPI({clientId})

const Dashboard = ({accessToken}) =>{

    const [ready,setReady]= useState(false);

    useEffect(()=>{
        setReady(false);
        if(!accessToken) return; 
        spotifyApi.setAccessToken(accessToken);
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
                    <SongSearcher spotifyApi={spotifyApi}>
                        <Player spotifyApi={spotifyApi} ready={ready}/>
                    </SongSearcher> 
                </div>
                <div style = {{flexBasis: "20%"}}><Playlists spotifyApi={spotifyApi} ready={ready}/> </div>
            </div>
        </div>
    );

}

export default Dashboard;