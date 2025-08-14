
const express = require("express");
const { searchtask } = require("../controllers/searchtaskController");

const router = express.Router();

/**
 * @swagger
 * /tasks/search:
 *   get:
 *     summary: Search for tasks
 *     description: Retrieve a list of tasks based on search criteria.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Search keyword for filtering tasks
 *     responses:
 *       200:
 *         description: A list of matching tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 */
router.get("/tasks/search", searchtask);

module.exports = router;

