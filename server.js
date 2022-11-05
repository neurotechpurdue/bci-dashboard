const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
var fs = require("fs");

dotenv.config();
const recordingsRouter = require("./routes/RecordingsRouter");
const experimentRouter = require("./routes/ExperimentRouter");
app.use(cors());
app.use(express.json());
app.use("/api", recordingsRouter);
app.use("/api", experimentRouter);
app.get("/test", (req, res) => {
  res.send(res.status(200).json("Application working!"));
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3024",
    methods: ["GET", "POST"],
  },
});

var data = null;
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  var oldData = null;
  var interval2 = setInterval(function () {
    if (!(oldData == data)) {
      // if the old data is not equal to data, it means that fresh data has been produced
      socket.emit("openbci", data);
      oldData = data;
    }
  }, 20);

  socket.on("disconnect", () => {
    // clearInterval(interval);
    clearInterval(interval2);

    console.log("User Disconnected", socket.id);
  });
});
const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log("SERVER RUNNING on port 3001");
});
const mongoose = require("mongoose");

console.log("mongo uri: " + process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("successfully connected to db"))
  .catch((error) => {
    console.log("Connection Error: ", error.message);
  });

const db = mongoose.connection;
function isDirEmpty(dirnane) {
  try {
    fs.rmdirSync(dirname);
  } catch (err) {
    return false;
  }
  fs.mkdirSync(dirname);
  return true;
}

// // const { Storage } = require("@google-cloud/storage");

// var dotenv = require("dotenv").config();
const osc = require("node-osc");
// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// var cors = require("cors");

// app.use(cors({ origin: true, credentials: true }));
// app.options("*", cors()); // enable pre-flight requests all across the app
// // const io = new Server(server
// //   //,{
// // //   cors: {
// // //     origin: "http://localhost:3000", // do not do this in prod
// // //     methods: ["GET", "POST"],
// // //   },
// // // }
// // );

// // const io = require("socket.io")(server, {
// //   cors: {
// //     origin: "*", // do not do this in prod
// //     methods: ["GET", "POST"],
// //   },
// // });

// //output means a client connected
// // io.on("connection", (socket) => {
// //   console.log(socket.id);
// //   socket.on("disconnect", () => {
// //     console.log("User disconnected", socket.id);
// //   });
// // });
// // io.sockets.emit("message", "HELLO CAN ANYONE HEAR ME");
// // });

// // setInterval(() => {
// //   io.to("clock-room").emit("time", new Date());
// // }, 1000);

const OSC_PORT = 12345;
const environment = process.env.NODE_ENV;
console.log(environment);
var serverUrl;
process.env.NODE_ENV == "production"
  ? (serverUrl = process.env.SERVER_IP)
  : (serverUrl = "127.0.0.1");

//Why is the production ip working but not the local??
console.log(serverUrl);
const oscServer = new osc.Server(OSC_PORT, serverUrl, () => {
  console.log("osc server is listening");
});

var checkMessage = true;

//TODO: Check if data is streaming by checking if the message
function isDataStreaming(d) {
  if (checkMessage) {
    console.log(d);
    if (d) {
      console.log("Data is streaming");
      checkMessage = false;
    }
  }
}

oscServer.on("message", (d) => {
  isDataStreaming(d);
  // console.log(`Message: ${d}`);
  var timeStamp = Date.now();
  //format dta
  //send message to oscServer to close it.
  if (d == "/close") {
    oscServer.close();
  }
  //remove "openbci "
  var channels = d.slice(1);
  data =
    channels[0] +
    "," +
    channels[1] +
    "," +
    channels[2] +
    "," +
    channels[3] +
    "," +
    channels[4] +
    "," +
    channels[5] +
    "," +
    channels[6] +
    "," +
    channels[7] +
    "," +
    timeStamp.toString();

  //if data folder doesn't exists, create it:
  console.log(fs.existsSync("./data"));
  if (!fs.existsSync("./data")) {
    console.log("made data folder");
    fs.mkdirSync("./data");
  }
  //if data folder has open file, then put data in there
  fs.readdir("./data/", function (err, files) {
    if (err) {
      console.log(err);
      // some sort of error
    } else {
      if (!files.length) {
        // console.log("empty directory");
        // directory appears to be empty, wait
      } else {
        var dataFile = "";
        fs.readdirSync("./data/").forEach((file) => {
          dataFile = file;
        });
        // console.log(dataFile);
        // console.log(JSON.stringify(data));
        console.log("Exists data: " + fs.existsSync("./data/" + dataFile));
        if (fs.existsSync("./data/" + dataFile)) {
          console.log("data appended to the dataFile");
          console.log(dataFile);
          fs.appendFileSync("./data/" + dataFile, data + "\n");
        }
      }
    }
  });
});

// console.log("message", data);
// let interval;

// // const storage = new Storage();
// // console.log("storage:" + storage);

// async function listBuckets() {
//   try {
//     const results = await storage.getBuckets();

//     const [buckets] = results;

//     console.log("Buckets:");
//     buckets.forEach((bucket) => {
//       console.log(bucket.name);
//     });
//   } catch (err) {
//     console.error("ERROR:", err);
//   }
// }
// // listBuckets();

const handleMessage = (data) => {
  console.log(data);
  if (data[0] == "fft") {
    console.log("handling fft data");
    handleFFTData(data);
    // }
    // else {
    // handleTimeSeries(data);
    // }
  } else if (data[0] == "/openbci") {
    data.slice(1); //removes "/openbci" from all objects in array
    //8 different channels
  }
};

// const handleFFTData = (data) => {
//   console.log("HandleFFTData");
//   console.log(data);
//   // if(data[1] == 1) { //channel 1

//   // }
// };

// app.get("/", (req, res) => {
//   console.log(req);
// });

// server.listen(app.get(port), () =>
//   console.log(`server running on port ${port}`)
// );
