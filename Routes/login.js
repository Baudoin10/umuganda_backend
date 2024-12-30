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
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication related endpoints (Login)
 */

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     description: Endpoint for user login with username, password, and role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 example: user123
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *               role:
 *                 type: string
 *                 description: User's role (admin or user)
 *                 example: user
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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
