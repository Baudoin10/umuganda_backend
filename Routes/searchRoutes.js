// const express = require("express");


// const {searchtask} = require("../controllers/taskController")

// const router = express.Router();

// // Search task route
// router.get("/search", searchtask);

// module.exports = router;

const express = require("express");
const { searchtask } = require("../controllers/searchtaskController");

const router = express.Router();

// Search task route
router.get("/tasks/search", searchtask);

module.exports = router;

