const express = require('express')
const app = express();
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

app.use(express.static(__dirname + '/build'));
app.use(cors()); // change this to not allow everyone eventually 
app.use(bodyParser.json());

let connectedDevices = [];
let disconnectedDevices = [];


const makeStatus = dps => ({
    on: dps?.["20"],
    mode: dps?.["21"],
    color: dps?.["24"]
});

const getDevices = async () => {
    const devices = device_keys.map(async ({ Name, id, key }) => {
        const device = new TuyAPI({ id, key });
        console.log("connecting " + Name);
        await device.find().catch(e => { console.error(`Error with ${Name}`) });
        await device.connect();
        device.on('disconnected', () => onDisconnected(Name, device));
        device.on('error', e => onError(e, Name, device));
        // device.on('data', (data) => onData(data, Name, device));
        device.on('dp-refresh', (data) => onData(data, Name, device));
        return ({ Name, device, status: makeStatus((await device.get({ schema: true })).dps) })
    });
    connectedDevices = await Promise.all(devices);
}

getDevices();

const connectAllDisconnected = async () => {
    const devices = disconnectedDevices.map(async ({ Name, device }) => {
        console.log("connecting from disconnected" + Name);
        await device.find().catch(e => { console.error(`Error with ${Name}`) });
        await device.connect();
        const status = makeStatus((await device.get({ schema: true })).dps)
        device.on('disconnected', () => onDisconnected(Name, device));
        device.on('error', e => onError(e, Name, device));
        // device.on('data', data => onData(data, Name, device));
        device.on('dp-refresh', (data) => onData(data, Name, device));
        return ({ Name, device, status });
    });

    connectedDevices = [...(await Promise.all(devices)), ...connectedDevices];

}

const interval = setInterval(connectAllDisconnected, 1000);

const onError = (e, Name, device) => {
    connectedDevices = connectedDevices.filter(({ Name: currentName }) => Name !== currentName);
    disconnectedDevices = [...disconnectedDevices.filter(({ Name: currentName }) => Name !== currentName), { device, Name }];
}

const onDisconnected = (Name, device) => {
    connectedDevices = connectedDevices.filter(({ Name: currentName }) => Name !== currentName);
    disconnectedDevices.push({ Name, device });
}

const onData = ({ dps: data }, Name, device) => {

    status = connectedDevices.find(({ Name: currentName }) => Name === currentName)?.status;

    if( !("20" in data) && status) data["20"] = status.on; 
    if( !("21" in data) && status) data["21"] = status.mode; 
    if( !("24" in data) && status) data["24"] = status.color; 

    const newStatus = makeStatus(data);
    connectedDevices = connectedDevices.map(({ Name: currentName, device: currentDevice, status }) => Name !== currentName ? { Name: currentName, device: currentDevice, status } : { Name, device, status: newStatus })
    console.log("running onData");
    io.emit("update", { Name, ...newStatus });
}

app.get('/', (req, res)=> {
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

const changeLights = (lghts,newState) => {
    const devicesToUpdate = connectedDevices.map((x,i)=>({...x,index:i})).filter(({ Name }) => lghts.includes(Name));
    devicesToUpdate.forEach(({ device,index }) => {
        if (newState === "white") {
            // need to check for warmth and other parameters in the setting and newState
            device.set({
                multiple: true,
                data: {
                    "20": true,
                    "21": "white"
                }
            });

        } else if (newState === "off")
            device.set({ dps: 20, set: false });
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
    const lights = isGroup ? groups.filter(({ Name }) => req.body.lights.includes(Name)).reduce((acc, { members }) => ([...acc, ...members.filter(name => !acc.includes(name))]), []) : req.body.lights;
    const newState = req.body.newState;

    changeLights(lights,newState);
    if (disconnectedDevices.length > 0) {
        await connectAllDisconnected();
        changeLights(lights,newState);
    }
    res.send(true);
})


http.listen(port, () => console.log(`listening on port ${port}`));

