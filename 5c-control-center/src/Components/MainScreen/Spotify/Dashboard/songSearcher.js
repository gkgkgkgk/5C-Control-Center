import { useState, useEffect } from "react";

const SongSearcher = ({spotifyApi,children,correct_device_id: device_id, transferDeviceId, current_device_id})=>{

    const [text,setText] = useState("");
    const [results, setResults] = useState(<ul></ul>); 

    const onClick = async uri=>{
        if (current_device_id === false) await transferDeviceId(); 
        await spotifyApi.addToQueue(uri); 
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
            <input type="text" value={text} onChange={onChange} style ={{width: '95%', height:"30px", fontSize: '20px'}} placeholder="search"/>
            <div style={{display: 'flex', justifyContent: text ? 'start': 'center'}}>
                {text ? results: children}
            </div>
            
        </div>
    )
}


export default SongSearcher; 