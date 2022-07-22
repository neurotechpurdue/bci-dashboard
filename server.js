const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
var fs = require("fs");

dotenv.config();
const recordingsRouter = require("./routes/RecordingsRouter");
app.use(cors());
app.use(express.json());
app.use("/api", recordingsRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

var data = [null, null];
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  var tweet = { user: "nodesource", text: "Hello, world!" };

  // to make things interesting, have it send every second

  var interval2 = setInterval(function () {
    socket.emit("openbci", data);
    // data = null;
  }, 1000);

  socket.on("disconnect", () => {
    // clearInterval(interval);
    clearInterval(interval2);

    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
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

const port = 8000;

const OSC_PORT = 12345;
const oscServer = new osc.Server(OSC_PORT, "127.0.0.1", () => {
  console.log("osc server is listening");
});

oscServer.on("message", (d) => {
  var timeStamp = new Date();
  //format dta
  if (d == data[0]) {
    oscServer.close();
  }
  data = [d, timeStamp];
  //if data folder has open file, then put data in there
  if (!isDirEmpty("./data/")) {
    //write to file
    console.log("directory not empty");
    var dataFile = "";
    fs.readdirSync("./data/").forEach((file) => {
      dataFile = file;
    });
    console.log(dataFile);
    fs.appendFile(dataFile, data.toString(), (err) => {
      if (err) {
        console.log(err);
      } else {
        //TODO: Nothing was appended :'((((
        // Get the file contents after the append operation
        console.log("Appended!");
      }
    });
  }

  // console.log("message", data);
}); //
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
