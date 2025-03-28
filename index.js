// index.js
const express = require("express");
const app = express();
const authRoutes = require("../routes/authRoutes");
const userRoutes = require("../routes/userRoutes");

const port = 3000; 


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send(""); 
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
