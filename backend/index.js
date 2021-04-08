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
let supressData = false;

let count = 0;

const devices = device_keys.map(({ Name, id, key }) => {
    const device = new TuyAPI({ id, key });
    console.log("connecting " + Name);

    return ({ Name, device })
});

(() => {
    console.log("connecting devices");

    devices.forEach(async d => {
        await d.device.find().then(() => {
            console.log("Found " + d.Name);
            d.device.connect();
            console.log(d.Name);
        });

        console.log(count);

        await d.device.on("connected", () => {
            // console.log("Connected " + d.Name)
            count++;
            d.device.on("disconnected", () => { console.log("I ran the disc"); })
            d.device.on("error", (e) => { console.log("I ran the error"); console.log(e); })
        });

        console.log(devices.length + " " + count);
            if (count === devices.length - 1) {
                http.listen(port, () => console.log(`listening on port ${port}`));
                console.log(devices);
                // devices.forEach (({Name, device}) => {
                //     device.on("data", onData);
                // });
            }
    });
})();


const onData = async data => {
    if (supressData) return;

    const res = devices.map(async ({ device, Name }) => {

        const { dps } = await device.get({ schema: true });
        return ({
            Name,
            on: dps?.["20"],
            mode: dps?.["21"],
            color: dps?.["24"]
        })

    })
    // console.log(await Promise.all(res))
    io.emit("update", await Promise.all(res));
}

app.get("/turnOffAllLights", (req, res) => {
    console.log(devices);
    console.log("turning off all lights");
    supressData = true;
    devices.forEach(({ device }, i) => {
        device.set({ dps: 20, set: false }).then(() => { if (i === devices.length - 1) supressData = false; });
    });


    res.send(true);
});
app.get("/turnOnAllLights", (req, res) => {
    console.log("turning on all lights");
    supressData = true;
    devices.forEach(({ device,Name }, i) => {
        console.log(`turning on ${Name}`);
        device.set({ dps: 20, set: true }).then(() => { if (i === devices.length - 1) supressData = false; });
    })
    res.send(true);
});

app.get("/isOneLightOn", async (req, res) => {
    const val = devices.reduce(async (acc, { device }) => {
        const data = await device.get({ dps: 20 });
        return ((await acc) || data);
    }, new Promise((resolve, reject) => resolve(false)))
    // console.log(`I ran with value ${await val}`); 
    res.send((await val));
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post("/changeLights", async (req, res) => {
    const isGroup = req.body.isGroup;
    const lights = isGroup ? groups.filter(({ Name }) => req.body.lights.includes(Name)).reduce((acc, { members }) => ([...acc, ...members.filter(name => !acc.includes(name))]), []) : req.body.lights;
    const newState = req.body.newState;
    const devicesToUpdate = devices.filter(({ Name }) => lights.includes(Name));
    supressData = true;
    devicesToUpdate.forEach({ device }, i => {
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
    res.send(true);
})


