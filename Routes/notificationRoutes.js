const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
  getUserNotifications,
  updateNotification,
  deleteNotification,
} = require("../controllers/notificationController"); 

// Routes for notifications
router.post("/notifications", createNotification); 
router.get("/notifications", getNotifications);
router.get("/notifications/user/:userId", getUserNotifications); 
router.put("/notifications/:id", updateNotification); 
router.delete("/notifications/:id", deleteNotification); 

module.exports = router;
