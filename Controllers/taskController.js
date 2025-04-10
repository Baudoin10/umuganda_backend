
const task = require("../models/taskModel");

// Create a new task
const createTask = async (req, res) => {
  const { title, description, location, status, date, photo } = req.body;

  try {
    const newTask = new task({
      title,
      description,
      location,
      status,
      date,
      photo, 
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
    const tasks = await task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.location = req.body.location || task.location;
    task.status = req.body.status || task.status;
    task.date = req.body.date || task.date;
    task.photo = req.body.photo || task.photo; // Update photo if provided

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
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
};
