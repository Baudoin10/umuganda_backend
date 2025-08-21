const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  // ✅ new controllers
  getParticipants,
  updateParticipantStatus,
} = require("../controllers/eventController");

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Manage community events
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, address, date]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post("/events", createEvent);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 */
router.get("/events", getEvents);

/**
 * @swagger
 * /api/events/join:
 *   post:
 *     summary: Join an event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, eventId]
 *             properties:
 *               userId: { type: string }
 *               eventId: { type: string }
 *     responses:
 *       200:
 *         description: User joined event successfully
 *       404:
 *         description: Event or user not found
 */
router.post("/events/join", joinEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event data
 *       404:
 *         description: Event not found
 */
router.get("/events/:id", getEventById);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [Open, Closed]
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.put("/events/:id", updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete("/events/:id", deleteEvent);

/* ============================
   Participation (Admin)
   ============================ */

/**
 * @swagger
 * /api/events/{eventId}/participants:
 *   get:
 *     summary: List participants of an event (filter + pagination)
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search by name/email
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [joined, present, absent]
 *       - in: query
 *         name: sector
 *         schema: { type: string }
 *         description: Sector name
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated participants
 */
router.get("/events/:eventId/participants", getParticipants);

/**
 * @swagger
 * /api/events/{eventId}/participants/{userId}:
 *   put:
 *     summary: Update a participant's status (present/absent)
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [present, absent]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Event/participant not found
 */
router.put("/events/:eventId/participants/:userId", updateParticipantStatus);

module.exports = router;
