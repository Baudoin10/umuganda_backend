
const express = require("express");
const router = express.Router();
const { joinEvent } = require("../controllers/detaileventController");

/**
 * @swagger
 * tags:
 *   name: DetailEvent
 *   description: Event joining through detail view
 */

/**
 * @swagger
 * /api/join:
 *   post:
 *     summary: Join an event (from detailed event view)
 *     tags: [DetailEvent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - eventId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user joining the event
 *               eventId:
 *                 type: string
 *                 description: ID of the event being joined
 *     responses:
 *       200:
 *         description: Successfully joined the event
 *       400:
 *         description: Invalid input or user/event not found
 */
router.post("/join", joinEvent);

module.exports = router;
