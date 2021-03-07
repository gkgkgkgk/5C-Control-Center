const TuyAPI = require('tuyapi');

const device = new TuyAPI({
    id: '',
    key: ''
});


// Find device on network
device.find().then(() => {
    // Connect to device
    device.connect();
});

// Add event listeners
device.on('connected', () => {
    console.log('Connected to device!');
    device.set({ dps: 24, set: '005a03e803e8' })
});

device.on('disconnected', () => {
    console.log('Disconnected from device.');
});

device.on('error', error => {
    console.log('Error!', error);
});

device.on('data', data => {
    console.log(data);

});

// Disconnect after 10 seconds
setTimeout(() => { device.disconnect(); }, 100000);


