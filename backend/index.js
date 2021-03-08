const express = require("express");
const TuyAPI = require("tuyapi"); 
const app = express(); 
const port = process.env.PORT == undefined ? 3000:process.env.PORT
const {device_keys} = require("../env/devices.json"); 

const devices = device_keys.map(({Name,id,key})=>{
    let count = 0;
    console.log({id,key}) 
    const device = new TuyAPI({id,key});
    device.find().then(()=>{
        device.connect();
        
    });
    device.on("connected",()=>{
        count++; 
        if(count === devices.length)
            app.listen(port,()=>console.log(`listening on port ${port}`)); 
    }); 
    
    return ({Name,device})
}); 

app.get("/turnOfAllLights",(req,res)=>{

});

