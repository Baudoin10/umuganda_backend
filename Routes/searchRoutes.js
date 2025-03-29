const express = require("express");
const { searchtasks } = require("../controllers/taskController");

const router = express.Router();

// Search tasks route
router.get("/search", searchtasks);

module.exports = router;
