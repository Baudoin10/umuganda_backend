// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Example controller
const registerUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phone,
      sector,
      address,
      role,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      sector,
      address,
      role: role || "user",
    });

    res.status(201).json({ userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  /* ... */
};
const logoutUser = (req, res) => {
  /* ... */
};
const forgetController = async (req, res) => {
  /* ... */
};
const resetController = async (req, res) => {
  /* ... */
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgetController,
  resetController,
};
