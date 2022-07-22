const Recording = require("../models/Recording");

var fs = require("fs");

const saveRecording = async (req, res) => {
  console.log("req body: " + req.body);
  let { subject, data, experimentId } = req.body;
  if (!subject || !data || !experimentId)
    return res.status(400).json({ error: "Invalid request body" });
  let recording = new Recording({
    subject,
    data,
    experiment_id: experimentId,
  });

  recording
    .save()
    .then((response) => {
      console.log("success!");
      return res.status(200).json(response);
    })
    .catch((err) => res.status(400).json({ error: err.message }));
};

const getRecordingById = async (req, res) => {
  let { _id } = req.params;
  Recording.findById(_id)
    .select("-_id -experiment_id")
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(400).json({ error: error.message });
    });
};
const startRecording = async (req, res) => {
  let { startTime } = req.body;
  console.log(startTime);
  var filename = "./data/" + startTime.toString() + ".txt";
  fs.writeFile(filename, startTime.toString(), (err) => console.log(err));
  return res.status(200).json("Recording start time has been written to file.");
};
module.exports = {
  getRecordingById,
  saveRecording,
  startRecording,
};
