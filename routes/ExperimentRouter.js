const express = require("express");

const ExperimentController = require("../controllers/experimentController");

const router = express.Router();
router.get("/experiment/:_id", ExperimentController.getExperimentById);
router.get("/experiments/", ExperimentController.getExperiments);
router.post("/experiment/new", ExperimentController.createExperiment);
module.exports = router;
