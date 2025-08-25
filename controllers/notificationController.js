// controllers/notificationController.js
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// Create ONE notification that targets many users
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

    // If you later add async delivery (email/SMS), start with status: "pending"
    const notif = await Notification.create({
      title,
      message,
      targetUserIds: finalTargets,
      status: "sent", // or "pending" if you queue external sends
    });

    return res
      .status(201)
      .json({ message: "Notification created", notification: notif });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ message: err.message });
  }
};

// List all notifications (newest first)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 }).lean();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List notifications visible to a specific user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({
      targetUserIds: userId,
    })
      .sort({ date: -1 })
      .lean();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional: mark-as-read for the user app (not used by admin list now)
const updateNotification = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif)
      return res.status(404).json({ message: "Notification not found" });

    // If you authenticate users, use req.user.id; otherwise accept req.body.userId
    const userId = req.user?.id || req.body?.userId;
    if (!userId)
      return res
        .status(400)
        .json({ message: "userId required to mark as read" });

    if (!notif.readBy.some((id) => String(id) === String(userId))) {
      notif.readBy.push(userId);
      await notif.save();
    }
    res.json(notif);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
const deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif)
      return res.status(404).json({ message: "Notification not found" });

    await Notification.findByIdAndDelete(req.params.id);
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
