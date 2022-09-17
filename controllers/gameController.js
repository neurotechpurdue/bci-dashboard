const Game = require("../models/Game");
const Game = require("../models/Game");

const getGameById = (req, res) => {
  let { _id } = req.params;
  Game.findById(_id)
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(400).json({ error: error.message });
    });
};

const createGame = (req, res) => {
  let { name, game_url } = req.body;

  if (!name || !game_url) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  let Game = new Game({
    name,
    game_url,
  });

  game.save().then((response) => {
    console.log("experiment created");

    return res.status(200).json(response);
  });
};



module.exports = {
  createGame
};
