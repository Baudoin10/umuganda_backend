
const notification = require("../models/notificationModel");
const User = require("../models/userModel"); 

  const createNotification = async (req, res) => {
    const { title, message, targetUserIds } = req.body;

    try {
      if (!title || !message) {
        return res
          .status(400)
          .json({ message: "Title and message are required" });
      }

      let finalTargets = [];

      if (targetUserIds === "all") {
        const users = await User.find({}, "_id");
        finalTargets = users.map((u) => u._id);
      } else if (Array.isArray(targetUserIds) && targetUserIds.length > 0) {
        finalTargets = targetUserIds;
      } else {
        return res.status(400).json({ message: "Invalid targetUserIds" });
      }

      // create **one** notification
      const notif = await notification.create({
        title,
        message,
        targetUserIds: finalTargets,
      });

      return res
        .status(201)
        .json({ message: "Notification created", notification: notif });
    } catch (err) {
      console.error("Error creating notification:", err);
      res.status(500).json({ message: err.message });
    }
  };


// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get notifications for a specific user
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await notification.find({
      userId: req.params.userId,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update notification status (mark as read)
const updateNotification = async (req, res) => {
  try {
    const notificationToUpdate = await notification.findById(req.params.id);
    if (!notificationToUpdate)
      return res.status(404).json({ message: "Notification not found" });

    notificationToUpdate.read = true; // Mark as read
    const updatedNotification = await notificationToUpdate.save();
    res.json(updatedNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notificationToDelete = await notification.findById(req.params.id);
    if (!notificationToDelete)
      return res.status(404).json({ message: "Notification not found" });

    await notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getUserNotifications,
  updateNotification,
  deleteNotification,
};