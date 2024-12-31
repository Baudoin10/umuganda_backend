
// const express = require("express");
// const router = express.Router();
// const { check, validationResult } = require("express-validator");

// // Mock database for demonstration purposes
// let users = []; // In-memory storage

// /**
//  * @swagger
//  * tags:
//  *   name: Users Management
//  *   description: Endpoints for managing users (CRUD operations)
//  */

// /**
//  * @swagger
//  * /api/v1/users:
//  *   post:
//  *     summary: Create new user
//  *     tags: [Users Management]
//  *     description: Endpoint for creating a new user with firstName, username, password, and email
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               firstName:
//  *                 type: string
//  *                 description: User's first name
//  *                 example: John
//  *               username:
//  *                 type: string
//  *                 description: Unique username
//  *                 example: johndoe
//  *               password:
//  *                 type: string
//  *                 description: User's password
//  *                 example: password123
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 description: User's email address
//  *                 example: john@example.com
//  *     responses:
//  *       201:
//  *         description: User created successfully
//  *       400:
//  *         description: Bad Request
//  */
// router.post(
//   "/users",
//   [
//     check("firstName").notEmpty().withMessage("firstName is required"),
//     check("username").notEmpty().withMessage("username is required"),
//     check("password").notEmpty().withMessage("password is required"),
//     check("email").isEmail().withMessage("Invalid email format"),
//   ],
//   (req, res) => {
//     // Validate request
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { firstName, username, password, email } = req.body;

//     // Save user to the in-memory list
//     const newUser = { id: Date.now(), firstName, username, password, email };
//     users.push(newUser);

//     res.status(201).send(newUser);
//   }
// );

// /**
//  * @swagger
//  * /api/v1/users:
//  *   get:
//  *     summary: Get all users
//  *     tags: [Users Management]
//  *     description: Endpoint to retrieve all users
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                   firstName:
//  *                     type: string
//  *                   username:
//  *                     type: string
//  *                   email:
//  *                     type: string
//  *       404:
//  *         description: No users found
//  */
// router.get("/users", (req, res) => {
//   if (users.length > 0) {
//     res.status(200).send(users);
//   } else {
//     res.status(404).send({ message: "No users found" });
//   }
// });

// /**
//  * @swagger
//  * /api/v1/users/{id}:
//  *   delete:
//  *     summary: Delete user by ID
//  *     tags: [Users Management]
//  *     description: Endpoint to delete a user by their ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *           description: User ID
//  *           example: 1
//  *     responses:
//  *       200:
//  *         description: User deleted successfully
//  *       404:
//  *         description: User not found
//  */
// router.delete("/users/:id", (req, res) => {
//   const userId = parseInt(req.params.id);

//   const userIndex = users.findIndex((user) => user.id === userId);

//   if (userIndex !== -1) {
//     users.splice(userIndex, 1);
//     res.status(200).send({ message: `User with ID ${userId} deleted` });
//   } else {
//     res.status(404).send({ message: "User not found" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); // For generating tokens

// Mock database for demonstration purposes
let users = []; // In-memory storage

// Secret for signing JWTs (make sure to store this in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * @swagger
 * tags:
 *   name: Users Management
 *   description: Endpoints for managing users (CRUD operations)
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users Management]
 *     description: Endpoint for creating a new user with firstName, username, password, and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *                 example: John
 *               username:
 *                 type: string
 *                 description: Unique username
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: john@example.com
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 access_token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *       400:
 *         description: Bad Request
 */
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

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users Management]
 *     description: Endpoint to retrieve all users
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
 *                   email:
 *                     type: string
 *       404:
 *         description: No users found
 */
router.get("/users", (req, res) => {
  if (users.length > 0) {
    res.status(200).send(users);
  } else {
    res.status(404).send({ message: "No users found" });
  }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users Management]
 *     description: Endpoint to delete a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: User ID
 *           example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
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
