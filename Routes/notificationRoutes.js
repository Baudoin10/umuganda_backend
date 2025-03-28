const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
  getUserNotifications,
  updateNotification,
  deleteNotification,
} = require("../controllers/notificationController"); // Ensure it's lowercase

// Routes for notifications
router.post("/notifications", createNotification); // Create notification
router.get("/notifications", getNotifications); // Get all notifications
router.get("/notifications/user/:userId", getUserNotifications); // Get notifications for a specific user
router.put("/notifications/:id", updateNotification); // Update notification status (mark as read)
router.delete("/notifications/:id", deleteNotification); // Delete notification

module.exports = router;
