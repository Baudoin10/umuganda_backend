
// const express = require("express");
// const router = express.Router();
// const { check, validationResult } = require("express-validator");

// // In-memory tasks storage
// let tasks = [];

// /**
//  * @swagger
//  * tags:
//  *   name: Task Management
//  *   description: Endpoints for managing tasks
//  */

// /**
//  * @swagger
//  * /api/v1/tasks:
//  *   get:
//  *     summary: Get all tasks
//  *     tags: [Task Management]
//  *     description: Retrieve all tasks with their details
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved tasks
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                     example: 1
//  *                   title:
//  *                     type: string
//  *                     example: Clean the park
//  *                   description:
//  *                     type: string
//  *                     example: Remove trash from the central park
//  *                   location:
//  *                     type: string
//  *                     example: Kigali City Park
//  *                   image:
//  *                     type: string
//  *                     example: https://example.com/image.jpg
//  *       404:
//  *         description: No tasks found
//  */
// router.get("/tasks", (req, res) => {
//   if (tasks.length > 0) {
//     res.status(200).json(tasks);
//   } else {
//     res.status(404).json({ message: "No tasks found" });
//   }
// });

// /**
//  * @swagger
//  * /api/v1/tasks:
//  *   post:
//  *     summary: Create a new task
//  *     tags: [Task Management]
//  *     description: Endpoint for creating a new task with title, description, location, and image
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *                 description: Task title
//  *                 example: Clean the park
//  *               description:
//  *                 type: string
//  *                 description: Task description
//  *                 example: Remove trash from the central park
//  *               location:
//  *                 type: string
//  *                 description: Task location
//  *                 example: Kigali City Park
//  *               image:
//  *                 type: string
//  *                 description: URL of the image
//  *                 example: https://example.com/image.jpg
//  *     responses:
//  *       201:
//  *         description: Task created successfully
//  *       400:
//  *         description: Bad Request
//  */
// router.post(
//   "/tasks",
//   [
//     check("title").notEmpty().withMessage("Title is required"),
//     check("description").notEmpty().withMessage("Description is required"),
//     check("location").notEmpty().withMessage("Location is required"),
//     check("image").notEmpty().withMessage("Image is required"),
//   ],
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { title, description, location, image } = req.body;

//     const newTask = {
//       id: tasks.length + 1,
//       title,
//       description,
//       location,
//       image,
//     };

//     tasks.push(newTask);

//     res.status(201).json(newTask);
//   }
// );

// module.exports = router;


const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// In-memory tasks storage
let tasks = [];

/**
 * @swagger
 * tags:
 *   name: Task Management
 *   description: Endpoints for managing tasks
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Task Management]
 *     description: Retrieve all tasks with their details
 *     responses:
 *       200:
 *         description: Successfully retrieved tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Clean the park
 *                   description:
 *                     type: string
 *                     example: Remove trash from the central park
 *                   location:
 *                     type: string
 *                     example: Kigali City Park
 *                   image:
 *                     type: string
 *                     example: https://example.com/image.jpg
 *       404:
 *         description: No tasks found
 */
router.get("/tasks", (req, res) => {
  if (tasks.length > 0) {
    res.status(200).json(tasks);
  } else {
    res.status(404).json({ message: "No tasks found" });
  }
});

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Task Management]
 *     description: Endpoint for creating a new task with title, description, location, and image
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *                 example: Clean the park
 *               description:
 *                 type: string
 *                 description: Task description
 *                 example: Remove trash from the central park
 *               location:
 *                 type: string
 *                 description: Task location
 *                 example: Kigali City Park
 *               image:
 *                 type: string
 *                 description: URL of the image
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad Request
 */
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

/**
 * @swagger
 * /api/v1/tasks/{id}/approve:
 *   put:
 *     summary: Approve a task
 *     tags: [Task Management]
 *     description: Approve a task submitted by a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task approved successfully
 *       404:
 *         description: Task not found
 */
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

/**
 * @swagger
 * /api/v1/tasks/{id}/reject:
 *   put:
 *     summary: Reject a task
 *     tags: [Task Management]
 *     description: Reject a task submitted by a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task rejected successfully
 *       404:
 *         description: Task not found
 */
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

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Task Management]
 *     description: Endpoint to delete a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
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
