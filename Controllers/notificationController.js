
const notification = require("../models/notificationModel");
const User = require("../models/userModel"); 

const createNotification = async (req, res) => {
  const { title, message, targetUserIds } = req.body;

  try {
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }
    if (targetUserIds === "all") {
      const users = await User.find({}, '_id');
      const userIds = users.map(user => user._id);
      
      const notifications = userIds.map(userId => ({
        title,
        message,
        userId
      }));
      
      // Insert all notifications at once
      const savedNotifications = await notification.insertMany(notifications);
      return res.status(201).json({ 
        message: `Notification sent to ${userIds.length} users`, 
        count: userIds.length 
      });
    } 
    // Handle specific users
    else if (Array.isArray(targetUserIds) && targetUserIds.length > 0) {
      // Create notifications for selected users
      const notifications = targetUserIds.map(userId => ({
        title,
        message,
        userId
      }));
      
      // Insert all notifications at once
      const savedNotifications = await notification.insertMany(notifications);
      return res.status(201).json({ 
        message: `Notification sent to ${targetUserIds.length} users`, 
        count: targetUserIds.length 
      });
    } else {
      return res.status(400).json({ 
        message: "Invalid targetUserIds. Must be 'all' or a non-empty array of user IDs" 
      });
    }
  } catch (err) {
    console.error("Error creating notifications:", err);
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