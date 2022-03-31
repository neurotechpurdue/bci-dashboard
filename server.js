const {Storage} = require('@google-cloud/storage');



var dotenv = require('dotenv').config()
const osc = require('node-osc');
const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const socketio = require("socket.io");
var cors = require('cors');

app.use(cors());
var io = socketio(server,{
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.emit('message', "HELLO CAN ANYONE HEAR ME")
  })

const port = 8000 

const OSC_PORT = 12345;
const oscServer = new osc.Server(OSC_PORT, '127.0.0.1');
oscServer.on('message', data => handleMessage(data)); //
let interval;

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY
  }
});

console.log("storage:" + storage);

async function listBuckets() {
  try {
    const results = await storage.getBuckets();

    const [buckets] = results;

    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}
listBuckets();


const handleMessage = (data) =>{
    console.log(data);
     if(data[0] == 'fft' ) {
         console.log("handling fft data")
         handleFFTData(data)
    // }
    // else {
    // handleTimeSeries(data);
    // }
}
}

const handleFFTData = (data) => {

    if(data[1] == 1) { //channel 1

    }

}



  server.listen(app.get(port), ()=> console.log(`server running on port ${port}`))
