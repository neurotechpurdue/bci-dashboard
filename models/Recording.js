const mongoose = require("mongoose");

const Recording = new mongoose.Schema(
  {
    data: [],
    experiment_id: String,
    subject: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Recording", Recording);
