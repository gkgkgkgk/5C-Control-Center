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


const getDevices = async ()=>{
    const devices = device_keys.map(({ Name, id, key }) => {
        const device = new TuyAPI({ id, key });
        console.log("connecting " + Name);
        return ({ Name, device })
    })
    devices.forEach(async ({device,Name})=>{
        await device.find().catch(e=>{console.error(`Error with ${Name}`)}); 
        await device.connect(); 
    });
    return devices; 
}

app.get("/turnOffAllLights", async (req, res) => {
    const devices = await getDevices();
    console.log("turning off all lights");
    devices.forEach(({ device }, i) => {
        device.set({ dps: 20, set: false });
    });
    res.send(true);
});


app.get("/turnOnAllLights", async (req, res) => {
    const devices = await getDevices(); 
    devices.forEach(({ device,Name }, i) => {
        console.log(`turning on ${Name}`);
        device.set({ dps: 20, set: true });
    })
    res.send(true);
});

app.get("/isOneLightOn", async (req, res) => {
    const devices = await getDevices(); 
    // console.log(devices); 
    console.log("I have the devices")
    const val = devices.reduce(async (acc, { device },i) => {
        console.log(`started with ${i}`);
        const data = await device.get({ dps: 20 });
        console.log(`finished with ${i}`);
        return ((await acc) || data);
    }, new Promise((resolve, reject) => resolve(false)));
    console.log(`I ran with value ${await val}`); 
    res.send((await val));
});





http.listen(port, () => console.log(`listening on port ${port}`));

