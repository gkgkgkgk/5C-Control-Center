const app = require("express")();
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
const port = process.env.PORT == undefined ? 3000 : process.env.PORT
const { device_keys } = require("../env/devices.json");
const { groups } = require("../env/groups.json");

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
        device.on('data', (data) => onData(data, Name, device));
        console.log("connected" + Name)
        return ({ Name, device, status: makeStatus((await device.get({ schema: true })).dps) })
    });
    connectedDevices = await Promise.all(devices);
}

getDevices();

const connectAllDisconnected = async () => {
    let devices = disconnectedDevices.map(async ({ Name, device }) => {
        console.log("connecting " + Name);
        await device.find().catch(e => { console.error(`Error with ${Name}`) });
        await device.connect();
        device.on('disconnected', () => onDisconnected(Name, device));
        device.on('error', e => onError(e, Name, device));
        device.on('data', data => onData(data, Name, device));
        console.log("connected" + Name);
        return ({ Name, device, status: makeStatus((await device.get({ schema: true })).dps) });
    });

    connectedDevices = [...(await Promise.all(devices)), ...connectedDevices];

}

const interval = setInterval(connectAllDisconnected, 10000);

const onError = (e, Name, device) => {
    connectedDevices = connectedDevices.filter(({ Name: currentName }) => Name !== currentName);
    disconnectedDevices = [...disconnectedDevices.filter(({ Name: currentName }) => Name !== currentName), { device, Name }];
}

const onDisconnected = (Name, device) => {
    connectedDevices = connectedDevices.filter(({ Name: currentName }) => Name !== currentName);
    disconnectedDevices.push({ Name, device });
}

const onData = ({ dps: data }, Name, device) => {
    // console.log("running"); 
    const newStatus = makeStatus(data);
    // // console.log(newStatus); 
    connectedDevices = connectedDevices.map(({ Name: currentName, device: currentDevice, status }) => Name !== currentName ? { Name: currentName, device: currentDevice, status } : { Name, device, status: newStatus })
    io.emit("update", { Name, ...newStatus });
}


app.get("/turnOffAllLights", async (req, res) => {

    const doTurnOff = () => {
        connectedDevices.forEach(({ device }, i) => {
            device.set({ dps: 20, set: false });
        });
    }

    console.log(connectedDevices);
    console.log("turning off all lights");
    doTurnOff();
    if (disconnectedDevices.length > 0) {
        await connectAllDisconnected();
        doTurnOff();
    }
    res.send(true);
});

app.get("/turnOnAllLights", async (req, res) => {

    const doTurnOn = () => {
        connectedDevices.forEach(({ device, Name }, i) => {
            console.log(`turning on ${Name}`);
            device.set({ dps: 20, set: true });
        })
    }
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
    console.log(`I ran with value ${await val}`);
    res.send((await val));
});

app.get("/getAllStatus", async (req, res) => {
    if (disconnectedDevices.length > 0) await connectAllDisconnected();
    res.send(connectedDevices.map(({ Name, status }) => ({ Name, status })))
});


app.post("/changeLights", async (req, res) => {
    const isGroup = req.body.isGroup;
    const lights = isGroup ? groups.filter(({ Name }) => req.body.lights.includes(Name)).reduce((acc, { members }) => ([...acc, ...members.filter(name => !acc.includes(name))]), []) : req.body.lights;
    const newState = req.body.newState;

    const changeLights = lghts => {
        const devicesToUpdate = connectedDevices.filter(({ Name }) => lghts.includes(Name));
        devicesToUpdate.forEach(({ device }) => {
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

    changeLights(lights);
    if (disconnectedDevices.length > 0) {
        await connectAllDisconnected();
        changeLights(lights);
    }

    res.send(true);
})





http.listen(port, () => console.log(`listening on port ${port}`));

