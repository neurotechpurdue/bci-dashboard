const Recording = require("../models/Recording");
var AWS = require("aws-sdk");
var uuid = require("uuid");
var fs = require("fs");
var osc = require("node-osc");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var s3 = new AWS.S3();

const downloadRecording = async (req, res) => {
  /// get recording data url from id.
  let { _id } = req.params;
  //get recording by Id

  Recording.findById(_id)
    .select("data")
    .then((response) => {
      console.log(response);
      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(400).json({ error: error.message });
    });
  //fetch AWS S3 Url
  //return URL
};

const saveRecording = async (req, res) => {
  let { subject, experimentId, author, configuration, sampleRate, trials } =
    req.body;

  console.log(
    subject +
      " " +
      experimentId +
      " " +
      author +
      " " +
      configuration +
      " " +
      sampleRate +
      " " +
      trials
  );
  // read contents of the EEG file
  var dataFile = "";
  var fileName = "";
  fs.readdirSync("./data/").forEach((file) => {
    fileName = file;
    dataFile = "./data/" + file;
  });
  console.log(dataFile);
  const data = fs.readFileSync(dataFile, { encoding: "utf8", flag: "r" });

  //check if request format is correct
  if (
    !subject ||
    !data ||
    !experimentId ||
    !author ||
    !configuration ||
    !trials ||
    !sampleRate
  )
    return res.status(400).json({ error: "Invalid request body" });

  // Upload EEG file to AWS S3
  var params = {
    Bucket: "nsp-eeg-data",
    Body: data,
    Key: fileName,
  };
  let recording;
  let dataLocation;
  s3.upload(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      return res.status(400).json("Could not save to AWS");
    }
    dataLocation = data.Location;

    //Create recording and populates it using the Recording model
    recording = new Recording({
      data: dataLocation,
      experiment_id: experimentId,
      configuration,
      sample_rate: sampleRate,
      trials,
      subject,
      author,
    });

    //Save recording to the database
    if (recording != undefined) {
      console.log("saving recording...");
      recording.save().then((response) => {
        console.log(" url saved to db ");
      });

      // Delete the eeg file from our backend
      // Close the OSC connection with OpenBCI GUI datastream
      try {
        const client = new new osc.Client("127.0.0.1", 12345)();
        client.send("/close", 200, () => {
          client.close();
          console.log("Closing OSC Client");
        });
      } catch (err) {
        console.log("could not close OSC Client");
      }

      try {
        fs.unlinkSync(dataFile);
        console.log("removed dataFile from folder");
      } catch (err) {
        console.log("Could not remove EEG file");
      }
      //return AWS url
      return res.status(200).json(data.Location);
    }
    // if (data) {
    //   console.log(
    //     "%s %s %s %s %s %s %s",
    //     data.Location,
    //     subject,
    //     author,
    //     experimentId,
    //     configuration,
    //     sampleRate,
    //     trials
    //   );

    //   // return res.status(200).json("Saved data to AWS and deleted temporary file.");
    // }
  });
};

const getRecordingById = async (req, res) => {
  let { _id } = req.params;
  Recording.findById(_id)
    .select("-_id -experiment_id")
    .then((response) => {
      console.log(response);
      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(400).json({ error: error.message });
    });
};
const startRecording = async (req, res) => {
  var date = Date.now();
  var filename = "./data/" + date.toString() + ".csv";
  fs.writeFile(
    filename,
    "ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, Timestamps\n",
    (err) => console.log(err)
  );
  return res.status(200).json("Recording start time has been written to file.");
};

const getRecordingsByExperimentId = async (req, res) => {
  //Go over all recordings and select those with the experiment id
  let { experiment_id } = req.params; //<- this must be params, not body
  console.log(experiment_id);
  Recording.find({ experiment_id: experiment_id })
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(400).json({ error: error.message });
    });
};

const deleteRecordingById = (req, res) => {
  let { recordingId } = req.body;
  Recording.deleteMany();
};
module.exports = {
  getRecordingById,
  saveRecording,
  startRecording,
  getRecordingsByExperimentId,
  downloadRecording,
};
