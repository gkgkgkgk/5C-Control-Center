import { useState, useEffect } from 'react';
const {playlists} = require('../../../../env/playlists.json')

const Playlists = ({spotifyApi, ready, device_id}) => {

    const [playlistIcons,setPlaylistsIcons] = useState([]); 

    const onClick = uri =>{
        spotifyApi.play({context_uri: uri,device_id}); 
    }


    useEffect(() => {
        if (!ready) return; 
        (async() => {
            setPlaylistsIcons(await Promise.all(playlists.map(async id=>{
                const {body: {images: [{url: im} = {url:""}],name,uri}} = await spotifyApi.getPlaylist(id);
                return (<img style ={{border: "2px solid black", paddingBottom: "3px"}} height ={150} src={im} alt={name} key={id} onClick={()=>onClick(uri)}/>); 
            })));
        })();
    },[ready])

    return (
        <div style={{display: "flex", flexDirection: "column", overflowY:"scroll"}} > 
            {playlistIcons}
        </div>
    )
}

export default Playlists; 