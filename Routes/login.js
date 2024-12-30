// const express = require("express");
// const router = express.Router();

// /**
//  * @swagger
//  * /api/v1/login:
//  *   post:
//  *     summary: User login
//  *     description: Endpoint for user login with username, password, and role
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               username:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               role:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Login successful
//  *       400:
//  *         description: Bad Request
//  */
// router.post("/login", (req, res) => {
//   const { username, password, role } = req.body;

//   if (username && password && role) {
//     // Logic to authenticate user
//     res.status(200).send({ message: "Login successful", username, role });
//   } else {
//     res.status(400).send({ message: "Invalid input" });
//   }
// });

// module.exports = router;


const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const secretKey = "your_secret_key"; // Replace with a secure secret key

// Mock database for demonstration purposes
let users = []; // In-memory storage

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login and get a token
 *     description: Endpoint for user login and returning a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/login",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  }
);

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Logout and invalidate token
 *     description: Endpoint to logout and invalidate the token
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", (req, res) => {
  // Here we simply return a success message
  // In a real-world app, you'd invalidate the token (e.g., blacklist it)
  res.status(200).send({ message: "Successfully logged out" });
});

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Protected Route)
 *     description: Endpoint to retrieve all users (requires token)
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   firstName:
 *                     type: string
 *                   username:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/users", (req, res) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      // Assuming users are stored in-memory or a database
      const usersList = users; // Replace with actual user data retrieval logic
      res.status(200).send(usersList);
    });
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
});

module.exports = router;
