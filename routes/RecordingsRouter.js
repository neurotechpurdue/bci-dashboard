const express = require("express");

const RecordingController = require("../controllers/recordingController");

const router = express.Router();
router.get("/recordings/:_id", RecordingController.getRecordingById);

router.post("/recordings", RecordingController.saveRecording);
router.post("/recordings/start", RecordingController.startRecording);
module.exports = router;

/*when creating a recording (aka saving recording, 
button is pressed, which in turn sends a saveRecording API Req, and once that is done, contents of file created by OSC server can be transmitted! And that also takes care of creating a file as we go to save our data)

BUT ONLY IF RECORDING STARTED*/
