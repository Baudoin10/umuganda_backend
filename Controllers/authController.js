// const User = require("../models/userModel");
// const bcrypt = require("bcryptjs"); // For password hashing
// const jwt = require("jsonwebtoken"); // For creating tokens

// // User registration
// const registerUser = async (req, res) => {
//   const { firstname, lastname, email, password, role } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       firstname,
//       lastname,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // User login
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { userId: user._id, role: user.role }, // Include role in token
//       "your_jwt_secret", // You should replace this with an actual secret in production
//       { expiresIn: "1h" }
//     );

//     res.json({ token, role: user.role }); // Send role to frontend
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const logoutUser = (req, res) => {
//   console.log(req.headers); // Check if token is received

//   const token = req.header("Authorization")?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     jwt.verify(token, "your_jwt_secret");
//     blacklistedTokens.push(token);
//     res.status(200).json({ message: "Logout successful" });
//   } catch (err) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// const isTokenBlacklisted = (token) => blacklistedTokens.includes(token);

// module.exports = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   isTokenBlacklisted,
// };

// // module.exports = { registerUser, loginUser };

const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 

let blacklistedTokens = []; 

// User registration
const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Include role in token
      "your_jwt_secret", // You should replace this with an actual secret in production
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role }); // Send role to frontend
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout user
const logoutUser = (req, res) => {
  console.log(req.headers); // Check if token is received

  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // Check if the token is in the blacklist
    if (blacklistedTokens.includes(token)) {
      return res.status(400).json({ message: "Token already logged out" });
    }

    // Verify token
    jwt.verify(token, "your_jwt_secret");

    // Add token to blacklist (invalidate it)
    blacklistedTokens.push(token);
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isTokenBlacklisted = (token) => blacklistedTokens.includes(token);

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  isTokenBlacklisted,
};
