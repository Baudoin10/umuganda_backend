

const express = require("express");
const { getCurrentUser } = require("../controllers/meController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current logged-in user's info
 *     description: Returns the authenticated user's profile information.
 *     tags:
 *       - Get current user's info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12345"
 *                 firstname:
 *                   type: string
 *                   example: "John"
 *                 lastname:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       401:
 *         description: Unauthorized - user not authenticated
 */
router.get("/", authMiddleware, getCurrentUser);

module.exports = router;
