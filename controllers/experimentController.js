const Experiment = require("../models/Experiment");

const getExperimentById = (req, res) => {
  let { _id } = req.params;
  Experiment.findById(_id)
  .then((response) => {
    return res.status(200).json(response);
  })
  .catch((err) => {
    return res.status(400).json({ error: error.message });
  });
};

const createExperiment = () => {
    let {name, game_id} = req.params;

    if(!name || !game_id) {
    return res.status(400).json({ error: "Invalid request body" });
    }
    let experiment = new Experiment({
        name,
        game_id
      });

    experiment
    .save()
    .then((response) => {
      console.log("experiment created");

      return res.status(200).json(response);
    })
}
