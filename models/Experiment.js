const mongoose = require("mongoose");

const Experiment = new mongoose.Schema(
  {
    name: String,
    game_id:String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Experiment", Experiment);
