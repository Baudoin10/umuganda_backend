const Task = require("../models/taskModel");

// Create a new task
const createTask = async (req, res) => {
  const { title, description, location, status, date, photo, assignedTo } =
    req.body;

  try {
    const newTask = new Task({
      title,
      description,
      location,
      status: status || "Pending",
      date,
      photo,
      assignedTo,
      statusHistory: [
        {
          status: status || "Pending",
          updatedAt: new Date(),
          updatedBy: req.user ? req.user.id : null,
        },
      ],
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    // If user is not admin, only show their assigned tasks
    const filter =
      req.user && req.user.role !== "admin" ? { assignedTo: req.user.id } : {};

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const foundTask = await Task.findById(req.params.id);
    if (!foundTask) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role !== "admin" &&
      foundTask.assignedTo &&
      foundTask.assignedTo.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this task" });
    }

    res.json(foundTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const foundTask = await Task.findById(req.params.id);
    if (!foundTask) return res.status(404).json({ message: "Task not found" });
    // Basic updates
    if (req.body.title) foundTask.title = req.body.title;
    if (req.body.description) foundTask.description = req.body.description;
    if (req.body.location) foundTask.location = req.body.location;
    if (req.body.date) foundTask.date = req.body.date;
    if (req.body.photo) foundTask.photo = req.body.photo;

    // Status update tracking
    if (req.body.status && req.body.status !== foundTask.status) {
      foundTask.status = req.body.status;
      foundTask.lastUpdated = new Date();

      // Add to status history
      foundTask.statusHistory.push({
        status: req.body.status,
        updatedAt: new Date(),
        updatedBy: req.user ? req.user.id : null,
      });
    }

    // Assignment update
    if (req.body.assignedTo) {
      foundTask.assignedTo = req.body.assignedTo;
    }
    const updatedTask = await foundTask.save();
    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const foundTask = await Task.findById(req.params.id);
    if (!foundTask) return res.status(404).json({ message: "Task not found" });

    // Only admin can delete tasks
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks by status (for admin dashboard)
const getTasksByStatus = async (req, res) => {
  try {
    // Verify admin permission
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { status } = req.query;
    const filter = status ? { status } : {};

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .sort({ lastUpdated: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByStatus,
};
