const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },


    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
      required: true,
    },

    date: { type: String, required: true },
    photo: { type: String, default: "" },

    
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // <- must match your User model name
      default: null,
    },

    lastUpdated: { type: Date, default: Date.now },

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Completed"],
          required: true,
        },
        updatedAt: { type: Date, default: Date.now },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
