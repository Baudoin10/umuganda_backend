// const mongoose = require("mongoose");

// const eventSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     address: { type: String, required: true },
//     date: { type: String, required: true }, 
//     day: { type: String, required: true },
//     month: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Event", eventSchema);

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: true }, // You can also use Date type
    day: { type: String, required: true },
    month: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }, // Added status field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
