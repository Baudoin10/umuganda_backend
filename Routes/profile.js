const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const multer = require("multer");

// In-memory admin profile storage
let adminProfile = {};

// Setup Multer for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_pictures/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Admin Profile Management
 *   description: Endpoints for managing admin profiles
 */

/**
 * @swagger
 * /api/v1/admin/profile:
 *   post:
 *     summary: Update admin profile
 *     tags: [Admin Profile Management]
 *     description: Endpoint for updating admin profile details including first name, last name, email, and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad Request
 */
router.post(
  "/admin/profile",
  [
    check("firstName").notEmpty().withMessage("First name is required"),
    check("lastName").notEmpty().withMessage("Last name is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    adminProfile = { firstName, lastName, email, password };
    res
      .status(200)
      .json({ message: "Profile updated successfully", profile: adminProfile });
  }
);

/**
 * @swagger
 * /api/v1/admin/profile/upload-picture:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Admin Profile Management]
 *     description: Endpoint for uploading admin profile picture
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Picture uploaded successfully
 *       400:
 *         description: Bad Request
 */
router.post(
  "/admin/profile/upload-picture",
  upload.single("picture"),
  (req, res) => {
    if (req.file) {
      res
        .status(200)
        .json({
          message: "Picture uploaded successfully",
          picture: req.file.path,
        });
    } else {
      res.status(400).json({ message: "Picture upload failed" });
    }
  }
);

module.exports = router;
