const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// In-memory tasks storage
let tasks = [];

// Get all tasks
router.get("/tasks", (req, res) => {
  if (tasks.length > 0) {
    res.status(200).json(tasks);
  } else {
    res.status(404).json({ message: "No tasks found" });
  }
});

// Create a new task
router.post(
  "/tasks",
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("description").notEmpty().withMessage("Description is required"),
    check("location").notEmpty().withMessage("Location is required"),
    check("image").notEmpty().withMessage("Image is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, location, image } = req.body;

    const newTask = {
      id: tasks.length + 1,
      title,
      description,
      location,
      image,
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
  }
);

// Approve a task
router.put("/tasks/:id/approve", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (task) {
    task.status = "approved";
    res.status(200).json({ message: "Task approved successfully", task });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// Reject a task
router.put("/tasks/:id/reject", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (task) {
    task.status = "rejected";
    res.status(200).json({ message: "Task rejected successfully", task });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// Delete a task
router.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: "Task deleted successfully" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

module.exports = router;
