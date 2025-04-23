
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
      default: "Pending"
    },
    date: { type: String, required: true },
    photo: { type: String, required: false },
    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user",
      required: false 
    },
    lastUpdated: { 
      type: Date,
      default: Date.now 
    },
    statusHistory: [{
      status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"]
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", taskSchema);