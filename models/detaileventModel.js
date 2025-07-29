
const mongoose = require("mongoose");

const detaileventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: true },
    day: { type: String, required: true },
    month: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Detailevent", detaileventSchema);