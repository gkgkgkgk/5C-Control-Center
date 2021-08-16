import { useState, useEffect,useRef } from "react";

const SearchResult = ({onClick,key,children})=>(
    <li key={key} style={{fontSize:"30px"}} onClick={onClick}>
        {children}
    </li>
)


const SongSearcher = ({spotifyApi,children,correct_device_id: device_id, transferDeviceId, current_device_id})=>{

    const [text,setText] = useState("");
    const [results, setResults] = useState(<ul></ul>); 
    
    

    const onClick = async (uri)=>{
        if (current_device_id === false) await transferDeviceId(); 
        
        spotifyApi.addToQueue(uri); 
        setText("");
        setResults(<ul></ul>);
    }

    const onChange = async ({target: {value}})=>{
        setText(value);
        if (!value) return; 
        const {body: {tracks: {items}}} = await spotifyApi.searchTracks(value); 
        setResults(<ul>{items.slice(0,5).map(({name,uri,id})=><SearchResult onClick={()=>onClick(uri)} key={id}>{name}</SearchResult>)}</ul>);
    };

    return (
        <div>
            <input type="text" value={text} onChange={onChange} style ={{width: '95%', height:"60px", fontSize: '40px'}} placeholder="search"/>
            <div style={{display: 'flex', justifyContent: text ? 'start': 'center'}}>
                {text ? results: children}
            </div>
            
        </div>
    )
}


export default SongSearcher; 