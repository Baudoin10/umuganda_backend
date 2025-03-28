const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); // For generating tokens

// Mock database for demonstration purposes
let users = []; // In-memory storage

// Secret for signing JWTs (make sure to store this in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Create a new user
router.post(
  "/users",
  [
    check("firstName").notEmpty().withMessage("firstName is required"),
    check("username").notEmpty().withMessage("username is required"),
    check("password").notEmpty().withMessage("password is required"),
    check("email").isEmail().withMessage("Invalid email format"),
  ],
  (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, username, password, email } = req.body;

    // Save user to the in-memory list
    const newUser = { id: Date.now(), firstName, username, password, email };
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).send({
      message: "User logged in successfully",
      access_token: token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        username: newUser.username,
        email: newUser.email,
      },
    });
  }
);

// Get all users
router.get("/users", (req, res) => {
  if (users.length > 0) {
    res.status(200).send(users);
  } else {
    res.status(404).send({ message: "No users found" });
  }
});

// Delete user by ID
router.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(200).send({ message: `User with ID ${userId} deleted` });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

module.exports = router;
