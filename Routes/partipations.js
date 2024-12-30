const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// In-memory participation storage
let participations = [];

/**
 * @swagger
 * tags:
 *   name: Participation Management
 *   description: Endpoints for managing user participation in tasks and events
 */

/**
 * @swagger
 * /api/v1/participation:
 *   post:
 *     summary: Log user participation
 *     tags: [Participation Management]
 *     description: Endpoint for logging user participation in tasks or events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *               type:
 *                 type: string
 *                 description: Type of participation (task/event)
 *                 enum: [task, event]
 *               itemId:
 *                 type: integer
 *                 description: ID of the task or event
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of participation
 *     responses:
 *       201:
 *         description: Participation logged successfully
 *       400:
 *         description: Bad Request
 */
router.post(
  "/participation",
  [
    check("userId").isInt().withMessage("User ID must be an integer"),
    check("type")
      .isIn(["task", "event"])
      .withMessage("Type must be either 'task' or 'event'"),
    check("itemId").isInt().withMessage("Item ID must be an integer"),
    check("timestamp")
      .isISO8601()
      .withMessage("Timestamp must be a valid ISO 8601 date-time"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, type, itemId, timestamp } = req.body;

    const newParticipation = {
      id: participations.length + 1,
      userId,
      type,
      itemId,
      timestamp,
    };

    participations.push(newParticipation);

    res.status(201).json(newParticipation);
  }
);

module.exports = router;
