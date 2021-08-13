import {useState,useEffect} from 'react';

const Spotify = ({setBackground})=>{

    useEffect(() => {
        setBackground('white');
    },[])

    return (
        <div style = {{width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
            <div style = {{alignSelf:"center"}} >Spotify </div>
        </div>
    ); 
}

export default Spotify; 