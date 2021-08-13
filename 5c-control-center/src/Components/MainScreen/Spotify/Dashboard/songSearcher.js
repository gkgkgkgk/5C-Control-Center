import { useState, useEffect } from "react";
import Player from './player';
const SongSearcher = ({spotifyApi,children})=>{

    const [text,setText] = useState("");
    const [results, setResults] = useState(<ul></ul>); 

    const onClick = async uri=>{
        const {body: {devices : [{id: device_id} = {id: null}] = []}} = await spotifyApi.getMyDevices(); 
        if(!device_id) return; 
        await spotifyApi.addToQueue(uri,{device_id}); 
        spotifyApi.skipToNext(); 
        setText("");
        setResults(<ul></ul>);
    }

    const onChange = async ({target: {value}})=>{
        setText(value);
        if (!value) return; 
        const {body: {tracks: {items}}} = await spotifyApi.searchTracks(value); 
        setResults(<ul>{items.slice(0,5).map(({name,uri,id})=><li onClick={()=>onClick(uri)} key={id}>{name}</li>)}</ul>);
    };

    return (
        <div>
            <input type="text" value={text} onChange={onChange} style ={{width: '95%'}} placeholder="search"/>
            <div style={{display: 'flex', justifyContent: text ? 'start': 'center'}}>
                {text ? results: children}
            </div>
            
        </div>
    )
}


export default SongSearcher; 