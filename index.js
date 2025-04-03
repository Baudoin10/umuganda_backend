// index.js
const express = require("express");
const mongoose = require ("mongoose")
const cors = require("cors")


const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const searchRoutes = require("./routes/searchRoutes")


const port = 3000; 


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", taskRoutes);
app.use("/api", notificationRoutes);
app.use("/api", searchRoutes);


app.get("/", (req, res) => {
  res.send(""); 
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
