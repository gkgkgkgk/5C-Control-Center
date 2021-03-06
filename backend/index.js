const express = require('express')
const app = express();
const SpotifyWebAPI = require("spotify-web-api-node"); 
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const TuyAPI = require("tuyapi");
const cors = require("cors");
const port = process.env.PORT == undefined ? 8080 : process.env.PORT
const { device_keys } = require("../env/devices.json");
const { groups } = require("../env/groups.json");
const { spotify } = require("../env/keys.json");

app.use(express.static(__dirname + '/build'));
app.use(cors()); // change this to not allow everyone eventually 
app.use(bodyParser.json());

let connectedDevices = [];
let disconnectedDevices = [];
let flag = false; 


const makeStatus = dps => ({
    on: dps?.["20"],
    mode: dps?.["21"],
    brightnessWhite: dps?.["22"],
    warmth: dps?.["23"],
    color: dps?.["24"],
});

const getDevices = async () => {
    const devices = device_keys.map(async ({ Name, id, key }) => {
        const device = new TuyAPI({ id, key });
        console.log("connecting " + Name);
        await device.find().catch(e => { console.error(`Error with ${Name}`) });
        await device.connect();
        const status = makeStatus((await device.get({ schema: true })).dps)
        device.on('disconnected', () => onDisconnected(Name, device));
        device.on('error', e => onError(e, Name, device));
        // device.on('data', (data) => onData(data, Name, device));
        device.on('dp-refresh', (data) => onData(data, Name, device));
        return ({ Name, device, status  })
    });
    connectedDevices = await Promise.all(devices);
}

getDevices();

const connectAllDisconnected = async () => {
    if(disconnectedDevices.length === 0) {
        timeout = setTimeout(connectAllDisconnected, 10000);
        return;
    }
    const disconnectedNames = disconnectedDevices.map(({Name})=>Name); 
    const disconnectedKeys = device_keys.filter(({Name})=>disconnectedNames.includes(Name));
    
    for(let i = 0; i<disconnectedKeys.length; i++){
        const { Name, id, key } = disconnectedKeys[i];
        const device = new TuyAPI({ id, key });
        console.log("reconnecting " + Name);
        let error = false; 
        await device.find().catch(e => { console.error(`Error with ${Name}`); error = true});
        if(error) continue;
        await device.connect();
        const status = makeStatus((await device.get({ schema: true })).dps)
        device.on('disconnected', () => onDisconnected(Name, device));
        device.on('error', e => onError(e, Name, device));
        device.on('dp-refresh', (data) => onData(data, Name, device));

        connectedDevices = [...connectedDevices.filter(({ Name: currentName }) => Name !== currentName), { Name, device, status  }];
        disconnectedDevices = disconnectedDevices.filter(({ Name: currentName }) => Name !== currentName);
        if(i === disconnectedKeys.length - 1)
            timeout = setTimeout(connectAllDisconnected, 10000);
    }
    

}

let timeout = setTimeout(connectAllDisconnected, 10000);

const onError = (e, Name, device) => {
    if(device.isConnected()) return; 
    connectedDevices = connectedDevices.filter(({ Name: currentName }) => Name !== currentName);
    disconnectedDevices = [...disconnectedDevices.filter(({ Name: currentName }) => Name !== currentName), { device, Name }];
}

const onDisconnected = (Name, device) => {
    connectedDevices = connectedDevices.filter(({ Name: currentName }) => Name !== currentName);
    disconnectedDevices = [...disconnectedDevices.filter(({ Name: currentName }) => Name !== currentName), { device, Name }];
}

const onData = ({ dps: data }, Name, device) => {

    status = connectedDevices.find(({ Name: currentName }) => Name === currentName)?.status;

    if( !("20" in data) && status) data["20"] = status.on; 
    if( !("21" in data) && status) data["21"] = status.mode; 
    if( !("22" in data) && status) data["22"] = status.brightnessWhite; 
    if( !("23" in data) && status) data["23"] = status.warmth; 
    if( !("24" in data) && status) data["24"] = status.color; 

    // console.log(data); 

    const newStatus = makeStatus(data);
    connectedDevices = connectedDevices.map(({ Name: currentName, device: currentDevice, status }) => Name !== currentName ? { Name: currentName, device: currentDevice, status } : { Name, device, status: newStatus })
    console.log("running onData");
    io.emit("update", { Name, ...newStatus });
}

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/build/index.html');
})

app.get('/skipSpotify', (req, res)=> {
    res.sendFile(__dirname + '/build/index.html');
})

const doTurnOff = () => {
    connectedDevices.forEach(({ device }, i) => {
        device.set({ dps: 20, set: false });
    });
}
app.get("/turnOffAllLights", async (req, res) => {

    doTurnOff();
    if (disconnectedDevices.length > 0) {
        await connectAllDisconnected();
        doTurnOff();
    }
    res.send(true);
});

const doTurnOn = () => {
    connectedDevices.forEach(({ device, Name }, i) => {
        console.log(`turning on ${Name}`);
        device.set({ dps: 20, set: true });
    })
}

app.get("/turnOnAllLights", async (req, res) => {

    
    doTurnOn();
    if (disconnectedDevices.length > 0) {
        await connectAllDisconnected();
        doTurnOn();
    }

    res.send(true);
});

app.get("/isOneLightOn", async (req, res) => {
    if (disconnectedDevices.length > 0) await connectAllDisconnected();
    const val = connectedDevices.reduce((acc, { status: { on } }) => ((acc) || on), false);
    // console.log(`I ran with value ${await val}`);
    res.send((await val));
});

app.get("/getAllStatus", async (req, res) => {
    if (disconnectedDevices.length > 0) await connectAllDisconnected();
    res.send(connectedDevices.map(({ Name, status }) => ({ Name, status })))
});

const changeLights = (lghts,newState,isGroup,original) => {
    const devicesToUpdate = connectedDevices.filter(({ Name }) => lghts.includes(Name));
    if(newState === "off"){
        let check = devicesToUpdate; 
        if(isGroup)
            check = connectedDevices.filter(( {Name} ) => original.includes(Name));
        newState = check.reduce((acc,{status})=>{
            if (status.on) {
                acc.on++; 
                return acc;
            }
            acc.off++; 
            return acc;
        },{on:0,off:0});
        if (newState.on > newState.off) newState = "off";
        else newState = "on";
    }
    devicesToUpdate.forEach(({ device },i) => {
        if (newState === "white|warm") {
            // need to check for warmth and other parameters in the setting and newState
            device.set({
                multiple: true,
                data: {
                    "20": true,
                    "21": "white",
                    "22": 1000,
                    "23": 0,
                }
            });

        } else if (newState === "white|normal") { 
            device.set({
                multiple: true,
                data: {
                    "20": true,
                    "21": "white",
                    "22": 1000,
                    "23": 500,
                }
            });
        }
        
        else if (newState === "off")
            device.set({ dps: 20, set: false });
        else if (newState === "on")
            device.set({ dps: 20, set: true });
        else {
            device.set({
                multiple: true,
                data: {
                    "20": true,
                    "21": "colour",
                    "24": newState
                }
            });
        }
    });
}

app.post("/changeLights", async (req, res) => {
    const isGroup = req.body.isGroup;
    const lightvals = req.body.lights.includes("All") ?  groups.filter(({ Name }) => Name !== "All"): groups.filter(({ Name }) => req.body.lights.includes(Name)); 
    const lights = isGroup ? lightvals.reduce((acc, { members }) => ([...acc, ...members.filter(name => !acc.includes(name))]), []) : lightvals;
    const firstFromEachGroup = isGroup ? lightvals.reduce((acc,{members}) => [...acc, members.filter(name => !acc.includes(name))[0]],[]): lightvals;
    const newState = req.body.newState;

    changeLights(lights,newState,isGroup,firstFromEachGroup);
    if (disconnectedDevices.length > 0) {
        await connectAllDisconnected();
        changeLights(lights,newState,isGroup,firstFromEachGroup);
    }
    res.send(true);
})


app.post("/refresh",(req,res)=>{
    const refreshToken = req.body.refreshToken; 
    const spotifyApi = new SpotifyWebAPI({
      redirectUri: `${req.get("origin")}/skipSpotify/`,
      clientId: spotify.clientId,
      clientSecret: spotify.clientSecret,
      refreshToken
    });
    
    spotifyApi.refreshAccessToken().then(({body: {access_token:accessToken ,expires_in:expiresIn }})=>{
        res.json({accessToken,expiresIn}); 
    })
    .catch(()=>{res.sendStatus(400)})
  
  })
  
  app.post("/login", (req,res)=>{
    const code = req.body.code; 
    console.log(`${req.get("origin")}/skipSpotify`); 
    const spotifyApi = new SpotifyWebAPI({
      redirectUri: `${req.get("origin")}/skipSpotify`,
      clientId: spotify.clientId,
      clientSecret: spotify.clientSecret
    });
    spotifyApi.authorizationCodeGrant(code).then(data => {
      res.json({
        accessToken: data.body.access_token, 
        refreshToken: data.body.refresh_token, 
        expiresIn: data.body.expires_in,
      })
    }).catch((err)=>{
      console.log(err); 
      res.sendStatus(400)
    }); 
  })


http.listen(port, () => console.log(`listening on port ${port}`));

