const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// In-memory events storage
let events = [];

/**
 * @swagger
 * tags:
 *   name: Event Management
 *   description: Endpoints for managing events
 */

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events
 *     tags: [Event Management]
 *     description: Retrieve all events with their details
 *     responses:
 *       200:
 *         description: Successfully retrieved events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Community Cleanup
 *                   description:
 *                     type: string
 *                     example: A community-wide effort to clean the central park
 *                   address:
 *                     type: string
 *                     example: Kigali City Center
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2024-12-31
 *                   day:
 *                     type: string
 *                     example: Tuesday
 *                   month:
 *                     type: string
 *                     example: December
 *       404:
 *         description: No events found
 */
router.get("/events", (req, res) => {
  if (events.length > 0) {
    res.status(200).json(events);
  } else {
    res.status(404).json({ message: "No events found" });
  }
});

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Event Management]
 *     description: Endpoint for creating a new event with title, description, address, date, day, and month
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Event title
 *                 example: Community Cleanup
 *               description:
 *                 type: string
 *                 description: Event description
 *                 example: A community-wide effort to clean the central park
 *               address:
 *                 type: string
 *                 description: Event address
 *                 example: Kigali City Center
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Event date in YYYY-MM-DD format
 *                 example: 2024-12-31
 *               day:
 *                 type: string
 *                 description: Day of the week
 *                 example: Tuesday
 *               month:
 *                 type: string
 *                 description: Month of the event
 *                 example: December
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad Request
 */
router.post(
  "/events",
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("description").notEmpty().withMessage("Description is required"),
    check("address").notEmpty().withMessage("Address is required"),
    check("date").isISO8601().withMessage("Date must be in YYYY-MM-DD format"),
    check("day").notEmpty().withMessage("Day is required"),
    check("month").notEmpty().withMessage("Month is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, address, date, day, month } = req.body;
    

    const newEvent = {
      id: events.length + 1,
      title,
      description,
      address,
      date,
      day,
      month,
    };

    events.push(newEvent);

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  }
);


module.exports = router;
