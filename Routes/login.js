const express = require("express");
const router = express.Router();

// User login
router.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  if (username && password && role) {
    // Logic to authenticate user
    res.status(200).send({ message: "Login successful", username, role });
  } else {
    res.status(400).send({ message: "Invalid input" });
  }
});

module.exports = router;
