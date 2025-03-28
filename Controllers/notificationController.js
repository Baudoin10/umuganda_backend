const notification = require("../models/notificationModel");

// Create a new notification
const createNotification = async (req, res) => {
  const { title, message, userId } = req.body;

  try {
    const newNotification = new notification({
      title,
      message,
      userId,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
