// const express = require("express");
// const router = express.Router();
// const { check, validationResult } = require("express-validator");

// // In-memory tasks and events storage
// let tasks = [];
// let events = [];

// /**
//  * @swagger
//  * tags:
//  *   name: Task Management
//  *   description: Endpoints for managing tasks and events
//  */

// /**
//  * @swagger
//  * /api/v1/locations/nearby:
//  *   get:
//  *     summary: Get nearby locations for tasks and events
//  *     tags: [Task Management]
//  *     description: Retrieve tasks and events within a specified radius of a given location (latitude, longitude)
//  *     parameters:
//  *       - in: query
//  *         name: latitude
//  *         required: true
//  *         schema:
//  *           type: number
//  *         description: Latitude of the location
//  *       - in: query
//  *         name: longitude
//  *         required: true
//  *         schema:
//  *           type: number
//  *         description: Longitude of the location
//  *       - in: query
//  *         name: radius
//  *         required: false
//  *         schema:
//  *           type: number
//  *         description: Radius in meters (default: 1000)
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved nearby tasks and events
//  *         content:
//  *           application/json:
//  *             type: array
//  *             items:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: integer
//  *                   example: 1
//  *                 title:
//  *                   type: string
//  *                   example: Clean the park
//  *                 description:
//  *                   type: string
//  *                   example: Remove trash from the central park
//  *                 location:
//  *                   type: string
//  *                   example: Kigali City Park
//  *                 image:
//  *                   type: string
//  *                   example: https://example.com/image.jpg
//  *       404:
//  *         description: No tasks or events found within the specified radius
//  */
// router.get("/locations/nearby", (req, res) => {
//   const { latitude, longitude, radius = 1000 } = req.query;

//   if (!latitude || !longitude) {
//     return res.status(400).json({ message: "Latitude and longitude are required" });
//   }

//   const nearbyTasks = tasks.filter((task) => {
//     const distance = calculateDistance(
//       latitude,
//       longitude,
//       task.location.latitude,
//       task.location.longitude
//     );
//     return distance <= radius;
//   });

//   const nearbyEvents = events.filter((event) => {
//     const distance = calculateDistance(
//       latitude,
//       longitude,
//       event.location.latitude,
//       event.location.longitude
//     );
//     return distance <= radius;
//   });

//   const results = [...nearbyTasks, ...nearbyEvents];

//   if (results.length > 0) {
//     res.status(200).json(results);
//   } else {
//     res.status(404).json({ message: "No tasks or events found within the specified radius" });
//   }
// });

// // Helper function to calculate distance (Haversine formula)
// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // Earth radius in meters
//   const φ1 = (lat1 * Math.PI) / 180;
//   const φ2 = (lat2 * Math.PI) / 180;
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//   const a =
//     Math.sin(Δφ / 2) ** 2 +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c;
// }

// module.exports = router;

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// In-memory tasks and events storage
let tasks = [];
let events = [];

/**
 * @swagger
 * tags:
 *   name: Task Management
 *   description: Endpoints for managing tasks and events
 */

/**
 * @swagger
 * /api/v1/locations/nearby:
 *   get:
 *     summary: Get nearby locations for tasks and events
 *     tags: [Task Management]
 *     description: Retrieve tasks and events within a specified radius of a given location (latitude, longitude)
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the location
 *       - in: query
 *         name: radius
 *         required: false
 *         schema:
 *           type: number
 *         description: "Radius in meters (default: 1000)"
 *     responses:
 *       200:
 *         description: Successfully retrieved nearby tasks and events
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Clean the park
 *                 description:
 *                   type: string
 *                   example: Remove trash from the central park
 *                 location:
 *                   type: string
 *                   example: Kigali City Park
 *                 image:
 *                   type: string
 *                   example: https://example.com/image.jpg
 *       404:
 *         description: No tasks or events found within the specified radius
 */
router.get("/locations/nearby", (req, res) => {
  const { latitude, longitude, radius = 1000 } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  const nearbyTasks = tasks.filter((task) => {
    const distance = calculateDistance(
      latitude,
      longitude,
      task.location.latitude,
      task.location.longitude
    );
    return distance <= radius;
  });

  const nearbyEvents = events.filter((event) => {
    const distance = calculateDistance(
      latitude,
      longitude,
      event.location.latitude,
      event.location.longitude
    );
    return distance <= radius;
  });

  const results = [...nearbyTasks, ...nearbyEvents];

  if (results.length > 0) {
    res.status(200).json(results);
  } else {
    res
      .status(404)
      .json({
        message: "No tasks or events found within the specified radius",
      });
  }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

module.exports = router;
