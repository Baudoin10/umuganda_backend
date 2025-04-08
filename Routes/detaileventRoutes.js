// detaileventRoutes.js

const express = require("express");
const router = express.Router();
const { joinEvent } = require("../controllers/detaileventController");

// Route to join an event
router.post("/join", joinEvent);

module.exports = router;
