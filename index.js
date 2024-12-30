const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swaggerOptions");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Swagger configuration
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routes
const loginRoutes = require("./routes/login");
const userRoutes = require("./routes/users");

// Use routes
app.use("/api/v1", loginRoutes);
app.use("/api/v1", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  console.log("Swagger docs available at http://localhost:3000/api-docs");
});
