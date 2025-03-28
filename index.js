const express = require("express");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Import routes
const loginRoutes = require("./routes/login");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const eventsRoutes = require("./routes/events");
const profileRoutes = require("./routes/profile");
const locationsRoutes = require("./routes/locations");
const participationsRoutes = require("./routes/participations");

// Use routes
app.use("/api/v1", loginRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", taskRoutes);
app.use("/api/v1", eventsRoutes);
app.use("/api/v1", locationsRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", participationsRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
