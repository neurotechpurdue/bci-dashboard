const Experiment = require("../models/Experiment");

const getExperimentById = (req, res) => {
  let { _id } = req.params;
  console.log("id: " + _id);
  Experiment.findById(_id)
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message });
    });
};

const createExperiment = (req, res) => {
  let { name, game_id } = req.body;

  if (!name || !game_id) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  let experiment = new Experiment({
    name,
    game_id,
  });

  experiment.save().then((response) => {
    console.log("experiment created");

    return res.status(200).json(response);
  });
};

const getExperiments = (req, res) => {
  Experiment.find({})
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message });
    });
};

module.exports = {
  getExperimentById,
  getExperiments,
  createExperiment,
};
