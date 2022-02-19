//environment variables
var dotenv = require('dotenv').config()
const osc = require('node-osc');
// general imports
const express = require('express')
const { Server } = require('http')

//create an express app
const app = express()
const port = process.env.PORT || 8000 
app.listen(port, ()=> console.log(`server running on port ${port}`))
const OSC_PORT = 12345;
const oscServer = new osc.Server(OSC_PORT, '127.0.0.1');
oscServer.on('message', data => handleMessage(data)); //


const handleMessage = (data) =>{
    console.log(data);
    // if(data[0] == 'fft' ) {
    //     handleFFTData(data)
    // }
    // else {
    // handleTimeSeries(data);
    // }
}

// app.get('/osc', (req, res)=> {

// })


