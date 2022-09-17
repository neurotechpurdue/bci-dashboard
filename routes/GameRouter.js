const express = require("express");

const ExperimentController = require("../controllers/experimentController");

const router = express.Router();
router.get("/game/:_id", ExperimentController.getGameById);
router.get("/games/", ExperimentController.getGames);
router.post("/game/new", ExperimentController.createGame);
module.exports = router;
