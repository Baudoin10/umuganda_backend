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
    date: { type: String, required: true }, // You can also use Date type if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", taskSchema);
