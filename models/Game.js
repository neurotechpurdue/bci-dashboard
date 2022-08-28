const mongoose = require("mongoose");

const Recording = new mongoose.Schema(
  {
    data: String,
    experiment_id: String,
    configuration: String,
    sample_rate: String,
    trials: String, 
    subject: String,
    author: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Recording", Recording);
