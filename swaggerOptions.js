
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Umuganda API Project Documentation",
      version: "1.0.0",
      description: "Umuganda API Project Documentation",
      contact: {
        name: "Your Name",
        email: "your_email@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000", // Change this to match your API base URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional: Specify the token format
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Applies BearerAuth globally to all routes
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your API files
};

module.exports = swaggerOptions;
