const app = require("express")();
const http = require('http').createServer(app);
const io = require("socket.io")(http,{
    cors:{
        origin:"*",
        methods: ["GET","POST"]
    }
}); 
const TuyAPI = require("tuyapi"); 
const cors = require("cors"); 
const port = process.env.PORT == undefined ? 3000:process.env.PORT
const {device_keys} = require("../env/devices.json"); 

app.use(cors()); // change this to not allow everyone eventually 

const devices = device_keys.map(({Name,id,key})=>{
    let count = 0;
    const device = new TuyAPI({id,key});
    device.find().then(()=>{
        device.connect();
    });
    
    device.on("connected",()=>{
        count++; 
        device.on("data",onData); 
        device.on("disconnected",()=>{console.log("I ran the disc")})
        device.on("error",(e)=>{console.log("I ran the error"); console.log(e)})
        if(count === devices.length)
            http.listen(port,()=>console.log(`listening on port ${port}`)); 
    }); 
    
    return ({Name,device})
}); 


const onData = async data=>{

    const res = devices.map(async ({device,Name})=>{
        
        const {dps} = await device.get({schema:true}); 
        return ({
            Name,
            on: dps["20"],
            mode: dps["21"],
            color: dps["24"]
        })
        
    })
    // console.log(await Promise.all(res))
    io.emit("update",await Promise.all(res)); 
}

app.get("/turnOffAllLights",(req,res)=>{
    console.log("I ran"); 
    devices.forEach(({device})=>{
        device.set({ dps: 20, set: false }); 
    });
    res.send(true); 
});
app.get("/turnOnAllLights",(req,res)=>{
    console.log("I ran"); 
    devices.forEach(({device})=>{
        device.set({ dps: 20, set: true }); 
    })
    res.send(true); 
});

app.get("/isOneLightOn",async (req,res)=>{  
    const val = devices.reduce( async (acc,{device})=>{
        const data = await device.get({dps: 20}); 
        return ((await acc) || data);
    },new Promise((resolve,reject)=>resolve(false)))
    // console.log(`I ran with value ${await val}`); 
    res.send((await val)); 
})


