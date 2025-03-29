const express = require("express");
const { searchTasks } = require("../controllers/taskController");

const router = express.Router();

// Search Tasks Route
router.get("/search", searchTasks);

module.exports = router;
