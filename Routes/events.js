const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// In-memory events storage
let events = [];

// Get all events
router.get("/events", (req, res) => {
  if (events.length > 0) {
    res.status(200).json(events);
  } else {
    res.status(404).json({ message: "No events found" });
  }
});

// Create a new event
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
