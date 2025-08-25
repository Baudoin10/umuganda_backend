const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  targetUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // many
  date: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // track who read it
});

module.exports = mongoose.model("Notification", notificationSchema);
