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
  let { id } = req.params.id;
  /// get recording data url from id.
};

const saveRecording = async (req, res) => {
  console.log("req body: " + req.body);
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
  var dataFile = "";
  var fileName = "";
  fs.readdirSync("./data/").forEach((file) => {
    fileName = file;
    dataFile = "./data/" + file;
  });
  console.log(dataFile);
  const data = fs.readFileSync(dataFile, { encoding: "utf8", flag: "r" });
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

  //

  console.log(data);
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
    console.log(data.Location);
    dataLocation = data.Location;

    console.log(dataLocation);
    recording = new Recording({
      data: dataLocation,
      experiment_id: experimentId,
      configuration,
      sample_rate: sampleRate,
      trials,
      subject,
      author,
    });
    console.log(recording);

    if (recording != undefined) {
      console.log("saving recording...");
      recording.save().then((response) => {
        console.log(" url saved to db ");
        // return res.status(200).json(response);
      });
      // I think a then is not needed because we already have the recording in local memory (i.e in the recording variable)
      console.log(dataFile);
      try {
        const client = new new osc.Client("127.0.0.1", 12345)();
        client.send("/close", 200, () => {
          client.close();
        });
        fs.unlinkSync(dataFile);
      } catch (err) {
        console.log("could not delete file");
      }
      console.log("data location: " + dataLocation);
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
  fs.writeFile(filename, "ch1, ch2, ch3, ch4, Timestamps\n", (err) =>
    console.log(err)
  );
  return res.status(200).json("Recording start time has been written to file.");
};

const getRecordingsByExperimentId = async (req, res) => {
  //Go over all recordings and select those with the experiment id
  let { experimentId } = req.body;
  console.log(experimentId);
  Recording.find({ experiment_id: experimentId })
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
};
