// index.js
const express = require("express");
const mongoose = require ("mongoose")
const cors = require("cors")

const swaggerDocs = require("./swagger");

const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const searchRoutes = require("./routes/searchRoutes")
const detailevent = require("./routes/detaileventRoutes")
const meRoutes = require("./routes/meRoutes");

const dbURI = "mongodb+srv://baudoin:muganda123456@cluster0.xhaqyxk.mongodb.net/umuganda?retryWrites=true&w=majority";

mongoose
.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.log("Error connecting to MongoDB Atlas:", err));

app.use(express.json());

app.use(cors());
app.use(express.json());

swaggerDocs(app);

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", taskRoutes);
app.use("/api", notificationRoutes);
app.use("/api", searchRoutes);
app.use("/api", detailevent);
app.use("/api/me", meRoutes);


const port = 3000; 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
