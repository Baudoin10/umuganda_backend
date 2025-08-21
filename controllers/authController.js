const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
let blacklistedTokens = [];

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      role,
      phone,
      sector,
      address,
    } = req.body;

    const normEmail = String(email || "")
      .trim()
      .toLowerCase();

    const userExists = await User.findOne({ email: normEmail });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email: normEmail,
      password: hashedPassword,
      phone, // ✅ now saved
      sector, // ✅ now saved
      address, // ✅ now saved
      role: role || "user",
      // status uses model default "Active"
    });

    // return only what you need on client
    res.status(201).json({ userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.status === "Inactive")
      return res.status(403).json({ message: "Account inactive" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, role: user.role, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/logout
const logoutUser = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    if (blacklistedTokens.includes(token)) {
      return res.status(400).json({ message: "Token already logged out" });
    }
    jwt.verify(token, JWT_SECRET);
    blacklistedTokens.push(token);
    res.status(200).json({ message: "Logout successful" });
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isTokenBlacklisted = (token) => blacklistedTokens.includes(token);

module.exports = { registerUser, loginUser, logoutUser, isTokenBlacklisted };
