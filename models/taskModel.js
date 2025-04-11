

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "In Progress", "Completed"],
    },
    date: { type: String, required: true },
    photo: { type: String, required: false },  
  }
);

module.exports = mongoose.model("task", taskSchema);
