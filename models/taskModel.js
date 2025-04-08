// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     location: { type: String, required: true },
//     status: {
//       type: String,
//       required: true,
//       enum: ["Pending", "In Progress", "Completed"],
//     },
//     date: { type: String, required: true }, 
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("task", taskSchema);

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
    photo: { type: String, required: false },  // Added to store image URL
  }
);

module.exports = mongoose.model("task", taskSchema);
