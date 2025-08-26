const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String }, 
  sector: { type: String }, 
  address: { type: String }, 
  role: { type: String, enum: ["admin", "user"], default: "user" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

  resetTokenHash: { type: String, default: null },
  resetTokenExp:  { type: Date,   default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
