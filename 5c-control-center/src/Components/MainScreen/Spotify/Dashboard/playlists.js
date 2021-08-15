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
                return (<img width ={50} src={im} alt={name} key={id} onClick={()=>onClick(uri)}/>); 
            })));
        })();
    },[ready])

    return (
        <div style={{display: "flex", flexDirection: "column"}} > 
            {playlistIcons}
        </div>
    )
}

export default Playlists; 