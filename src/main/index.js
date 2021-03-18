import path from 'path';
import { app, BrowserWindow } from 'electron';
import TuyAPI from 'tuyapi';

const entryUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/index.html'
  : `file://${path.join(__dirname, 'index.html')}`;

let window = null;

app.on('ready', () => {
  window = new BrowserWindow({ width: 576, height: 368 }); // 576x368
  window.loadURL(entryUrl);
  window.on('closed', () => window = null);
  //window.setMenu(null);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const device = new TuyAPI({
  id: 'ebec90e43ec1822c0cztjy',
  key: '2da9dc915db01c4c'
});


// Find device on network
// device.find().then(() => {
//   // Connect to device
//   device.connect();
// });

// // Add event listeners
// device.on('connected', () => {
//   console.log('Connected to device!');
//   device.set({ dps: 20, set: true })
//   device.set({ dps: 24, set: '005a03e803e8' })
// });

// device.on('disconnected', () => {
//   console.log('Disconnected from device.');
// });

// device.on('error', error => {
//   console.log('Error!', error);
// });

// device.on('data', data => {
//   console.log(data);

// });

// // Disconnect after 10 seconds
// setTimeout(() => { device.disconnect(); }, 100000);

