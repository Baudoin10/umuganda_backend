// const User = require("../models/userModel");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
// let blacklistedTokens = [];

// // POST /api/auth/register
// const registerUser = async (req, res) => {
//   try {
//     const {
//       firstname,
//       lastname,
//       email,
//       password,
//       role,
//       phone,
//       sector,
//       address,
//     } = req.body;

//     const normEmail = String(email || "")
//       .trim()
//       .toLowerCase();

//     const userExists = await User.findOne({ email: normEmail });
//     if (userExists)
//       return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       firstname,
//       lastname,
//       email: normEmail,
//       password: hashedPassword,
//       phone, // ✅ now saved
//       sector, // ✅ now saved
//       address, // ✅ now saved
//       role: role || "user",
//       // status uses model default "Active"
//     });

//     // return only what you need on client
//     res.status(201).json({ userId: user._id, role: user.role });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // POST /api/auth/login
// const loginUser = async (req, res) => {
//   try {
//     const email = String(req.body.email || "")
//       .trim()
//       .toLowerCase();
//     const password = String(req.body.password || "");

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });
//     if (user.status === "Inactive")
//       return res.status(403).json({ message: "Account inactive" });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({ token, role: user.role, userId: user._id });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // POST /api/auth/logout
// const logoutUser = (req, res) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     if (blacklistedTokens.includes(token)) {
//       return res.status(400).json({ message: "Token already logged out" });
//     }
//     jwt.verify(token, JWT_SECRET);
//     blacklistedTokens.push(token);
//     res.status(200).json({ message: "Logout successful" });
//   } catch {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// const isTokenBlacklisted = (token) => blacklistedTokens.includes(token);

// module.exports = { registerUser, loginUser, logoutUser, isTokenBlacklisted };


// controllers/authController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
let blacklistedTokens = [];

// --- mail transporter (use your SMTP env vars) ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

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

    const normEmail = String(email || "").trim().toLowerCase();

    const userExists = await User.findOne({ email: normEmail });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email: normEmail,
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

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
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

// POST /api/auth/forgot  { email }
const forgetController = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (user) {
      const raw = crypto.randomBytes(32).toString("hex"); // raw token for URL
      const hash = crypto.createHash("sha256").update(raw).digest("hex"); // store hash only
      user.resetTokenHash = hash;
      user.resetTokenExp = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save();

      const link = `${process.env.FRONTEND_URL}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;
      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Reset your password",
        text: `Reset your password: ${link}`,
        html: `<p>Reset your password:</p><p><a href="${link}">${link}</a></p><p><small>Link expires in 15 minutes.</small></p>`,
      });
    }

    // generic response (no user enumeration)
    return res.json({ ok: true, message: "If the account exists, an email was sent." });
  } catch (e) {
    console.error("forgetController error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/reset  { email, token, newPassword }
const resetController = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { token, newPassword } = req.body || {};
    if (!email || !token || !newPassword)
      return res.status(400).json({ message: "email, token, newPassword required" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      email,
      resetTokenHash: tokenHash,
      resetTokenExp: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetTokenHash = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    return res.json({ ok: true, message: "Password reset successful" });
  } catch (e) {
    console.error("resetController error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  isTokenBlacklisted,
  forgetController,
  resetController,
};
